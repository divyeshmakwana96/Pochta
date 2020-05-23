const ModelController = require('../model-controller')
const chalk = require('chalk')
const Enums = require('../../enums')

class HostController extends ModelController {
  constructor() {
    super('hosts')
  }

  getMapped(includesNone = false) {
    let mapped = super.getMapped()
    if (includesNone) {
      mapped.push({
        name: `${chalk.bold('None')} ${chalk.gray(`(embedded images)`)}`,
        value: { title: 'None', object: { id: 'none' } }
      })
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
