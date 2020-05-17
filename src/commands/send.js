const {Command, flags} = require('@oclif/command')

const fs = require('fs')
const clear = require('clear')
const chalk = require('chalk')
const ora = require('ora')
const _ = require('lodash')

// Finder
const finder = require('../lib/finder/finder')
const CrudInquirer = require('../lib/controller/crud-inquirer')
const ESPInquirer = require('../lib/controller/esp/esp-inquirer')

const HostController = require('../lib/controller/hosts/host-controller')
const ProfileController = require('../lib/controller/profiles/profile-controller')
const ESPController = require('../lib/controller/esp/esp-controller')
const ContactController = require('../lib/controller/contacts/contact-controller')

const HTMLGenerator = require('../lib/html/html-generator')
const UploadCacheProvider = require('../lib/cache/upload-cache-provider')
const HostServiceProvider = require('../lib/controller/hosts/host-service-provider')
const ESPServiceProvider = require('../lib/controller/esp/esp-service-provider')

class SendCommand extends Command {
  async run() {
    // clear all
    clear()

    // Global
    let inquirer = new CrudInquirer()

    // 1) files
    let files = finder.files()
    if (_.isEmpty(files)) { console.log(chalk.red(`No files found`)); return; }

    let mapped = _.map(finder.files(), (file) => {
      return {
        name: file.name,
        value: file
      }
    })
    let file = (await inquirer.askSelection(mapped)).profile

    // 2) Hosting
    let hosts = new HostController().getMapped()
    hosts.push({name: `None ${chalk.gray(`(Embed content)`)}`, value: {}})

    // we are not checking empty, because that will never be the case
    let host = (await inquirer.askSelection(hosts, 'Which host would you like to select?')).profile.object

    // 3) Check sender profiles
    let profiles = new ProfileController().getMapped()
    if (_.isEmpty(profiles)) { console.log(chalk.red(`No profiles found. Try 'profiles new' to create one.`)); return; }

    // 4) Check ESPs
    let espList = new ESPController().getMapped()
    if (_.isEmpty(espList)) { console.log(chalk.red(`No esp found. Try 'esp new' to create one.`)); return; }

    // 6) Check contacts
    let contacts = new ContactController().getMapped()
    if (_.isEmpty(contacts)) { console.log(chalk.red(`No contacts found. Try 'contacts new' to create one.`)); return; }

    // 3) Generate html based on the input
    let generator = new HTMLGenerator(
      file.path,
      host ? new HostServiceProvider(host) : null,
      host?  new UploadCacheProvider() : null
      )
    let rendered = generator.generate()
    // fs.writeFileSync('/Users/admin/Desktop/render.html', rendered.html)

    // 4) Sender Profile
    let from = (await inquirer.askSelection(profiles, 'Which profile would you like to select?')).profile.object

    // 5) ESP
    let esp = (await inquirer.askSelection(espList, 'Which esp would you like to select?')).profile.object
    let espServiceProvider = new ESPServiceProvider(esp)
    let espInquirer = new ESPInquirer()

    // 6) Contacts - pre selection
    /*
    let ids = ['ed137e6d5c31c35be737a9b61b4150d3', '501b92573b74b67b6dc3033536ed35ea', 'aa239f7b22cb2780ddb8a3b9a8c437c5']
    let list

    let checked = _.map(_.filter(contacts, contact => { return _.includes(ids, contact.value.object.id) }), contact => {
      contact.checked = true
      return contact
    })

    if (checked.length > 0) {
      // checked.splice(0, 0, inquirer.separator(`-------- preselected --------`))
      checked.push(inquirer.separator(`----------- more ------------`))
      list = _.union(checked, contacts)
    } else {
      list = contacts
    }
    */

    // 6.1) Contacts - to
    let to = (await inquirer.askMultiSelection(contacts, 'To recipients:', 1)).profile
    let toRecipients = _.map(to, (recipient) => { return recipient.object })

    // 6.1) Contacts - cc
    let ccRecipients = []
    if ((await espInquirer.askToIncludeCC()).shouldAddCc) {
      let cc = (await inquirer.askMultiSelection(contacts, 'CC recipients:')).profile
      ccRecipients = _.map(cc, (recipient) => { return recipient.object })
    }

    // 7) Ask composing questions
    let answers = (await new ESPInquirer().askMailComposeQuestions(rendered.title || '[TEST]'))
    if (answers.autoCc) {
      ccRecipients.push(from)
    }

    let replyTo = answers.autoReplyTo ? from : null

    // 8) Send
    await espServiceProvider.send(from, toRecipients, ccRecipients, replyTo, answers.subject, rendered.html, rendered.attachments)
  }
}

SendCommand.description = `setup hosting environments and send mjml/html test emails
`

module.exports = SendCommand

