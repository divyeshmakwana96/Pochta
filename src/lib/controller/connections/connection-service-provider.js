const APIController = require('../api-service-provider')
const ora = require('../../helpers/ora')
const ConnectionType = require('../../enums').ConnectionType

const RedmineServiceProvider = require('./services/redmine-service-provider')

class ConnectionServiceProvider extends APIController {
  test() {
    let type = ConnectionType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid connection type')
    }

    let controller
    switch (type) {
      case ConnectionType.Redmine:
        controller = new RedmineServiceProvider(this.object)
        break
    }

    if (controller) {
      return ora.task(controller.test(), 'testing..', 'success!!', function (e) {
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
        controller = new RedmineServiceProvider(this.object)
        break
    }

    if (controller) {
      return ora.task(controller.sync(), 'syncing..', 'profiles and contacts are synced successfully with this connection!!', function (e) {
        if (e instanceof Error) {
          return (e && e.response && e.response.data && e.response.data.ErrorMessage)
        } else {
          return e
        }
      })
    }
  }
}

module.exports = ConnectionServiceProvider
