const axios = require('axios')
const _ = require('lodash')

const BaseESPServiceProvider = require('../base-esp-service-provider')

const BASE_URL = 'https://api.mailjet.com/v3.1'

class MailJetServiceProvider extends BaseESPServiceProvider {
  test(contact) {

    if (!contact) {
      throw new Error(`MailJet connection can't be tested without a contact`)
    }

    let data = this.payload([contact], null, contact, this.subjectForTest, this.bodyForTest, false, false)

    return axios.post('/send', data, {
      auth: {
        username: this.object.config.apiKey,
        password: this.object.config.apiSecret
      },
      baseURL: BASE_URL
    })
  }

  payload(to, cc, from, subject, html, autoIncludeMeAsCc = true, autoIncludeMeAsReplyTo = true) {

    let sender = this.object.config && this.object.config.sender
    if (!sender) {
      throw new Error('Sender can\'t be nil for a MailJet account')
    }

    // default payload
    let payload = {
      From: {
        Email: sender,
        Name: `${from.firstname} ${from.lastname}`
      },
      Subject: subject,
      HTMLPart: html
    }

    // auto reply to
    if (autoIncludeMeAsReplyTo) {
      payload.ReplyTo = {
        Email: from.email,
        Name: `${from.firstname} ${from.lastname}`
      }
    }

    // to
    if (to && to.length > 0) {
      payload.To = _.map(to, (recipient) => {
        return {
          Email: recipient.email,
          Name: `${recipient.firstname} ${recipient.lastname}`
        }
      })
    }

    // cc
    let ccRecipients

    // 1) loop
    if (cc && cc.length > 0) {
      ccRecipients = _.map(cc, (recipient) => {
        return {
          Email: recipient.email,
          Name: `${recipient.firstname} ${recipient.lastname}`
        }
      })
    } else {
      ccRecipients = []
    }

    // 2) auto include cc
    if (autoIncludeMeAsCc) {
      ccRecipients.push({
        Email: from.email,
        Name: `${from.firstname} ${from.lastname}`
      })
    }

    // merge
    if (ccRecipients.length > 0) {
      payload.Cc = ccRecipients
    }

    // bind data
    return { Messages: [payload] }
  }
}

module.exports = MailJetServiceProvider
