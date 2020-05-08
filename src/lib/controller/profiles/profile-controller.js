const ModelController = require('../model-controller')

class ProfileController extends ModelController {
  constructor() {
    super('profiles')
  }
}

module.exports = ProfileController
