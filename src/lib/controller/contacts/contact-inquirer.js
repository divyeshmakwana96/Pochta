const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')

class ContactInquirer extends CrudInquirer {
  constructor(entityName) {
    super(entityName || 'contact')
  }

  askSetupQuestions(contact) {
    const questions = [
      {
        name: 'firstname',
        type: 'input',
        message: 'Enter first name:',
        default: contact && contact.firstname || null
      },
      {
        name: 'lastname',
        type: 'input',
        message: 'Enter last name:',
        default: contact && contact.lastname || null
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

  askShouldIncludeCC(shouldAddCc = false) {
    const question = [
      {
        name: 'shouldAddCc',
        type: 'confirm',
        message: 'Would you like to add cc?',
        default: shouldAddCc
      }
    ]
    return inquirer.prompt(question)
  }
}

module.exports = ContactInquirer
