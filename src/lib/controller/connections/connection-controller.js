const ModelController = require('../model-controller')
const chalk = require('chalk')
const Enums = require('../../enums')

class CollectionController extends ModelController {
  constructor() {
    super('connections')
  }

  getTitle(object) {
    let title = Enums.describe(object.type)

    if (object.config) {
      if (object.config.sender) {
        title = title + ` <${chalk.bold(object.config.sender)}>`
      } else if (object.config.auth && object.config.auth.user) {
        title = title + ` <${chalk.bold( object.config.auth.user)}>`
      }
    }

    if (object.label && object.label.length > 0) {
      title = title + ` (${chalk.bold(object.label)})`
    }

    return title
  }
}

module.exports = CollectionController
