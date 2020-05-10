const ModelController = require('../model-controller')

class ProfileController extends ModelController {
  constructor() {
    super('profiles')
  }

  getTitle(object) {
    return `${object.firstname || 'Unknown' } ${object.lastname || 'Unknown' }`
  }
}

module.exports = ProfileController
