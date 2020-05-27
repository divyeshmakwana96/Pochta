const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const validator = require('validator')
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
        name: 'config.cloudName',
        type: 'input',
        message: 'Enter the cloud name:',
        validate: cloudName => !validator.isEmpty(cloudName, { ignore_whitespace: true }) || 'Enter a valid cloud name',
        default: host && host.config && host.config.cloudName || null
      },
      {
        name: 'config.apiKey',
        type: 'input',
        message: 'Enter the api key:',
        validate: apiKey => !validator.isEmpty(apiKey, { ignore_whitespace: true }) || 'Enter a valid api key',
        default: host && host.config && host.config.apiKey || null
      },
      {
        name: 'config.apiSecret',
        type: 'input',
        message: 'Enter the api secret:',
        validate: apiSecret => !validator.isEmpty(apiSecret, { ignore_whitespace: true }) || 'Enter a valid api secret',
        default: host && host.config && host.config.apiSecret || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = CloudinaryInquirer
