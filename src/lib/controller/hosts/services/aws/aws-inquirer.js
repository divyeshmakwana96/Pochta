const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
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
        default: host && host.label
      },
      {
        name: 'config.bucketName',
        type: 'input',
        message: 'Enter the bucket name:',
        default: host && host.config && host.config.bucketName
      },
      {
        name: 'config.accessKeyId',
        type: 'input',
        message: 'Enter access key id:',
        default: host && host.config && host.config.accessKeyId
      },
      {
        name: 'config.secretAccessKey',
        type: 'input',
        message: 'Enter secret access key:',
        default: host && host.config && host.config.secretAccessKey
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = AWSInquirer
