const CrudCommand = require('../lib/command/crud-command')
const ProfileController = require('../lib/controller/profiles/profile-controller')
const ProfileInquirer = require('../lib/controller/profiles/profile-inquirer')

class ProfilesCommand extends CrudCommand {
  async init() {
    this.controller = new ProfileController()
    this.inquirer = new ProfileInquirer()
  }
}

ProfilesCommand.description = `Create, Read, Update and Delete profiles

A profile is a contact which is displayed as an identification when sending out emails. This helps enable functionalities to auto include as cc or reply to.
`

module.exports = ProfilesCommand
