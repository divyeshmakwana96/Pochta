const {Command, flags} = require('@oclif/command')

const path = require('path')

const clear = require('clear')
const chalk = require('chalk')
const ora = require('ora')

// local helpers
const finder = require('../lib/finder/finder')
const configs = require('../lib/configs')
const parser = require('../lib/parser')
const cache = require('../lib/cache')
const inquirer = require('../lib/inquirer')
const uploader = require('../lib/uploader')
const mailer = require('../lib/mailer')

class SendCommand extends Command {
  async run() {
    // clear all
    clear()

    let didSaveConfigs = false

    // Setup global profile
    let globalConfigs = configs.getStoredGlobalProfile()
    if (!globalConfigs) {
      globalConfigs = await configs.getGlobalProfile()
      didSaveConfigs = true
    }

    // Local
    let localConfigs = configs.getStoredLocalProfile()
    if (!localConfigs) {
      localConfigs = await configs.getLocalProfile()
      didSaveConfigs = true
    }

    if (didSaveConfigs) {
      ora('saving...').succeed('Configs saved successfully!!')
    }

    // Rendering
    const baseDir = './'

    // Render HTML
    let html = await finder.findFilesInDirectory(baseDir)
    .then(files => inquirer.askFileSelection(files)) // Ask for prompt
    .then(answer => parser.parseHTML(path.join(baseDir, answer.file))) // render if needed or get content
    .then(html => parser.parseImagesFromHTML(html)) // parse images
    .then(parsed => cache.analyzeImagePaths(baseDir, parsed.html, parsed.paths)) // analyze images that needs to be uploaded
    .then(result => uploader.uploadToCloudinary(globalConfigs.cloudinary, baseDir, result.uploadable, result.html)) // Uploads to Cloudinary
    .then(result => cache.cacheUploads(baseDir, result.uploads, result.html)) // Save URLs to cache
    .then(result => parser.render(result.html, result.cache)) // Render html with the remote urls
    .catch(error => this.log(chalk.red(error)))

    // Send with loader
    if (html) {
      const spinner = ora('sending...').start()
      mailer.sendWithMailjet(globalConfigs.mailjet,
        localConfigs.to,
        {
          email: globalConfigs.mailjet.from,
          name: globalConfigs.name,
        },
        localConfigs.subject,
        localConfigs.cc,
        {
          email: globalConfigs.email,
          name: globalConfigs.name,
        }, html)
      .then(() => spinner.succeed('Email sent successfully!!'))
      .catch(error => spinner.fail(`${chalk.red('There was an error while sending the email. ' + error)}`))
    }
  }
}

SendCommand.description = `setup hosting environments and send mjml/html test emails
`

module.exports = SendCommand
