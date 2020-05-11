const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const chalk = require('chalk')
const _ = require('lodash')

const Enums = require('../../../../enums')
const AuthType = Enums.AuthType
const OAuth2Type = Enums.OAuth2Type

class SMTPInquirer extends CrudInquirer {
  constructor() {
    super('esp')
  }

  askSetupQuestions(esp) {
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

module.exports = SMTPInquirer
