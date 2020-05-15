const ModelController = require('../model-controller')
const chalk = require('chalk')

class ProfileController extends ModelController {
  constructor() {
    super('profiles')
  }

  getTitle(object) {
    return `${object.firstname || 'Unknown' } ${object.lastname || 'Unknown' } ${chalk.bold(`<${object.email}>`)}`
  }
}

module.exports = ProfileController
