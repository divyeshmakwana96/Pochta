const axios = require('axios')
const _ = require('lodash')

const BaseESPServiceProvider = require('../base-esp-service-provider')
const MailJetPayloadProvider = require('./mailjet-payload-provider')

const BASE_URL = 'https://api.mailjet.com/v3.1'

class MailJetServiceProvider extends BaseESPServiceProvider {
  test(contact) {

    if (!contact) {
      throw new Error(`MailJet connection can't be tested without a contact`)
    }

    let provider = new MailJetPayloadProvider()
    provider.from = _.mergeWith(_.clone(contact), { email: this.object.config && this.object.config.sender })
    provider.subject = this.subjectForTest
    provider.html = this.bodyForTest
    provider.addTo(contact)

    // let payload = provider.payload()
    // console.log(JSON.stringify(payload))

    return axios.post('/send', provider.payload(), {
      auth: {
        username: this.object.config.apiKey,
        password: this.object.config.apiSecret
      },
      baseURL: BASE_URL
    })
  }
}

module.exports = MailJetServiceProvider
