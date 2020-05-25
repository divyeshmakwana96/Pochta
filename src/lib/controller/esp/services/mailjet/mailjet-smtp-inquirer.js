const SMTPInquirer = require('../smtp/smtp-inquirer')
const _ = require('lodash')

class MailJetSMTPInquirer extends SMTPInquirer {
  constructor() {
    super({
      promptAlias: true,
      promptHost: false,
      usernameAsEmail: false
    })
  }

  async askSetupQuestions(esp) {
    let answers = await super.askSetupQuestions(esp, {
      port: 465,
      secure: true,
    })

    return _.merge(answers, { config: { host: 'in-v3.mailjet.com' } })
  }
}

module.exports = MailJetSMTPInquirer
