const axios = require('axios')
const _ = require('lodash')

const BaseESPServiceProvider = require('../base-esp-service-provider')
const SendGridPayloadProvider = require('./sendgrid-payload-provider')

const BASE_URL = 'https://api.sendgrid.com/v3'

class SendGridServiceProvider extends BaseESPServiceProvider {

  constructor(object) {
    super(object)
  }

  test(contact) {

    if (!contact) {
      throw new Error(`MailJet connection can't be tested without a contact`)
    }

    let provider = new SendGridPayloadProvider()
    provider.from = _.mergeWith(_.clone(contact), { email: this.object.config && this.object.config.sender })
    provider.subject = this.subjectForTest
    provider.html = this.bodyForTest
    provider.addTo(contact)

    // let payload = provider.payload()
    // console.log(JSON.stringify(payload))

    return axios.post('/mail/send', provider.payload(), {
      headers: {
        Authorization: `Bearer ${this.object.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      baseURL: BASE_URL
    })
  }
}

module.exports = SendGridServiceProvider
