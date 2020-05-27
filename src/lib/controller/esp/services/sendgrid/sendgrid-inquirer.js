const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const validator = require('validator')
const chalk = require('chalk')

class SendGridInquirer extends CrudInquirer {
  constructor() {
    super('esp')
  }

  askSetupQuestions(esp) {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: esp && esp.label
      },
      {
        name: 'config.apiKey',
        type: 'input',
        message: 'Enter the api key:',
        validate: apiKey => !validator.isEmpty(apiKey, { ignore_whitespace: true }) || 'Enter a valid api key',
        default: esp && esp.config && esp.config.apiKey || null
      },
      {
        name: 'config.sender',
        type: 'input',
        message: 'Enter the sender email address:',
        validate: sender => validator.isEmail(sender) || 'Enter a valid email address',
        default: esp && esp.config && esp.config.sender || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = SendGridInquirer
