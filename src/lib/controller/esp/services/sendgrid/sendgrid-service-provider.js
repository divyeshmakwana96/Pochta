const axios = require('axios')

const BaseESPServiceProvider = require('../base-esp-service-provider')
const SendGridPayloadProvider = require('./sendgrid-payload-provider')

const BASE_URL = 'https://api.sendgrid.com/v3'

class SendGridServiceProvider extends BaseESPServiceProvider {

  getPayloadProvider() {
    return new SendGridPayloadProvider()
  }

  sendPayload(payload) {
    return axios.post('/mail/send', payload, {
      headers: {
        Authorization: `Bearer ${this.object.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      baseURL: BASE_URL
    })
  }
}

module.exports = SendGridServiceProvider
