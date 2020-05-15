const CrudCommand = require('../lib/command/crud-command')
const ESPController = require('../lib/controller/esp/esp-controller')
const ESPServiceProvider = require('../lib/controller/esp/esp-service-provider')
const ESPInquirer = require('../lib/controller/esp/esp-inquirer')

const OptionType = require('../lib/enums').OptionType

class ESPCommand extends CrudCommand {
  async run() {
    this.controller = new ESPController()
    this.inquirer = new ESPInquirer()

    await super.run()
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

ESPCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = ESPCommand
