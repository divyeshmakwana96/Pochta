const fs = require('fs')
const mjml2html = require('mjml')
const cheerio = require('cheerio')
const db = require('./db')

const urlFormat = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
const rootIndexFile = 'index.mjml'

module.exports = {

  parse: () => {

    const dir = './email/'
    const filePath = dir + rootIndexFile
    console.log(filePath)

    if (fs.existsSync(filePath)) {

      const mjmlData = fs.readFileSync(filePath, 'utf8')
      const rendered = mjml2html(mjmlData, {filePath: filePath})
      if (rendered.errors.length > 0) {
        throw rendered.errors[0].formattedMessage
      }

      console.log("Rendered:\n")
      fs.writeFileSync('./email/test.html', rendered.html)

      // Parse HTML
      const $ = cheerio.load(rendered.html)
      $("img").each(function() {
        const oldSrc = $(this).attr("src")

        let actualPath = dir + oldSrc
        let lastModified = fs.statSync(actualPath).mtime

        console.log("should upload url: " + oldSrc)

        let existing = db.getCloudanaryImage(actualPath, lastModified)
        console.log("existing: " + existing)
        if (!existing) {
          db.setCloudanaryImage(actualPath, {'url': 'https://www.google.com/'})
        }
      })

    } else {
      throw "index.mjml missing in the current directory"
    }
  }
}
