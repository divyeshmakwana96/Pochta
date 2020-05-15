const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const validator = require('validator')
const _ = require('lodash')

class MESInquirer extends CrudInquirer {
  constructor() {
    super('esp')
  }

  async askSetupQuestions(esp) {
    const questions = [
      {
        name: 'config.auth.user',
        type: 'input',
        message: 'Enter the username:',
        default: esp && esp.config && esp.config.auth && esp.config.auth.user
      },
      {
        name: 'config.auth.pass',
        type: 'password',
        message: 'Enter the password:',
        default: esp && esp.config && esp.config.auth && esp.config.auth.pass
      }
    ]

    let answers = await inquirer.prompt(questions)
    let alias = await inquirer.prompt([
      {
        name: 'config.sender',
        type: 'input',
        message: 'Enter email address:',
        default: (esp && esp.config && esp.config.sender) ||
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
