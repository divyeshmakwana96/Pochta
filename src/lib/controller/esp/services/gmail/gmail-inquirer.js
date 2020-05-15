const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')
const _ = require('lodash')

class GmailInquirer extends CrudInquirer {
  constructor() {
    super('esp')
  }

  async askSetupQuestions(esp) {
    const questions = [
      {
        name: 'config.auth.user',
        type: 'input',
        message: 'Enter the email address:',
        default: esp && esp.config && esp.config.auth && esp.config.auth.user
      },
      {
        name: 'config.auth.pass',
        type: 'input',
        message: 'Enter the password:',
        default: esp && esp.config && esp.config.auth && esp.config.auth.pass
      }
    ]

    let answers = await inquirer.prompt(questions)
    return _.merge(answers, {
      config: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
      }
    })
  }
}

module.exports = GmailInquirer
