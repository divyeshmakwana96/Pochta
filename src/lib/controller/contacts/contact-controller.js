const ModelController = require('../model-controller')
const chalk = require('chalk')

class ContactController extends ModelController {
  constructor() {
    super('contacts')
  }

  getTitle(object) {
    return `${object.firstname || 'Unknown' } ${object.lastname || 'Unknown' } ${chalk.bold(`<${object.email}>`)}`
  }
}

module.exports = ContactController
