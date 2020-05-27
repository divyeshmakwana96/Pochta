const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const validator = require('validator')
const _ = require('lodash')

class SMTPInquirer extends CrudInquirer {
  constructor(options) {
    super('esp')

    this._options = {
      promptAlias: false,
      promptHost: true,
      usernameAsEmail: true
    }

    if (options) {
      if (typeof (options.promptAlias) !== 'undefined') {
        this._options.promptAlias = options.promptAlias
      }

      if (typeof (options.promptHost) !== 'undefined') {
        this._options.promptHost = options.promptHost
      }

      if (typeof (options.usernameAsEmail) !== 'undefined') {
        this._options.usernameAsEmail = options.usernameAsEmail
      }
    }
  }

  askSetupQuestions(esp, defaults) {
    const questions = [
      {
        name: 'config.auth.user',
        type: 'input',
        message: `Enter the ${this._options.usernameAsEmail ? 'email address': 'username'}:`,
        validate: username => {
          if (this._options.usernameAsEmail) {
            return validator.isEmail(username) || 'Enter a valid email address'
          } else {
            return !validator.isEmpty(username, { ignore_whitespace: true }) || 'Enter a valid username'
          }
        },
        default: (esp && esp.config && esp.config.auth && esp.config.auth.user) || (defaults && defaults.auth && defaults.auth.user) || null
      },
      {
        name: 'config.auth.pass',
        type: 'password',
        message: 'Enter the password:',
        validate: password => !validator.isEmpty(password, { ignore_whitespace: true }) || 'Enter a valid password',
        default: (esp && esp.config && esp.config.auth && esp.config.auth.pass) || (defaults && defaults.auth && defaults.auth.pass) || null
      },
      {
        name: 'config.sender',
        type: 'input',
        message: 'Enter the email address:',
        validate: sender => validator.isEmail(sender) || 'Enter a valid email address',
        when: this._options.promptAlias,
        default: answers => {
          return (esp && esp.config && esp.config.sender) ||
          (validator.isEmail(answers.config.auth.user) ? answers.config.auth.user : null) || null
        }
      },
      {
        name: 'config.host',
        type: 'input',
        message: 'Enter the host name:',
        validate: host => validator.isURL(host) || 'Enter a valid host name',
        when: this._options.promptHost,
        default: esp && esp.config && esp.config.host || defaults.host || null
      },
      {
        name: 'config.port',
        type: 'input',
        message: 'Enter the port number:',
        validate: port => validator.isNumeric(port) || 'Enter a valid port number',
        default: () => {
          let port = esp && esp.config && esp.config.port || defaults.port
          return port && port.toString()
        }
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
