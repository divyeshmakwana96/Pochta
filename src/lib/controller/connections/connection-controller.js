const ModelController = require('../model-controller')

class CollectionController extends ModelController {
  constructor() {
    super('connections')
  }
}

module.exports = CollectionController
