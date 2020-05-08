const ModelController = require('../model-controller')

class ContactController extends ModelController {
  constructor() {
    super('contacts')
  }
}

module.exports = ContactController
