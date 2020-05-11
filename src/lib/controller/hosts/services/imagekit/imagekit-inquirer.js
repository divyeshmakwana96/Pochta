const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')

class ImageKitInquirer extends CrudInquirer {
  constructor() {
    super('host')
  }

  // setup
  async askSetupQuestions(host) {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: host && host.label || null
      },
      {
        name: 'privateKey',
        type: 'input',
        message: 'Enter the private key:',
        default: host && host.privateKey || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = ImageKitInquirer
