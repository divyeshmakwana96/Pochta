const inquirer = require('inquirer')
const Enums = require('../enums')
const chalk = require('chalk')

const _ = require('lodash')

const Inquirer = {

  askEspTypeSelection: () => {
    const question = [
      {
        name: 'type',
        type: 'list',
        message: 'Which email service provider you would like to add?',
        choices: _.map(Enums.EspType.enums, (enm) => {
          return {
            name: enm.key,
            value: enm
          }
        })
      }
    ]

    return inquirer.prompt(question)
  },

  askEspSelection: (profiles) => {
    const question = [
      {
        name: 'profile',
        type: 'list',
        message: 'Which esp would you like to view?',
        choices: profiles
      }
    ]
    return inquirer.prompt(question)
  },

  askEspConnectionTest: () => {
    const question = [
      {
        name: 'test',
        type: 'confirm',
        message: 'Would you like to test the connection?'
      }
    ]
    return inquirer.prompt(question)
  },

  askEspRemoveConfirmation: (title) => {
    const question = [
      {
        name: 'delete',
        type: 'confirm',
        message: `Are you sure you want to delete ${chalk.cyan(title)}?`
      }
    ]
    return inquirer.prompt(question)
  },

  askEspOptions: (title) => {
    const question = [
      {
        name: 'value',
        type: 'list',
        message: `What would you like to do with ${chalk.cyan(title)}?`,
        choices: ['view', 'edit', 'delete', 'test', new inquirer.Separator(), 'cancel']
      }
    ]
    return inquirer.prompt(question)
  },

  askEspSetupQuestions: (type, esp) => {
    if (type) {
      switch (type) {
        case Enums.EspType.SendGrid:
          return Inquirer.askSendGridSetupQuestions(esp)
        case Enums.EspType.MailJet:
          return Inquirer.askMailJetSetupQuestions(esp)
        case Enums.EspType.SMTP:
          return Inquirer.askSmtpSetupQuestions(esp)
      }
    }
  },

  // SendGrid
  askSendGridSetupQuestions: (esp) => {
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
  },

  // MailJet
  askMailJetSetupQuestions: (esp) => {
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
  },

  // SMTP
  askSmtpSetupQuestions: (esp) => {
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
        choices: _.map(Enums.OAuth2Type.enums, (enm) => { return enm.key }),
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.OAuth2.key
        },
        default: esp && esp.auth && esp.auth.oauth2type
      },
      {
        name: 'auth.user',
        type: 'input',
        message: 'Enter username:',
        default: esp && esp.auth && esp.auth.label
      },
      {
        name: 'auth.pass',
        type: 'input',
        message: 'Enter password:',
        default: esp && esp.auth && esp.auth.pass,
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.Login.key
        }
      },
      {
        name: 'auth.clientId',
        type: 'input',
        message: 'Enter client id:',
        default: esp && esp.auth && esp.auth.clientId,
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.OAuth2.key
            && answers.auth.oauth2type === Enums.OAuth2Type.a3L0.key
        }
      },
      {
        name: 'auth.clientSecret',
        type: 'input',
        message: 'Enter client secret:',
        default: esp && esp.auth && esp.auth.clientSecret,
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.OAuth2.key
            && answers.auth.oauth2type === Enums.OAuth2Type.a3L0.key
        }
      },
      {
        name: 'auth.refreshToken',
        type: 'input',
        message: 'Enter refresh token:',
        default: esp && esp.auth && esp.auth.refreshToken,
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.OAuth2.key
            && answers.auth.oauth2type === Enums.OAuth2Type.a3L0.key
        }
      },
      {
        name: 'auth.serviceClient',
        type: 'input',
        message: 'Enter client service client:',
        default: esp && esp.auth && esp.auth.serviceClient,
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.OAuth2.key
            && answers.auth.oauth2type === Enums.OAuth2Type.a2L0.key
        }
      },
      {
        name: 'auth.privateKey',
        type: 'input',
        message: 'Enter private key:',
        default: esp && esp.auth && esp.auth.privateKey,
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.OAuth2.key
            && answers.auth.oauth2type === Enums.OAuth2Type.a2L0.key
        }
      },
      {
        name: 'auth.accessToken',
        type: 'input',
        message: 'Enter access token:',
        default: esp && esp.auth && esp.auth.accessToken,
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.OAuth2.key
        }
      },
      {
        name: 'auth.expires',
        type: 'number',
        message: 'Enter token expiry timestamp:',
        default: esp && esp.auth && esp.auth.accessToken,
        when: (answers) => {
          return answers.auth.type === Enums.AuthType.OAuth2.key
            && answers.auth.oauth2type !== Enums.OAuth2Type.AccessToken.key
        }
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = Inquirer
