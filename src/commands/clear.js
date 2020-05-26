const {Command} = require('@oclif/command')

const clear = require('clear')
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')
const fs = require('fs')

class ClearCommand extends Command {
  async run() {
    // clear all
    clear()

    const {args} = this.parse(ClearCommand)
    const entity = args.entity

    if (entity === 'cache') {

      let confirm = (await new inquirer.prompt([
        {
          name: 'confirm',
          type: 'confirm',
          message: 'Are you sure you want to clear cache?',
          default: true
        }
      ])).confirm

      if (confirm && fs.existsSync('.pochta')) {
        let spinner = ora('clearing...')
        fs.unlinkSync('.pochta')
        spinner.succeed('cache cleared!!!')
      } else {
        console.log(chalk.gray('cache empty already!!'))
      }

    } else if (entity) {
      console.log(chalk.red(`Unknown argument ${chalk.bold(entity)}`))
    } else {
      console.log(chalk.red(`Must provide an argument. Possible value ${chalk.bold('cache')}.`))
    }
  }
}

ClearCommand.description = `Clears cached settings
This command will delete all the settings stored in a local directory or globally.

If argument ${chalk.bold('cache')} is given, it will remove previous user selections and cdn upload cache stored for the current directory.
`

ClearCommand.args = [
  {
    name: 'entity',
    required: true,
    description: 'Entity you would like to clear',
    default: 'cache',
    options: ['cache'],
  }
]

module.exports = ClearCommand
