const {Command, flags} = require('@oclif/command')
const clear = require('clear')
const fs = require('../lib/helpers/fs')
const ora = require('ora')
const crypto = require('../lib/helpers/crypto')
const path = require('path')
const puppeteer = require('puppeteer-core')
const PDFDocument = require('pdfkit')
const _ = require('lodash')

const finder = require('../lib/finder/finder')

const Inquirer = require('../lib/controller/crud-inquirer')
const HTMLGenerator = require('../lib/html/html-generator')

class CaptureCommand extends Command {
  async run() {
    const {flags} = this.parse(CaptureCommand)
    const widths = flags.width
    const format = flags.format
    const quality = flags.quality
    const deviceScaleFactor = flags.dsf

    console.log(widths)

    // clear all
    clear()

    // Global
    let inquirer = new Inquirer()

    // 1) files
    let files = finder.files()
    let defaultFileNames = finder.defaultHtmlFileNames

    if (_.isEmpty(files)) { console.log(chalk.red(`No files found`)); return; }
    let find = _.find(files, file => _.includes(defaultFileNames, file.name))

    let mapped = _.map(files, (file) => {
      return {
        name: file.name,
        value: { object: file }
      }
    })

    let file = (await inquirer.askSelection(mapped, {
      entity: 'file',
      default: find
    })).profile.object

    let spinner = ora('capturing...').start()
    // Generate html
    let generator = new HTMLGenerator(file.path, null, null, {
      embedType: 'base64'
    })
    let rendered = await generator.generate()

    // create captures directory if needed
    fs.mkdirSyncIfNeeded('captures')

    // puppeteer
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    })
    const page = await browser.newPage()
    await page.setContent(rendered.html, { waitUntil: 'networkidle2' })

    let prefix = path.join(path.basename(path.resolve())) || 'screenshot'
    let ext = format === 'pdf' ? 'png' : format
    let exportPaths = []

    for (let index = 0; index < widths.length; index++) {
      let width = widths[index]
      let exportPath = path.join('captures', `${prefix}-w${width}.${ext}`)
      await page.setViewport({width, height: 600, quality, deviceScaleFactor})
      await page.screenshot({path: exportPath, fullPage: true})

      exportPaths.push(exportPath)
    }
    await browser.close()

    // Compile pdf if requested
    if (format === 'pdf' && exportPaths.length > 0) {
      let name = `${prefix}.pdf`
      let pdfPath = path.join('captures', name)
      const doc = new PDFDocument({autoFirstPage:false})
      doc.pipe(fs.createWriteStream(pdfPath))

      exportPaths.forEach(exportPath => {
        const img = doc.openImage(exportPath)
        doc.addPage({size: [img.width, img.height]})
        doc.image(img, 0, 0)

        // delete file
        fs.unlinkSync(exportPath)
      })

      exportPaths = [pdfPath]
      doc.end()
    }

    spinner.succeed(`capture${exportPaths.length > 0 ? 's' : ''} saved at: ${_.join(exportPaths)}`)
  }
}

CaptureCommand.description = `Describe the command here
...
Extra documentation goes here
`

CaptureCommand.flags = {
  width: flags.string({
    char: 'w',
    description: 'capture widths comma separated',
    multiple: true,
    parse: input => parseInt(input),
    default: [800]
  }),
  format: flags.string({
    char: 'f',
    description: 'format which you would like to capture',
    options: ['jpg', 'png', 'pdf'],
    default: 'png'
  }),
  dsf: flags.string({
    char: 'd',
    description: 'device scale factor',
    parse: input => parseInt(input),
    default: 1
  }),
  quality: flags.string({
    char: 'q',
    description: 'capture quality (i.e. pdf, jpg)',
    parse: input => parseInt(input),
    default: 80
  })
}

module.exports = CaptureCommand
