const {flags} = require('@oclif/command')
const fs = require('../lib/helpers/fs')
const ora = require('ora')
const path = require('path')
const puppeteer = require('puppeteer-core')
const PDFDocument = require('pdfkit')
const chalk = require('chalk')
const _ = require('lodash')

const BaseGeneratorCommand = require('../lib/command/base-generator-command')

class CaptureCommand extends BaseGeneratorCommand {
  async run() {
    await super.run()

    const {flags} = this.parse(CaptureCommand)
    const widths = flags.width
    const format = flags.format
    const quality = flags.quality
    const deviceScaleFactor = flags.dsf

    // 1) ask file selection
    let file = await this.askFileSelection()
    if (!file) { return }

    // 2) html rendering
    let rendered = await this.renderHTML(file, null, null, 'base64', false)
    if (!rendered.html) { return }

    console.log(`${chalk.keyword('orange')('Make sure you have Google Chrome installed!!!')}`)

    // 3) spinner - just for fun
    let spinner = ora('capturing...').start()

    // 4) Capture
    // create captures directory if needed
    fs.mkdirSyncIfNeeded('captures')

    // puppeteer
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    })
    const page = await browser.newPage()
    await page.setContent(rendered.html, { waitUntil: 'networkidle2' })

    let prefix = _.kebabCase(path.basename(path.resolve())) || 'screenshot'
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
