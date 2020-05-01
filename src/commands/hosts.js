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
        console.log(chalk.gray('List empty'))
      } else {
        let choices = _.map(list, (host) => { return host.title })
        let profile = await inquirer.askHostProfileSelection(choices)
        let host = _.find(list, (choice) => { return choice.title === profile.host }).host

        let res = await controller.test(host)
        console.log(res)
      }

    /*
      Add new connection here
     */
    } else if (action === 'new') {

      // ask which host
      let type = await inquirer.askHostTypeSelection()

      let host
      if (type) {
        switch (type) {
          case HostType.S3:
            host = await inquirer.askS3SetupQuestions()
            break
          case HostType.Cloudinary:
            host = await inquirer.askCloudinarySetupQuestions()
            break
          case HostType.ImageKit:
            host = await inquirer.askImageKitSetupQuestions()
            break
        }
      }

      if (host) {
        host = Object.assign({
          id: uniqueString(),
          type: type.key
        }, host)

        // prompt for testing connection
        const confirmation = await inquirer.askConnectionTest()
        if (confirmation.test) {
          const spinner = ora('testing...').start()
          try {
            await controller.test(host)
            spinner.succeed('Connection successful!!')
            controller.add(host)
          } catch (e) {
            console.log(e)
            spinner.fail('Connection failed!! Reason: ' + e)
          }
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
