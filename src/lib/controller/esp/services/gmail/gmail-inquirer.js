const SMTPInquirer = require('../smtp/smtp-inquirer')
const _ = require('lodash')

class GmailInquirer extends SMTPInquirer {
  constructor() {
    super('esp')
  }

  async askSetupQuestions(esp) {
    let answers = await super.askSetupQuestions(esp, false, false, {
      port: 465,
      secure: true,
    })

    return _.merge(answers, { config: { host: 'smtp.gmail.com' } })
  }
}

module.exports = GmailInquirer
