const ModelController = require('../model-controller')
const chalk = require('chalk')
const inquirer = require('inquirer')
const Enums = require('../../enums')

class HostController extends ModelController {
  constructor() {
    super('hosts')
  }

  getMapped(otherOptions) {
    let mapped = super.getMapped()
    if (otherOptions) {
      mapped.push(new inquirer.Separator(`----------- other options ------------`))
      if (otherOptions.cid) {
        mapped.push({
          name: `${chalk.bold('Embed images as mime objects')}, or ${chalk.bold('CID attachments')}`,
          value: { object: { id: 'cid' } }
        })
      }

      if (otherOptions.base64) {
        mapped.push({
          name: `${chalk.bold('Inline embedding')}, or ${chalk.bold('Base64 encoding')}`,
          value: { object: { id: 'base64' } }
        })
      }

      if (otherOptions.export) {
        mapped.push({
          name: `${chalk.bold('None')} ${chalk.gray('(Export Images)')}`,
          value: { object: { id: 'export' } }
        })
      }

    }
    return mapped
  }

  getTitle(object) {
    let title = Enums.describe(object.type)

    if (object.label && object.label.length > 0) {
      title = title + ` (${chalk.bold(object.label)})`
    }

    return title
  }
}

module.exports = HostController
