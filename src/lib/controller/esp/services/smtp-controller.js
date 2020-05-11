const nodemailer = require("nodemailer")
const _ = require('lodash')

const BaseEspServiceProvider = require('./base-esp-service-provider')

class SMTPController extends BaseEspServiceProvider {
  test(contact) {

    if (!contact) {
      throw new Error(`SMTP connection can't be tested without a contact`)
    }

    let transporter = nodemailer.createTransport(this.object)
    let data = this.payload(this.object, [contact], null, contact, this.subjectForTest, this.subjectForMessage, false, false)
    return transporter.sendMail(data)
  }

  payload(esp, to, cc, from, subject, html, autoIncludeMeAsCc = true, autoIncludeMeAsReplyTo = true) {
    // default payload
    let payload = {
      from: `"${from.firstname} ${from.lastname}" <${esp.auth.user}>`,
      subject: subject,
      html: html
    }

    // auto reply to
    if (autoIncludeMeAsReplyTo) {
      payload.replyTo = `"${from.firstname} ${from.lastname}" <${from.email}>`
    }

    // to
    if (to && to.length > 0) {
      payload.to = _.join(_.map(to, (recipient) => {
        return `"${recipient.firstname} ${recipient.lastname}" <${recipient.email}>`
      }))
    }

    // cc
    let ccRecipients

    // 1) loop
    if (cc && cc.length > 0) {
      ccRecipients = _.map(cc, (recipient) => {
        return `"${recipient.firstname} ${recipient.lastname}" <${recipient.email}>`
      })
    } else {
      ccRecipients = []
    }

    // 2) auto include cc
    if (autoIncludeMeAsCc) {
      ccRecipients.push(`"${from.firstname} ${from.lastname}" <${from.email}>`)
    }

    // merge
    if (ccRecipients.length > 0) {
      payload.Cc = _.join(ccRecipients)
    }

    // bind data
    return payload
  }
}

module.exports = SMTPController
