const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const validator = require('validator')
const chalk = require('chalk')

class AWSInquirer extends CrudInquirer {
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
        name: 'config.bucketName',
        type: 'input',
        message: 'Enter the bucket name:',
        validate: key => !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid bucket name',
        default: host && host.config && host.config.bucketName || null
      },
      {
        name: 'config.accessKeyId',
        type: 'input',
        message: 'Enter access key id:',
        validate: key => !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid access key id',
        default: host && host.config && host.config.accessKeyId || null
      },
      {
        name: 'config.secretAccessKey',
        type: 'input',
        message: 'Enter secret access key:',
        validate: key => !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid secret access key',
        default: host && host.config && host.config.secretAccessKey || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = AWSInquirer
