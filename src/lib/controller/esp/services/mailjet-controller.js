const axios = require('axios')
const _ = require('lodash')

const EspServiceController = require('./esp-service-controller')

const BASE_URL = 'https://api.mailjet.com/v3.1'

class MailJetController extends EspServiceController {
  test(contact) {

    if (!contact) {
      throw new Error(`MailJet connection can't be tested without a contact`)
    }

    let data = this.payload(this.object, [contact], null, contact, this.subjectForTest, this.subjectForMessage, false, false)

    return axios.post('/send', data, {
      auth: {
        username: this.object.apiKey,
        password: this.object.apiSecret
      },
      baseURL: BASE_URL
    })
  }

  payload(esp, to, cc, from, subject, html, autoIncludeMeAsCc = true, autoIncludeMeAsReplyTo = true) {
    // default payload
    let payload = {
      From: {
        Email: esp.sender,
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

module.exports = MailJetController
