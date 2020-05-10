const APIController = require('../api-controller')
const ConnectionType = require('../../enums').ConnectionType

const RedmineController = require('./services/redmine-controller')

class ServiceController extends APIController {
  test() {
    let type = ConnectionType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid connection type')
    }

    let controller
    switch (type) {
      case ConnectionType.Redmine:
        controller = new RedmineController(this.object)
        break
    }

    if (controller) {
      return controller.test()
    }
  }

  sync() {
    let type = ConnectionType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid connection type')
    }

    let controller
    switch (type) {
      case ConnectionType.Redmine:
        controller = new RedmineController(this.object)
        break
    }

    if (controller) {
      return controller.sync()
    }
  }
}

module.exports = ServiceController
