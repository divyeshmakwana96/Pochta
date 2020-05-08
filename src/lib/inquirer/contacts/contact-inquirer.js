const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')

class ContactInquirer extends CrudInquirer {
  constructor() {
    super('contact', false)
  }

  askSetupQuestions(contact) {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: contact && contact.label || null
      },
      {
        name: 'name',
        type: 'input',
        message: 'Enter the name:',
        default: contact && contact.name || null
      },
      {
        name: 'email',
        type: 'input',
        message: 'Enter email address:',
        default: contact && contact.email || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = ContactInquirer
