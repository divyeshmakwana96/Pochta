const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')
const validator = require('validator')
const _ = require('lodash')

class MESInquirer extends CrudInquirer {
  constructor() {
    super('esp')
  }

  async askSetupQuestions(esp) {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: esp && esp.label
      },
      {
        name: 'config.auth.user',
        type: 'input',
        message: 'Enter the username:',
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
    let alias = await inquirer.prompt([
      {
        name: 'config.email',
        type: 'input',
        message: 'Enter email address:',
        default: (esp && esp.config && esp.config.email) ||
          (validator.isEmail(answers.config.auth.user) ? answers.config.auth.user : null)
      }
    ])
    answers = _.merge(answers, alias)

    return _.merge(answers, {
      config: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        tls: {
          cipher: 'SSLv3'
        }
      }
    })
  }
}

module.exports = MESInquirer
