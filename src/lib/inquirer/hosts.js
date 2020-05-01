const inquirer = require('inquirer')
const HostType = require('../enums').HostType
const chalk = require('chalk')

const _ = require('lodash')

module.exports = {

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
        name: 'host',
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

  askReviseConnectionConfigs: () => {
    const question = [
      {
        name: 'revise',
        type: 'confirm',
        message: 'Would you like to revise connection configs?'
      }
    ]
    return inquirer.prompt(question)
  },

  // S3
  askS3SetupQuestions: () => {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label you want to set ${chalk.gray('(optional)')}:`
      },
      {
        name: 'bucketName',
        type: 'input',
        message: 'Enter the bucket name:',
      },
      {
        name: 'accessKeyId',
        type: 'input',
        message: 'Enter access key id:',
      },
      {
        name: 'secretAccessKey',
        type: 'input',
        message: 'Enter secret access key:',
      }
    ]
    return inquirer.prompt(questions)
  },

  // Cloudinary
  askCloudinarySetupQuestions: () => {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label you want to set ${chalk.gray('(optional)')}:`
      },
      {
        name: 'cloudName',
        type: 'input',
        message: 'Enter the cloud name:',
      },
      {
        name: 'apiKey',
        type: 'input',
        message: 'Enter the api key:',
      },
      {
        name: 'apiSecret',
        type: 'input',
        message: 'Enter the api secret:',
      }
    ]
    return inquirer.prompt(questions)
  },

  // Cloudinary
  askImageKitSetupQuestions: () => {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label you want to set ${chalk.gray('(optional)')}:`
      },
      {
        name: 'privateKey',
        type: 'input',
        message: 'Enter the private key:',
      }
    ]
    return inquirer.prompt(questions)
  }
}
