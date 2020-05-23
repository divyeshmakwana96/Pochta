const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const _ = require('lodash')

const Enums = require('../../enums')
const HostType = Enums.HostType
const OptionType = Enums.OptionType

const AWSInquirer = require('./services/aws/aws-inquirer')
const CloudinaryInquirer = require('./services/cloudinary/cloudinary-inquirer')
const ImageKitInquirer = require('./services/imagekit/imagekit-inquirer')

class HostInquirer extends CrudInquirer {
  constructor() {
    super('host', [OptionType.View, OptionType.Edit, OptionType.Delete, OptionType.Test])
  }

  // selection type
  askHostTypeSelection() {

    let mapped = _.map(HostType.enums, (enm) => {
      return {
        name: Enums.describe(enm),
        value: enm
      }
    })

    const question = [
      {
        name: 'type',
        type: 'list',
        message: 'Which image hosting provider you would like to add?',
        choices: _.sortBy(mapped, 'name')
      }
    ]

    return inquirer.prompt(question)
  }

  // embed selection type
  askEmbedTypeSelection(options) {
    const question = [
      {
        name: 'type',
        type: 'list',
        message: 'How would you like to embed images?',
        choices: [
          {
            name: 'CID attachments',
            value: 'cid'
          },
          {
            name: 'Inline embedding (base64)',
            value: 'base64'
          }
        ],
        default: options && options.default
      }
    ]

    return inquirer.prompt(question)
  }

  // selection type
  askUploadDirectoryPath(path) {
    const question = [
      {
        name: 'path',
        type: 'input',
        message: 'Please enter upload directory path:',
        default: path
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

    let controller
    if (type) {
      switch (type) {
        case HostType.S3:
          controller = new AWSInquirer()
          break
        case HostType.Cloudinary:
          controller = new CloudinaryInquirer()
          break
        case HostType.ImageKit:
          controller = new ImageKitInquirer()
          break
      }
    }

    if (controller) {
      let answers = await controller.askSetupQuestions(host)
      answers.type = host.type
      return answers
    }
  }
}

module.exports = HostInquirer
