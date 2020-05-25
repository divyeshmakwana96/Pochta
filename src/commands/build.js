const BaseGeneratorCommand = require('../lib/command/base-generator-command')
const crypto = require('../lib/helpers/crypto')
const path = require('../lib/helpers/path')
const fs = require('../lib/helpers/fs')

const ora = require('ora')
const _ = require('lodash')

class BuildCommand extends BaseGeneratorCommand {
  async run() {
    await super.run()

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

  getDefaultUseCacheWhenFlagEmpty() { return false }
}

BuildCommand.description = `setup hosting environments and send mjml/html test emails
`

module.exports = BuildCommand
