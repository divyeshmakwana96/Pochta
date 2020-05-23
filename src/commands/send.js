const {Command, flags} = require('@oclif/command')

const fs = require('fs')
const path = require('path')
const clear = require('clear')
const chalk = require('chalk')
const ora = require('ora')
const uniqueString = require('unique-string')
const _ = require('lodash')

const HTMLInquirer = require('../lib/html/html-inquirer')
const HTMLGenerator = require('../lib/html/html-generator')
const UploadCacheProvider = require('../lib/cache/upload-cache-provider')

class SendCommand extends Command {
  async run() {
    // clear all
    clear()

    // Global
    this.cacheManager = new UploadCacheProvider()

    // 1) File
    // let file = await this.askFileSelection()

    // 2) Hosting
    // let hosting = await this.askHostSelection()

    // 3) HTML rendering
    // let rendered = await this.renderHTML(file, hosting.host, hosting.uploadPath, hosting.embedType)

    // 4) Ask profile selection
    // let from = await this.askProfileSelection()

    // 5) ESP

    // 6) Subject

    // 7) To
    // let to = await this.askToRecipientSelection()

    // 8) CC
    // let cc = await this.askCCRecipientSelection()

    // 9) Attachments
    let attachments = await this.askForEmailAttachments()


    // 8) Send
    // await espServiceProvider.send(from, toRecipients, ccRecipients, replyTo, answers.subject, rendered.html, rendered.attachments)

  }

  // 1) Get files
  async askFileSelection() {

    const finder = require('../lib/finder/finder')
    const Inquirer = require('../lib/controller/crud-inquirer')

    // 1) files
    let files = finder.files('.', {
      types: ['html', 'mjml']
    })
    let defaultFileNames = finder.defaultHtmlFileNames

    if (_.isEmpty(files)) {
      console.log(chalk.red(`No files found`));
      return;
    }
    // 1.1) default file names manipulation
    let lastFileSelection = this.cacheManager.getMeta('file')
    if (lastFileSelection) {
      defaultFileNames = _.union([lastFileSelection], defaultFileNames)
    }

    // 1.2) Looping and finding the proper selected file
    // in the same incremental order as default file names
    let find
    for (let index = 0; index < defaultFileNames.length; index++) {
      let name = defaultFileNames[index]
      find = _.find(files, file => file.name === name)
      if (find) {
        break;
      }
    }

    //// get mapped
    let mapped = _.map(files, (file) => {
      return {
        name: file.name,
        value: {object: file}
      }
    })

    // 1.2) ask file selection
    let file = (await new Inquirer().askSelection(mapped, {
      entityName: 'file',
      default: find
    })).profile.object
    this.cacheManager.setMeta('file', file.name)
    return file
  }

  // 2) Get Hosting
  async askHostSelection() {

    const crypto = require('../lib/helpers/crypto')
    const HostInquirer = require('../lib/controller/hosts/host-inquirer')
    const HostController = require('../lib/controller/hosts/host-controller')

    let controller = new HostController()
    let hosts = controller.getMapped(true)

    // we are not checking empty, because that will never be the case
    let hostInquirer = new HostInquirer()
    let host = (await hostInquirer.askSelection(hosts, { default: { id: this.cacheManager.getMeta('host.id') }})).profile.object
    this.cacheManager.setMeta('host.id', host.id)

    // Check content embed type if eligible
    // or ask upload directory
    let uploadPath, embedType
    host = host.id !== 'none' ? host : null

    if (host) {
      let dir = this.cacheManager.getMeta('host.path') || path.join(path.basename(path.resolve()), crypto.randomString(8))
      uploadPath = (await hostInquirer.askUploadDirectoryPath(dir)).path
      this.cacheManager.setMeta('host.path', uploadPath)
    } else {
      embedType = (await hostInquirer.askEmbedTypeSelection({ default: this.cacheManager.getMeta('host.embed') })).type
      this.cacheManager.setMeta('host.embed', embedType)
    }

    return { host, uploadPath, embedType }
  }

  // 3) render html
  async renderHTML(file, host, uploadPath, embedType) {

    const HostServiceProvider = require('../lib/controller/hosts/host-service-provider')

    // ask minify
    let minify = (await new HTMLInquirer().askShouldMinify(this.cacheManager.getMeta('html.minify'))).minify
    this.cacheManager.setMeta('html.minify', embedType)

    let generator = new HTMLGenerator(
      file.path,
      host ? new HostServiceProvider(host) : null,
      host ? this.cacheManager : null,
      { embedType: embedType, minify: minify, uploadPath: uploadPath }
    )
    return await generator.generate()
  }

