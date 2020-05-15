const nodemailer = require("nodemailer")
const _ = require('lodash')

const BaseESPServiceProvider = require('../base-esp-service-provider')

class SMTPServiceProvider extends BaseESPServiceProvider {

  constructor(object, transporter) {
    super(object)
    this.transporter = transporter || nodemailer.createTransport(object.config)
  }

  test(contact) {
    if (!contact) {
      throw new Error(`SMTP connection can't be tested without a contact`)
    }

    let data = this.payload([contact], null, contact, this.subjectForTest, this.bodyForTest, false, false)
    return this.transporter.sendMail(data)
  }

  payload(to, cc, from, subject, html, autoIncludeMeAsCc = true, autoIncludeMeAsReplyTo = true) {

    let config = this.object.config
    let sender = config && (config.sender || config.auth.user)
    if (!sender) {
      throw new Error('Sender can\'t be nil for an SMTP account')
    }

    // default payload
    let payload = {
      from: `"${from.firstname} ${from.lastname}" <${sender}>`,
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

    // console.log(payload)

    // bind data
    return payload
  }
}

module.exports = SMTPServiceProvider
