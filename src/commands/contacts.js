const {Command, flags} = require('@oclif/command')

class ContactsCommand extends Command {
  async run() {
    const {flags} = this.parse(ContactsCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/admin/Developer/JS/pochta/src/commands/contacts.js`)
  }
}

ContactsCommand.description = `Describe the command here
...
Extra documentation goes here
`

ContactsCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ContactsCommand
