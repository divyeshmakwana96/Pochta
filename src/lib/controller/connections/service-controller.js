const APIController = require('../api-service-provider')
const ora = require('../../ora')
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
      return ora(controller.test(), 'testing..', 'success!!', function (e) {
        if (e instanceof Error) {
          return (e && e.response && e.response.data && e.response.data.ErrorMessage)
        } else {
          return e
        }
      })
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
      return ora(controller.sync(), 'syncing..', 'profiles and contacts are synced successfully with this connection!!', function (e) {
        if (e instanceof Error) {
          return (e && e.response && e.response.data && e.response.data.ErrorMessage)
        } else {
          return e
        }
      })
    }
  }
}

module.exports = ServiceController
