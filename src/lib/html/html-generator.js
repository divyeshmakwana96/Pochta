const mjml2html = require('mjml')
const fs = require('fs')
const path = require('../helpers/path')
const minify = require('html-minifier').minify
const cheerio = require('cheerio')
const validator = require('validator')
const uniqueString = require('unique-string')
const _ = require('lodash')

class HtmlGenerator {

  constructor(filePath, hostServiceProvider, cacheManager, options) {
    this.filePath = filePath
    this.hostServiceProvider = hostServiceProvider
    this.cacheManager = cacheManager

    this._options = {
      minify: options && options.minify || true,
      enableContentID: options && options.enableContentID || true // not valid if host service provider is present
    }
  }

  generate() {
    if (!this.filePath) {
      throw new Error(`Filepath can't be empty`)
    } else if (_.find(['html', 'mjml'], this.filePath.split('.').pop())) {
      throw new Error('File must be html or mjml')
    }

    let ext = path.extname(this.filePath)

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
      let generator = this

      // 1) get title
      let title = $('title').text()

      // 2) get attachments
      let attachments = []

      // 3) analyze, upload, manipulate image sources
      $('img').each(function() {
        // console.log($(this))
        const src = $(this).attr('src')
        let newSrc = generator.handle(src, attachments)
        $(this).attr('src', newSrc)
      })

      // 4) parse pdfs [TODO]


      // 5) package html
      let renderedHtml = $.html()
      let html = this._options.minify ? minify(renderedHtml, {
        processConditionalComments: true,
        collapseWhitespace: true,
        minifyCSS: false,
        caseSensitive: true,
        removeEmptyAttributes: true
      }) : renderedHtml

      return {
        title,
        attachments,
        html
      }
    } else {
      throw new Error(`There was an error while rendered the HTML source`)
    }
  }

  handle(src, attachments) {
    if (!validator.isURL(src)) {

      let url
      if (this.cacheManager) {
        url = this.cacheManager.getRemoteUrl(src)
      }

      if (url) {
        return url
      } else if (this.hostServiceProvider) {

        console.log('should upload content')
        // return await this.hostServiceProvider.upload(src, 'pochta/test')
      } else if (this._options.enableContentID) {

        let filename = path.basename(src)
        let filepath = path.join(path.dirname(this.filePath), src)

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
      }
    }
    return src
  }
}

module.exports = HtmlGenerator
