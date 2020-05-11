const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')
const _ = require('lodash')

const Enums = require('../../enums')
const EspType = Enums.EspType
const OptionType = Enums.OptionType
const AuthType = Enums.AuthType
const OAuth2Type = Enums.OAuth2Type

class EspInquirer extends CrudInquirer {
  constructor() {
    super('esp', [OptionType.View, OptionType.Edit, OptionType.Delete, OptionType.Test])
  }

  // selection type
  askEspTypeSelection() {
    const question = [
      {
        name: 'type',
        type: 'list',
        message: 'Which email service provider you would like to add?',
        choices: _.map(EspType.enums, (enm) => {
          return {
            name: enm.key,
            value: enm
          }
        })
      }
    ]

    return inquirer.prompt(question)
  }

  // setup
  async askSetupQuestions(esp) {

    let type = esp && esp.type && EspType.get(esp.type)
    if (!type) {
      let choice = await this.askEspTypeSelection()
      type = choice.type
      esp = {type: type.key}
    }

    let promise
    if (type) {
      switch (type) {
        case EspType.SendGrid:
          promise = this.askSendGridSetupQuestions(esp)
          break
        case EspType.MailJet:
          promise = this.askMailJetSetupQuestions(esp)
          break
        case EspType.SMTP:
          promise = this.askSmtpSetupQuestions(esp)
          break
      }
    }

    // get answers
    let answers = await promise
    answers.type = esp.type
    return answers
  }

  // SendGrid
  askSendGridSetupQuestions(esp) {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: esp && esp.label
      },
      {
        name: 'sender',
        type: 'input',
        message: 'Enter the sender email address:',
        default: esp && esp.sender
      },
      {
        name: 'apiKey',
        type: 'input',
        message: 'Enter the api key:',
        default: esp && esp.apiKey
      }
    ]
    return inquirer.prompt(questions)
  }

  // MailJet
  askMailJetSetupQuestions(esp) {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: esp && esp.label
      },
      {
        name: 'sender',
        type: 'input',
        message: 'Enter the sender email address:',
        default: esp && esp.sender
      },
      {
        name: 'apiKey',
        type: 'input',
        message: 'Enter the api key:',
        default: esp && esp.apiKey
      },
      {
        name: 'apiSecret',
        type: 'input',
        message: 'Enter the api secret:',
        default: esp && esp.apiSecret
      }
    ]
    return inquirer.prompt(questions)
  }

  // SMTP
  askSmtpSetupQuestions(esp) {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: esp && esp.label
      },
      {
        name: 'host',
        type: 'input',
        message: 'Enter the host name:',
        default: esp && esp.host
      },
      {
        name: 'port',
        type: 'number',
        message: 'Enter the port number:',
        default: esp && esp.port || 465
      },
      {
        name: 'secure',
        type: 'confirm',
        message: 'Allow secure connection?',
        default: esp && esp.secure || true
      },
      {
        name: 'tls.rejectUnauthorized',
        type: 'confirm',
        message: 'Reject signing unauthorized certificates?',
        default: esp && esp.tls && esp.tls.rejectUnauthorized || true
      },
      {
        name: 'auth.type',
        type: 'list',
        message: 'Select authentication method:',
        choices: _.map(Enums.AuthType.enums, (enm) => {
          return enm.key
        }),
        default: esp && esp.auth && esp.auth.type
      },
      {
        name: 'auth.oauth2type',
        type: 'list',
        message: 'Select OAuth2 method:',
        choices: _.map(OAuth2Type.enums, (enm) => {
          return enm.key
        }),
        when: (answers) => {
          return answers.auth.type === AuthType.OAuth2.key
        },
        default: esp && esp.auth && esp.auth.oauth2type
      },
      {
        name: 'auth.user',
        type: 'input',
        message: 'Enter username:',
        default: esp && esp.auth && esp.auth.user
      },
      {
        name: 'auth.pass',
        type: 'input',
        message: 'Enter password:',
        default: esp && esp.auth && esp.auth.pass,
        when: (answers) => {
          return answers.auth.type === AuthType.Login.key
        }
      },
      {
        name: 'auth.clientId',
        type: 'input',
        message: 'Enter client id:',
        default: esp && esp.auth && esp.auth.clientId,
        when: (answers) => {
          return answers.auth.type === AuthType.OAuth2.key
            && answers.auth.oauth2type === OAuth2Type.a3L0.key
        }
      },
      {
        name: 'auth.clientSecret',
        type: 'input',
        message: 'Enter client secret:',
        default: esp && esp.auth && esp.auth.clientSecret,
        when: (answers) => {
          return answers.auth.type === AuthType.OAuth2.key
            && answers.auth.oauth2type === OAuth2Type.a3L0.key
        }
      },
      {
        name: 'auth.refreshToken',
        type: 'input',
        message: 'Enter refresh token:',
        default: esp && esp.auth && esp.auth.refreshToken,
        when: (answers) => {
          return answers.auth.type === AuthType.OAuth2.key
            && answers.auth.oauth2type === OAuth2Type.a3L0.key
        }
      },
      {
        name: 'auth.serviceClient',
        type: 'input',
        message: 'Enter client service client:',
        default: esp && esp.auth && esp.auth.serviceClient,
        when: (answers) => {
          return answers.auth.type === AuthType.OAuth2.key
            && answers.auth.oauth2type === OAuth2Type.a2L0.key
        }
      },
      {
        name: 'auth.privateKey',
        type: 'input',
        message: 'Enter private key:',
        default: esp && esp.auth && esp.auth.privateKey,
        when: (answers) => {
          return answers.auth.type === AuthType.OAuth2.key
            && answers.auth.oauth2type === OAuth2Type.a2L0.key
        }
      },
      {
        name: 'auth.accessToken',
        type: 'input',
        message: 'Enter access token:',
        default: esp && esp.auth && esp.auth.accessToken,
        when: (answers) => {
          return answers.auth.type === AuthType.OAuth2.key
        }
      },
      {
        name: 'auth.expires',
        type: 'number',
        message: 'Enter token expiry timestamp:',
        default: esp && esp.auth && esp.auth.accessToken,
        when: (answers) => {
          return answers.auth.type === AuthType.OAuth2.key
            && answers.auth.oauth2type !== OAuth2Type.AccessToken.key
        }
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = EspInquirer
