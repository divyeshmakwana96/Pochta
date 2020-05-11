const CrudCommand = require('../lib/command/crud-command')
const ProfileController = require('../lib/controller/profiles/profile-controller')
const ProfileInquirer = require('../lib/controller/profiles/profile-inquirer')

class ProfilesCommand extends CrudCommand {
  async run() {
    this.controller = new ProfileController()
    this.inquirer = new ProfileInquirer()

    await super.run()
  }
}

ProfilesCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = ProfilesCommand
