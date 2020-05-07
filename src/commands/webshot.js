const {Command, flags} = require('@oclif/command')
const puppeteer = require('puppeteer-core')

class WebshotCommand extends Command {
  async run() {
    const {flags} = this.parse(WebshotCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/admin/Developer/JS/pochta/src/commands/webshot.js`)

    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    })
    const page = await browser.newPage()
    await page.goto('file:///Users/admin/Developer/Emails/005895-virtual-seminar-rep-to-hcp-email/005895-virtual-seminar-rep-to-hcp-email.html', {
      waitUntil: 'networkidle2', headless: true
    })
    await page.screenshot({path: 'hn.png', fullPage: true})
    await browser.close()
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
