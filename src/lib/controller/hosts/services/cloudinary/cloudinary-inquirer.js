const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')

class CloudinaryInquirer extends CrudInquirer {
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
        name: 'cloudName',
        type: 'input',
        message: 'Enter the cloud name:',
        default: host && host.cloudName || null
      },
      {
        name: 'apiKey',
        type: 'input',
        message: 'Enter the api key:',
        default: host && host.apiKey || null
      },
      {
        name: 'apiSecret',
        type: 'input',
        message: 'Enter the api secret:',
        default: host && host.apiSecret || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = CloudinaryInquirer
