const CrudCommand = require('../lib/command/crud-command')
const ESPController = require('../lib/controller/esp/esp-controller')
const ESPServiceProvider = require('../lib/controller/esp/esp-service-provider')
const ESPInquirer = require('../lib/controller/esp/esp-inquirer')

const OptionType = require('../lib/enums').OptionType

class ESPCommand extends CrudCommand {
  async init() {
    this.controller = new ESPController()
    this.inquirer = new ESPInquirer()
  }

  async handleOption(option, esp) {
    switch (option) {
      case OptionType.Test: {
        let service = new ESPServiceProvider(esp)
        await service.test()
        break
      }
      default:
        super.handleOption(option, esp)
    }
  }
}

ESPCommand.description = `Create, Read, Update, Delete and Test ESP

ESP or Email Service Providers are required to send out test emails. There are two types of ESP currently supported by Pochta:
1) SMTP
2) API based

Configurations need to be setup on their dedicated platforms in order to work with Pochta.
`

module.exports = ESPCommand
