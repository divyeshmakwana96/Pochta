const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const validator = require('validator')
const _ = require('lodash')

class SMTPInquirer extends CrudInquirer {
  constructor() {
    super('esp')
  }

  askSetupQuestions(esp, askSender = false, askHost = true, defaults) {
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
      },
      {
        name: 'config.sender',
        type: 'input',
        message: 'Enter email address:',
        when: askSender,
        default: (answers) => {
          return (esp && esp.config && esp.config.sender) ||
          (validator.isEmail(answers.config.auth.user) ? answers.config.auth.user : null)
        }
      },
      {
        name: 'config.host',
        type: 'input',
        message: 'Enter the host name:',
        when: askHost,
        default: esp && esp.config && esp.config.host || defaults.host
      },
      {
        name: 'config.port',
        type: 'input',
        message: 'Enter the port number:',
        default: esp && esp.config && esp.config.port || defaults.port
      },
      {
        name: 'config.secure',
        type: 'confirm',
        message: 'Use tls?',
        default: esp && esp.secure && esp.config.secure || defaults.secure
      }
    ]

    return inquirer.prompt(questions)
  }
}

module.exports = SMTPInquirer
