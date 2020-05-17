const axios = require('axios')

const BaseESPServiceProvider = require('../base-esp-service-provider')
const MailJetPayloadProvider = require('./mailjet-payload-provider')

const BASE_URL = 'https://api.mailjet.com/v3.1'

class MailJetServiceProvider extends BaseESPServiceProvider {

  getPayloadProvider() {
    return new MailJetPayloadProvider()
  }

  sendPayload(payload) {
    return axios.post('/send', payload, {
      auth: {
        username: this.object.config.apiKey,
        password: this.object.config.apiSecret
      },
      baseURL: BASE_URL
    })
  }
}

module.exports = MailJetServiceProvider
