const nodemailer = require("nodemailer")
const _ = require('lodash')

const BaseESPServiceProvider = require('../base-esp-service-provider')
const SMTPPayloadProvider = require('./smtp-payload-provider')

class SMTPServiceProvider extends BaseESPServiceProvider {

  constructor(object, transporter) {
    super(object)
    this.transporter = transporter || nodemailer.createTransport(object.config)
  }

  test(contact) {
    if (!contact) {
      throw new Error(`SMTP connection can't be tested without a contact`)
    }

    let provider = new SMTPPayloadProvider()
    provider.from = _.mergeWith(_.clone(contact), { email: this.object.config && this.object.config.sender })
    provider.subject = this.subjectForTest
    provider.html = this.bodyForTest
    provider.addTo(contact)

    // let payload = provider.payload()
    // console.log(JSON.stringify(payload))

    return this.transporter.sendMail(provider.payload())
  }
}

module.exports = SMTPServiceProvider
