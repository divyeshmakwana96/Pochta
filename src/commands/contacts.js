const CrudCommand = require('../lib/command/crud-command')
const ContactController = require('../lib/controller/contacts/contact-controller')
const ContactInquirer = require('../lib/controller/contacts/contact-inquirer')

class ContactsCommand extends CrudCommand {
  async init() {
    this.controller = new ContactController()
    this.inquirer = new ContactInquirer()
  }
}

ContactsCommand.description = `Create, Read, Update and Delete contacts

A contact is a form of recipients for supporting multiselect functionality to fill TO or CC fields.
`

module.exports = ContactsCommand
