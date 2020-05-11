const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')

class MailJetInquirer extends CrudInquirer {
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
        name: 'sender',
        type: 'input',
        message: 'Enter the sender email address:',
        default: esp && esp.sender
      },
      {
        name: 'apiKey',
        type: 'input',
        message: 'Enter the api key:',
        default: esp && esp.apiKey
      },
      {
        name: 'apiSecret',
        type: 'input',
        message: 'Enter the api secret:',
        default: esp && esp.apiSecret
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = MailJetInquirer
