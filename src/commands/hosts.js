const ora = require('ora')

const CrudCommand = require('../lib/command/crud-command')
const HostController = require('../lib/controller/hosts/host-controller')
const ServiceController = require('../lib/controller/hosts/service-controller')
const HostInquirer = require('../lib/inquirer/hosts/host-inquirer')

class HostsCommand extends CrudCommand {
  async run() {
    this.controller = new HostController()
    this.inquirer = new HostInquirer()

    await super.run()
  }

  async performConnectionTest(host) {
    let service = new ServiceController(host)
    await ora.promise(service.test(), 'testing..')
  }
}

HostsCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = HostsCommand
