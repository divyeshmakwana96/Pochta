const fs = require('fs')

const mjml2html = require('mjml')
const minify = require('html-minifier').minify
const cheerio = require('cheerio')
const _ = require('lodash')

const urlFormat = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/

module.exports = {

  parseHTML: (filepath) => {
    return new Promise((resolve, reject) => {

      if (filepath.endsWith('.mjml')) {
        const mjmlData = fs.readFileSync(filepath, 'utf8')
        const rendered = mjml2html(mjmlData, {
          filePath: filepath,
          minify: true
        })

        if (rendered.errors.length > 0) {
          reject(rendered.errors[0].formattedMessage)
        } else {
          resolve(rendered.html)
        }

      } else {
        fs.readFile(filepath, 'utf8', (err, contents) => {
          if (err) {
            reject(err)
          } else {
            resolve(minify(contents, {
              processConditionalComments: true,
              collapseWhitespace: true,
              minifyCSS: false,
              caseSensitive: true,
              removeEmptyAttributes: true
            }))
          }
        })
      }
    })
  },

  parseImagesFromHTML: (html) => {
    return new Promise((resolve, reject) => {

      let paths = []
      const $ = cheerio.load(html)

      $('img').each(function() {
        // console.log($(this))
        const src = $(this).attr('src')
        if (!urlFormat.test(src) && !paths.includes(src)) {
          paths.push(src)
        }
      })
      resolve({html, paths})
    })
  },

  render: (html, cache) => {
    return new Promise((resolve, reject) => {

      const $ = cheerio.load(html)

      $('img').each(function() {
        const src = $(this).attr('src')
        const upload = _.find(cache, { path: src })

        if (upload && upload.url) {
          $(this).attr('src', upload.url)
        }
      })

      resolve($.html())
    })
  }
}
