const {Command} = require('@oclif/command')

const clear = require('clear')
const chalk = require('chalk')
const ora = require('ora')

const uniqueString = require('unique-string')
const _ = require('lodash')

const controller = require('../lib/controller/profiles/profile-controller')
const inquirer = require('../lib/inquirer/contacts')

class ProfilesCommand extends Command {
  async run() {
    // clear all
    clear()

    const {args} = this.parse(ProfilesCommand)
    const action = args.action || 'list'

    if (action === 'list') {
      let list = controller.getMapped()
      if (_.isEmpty(list)) {
        // list is empty
        console.log(chalk.gray('No profiles found'))

      } else {

        // ask for profile selection
        let choice = await inquirer.askContactSelection(list)
        let option = await inquirer.askContactOptions(choice.profile.title)

        switch (option.value) {
          case 'view':
            console.log(choice.profile.sender)
            break
          case 'edit':
            let profile = await inquirer.askContactSetupQuestions(choice.profile.sender)

            // add back default keys
            profile = Object.assign({
              id: choice.profile.sender.id
            }, profile)

            controller.update(profile)
            ora('updating..').start().succeed('updated')
            break
          case 'delete':
            const confirmation = await inquirer.askContactRemoveConfirmation(choice.profile.title)
            if (confirmation.delete) {
              controller.delete(choice.profile.sender)
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
      let sender = await inquirer.askContactSetupQuestions()

      if (sender) {
        sender = Object.assign({
          id: uniqueString()
        }, sender)
        controller.add(sender)

        ora('saving..').start().succeed('profile added')
      }
    }
  }
}

ProfilesCommand.args = [
  { name: 'action' }
]

ProfilesCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = ProfilesCommand
