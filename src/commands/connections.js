const CrudCommand = require('../lib/command/crud-command')
const ConnectionController = require('../lib/controller/connections/connection-controller')
const ServiceController = require('../lib/controller/connections/service-controller')
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
        let service = new ServiceController(conn)
        await service.test()
        break
      }
      case OptionType.Sync: {
        let service = new ServiceController(conn)
        await service.sync()
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
