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
        console.log(chalk.gray('No hosts found'))

      } else {

        // ask for profile selection
        let choice = await inquirer.askHostSelection(list)
        let option = await inquirer.askHostOptions(choice.profile.title)

        switch (option.value) {
          case 'view':
            console.log(choice.profile.host)
            break
          case 'edit':
            let type = HostType.get(choice.profile.host.type)
            let host = await inquirer.askHostSetupQuestions(type, choice.profile.host)

            // add back default keys
            host = Object.assign({
              id: choice.profile.host.id,
              type: choice.profile.host.type
            }, host)

            controller.update(host)
            ora('updating..').start().succeed('updated')
            break
          case 'test':
            await ora.promise(controller.test(choice.profile.host), 'testing..')
            break
          case 'delete':
            const confirmation = await inquirer.askHostRemoveConfirmation(choice.profile.title)
            if (confirmation.delete) {
              controller.delete(choice.profile.host)
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
      let choice = await inquirer.askHostTypeSelection()
      let host = await inquirer.askHostSetupQuestions(choice.type)

      if (host) {
        host = Object.assign({
          id: uniqueString(),
          type: choice.type.key
        }, host)

        ora('saving..').start().succeed('host added')
        controller.add(host)

        // prompt for testing connection
        const confirmation = await inquirer.askHostConnectionTest()
        if (confirmation.test) {
          await ora.promise(controller.test(host), 'testing..')

        }
      } else {
        throw new Error(`Unknown host type: ${ choice.type.key }`)
      }
    }
  }
}

HostsCommand.args = [
  { name: 'action' }
]

HostsCommand.description = `Describe the command here
...
Extra documentation goes here
`


module.exports = HostsCommand
