const {flags} = require('@oclif/command')
const BaseGeneratorCommand = require('../lib/command/base-generator-command')
const crypto = require('../lib/helpers/crypto')
const path = require('../lib/helpers/path')
const fs = require('../lib/helpers/fs')
const chalk = require('chalk')

const ora = require('ora')
const _ = require('lodash')

class BuildCommand extends BaseGeneratorCommand {
  async run() {
    await super.run()

    const {flags} = this.parse(BuildCommand)
    this.useCache = (flags.cache && !(flags.cache === 'false')) || false

    // 1) ask file selection
    let file = await this.askFileSelection()
    if (!file) { return }

    // 2) ask image hosting
    let hosting = await this.askHostSelection({
      base64: true,
      export: true
    }, false)
    if (!hosting) { return }

    // 3) ask minify
    let minify = await this.askShouldMinifyHTML()

    // 4) html rendering
    let rendered = await this.renderHTML(file, hosting.host, hosting.uploadPath, hosting.embedType, minify)
    if (!rendered.html) { return }

    // 5) spinner - just for fun
    let spinner = ora('exporting...').start()

    // 6) save
    // 6.1) create build dir
    let buildPath = path.join('build', crypto.randomString(8))
    fs.mkdirSyncIfNeeded(buildPath) // create path
    let exportName = `${_.kebabCase(path.basename(path.resolve())) || 'export'}.html`

    // 6.2) save html
    fs.writeFileSync(path.join(buildPath, exportName), rendered.html)

    // 6.3) copy unresolved image paths
    rendered.unresolved.forEach(file => {
      let dest = path.join(buildPath, file.src)
      fs.mkdirSyncIfNeeded(path.dirname(dest))
      fs.copyFileSync(file.path, path.join(buildPath, file.src))
    })

    spinner.succeed(`export saved at: ${buildPath}`)
  }
}

BuildCommand.description = `Build html/mjml files and export content into a new directory
This command generates HTML by parsing MJML/HTML and hosting images to the dedicated cdn provider. If no host selected then, either the images can be embedded as Base64 or can be exported to a directory related to the generated html file.

By default the cache is disabled, meaning on each usage of this command it will try to upload images to the preferred cdn provider. If you want to enable cache use with ${chalk.bold('--cache=true')} flag.
`

BuildCommand.flags = {
  cache: flags.string({
    char: 'c',
    description: 'Boolean flag to enable/disable upload cache'
  })
}

module.exports = BuildCommand
