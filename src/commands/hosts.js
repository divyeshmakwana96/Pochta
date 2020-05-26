const CrudCommand = require('../lib/command/crud-command')
const HostController = require('../lib/controller/hosts/host-controller')
const HostServiceProvider = require('../lib/controller/hosts/host-service-provider')
const HostInquirer = require('../lib/controller/hosts/host-inquirer')

const OptionType = require('../lib/enums').OptionType

class HostsCommand extends CrudCommand {
  async init() {
    this.controller = new HostController()
    this.inquirer = new HostInquirer()
  }

  async handleOption(option, host) {
    switch (option) {
      case OptionType.Test: {
        let service = new HostServiceProvider(host)
        await service.test()
        break
      }
      default:
        super.handleOption(option, host)
    }
  }
}

HostsCommand.description = `Create, Read, Update, Delete and Test image hosting providers

Configure your CDN provider with Pochta using this command. APIs needs to be enabled on the dedicated platforms in order to work with Pochta.
`

module.exports = HostsCommand
