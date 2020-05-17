const CrudCommand = require('../lib/command/crud-command')
const ConnectionController = require('../lib/controller/connections/connection-controller')
const ConnectionServiceProvider = require('../lib/controller/connections/connection-service-provider')
const ConnectionInquirer = require('../lib/controller/connections/connection-inquirer')

const OptionType = require('../lib/enums').OptionType

class ConnectionsCommand extends CrudCommand {
  async run() {
    this.controller = new ConnectionController()
    this.inquirer = new ConnectionInquirer()

    await super.run()
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

ConnectionsCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = ConnectionsCommand
