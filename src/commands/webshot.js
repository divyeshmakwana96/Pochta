const {Command, flags} = require('@oclif/command')
const webshot = require('webshot-node')
const fs = require('fs')

class WebshotCommand extends Command {
  async run() {
    const {flags} = this.parse(WebshotCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/admin/Developer/JS/pochta/src/commands/webshot.js`)

    webshot('<html><body>Hello World</body></html>', 'hello_world.png', {siteType:'html'}, function(err) {
      // screenshot now saved to hello_world.png
    })
  }
}

WebshotCommand.description = `Describe the command here
...
Extra documentation goes here
`

WebshotCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = WebshotCommand
