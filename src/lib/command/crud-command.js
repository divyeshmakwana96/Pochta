const {Command} = require('@oclif/command')

const clear = require('clear')
const chalk = require('chalk')
const ora = require('ora')
const _ = require('lodash')

const OptionType = require('../../lib/enums').OptionType

class CrudCommand extends Command {
  async run() {
    // clear all
    clear()

    const {args} = this.parse(CrudCommand)
    const action = args.action || 'list'

    if (action === 'list') {
      let list = this.controller.getMapped()

      // check list is empty
      if (_.isEmpty(list)) { console.log(chalk.red(`No ${this.inquirer && this.inquirer.entityName || 'object'}s found`)); return }

      // ask for profile selection
      let choice = await this.inquirer.askSelection(list)
      let selection = await this.inquirer.askOptions(choice.profile.title)

      switch (selection.option) {
        case OptionType.View:
          console.log(choice.profile.object)
          break

        case OptionType.Edit:
          let profile = await this.inquirer.askSetupQuestions(choice.profile.object)
          profile.id = choice.profile.object.id
          this.controller.put(profile)
          ora('updating..').start().succeed('updated')
          break

        case OptionType.Delete:
          const shouldDelete = await this.inquirer.askDeleteConfirm(choice.profile.title)
          if (shouldDelete.confirm) {
            this.controller.delete(choice.profile.object)
            ora('deleting..').start().succeed('deleted')
          }
          break

        case OptionType.Cancel: break
        default:
          await this.handleOption(selection.option, choice.profile.object)
          break
      }

    /* Add new profile here */
    } else if (action === 'new') {

      // ask which host
      let profile = await this.inquirer.askSetupQuestions()
      if (profile) {
        this.controller.add(profile)
        ora('saving..').start().succeed(`${this.inquirer && this.inquirer.entityName || 'object'} added`)

        if (_.find(this.inquirer.objectOptions, OptionType.Test)) {
          let test = await this.inquirer.askConnectionTestConfirm()
          if (test.confirm) {
            await this.handleOption(OptionType.Test, profile)
          }
        }
      }
    } else {
      this.handleAction(action)
    }
  }

  handleOption(option, object) {
    throw new Error(`Invalid option '${option}'. Run help command to see available options`)
  }

  handleAction(action) {
    throw new Error(`Invalid argument '${action}'. Run help command to see available options`)
  }
}

CrudCommand.args = [
  {
    name: 'action',
    required: true,
    description: 'Action for the command',
    default: 'list',
    options: ['list', 'new'],
  }
]

module.exports = CrudCommand
