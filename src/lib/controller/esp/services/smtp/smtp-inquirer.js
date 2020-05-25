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
        validate: key => {
          return !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid username'
        },
        default: esp && esp.config && esp.config.auth && esp.config.auth.user || defaults.auth.user
      },
      {
        name: 'config.auth.pass',
        type: 'password',
        message: 'Enter the password:',
        validate: key => {
          return !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid password'
        },
        default: esp && esp.config && esp.config.auth && esp.config.auth.pass || defaults.auth.pass
      },
      {
        name: 'config.sender',
        type: 'input',
        message: 'Enter email address:',
        validate: key => {
          return validator.isEmail(key) || 'Enter a valid email address'
        },
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
        validate: url => {
          return validator.isURL(url) || 'Enter a valid host name'
        },
        when: askHost,
        default: esp && esp.config && esp.config.host || defaults.host
      },
      {
        name: 'config.port',
        type: 'input',
        message: 'Enter the port number:',
        validate: port => {
          return validator.isNumeric(port) || 'Enter a valid port number'
        },
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
