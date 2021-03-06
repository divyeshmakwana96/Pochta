const SMTPInquirer = require('../smtp/smtp-inquirer')
const _ = require('lodash')

class SendGridSMTPInquirer extends SMTPInquirer {
  constructor() {
    super({
      promptAlias: true,
      promptHost: false,
      usernameAsEmail: false
    })
  }

  async askSetupQuestions(esp) {
    let answers = await super.askSetupQuestions(esp, {
      auth: {
        user: 'apikey'
      },
      port: 465,
      secure: true,
    })

    return _.merge(answers, { config: { host: 'smtp.sendgrid.net' } })
  }
}

module.exports = SendGridSMTPInquirer
