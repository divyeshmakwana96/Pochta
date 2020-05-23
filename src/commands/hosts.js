const CrudCommand = require('../lib/command/crud-command')
const HostController = require('../lib/controller/hosts/host-controller')
const HostServiceProvider = require('../lib/controller/hosts/host-service-provider')
const HostInquirer = require('../lib/controller/hosts/host-inquirer')

const OptionType = require('../lib/enums').OptionType

class HostsCommand extends CrudCommand {
  async run() {
    this.controller = new HostController()
    this.inquirer = new HostInquirer()

    await super.run()
  }

  async handleOption(option, host) {
    switch (option) {
      case OptionType.Test: {
        let service = new HostServiceProvider(host)
        let res = await service.test()
        console.log(res)
        break
      }
      default:
        super.handleOption(option, host)
    }
  }
}

HostsCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = HostsCommand
