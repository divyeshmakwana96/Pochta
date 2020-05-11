const CrudCommand = require('../lib/command/crud-command')
const ContactController = require('../lib/controller/contacts/contact-controller')
const ContactInquirer = require('../lib/controller/contacts/contact-inquirer')

class ContactsCommand extends CrudCommand {
  async run() {
    this.controller = new ContactController()
    this.inquirer = new ContactInquirer()

    await super.run()
  }
}

ContactsCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = ContactsCommand
