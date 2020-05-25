const CrudInquirer = require('../../../crud-inquirer')
const inquirer = require('inquirer')
const validator = require('validator')
const chalk = require('chalk')

class SESInquirer extends CrudInquirer {
  constructor() {
    super('esp')
  }

  // setup
  async askSetupQuestions(esp) {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: esp && esp.label
      },
      {
        name: 'config.accessKeyId',
        type: 'input',
        message: 'Enter access key id:',
        validate: key => !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid access key id',
        default: esp && esp.config && esp.config.accessKeyId || null
      },
      {
        name: 'config.secretAccessKey',
        type: 'input',
        message: 'Enter secret access key:',
        validate: key => !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid secret access key',
        default: esp && esp.config && esp.config.secretAccessKey || null
      },
      {
        name: 'config.region',
        type: 'list',
        message: 'Select a region:',
        choices: [
          { name: 'US East (N. Virginia) [us-east-1]', value: 'us-east-1' },
          { name: 'US West (Oregon) [us-west-2]', value: 'us-west-2' },
          { name: 'Asia Pacific (Mumbai) [ap-south-1]', value: 'ap-south-1' },
          { name: 'Asia Pacific (Sydney) [ap-southeast-2]', value: 'ap-southeast-2' },
          { name: 'Canada (Central) [ca-central-1]', value: 'ca-central-1' },
          { name: 'Europe (Frankfurt) [eu-central-1]', value: 'eu-central-1' },
          { name: 'Europe (Ireland) [eu-west-1]', value: 'eu-west-1' },
          { name: 'Europe (London) [eu-west-2]', value: 'eu-west-2' },
          { name: 'South America (São Paulo) [sa-east-1]', value: 'sa-east-1' },
          { name: 'AWS GovCloud (US) [us-gov-west-1]', value: 'us-gov-west-1' },
        ],
        default: esp && esp.config && esp.config.region
      },
      {
        name: 'config.sender',
        type: 'input',
        message: 'Enter the email address:',
        validate: key => validator.isEmail(key) || 'Enter a valid email address',
        default: esp && esp.config && esp.config.sender || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = SESInquirer
