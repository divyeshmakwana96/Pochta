const {Command} = require('@oclif/command')

const clear = require('clear')
const chalk = require('chalk')
const ora = require('ora')

const uniqueString = require('unique-string')
const _ = require('lodash')

const EspController = require('../lib/controller/esp/esp-controller')
const inquirer = require('../lib/inquirer/esp')

const ProfileController = require('../lib/controller/profiles/profile-controller')
const profileInquirer = require('../lib/inquirer/contacts')
const EspType = require('../lib/enums').EspType

class EspCommand extends Command {
  async run() {
    // clear all
    clear()

    const {args} = this.parse(EspCommand)
    const action = args.action || 'list'

    const controller = new EspController()

    if (action === 'list') {
      let list = controller.getMapped()
      if (_.isEmpty(list)) {
        // list is empty
        console.log(chalk.gray('No esp found'))

      } else {

        // ask for profile selection
        let choice = await inquirer.askEspSelection(list)
        let option = await inquirer.askEspOptions(choice.profile.title)

        switch (option.value) {
          case 'view':
            console.log(choice.profile.object)
            break
          case 'edit':
            let type = EspType.get(choice.profile.object.type)
            let host = await inquirer.askEspSetupQuestions(type, choice.profile.object)
            host.id = choice.profile.object.id
            controller.update(host)
            ora('updating..').start().succeed('updated')
            break
          case 'test':
            let profiles = profileController.getMapped()
            if (_.isEmpty(profiles)) { // list is empty
              console.log(chalk.gray('No profiles found'))
            } else {

              let selection = await profileInquirer.askContactSelection(profiles)
              // Test
              try {
                let response = await controller.test(choice.profile.esp, selection.profile.sender)
                console.log(response)
              } catch (e) {
                console.log(e)
              }
            }
            break
          case 'delete':
            const confirmation = await inquirer.askEspRemoveConfirmation(choice.profile.title)
            if (confirmation.delete) {
              controller.delete(choice.profile.object)
              ora('deleting..').start().succeed('deleted')
            }
            break
        }
      }

      /*
        Add new connection here
       */
    } else if (action === 'new') {

      // ask which host
      let choice = await inquirer.askEspTypeSelection()
      let esp = await inquirer.askEspSetupQuestions(choice.type)

      if (esp) {
        esp.type = choice.type.key
        controller.add(esp)
        ora('saving..').start().succeed('host added')

        // prompt for testing connection
        // const confirmation = await inquirer.askEspConnectionTest()
        // if (confirmation.test) {
        //   await ora.promise(controller.test(esp), 'testing..')
        // }
      } else {
        throw new Error(`Unknown esp type: ${ choice.type.key }`)
      }
    }
  }
}

EspCommand.args = [
  { name: 'action' }
]

EspCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = EspCommand
