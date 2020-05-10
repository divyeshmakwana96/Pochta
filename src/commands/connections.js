const ora = require('ora')

const CrudCommand = require('../lib/command/crud-command')
const ConnectionController = require('../lib/controller/connections/connection-controller')
const ServiceController = require('../lib/controller/connections/service-controller')
const ConnectionInquirer = require('../lib/inquirer/connections/connection-inquirer')

class ConnectionsCommand extends CrudCommand {
  async run() {
    this.controller = new ConnectionController()
    this.inquirer = new ConnectionInquirer()

    await super.run()
  }

  async performConnectionTest(conn) {
    let service = new ServiceController(conn)
    await ora.promise(service.test(), 'testing..')
  }

  async performConnectionSync(conn) {
    let service = new ServiceController(conn)
    try {
      await service.sync()
    } catch (e) {
      console.log(e)
    }

    // await ora.promise(service.sync(), 'testing..')
  }
}

ConnectionsCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = ConnectionsCommand
