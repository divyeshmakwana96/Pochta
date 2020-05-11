const CrudCommand = require('../lib/command/crud-command')
const EspController = require('../lib/controller/esp/esp-controller')
const EspServiceProvider = require('../lib/controller/esp/esp-service-provider')
const EspInquirer = require('../lib/controller/esp/esp-inquirer')

const OptionType = require('../lib/enums').OptionType

class EspCommand extends CrudCommand {
  async run() {
    this.controller = new EspController()
    this.inquirer = new EspInquirer()

    await super.run()
  }

  async handleOption(option, esp) {
    switch (option) {
      case OptionType.Test: {
        let service = new EspServiceProvider(esp)
        await service.test()
        break
      }
      default:
        super.handleOption(option, esp)
    }
  }
}

EspCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = EspCommand
