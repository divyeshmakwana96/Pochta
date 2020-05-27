const mjml2html = require('mjml')
const fs = require('../helpers/fs')
const path = require('../helpers/path')
const minify = require('html-minifier').minify
const cheerio = require('cheerio')
const validator = require('validator')
const uniqueString = require('unique-string')
const _ = require('lodash')

class HTMLGenerator {

  constructor(filePath, hostServiceProvider, cacheManager, options) {
    this.filePath = filePath
    this.hostServiceProvider = hostServiceProvider
    this.cacheManager = cacheManager

    this._options = {
      minify: options && options.minify || false,
      embedType: options && options.embedType, // not valid if host service provider is present
      uploadPath: options && options.uploadPath || 'pochta/uploads'
    }
  }

  async generate() {
    if (!this.filePath) {
      throw new Error(`Filepath can't be empty`)
    } else if (_.find(['html', 'mjml'], this.filePath.split('.').pop())) {
      throw new Error('File must be html or mjml')
    }

    let ext = path.extension(this.filePath)

    let _html // save html output for next operations
    /* MJML Parsing */
    if (ext === 'mjml') {
      const mjmlData = fs.readFileSync(this.filePath, 'utf8')
      const rendered = mjml2html(mjmlData, {
        filePath: this.filePath
      })

      if (rendered.errors && rendered.errors.length > 0) {
        return new Error(_.join(_.map(rendered.errors, error => { return error.formattedMessage })))
      }

      _html = rendered.html
    } else {
      /* HTML Parsing */
      _html = fs.readFileSync(this.filePath, 'utf8')
    }

    if (_html) {
      /* Manipulate html with cheerio */
      const $ = cheerio.load(_html)

      // 1) get title
      let subject = $('title').text()

      // 2) get attachments
      let attachments = []
      let unresolved = []

      // 3) analyze, upload, manipulate image sources
      // - collect all elements and loop async separately, each function is not thread safe
      let elArr = []

      // 3.1) loop images
      $('img').each(function() {
        let el = $(this)
        let src = el.attr('src')

        if (src && src.length > 0 && !(validator.isURL(src) || validator.isBase64(src))) { // to avoid empty or url or base64 img tags
          elArr.push({ $: el, attr: 'src', src: src })
        }
      })

      // 3.2) loop and gather cid or hosted links
      let pathArr = _.uniq(_.map(elArr, (el) => { return el.src })) // To avoid redundant uploads
      let pathMappings = []
      for (let index = 0; index < pathArr.length; index++) {
        let src = pathArr[index]
        let url = await this.handle(src, attachments, unresolved)
        pathMappings.push({ src, url: url || src })
      }

      // Repack html with mappings
      elArr.forEach((el) => {
        let mapping = _.find(pathMappings, (map) => { return map.src === el.src })
        el.$.attr(el.attr, mapping && mapping.url || el.src)
      })

      // 4) package html
      let renderedHtml = $.html()
      let html = this._options.minify ? minify(renderedHtml, {
        processConditionalComments: true,
        collapseWhitespace: true,
        minifyCSS: false,
        caseSensitive: true,
        removeEmptyAttributes: true
      }) : renderedHtml

      return {
        subject,
        html,
        attachments,
        unresolved
      }
    } else {
      throw new Error(`There was an error while rendered the HTML source`)
    }
  }

  async handle(src, attachments, unresolved) {
    if (!(validator.isURL(src) || validator.isBase64(src))) {

      let url
      if (this.cacheManager) {
        url = this.cacheManager.getRemoteUrl(src)
      }

      if (url) {
        return url
      } else if (this.hostServiceProvider) {
        let url = await this.hostServiceProvider.upload(src, this._options.uploadPath, [{key: 'client', value: 'pochta'}])
        if (this.cacheManager) {
          this.cacheManager.putRemoteUrl(url, src)
        }
        return url
      } else {

        let filename = path.basename(src)
        let filepath = path.join(path.dirname(this.filePath), src)

        if (this._options.embedType === 'base64') {
          return fs.base64Encoded(filepath)
        } else if (this._options.embedType === 'cid') {

          // generate cid and add as an attachment
          let find = _.find(attachments, attachment => { return attachment.path === filepath })
          if (find) {
            return `cid:${find.cid}`
          } else {

            let cid = uniqueString()
            // loop to get a name
            attachments.push({
              filename,
              cid,
              path: filepath,
              contentType: path.mimeType(filepath),
              contentDisposition: 'inline'
            })
            return `cid:${cid}`
          }
        } else {
          // we have to return relative paths as unresolved
          unresolved.push({src, path: filepath})
        }
      }
    }

    return src
  }
}

module.exports = HTMLGenerator
