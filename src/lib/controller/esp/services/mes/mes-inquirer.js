const SMTPInquirer = require('../smtp/smtp-inquirer')
const _ = require('lodash')

class MESInquirer extends SMTPInquirer {
  constructor() {
    super('esp')
  }

  async askSetupQuestions(esp) {
    let answers = await super.askSetupQuestions(esp, false, false, {
      port: 587,
      secure: false,
    })

    return _.merge(answers, {
      config: {
        host: 'smtp.office365.com',
        tls: { cipher: 'SSLv3' }
      }
    })
  }
}

module.exports = MESInquirer
