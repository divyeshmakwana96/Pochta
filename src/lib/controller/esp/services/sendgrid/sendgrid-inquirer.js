const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
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
        name: 'config.sender',
        type: 'input',
        message: 'Enter the sender email address:',
        default: esp && esp.config && esp.config.sender
      },
      {
        name: 'config.apiKey',
        type: 'input',
        message: 'Enter the api key:',
        default: esp && esp.config && esp.config.apiKey
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = SendGridInquirer
