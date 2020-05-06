const inquirer = require('inquirer')
const HostType = require('../enums').HostType
const chalk = require('chalk')

const _ = require('lodash')

const Inquirer = {

  askHostTypeSelection: async () => {
    const question = [
      {
        name: 'type',
        type: 'list',
        message: 'Which image hosting provider you would like to add?',
        choices: _.map(HostType.enums, (enm) => {
          return enm.key
        })
      }
    ]

    let answers = await inquirer.prompt(question)
    return HostType.get(answers.type)
  },

  askHostProfileSelection: (profiles) => {
    const question = [
      {
        name: 'profile',
        type: 'list',
        message: 'Which host you would like to view?',
        choices: profiles
      }
    ]
    return inquirer.prompt(question)
  },

  askConnectionTest: () => {
    const question = [
      {
        name: 'test',
        type: 'confirm',
        message: 'Would you like to test the connection?'
      }
    ]
    return inquirer.prompt(question)
  },

  askRemoveConfirmation: (title) => {
    const question = [
      {
        name: 'delete',
        type: 'confirm',
        message: `Are you sure you want to delete ${chalk.cyan(title)}?`,
        default: false
      }
    ]
    return inquirer.prompt(question)
  },

  aksHostProfileOptions: (label) => {
    const question = [
      {
        name: 'value',
        type: 'list',
        message: `What would you like to do with ${chalk.cyan(label)}?`,
        choices: ['view', 'edit', 'delete', 'test', new inquirer.Separator(), 'cancel']
      }
    ]
    return inquirer.prompt(question)
  },

  askSetupQuestions: (type, host) => {
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
        message: `Enter a label you want to set ${chalk.gray('(optional)')}:`,
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
        message: `Enter a label you want to set ${chalk.gray('(optional)')}:`,
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

  // Cloudinary
  askImageKitSetupQuestions: (host) => {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label you want to set ${chalk.gray('(optional)')}:`,
        default: host && host.apiSecret || null
      },
      {
        name: 'privateKey',
        type: 'input',
        message: 'Enter the private key:',
        default: host && host.apiSecret || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = Inquirer
