const CrudCommand = require('../lib/command/crud-command')
const ConnectionController = require('../lib/controller/connections/connection-controller')
const ConnectionServiceProvider = require('../lib/controller/connections/connection-service-provider')
const ConnectionInquirer = require('../lib/controller/connections/connection-inquirer')

const OptionType = require('../lib/enums').OptionType

class ConnectionsCommand extends CrudCommand {
  async init() {
    this.controller = new ConnectionController()
    this.inquirer = new ConnectionInquirer()
  }

  async handleOption(option, conn) {
    switch (option) {
      case OptionType.Test: {
        await new ConnectionServiceProvider(conn).test()
        break
      }
      case OptionType.Sync: {
        await new ConnectionServiceProvider(conn).sync()
        break
      }
    }
  }
}

ConnectionsCommand.description = `Create, Read, Update, Delete, Test and Sync connections

A connection is a form of integration which enhances and/or aids existing functionalities of Pochta. Connections are built for manipulating root setting or adding features which don't belong to Pochta's core functionalities.

Currently, only Redmine (version 4.0+) connection is supported. Adding this connection will sync contacts and user profile with your account.
`

module.exports = ConnectionsCommand
