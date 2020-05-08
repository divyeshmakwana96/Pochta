const ModelController = require('../model-controller')

class HostController extends ModelController {
  constructor() {
    super('hosts')
  }
}

module.exports = HostController
