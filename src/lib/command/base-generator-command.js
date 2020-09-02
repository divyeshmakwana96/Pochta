const {Command} = require('@oclif/command')

const path = require('../helpers/path')
const clear = require('clear')
const chalk = require('chalk')
const _ = require('lodash')

const HTMLInquirer = require('../html/html-inquirer')
const HTMLGenerator = require('../html/html-generator')
const UploadCacheProvider = require('../cache/upload-cache-provider')

class BaseGeneratorCommand extends Command {
  async init() {
    this.cacheManager = new UploadCacheProvider()
    this.useCache = true
  }

  async run() {
    // clear all
    clear()
  }

  // 1) Get files
  async askFileSelection() {

    const finder = require('../finder/finder')
    const Inquirer = require('../controller/crud-inquirer')

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
      if (find) { break; }
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
  async askHostSelection(otherOptions, useCacheForDirPaths = true) {

    const crypto = require('../helpers/crypto')
    const HostInquirer = require('../controller/hosts/host-inquirer')
    const HostController = require('../controller/hosts/host-controller')

    let controller = new HostController()
    let hosts = controller.getMapped(otherOptions)

    // we are not checking empty, because that will never be the case
    let hostInquirer = new HostInquirer()
    let choice = (await hostInquirer.askSelection(hosts, { default: { id: this.cacheManager.getMeta('host.id') }})).profile

    let id = choice.object.id
    let host = choice.title && choice.object
    this.cacheManager.setMeta('host.id', id)

    // Check content embed type if eligible
    // or ask upload directory
    let uploadPath, embedType
    if (host) {
      let dir = useCacheForDirPaths && this.cacheManager.getMeta('host.path') || path.join(_.kebabCase(path.basename(path.resolve())), crypto.randomString(16))
      uploadPath = (await hostInquirer.askUploadDirectoryPath(dir)).path
      useCacheForDirPaths && this.cacheManager.setMeta('host.path', uploadPath)
    } else {
      embedType = id
      this.cacheManager.setMeta('host.embed', embedType)
    }

    return { host, uploadPath, embedType }
  }

  // 3) ask minifier
  async askShouldMinifyHTML() {
    // ask minify
    let minify = (await new HTMLInquirer().askShouldMinify(this.cacheManager.getMeta('html.minify'))).minify
    this.cacheManager.setMeta('html.minify', minify)
    return minify
  }

  // 4) render html
  async renderHTML(file, host, uploadPath, embedType, minify) {

    const HostServiceProvider = require('../controller/hosts/host-service-provider')
    let generator = new HTMLGenerator(
      file.path,
      host && new HostServiceProvider(host),
      host && this.useCache && this.cacheManager,
      { embedType: embedType, minify: minify, uploadPath: uploadPath }
    )
    return await generator.generate()
  }

  // 5) check profiles
  async askProfileSelection() {

    const ProfileInquirer = require('../controller/profiles/profile-inquirer')
    const ProfileController = require('../controller/profiles/profile-controller')

    let profiles = new ProfileController().getMapped()
    if (_.isEmpty(profiles)) { console.log(chalk.red(`No profiles found. Try 'profiles new' to create one.`)); return; }

    let from = (await new ProfileInquirer().askSelection(profiles, { default: { id: this.cacheManager.getMeta('profile') }})).profile.object
    this.cacheManager.setMeta('profile', from.id)
    return from
  }

  // 6) ESP
  async askESPSelection() {

    const ESPInquirer = require('../controller/esp/esp-inquirer')
    const ESPController = require('../controller/esp/esp-controller')

    let list = new ESPController().getMapped()
    if (_.isEmpty(list)) { console.log(chalk.red(`No esp found. Try 'esp new' to create one.`)); return; }

    return (await new ESPInquirer().askSelection(list, 'Which esp would you like to select?')).profile.object
  }

  // 7) Subject
  async askSubject(subject) {
    return (await new HTMLInquirer().askSubjectLine(subject)).subject
  }

  // 8) recipient selection
  async askRecipientSelection(cacheKey, options) {

    const ContactInquirer = require('../controller/contacts/contact-inquirer')
    const ContactController = require('../controller/contacts/contact-controller')

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

  // 8.1) to recipient selection
  async askToRecipientSelection() {
    return await this.askRecipientSelection('recipients.to', {
      minSelectionCount: 1,
      message: 'Select TO recipients:'
    })
  }

  // 8.2) cc recipient selection
  async askCCRecipientSelection() {

    const ContactInquirer = require('../controller/contacts/contact-inquirer')

    let shouldAddCc = (await new ContactInquirer().askShouldIncludeCC(this.cacheManager.getMeta('recipients.shouldAddCc'))).shouldAddCc
    this.cacheManager.setMeta('recipients.shouldAddCc', shouldAddCc)

    if (shouldAddCc) {
      return await this.askRecipientSelection('recipients.cc', {
        message: 'Select CC recipients:'
      })
    }

    return null
  }

  // 9) rest of the questions
  async askAutoIncludeQuestions() {

    const ESPInquirer = require('../controller/esp/esp-inquirer')

    let answers = (await new ESPInquirer().askMailComposeQuestions(
      this.cacheManager.getMeta('autoCC'),
      this.cacheManager.getMeta('autoReplyTo')
    ))

    this.cacheManager.setMeta('autoCC', answers.autoCC)
    this.cacheManager.setMeta('autoReplyTo', answers.autoReplyTo)

    return answers
  }

  // 10) get attachments
  async askForEmailAttachments() {

    const ESPInquirer = require('../controller/esp/esp-inquirer')
    let shouldAddAttachments = (await new ESPInquirer().shouldAddAttachments()).shouldAddAttachments

    if (shouldAddAttachments) {

      const finder = require('../finder/finder')
      const Inquirer = require('../controller/crud-inquirer')

      let files = finder.files('.', {
        recursive: true,
        types: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'mp4', 'webm', 'mov', 'zip', 'txt']
      })

      let mapped = _.map(files, (file) => {
        return {
          name: file.path,
          value: {object: file}
        }
      })

      let attachments = (await new Inquirer().askMultiSelection(mapped, {
        message: 'Select attachments:'
      })).checked

      return _.map(attachments, checked => {
        let attachment = checked.object
        return {
          filename: attachment.name,
          path: attachment.path,
          contentType: path.mimeType(attachment.path),
          contentDisposition: 'attachment'
        }
      })
    }
  }
}

module.exports = BaseGeneratorCommand

