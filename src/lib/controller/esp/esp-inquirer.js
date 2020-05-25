const CrudInquirer = require('../crud-inquirer')
const inquirer = require('inquirer')
const _ = require('lodash')

const Enums = require('../../enums')
const ESPType = Enums.ESPType
const OptionType = Enums.OptionType

const GmailInquirer = require('./services/gmail/gmail-inquirer')
const MailJetInquirer = require('./services/mailjet/mailjet-inquirer')
const MailJetSMTPInquirer = require('./services/mailjet/mailjet-smtp-inquirer')
const MESInquirer = require('./services/mes/mes-inquirer')
const SendGridInquirer = require('./services/sendgrid/sendgrid-inquirer')
const SendGridSMTPInquirer = require('./services/sendgrid/sendgrid-smtp-inquirer')
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
        case ESPType.MailJet_SMTP:
          controller = new MailJetSMTPInquirer()
          break
        case ESPType.MES:
          controller = new MESInquirer()
          break
        case ESPType.SendGrid:
          controller = new SendGridInquirer()
          break
        case ESPType.SendGrid_SMTP:
          controller = new SendGridSMTPInquirer()
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

  // Auto CC
  askMailComposeQuestions(autoCc = true, autoReplyTo = true) {
    const questions = [
      {
        name: 'autoCC',
        type: 'confirm',
        message: 'Enable auto cc?',
        default: autoCc
      },
      {
        name: 'autoReplyTo',
        type: 'confirm',
        message: 'Enable auto reply-to?',
        default: autoReplyTo
      }
    ]
    return inquirer.prompt(questions)
  }

  // attachments
  shouldAddAttachments() {
    const question = [
      {
        name: 'shouldAddAttachments',
        type: 'confirm',
        message: 'Would you like to add attachments?',
        default: false
      }
    ]
    return inquirer.prompt(question)
  }
}

module.exports = ESPInquirer
