const {Command} = require('@oclif/command')

const clear = require('clear')
const chalk = require('chalk')
const ora = require('ora')

const uniqueString = require('unique-string')
const _ = require('lodash')

const controller = require('../lib/controller/hosts/host-controller')
const inquirer = require('../lib/inquirer/hosts')
const HostType = require('../lib/enums').HostType

class HostsCommand extends Command {
  async run() {
    // clear all
    clear()

    const {args} = this.parse(HostsCommand)
    const action = args.action || 'list'

    if (action === 'list') {
      let list = controller.getMapped()
      if (_.isEmpty(list)) {
        // list is empty
        console.log(chalk.gray('List empty'))
      } else {

        // ask for profile selection
        let choice = await inquirer.askHostProfileSelection(list)
        let option = await inquirer.aksHostProfileOptions(choice.profile.title)

        switch (option.value) {
          case 'view':
            console.log(choice.profile.host)
            break
          case 'edit':
            let type = HostType.get(choice.profile.host.type)
            let host = await inquirer.askSetupQuestions(type, choice.profile.host)

            // add back default keys
            host = Object.assign({
              id: choice.profile.host.id,
              type: choice.profile.host.type
            }, host)

            controller.update(host)
            ora('saving..').start().succeed('Updated successfully!!')
            break
          case 'test':
            await controller.test(choice.profile.host)
            break
          case 'delete':
            const confirmation = await inquirer.askRemoveConfirmation(choice.profile.title)
            if (confirmation.delete) {
              controller.delete(choice.profile.host)
              ora('deleting..').start().succeed('Deleted successfully!!')
            }
            break
        }
      }

    /*
      Add new connection here
     */
    } else if (action === 'new') {

      // ask which host
      let type = await inquirer.askHostTypeSelection()
      let host = await inquirer.askSetupQuestions(type)

      if (host) {
        host = Object.assign({
          id: uniqueString(),
          type: type.key
        }, host)

        // prompt for testing connection
        const confirmation = await inquirer.askConnectionTest()
        if (confirmation.test) {
          try {
            await controller.test(host)
            controller.add(host)
            ora('saving..').start().succeed('Added successfully!!')
          } catch (e) { }
        }
      } else {
        throw new Error(`Unknown host type: ${ answers.type }`)
      }
    }
  }
}

HostsCommand.description = `Describe the command here
...
Extra documentation goes here
`
HostsCommand.args = [
  { name: 'action' }
]

module.exports = HostsCommand
