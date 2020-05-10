const ModelController = require('../model-controller')

class ContactController extends ModelController {
  constructor() {
    super('contacts')
  }

  getTitle(object) {
    return `${object.firstname || 'Unknown' } ${object.lastname || 'Unknown' }`
  }
}

module.exports = ContactController
