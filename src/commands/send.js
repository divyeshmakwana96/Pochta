const {flags} = require('@oclif/command')
const BaseGeneratorCommand = require('../lib/command/base-generator-command')
const ESPServiceProvider = require('../lib/controller/esp/esp-service-provider')

const _ = require('lodash')

class SendCommand extends BaseGeneratorCommand {
  async run() {
    await super.run()

    const {flags} = this.parse(SendCommand)
    this.useCache = (flags.cache && !(flags.cache === 'false')) || true

    // 1) ask file selection
    let file = await this.askFileSelection()
    if (!file) { return }

    // 2) ask image hosting
    let hosting = await this.askHostSelection({
      cid: true,
      base64: true
    })
    if (!hosting) { return }

    // 3) ask minify
    let minify = await this.askShouldMinifyHTML()

    // 4) html rendering
    let rendered = await this.renderHTML(file, hosting.host, hosting.uploadPath, hosting.embedType, minify)
    // console.log(rendered)
    if (!rendered.html) { return }

    // 5) esp selection
    let esp = await this.askESPSelection()
    if (!esp) { return }

    // 6) profile selection
    let from = await this.askProfileSelection()
    if (!from) { return }

    // 7) to
    let to = await this.askToRecipientSelection()
    if (!to || to && to.length === 0) { return }

    // 8) should add cc
    let cc = await this.askCCRecipientSelection()

    // 9) subject line
    let subject = await this.askSubject(rendered.subject)

    // 10) ask auto include
    let autoInclude = await this.askAutoIncludeQuestions()
    if (autoInclude.autoCC) { cc && cc.push(from) }
    let replyTo = autoInclude.autoReplyTo && from

    // 11) ask attachment
    let additional = await this.askForEmailAttachments()
    let attachments = additional ? _.concat(rendered.attachments, additional) : rendered.attachments

    // 12) SEND!!! Hurray
    await new ESPServiceProvider(esp).send(from, to, cc, replyTo, subject, rendered.html, attachments)
  }
}

SendCommand.description = `Build, export and send HTML/MJML files as test emails with attachments

This command will provide a guide and selection process for sending out test emails. You can add additional attachments from the current directory with the email.

Subject line is derived from html's <title> tag. If the tag is missing Pochta will set a default value.

An Image hosting provider is not necessary since Pochta can embed images inline or as attachments.

Currently supported attachment types are: 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'mp4', 'webm', 'mov', 'zip', 'txt'
`

SendCommand.flags = {
  cache: flags.string({
    char: 'c',
    description: 'Boolean flag to enable/disable upload cache'
  })
}

module.exports = SendCommand
