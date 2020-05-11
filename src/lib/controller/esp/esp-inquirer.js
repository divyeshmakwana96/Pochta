const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const _ = require('lodash')

const Enums = require('../../enums')
const EspType = Enums.EspType
const OptionType = Enums.OptionType

const MailJetInquirer = require('./services/mailjet/mailjet-inquirer')
const SendGridInquirer = require('./services/sendgrid/sendgrid-inquirer')
const SMTPInquirer = require('./services/smtp/smtp-inquirer')

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

    let controller
    if (type) {
      switch (type) {
        case EspType.SendGrid:
          controller = new SendGridInquirer()
          break
        case EspType.MailJet:
          controller = new MailJetInquirer()
          break
        case EspType.SMTP:
          controller = new SMTPInquirer()
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

module.exports = EspInquirer
