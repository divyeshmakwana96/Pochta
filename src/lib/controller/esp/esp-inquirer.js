const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const _ = require('lodash')

const Enums = require('../../enums')
const ESPType = Enums.ESPType
const OptionType = Enums.OptionType

const GmailInquirer = require('./services/gmail/gmail-inquirer')
const MailJetInquirer = require('./services/mailjet/mailjet-inquirer')
const MESInquirer = require('./services/mes/mes-inquirer')
const SendGridInquirer = require('./services/sendgrid/sendgrid-inquirer')
const SESInquirer = require('./services/ses/ses-inquirer')

class ESPInquirer extends CrudInquirer {
  constructor() {
    super('esp', [OptionType.View, OptionType.Edit, OptionType.Delete, OptionType.Test])
  }

  // selection type
  askESPTypeSelection() {
    let mapped = _.map(ESPType.enums, (enm) => {
      return {
        name: Enums.describe(enm),
        value: enm
      }
    })

    const question = [
      {
        name: 'type',
        type: 'list',
        message: 'Which email service provider you would like to add?',
        choices: _.sortBy(mapped, 'name')
      }
    ]
    return inquirer.prompt(question)
  }

  // setup
  async askSetupQuestions(esp) {

    let type = esp && esp.type && ESPType.get(esp.type)
    if (!type) {
      let choice = await this.askESPTypeSelection()
      type = choice.type
      esp = {type: type.key.toLowerCase()}
    }

    let controller
    if (type) {
      switch (type) {
        case ESPType.Gmail:
          controller = new GmailInquirer()
          break
        case ESPType.MailJet:
          controller = new MailJetInquirer()
          break
        case ESPType.MES:
          controller = new MESInquirer()
          break
        case ESPType.SendGrid:
          controller = new SendGridInquirer()
          break
        case ESPType.SES:
          controller = new SESInquirer()
          break
      }
    }

    if (controller) {
      let answers = await controller.askSetupQuestions(esp)
      answers.type = esp.type
      return answers
    }
  }
}

module.exports = ESPInquirer
