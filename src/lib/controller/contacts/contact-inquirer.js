const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const validator = require('validator')

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
        validate: key => {
          return !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid first name'
        },
        default: contact && contact.firstname || null
      },
      {
        name: 'lastname',
        type: 'input',
        message: 'Enter last name:',
        validate: key => {
          return !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid last name'
        },
        default: contact && contact.lastname || null
      },
      {
        name: 'email',
        type: 'input',
        message: 'Enter email address:',
        validate: key => {
          return validator.isEmail(key) || 'Enter a valid email address'
        },
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
