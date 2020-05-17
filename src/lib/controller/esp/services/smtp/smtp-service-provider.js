const nodemailer = require("nodemailer")

const BaseESPServiceProvider = require('../base-esp-service-provider')
const SMTPPayloadProvider = require('./smtp-payload-provider')

class SMTPServiceProvider extends BaseESPServiceProvider {

  constructor(object, transporter) {
    super(object)
    this.transporter = transporter || nodemailer.createTransport(object.config)
  }

  getPayloadProvider() {
    return new SMTPPayloadProvider()
  }

  sendPayload(payload) {
    return this.transporter.sendMail(payload)
  }
}

module.exports = SMTPServiceProvider
