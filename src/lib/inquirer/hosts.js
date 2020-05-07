const inquirer = require('inquirer')
const HostType = require('../enums').HostType
const chalk = require('chalk')

const _ = require('lodash')

const Inquirer = {

  askHostTypeSelection: () => {
    const question = [
      {
        name: 'type',
        type: 'list',
        message: 'Which image hosting provider you would like to add?',
        choices: _.map(HostType.enums, (enm) => {
          return {
            name: enm.key,
            value: enm
          }
        })
      }
    ]

    return inquirer.prompt(question)
  },

  askHostSelection: (profiles) => {
    const question = [
      {
        name: 'profile',
        type: 'list',
        message: 'Which host would you like to view?',
        choices: profiles
      }
    ]
    return inquirer.prompt(question)
  },

  askHostConnectionTest: () => {
    const question = [
      {
        name: 'test',
        type: 'confirm',
        message: 'Would you like to test the connection?'
      }
    ]
    return inquirer.prompt(question)
  },

  askHostRemoveConfirmation: (title) => {
    const question = [
      {
        name: 'delete',
        type: 'confirm',
        message: `Are you sure you want to delete ${chalk.cyan(title)}?`
      }
    ]
    return inquirer.prompt(question)
  },

  askHostOptions: (title) => {
    const question = [
      {
        name: 'value',
        type: 'list',
        message: `What would you like to do with ${chalk.cyan(title)}?`,
        choices: ['view', 'edit', 'delete', 'test', new inquirer.Separator(), 'cancel']
      }
    ]
    return inquirer.prompt(question)
  },

  askHostSetupQuestions: (type, host) => {
    if (type) {
      switch (type) {
        case HostType.S3:
          return Inquirer.askS3SetupQuestions(host)
        case HostType.Cloudinary:
          return Inquirer.askCloudinarySetupQuestions(host)
        case HostType.ImageKit:
          return Inquirer.askImageKitSetupQuestions(host)
      }
    }
  },

  // S3
  askS3SetupQuestions: (host) => {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: host && host.label || null
      },
      {
        name: 'bucketName',
        type: 'input',
        message: 'Enter the bucket name:',
        default: host && host.bucketName || null
      },
      {
        name: 'accessKeyId',
        type: 'input',
        message: 'Enter access key id:',
        default: host && host.accessKeyId || null
      },
      {
        name: 'secretAccessKey',
        type: 'input',
        message: 'Enter secret access key:',
        default: host && host.secretAccessKey || null
      }
    ]
    return inquirer.prompt(questions)
  },

  // Cloudinary
  askCloudinarySetupQuestions: (host) => {
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
  },

  // ImageKit
  askImageKitSetupQuestions: (host) => {
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

module.exports = Inquirer
