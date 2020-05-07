const axios = require('axios')
const _ = require('lodash')

const MailJetController = {
  test: (esp, profile) => {
    MailJetController.send(esp, [profile], profile, '[TEST] Connection Test', 'This is a just a test email.', null, false, false)
  },

  send: (esp, to, from, subject, html, cc, autoIncludeMeAsCc = true, autoIncludeMeAsReplyTo = true) => {
    // default payload
    let payload = {
      From: {
        Email: esp.sender,
        Name: from.name
      },
      Subject: subject,
      HTMLPart: html
    }

    // auto reply to
    if (autoIncludeMeAsReplyTo) {
      Object.assign(payload, {
        ReplyTo : {
          Email: from.email,
          Name: from.name
        }
      })
    }

    // to
    if (to && to.length > 0) {
      let recipients = _.map(to, (recipient) => {
          return {
            Email: recipient.email,
            Name: recipient.name
          }
      })

      Object.assign(payload, { To : recipients })
    }

    // cc
    let ccRecipients

    // 1) loop
    if (cc && cc.length > 0) {
      ccRecipients = _.map(to, (recipient) => {
        return {
          Email: recipient.email,
          Name: recipient.name
        }
      })
    } else {
      ccRecipients = []
    }

    // 2) auto include cc
    if (autoIncludeMeAsCc) {
      ccRecipients.push({
        Email: from.email,
        Name: from.name
      })
    }

    // merge
    if (ccRecipients.length > 0) {
      Object.assign(payload, { Cc : ccRecipients })
    }

    // bind data
    const data = { Messages: [payload] }

    // make api call
    return axios.post('https://api.mailjet.com/v3.1/send', data, {
      auth: {
        username: esp.apiKey,
        password: esp.apiSecret
      }
    })
  }
}

module.exports = MailJetController
