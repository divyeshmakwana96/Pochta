const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')
const _ = require('lodash')

const Enums = require('../../enums')
const HostType = Enums.HostType
const OptionType = Enums.OptionType

class HostInquirer extends CrudInquirer {
  constructor() {
    super('host', [OptionType.View, OptionType.Edit, OptionType.Delete, OptionType.Test])
  }

  // selection type
  askHostTypeSelection() {
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
  }

  // setup
  async askSetupQuestions(host) {

    let type = host && host.type && HostType.get(host.type)
    if (!type) {
      let choice = await this.askHostTypeSelection()
      type = choice.type
      host = {type: type.key}
    }

    let promise
    if (type) {
      switch (type) {
        case HostType.S3:
          promise = this.askS3SetupQuestions(host)
          break
        case HostType.Cloudinary:
          promise = this.askCloudinarySetupQuestions(host)
          break
        case HostType.ImageKit:
          promise = this.askImageKitSetupQuestions(host)
          break
      }
    }

    // get answers
    let answers = await promise
    answers.type = host.type
    return answers
  }

  // S3
  askS3SetupQuestions(host) {
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
  }

  // Cloudinary
  askCloudinarySetupQuestions(host) {
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

  // ImageKit
  askImageKitSetupQuestions(host) {
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

module.exports = HostInquirer