  // 4) check profiles
  async askProfileSelection() {

    const ProfileInquirer = require('../lib/controller/profiles/profile-inquirer')
    const ProfileController = require('../lib/controller/profiles/profile-controller')

    let profiles = new ProfileController().getMapped()
    if (_.isEmpty(profiles)) { console.log(chalk.red(`No profiles found. Try 'profiles new' to create one.`)); return; }

    let from = (await new ProfileInquirer().askSelection(profiles, { default: { id: this.cacheManager.getMeta('profile') }})).profile.object
    this.cacheManager.setMeta('profile', from.id)
    return from
  }

  // 5) ESP
  async askESPSelection() {

    const ESPInquirer = require('../lib/controller/esp/esp-inquirer')
    const ESPController = require('../lib/controller/esp/esp-controller')

    let list = new ESPController().getMapped()
    if (_.isEmpty(list)) { console.log(chalk.red(`No esp found. Try 'esp new' to create one.`)); return; }

    return (await new ESPInquirer().askSelection(list, 'Which esp would you like to select?')).profile.object
  }

  // 6) Subject
  async askSubject(subject) {
    return (await new HTMLInquirer().askSubjectLine(subject)).subject
  }

  // 7) recipient selection
  async askRecipientSelection(cacheKey, options) {

    const ContactInquirer = require('../lib/controller/contacts/contact-inquirer')
    const ContactController = require('../lib/controller/contacts/contact-controller')

    let contacts = new ContactController().getMapped()
    let inquirer = new ContactInquirer()

    // cached ids
    let ids = this.cacheManager.getMeta(cacheKey)
    let list

    // get object list associated with ids
    let checked = _.map(_.filter(contacts, contact => { return _.includes(ids, contact.value.object.id) }), contact => {
      contact.checked = true
      return contact
    })

    // if we found previous checked, then display them first
    if (checked.length > 0 && (checked.length !== contacts.length)) {
      checked.push(inquirer.separator(`----------- other ------------`))
      list = _.union(checked, contacts)
    } else {
      list = contacts
    }

    // present check list
    let recipients = (await inquirer.askMultiSelection(list, options)).checked
    let out = _.map(recipients, (recipient) => { return recipient.object })
    this.cacheManager.setMeta(cacheKey, _.map(out, contact => contact.id || ''))
    return out
  }

  // 7.1) to recipient selection
  async askToRecipientSelection() {
    return await this.askRecipientSelection('recipients.to', {
      minSelectionCount: 1,
      message: 'Select TO recipients:'
    })
  }

  // 7.1) cc recipient selection
  async askCCRecipientSelection() {

    const ContactInquirer = require('../lib/controller/contacts/contact-inquirer')

    let shouldAddCc = (await new ContactInquirer().askShouldIncludeCC(this.cacheManager.getMeta('recipients.shouldAddCc'))).shouldAddCc
    this.cacheManager.setMeta('recipients.shouldAddCc', shouldAddCc)

    if (shouldAddCc) {
      return await this.askRecipientSelection('recipients.cc', {
        message: 'Select CC recipients:'
      })
    }

    return null
  }

  // 8) rest of the questions
  async askAutoIncludeQuestions() {

    const ESPInquirer = require('../lib/controller/esp/esp-inquirer')

    let answers = (await new ESPInquirer().askMailComposeQuestions(
      this.cacheManager.getMeta('autoCC'),
      this.cacheManager.getMeta('autoReplyTo')
    ))

    this.cacheManager.setMeta('autoCC', answers.autoCC)
    this.cacheManager.setMeta('autoReplyTo', answers.autoReplyTo)

    return answers
  }

  // 9) get attachments
  async askForEmailAttachments() {

    const ESPInquirer = require('../lib/controller/esp/esp-inquirer')
    let shouldAddAttachments = (await new ESPInquirer().shouldAddAttachments()).shouldAddAttachments

    if (shouldAddAttachments) {

      const finder = require('../lib/finder/finder')
      const Inquirer = require('../lib/controller/crud-inquirer')

      let files = finder.files('.', {
        recursive: true,
        types: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'mp4', 'webm', 'mov', 'zip']
      })

      let mapped = _.map(files, (file) => {
        return {
          name: file.path,
          value: {object: file}
        }
      })

      return (await new Inquirer().askMultiSelection(mapped, {
        message: 'Select attachments:'
      })).checked
    }

    return null
  }

}

SendCommand.description = `setup hosting environments and send mjml/html test emails
`

module.exports = SendCommand

