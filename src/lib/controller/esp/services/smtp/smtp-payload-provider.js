const _ = require('lodash')

const PayloadProvider = require('../payload-provider')

class SMTPPayloadProvider extends PayloadProvider {

  payload() {
    let payload = {
      from: this.getFrom(),
      to: this.getTo(),
      subject: this.subject,
      html: this.html
    }

    if (this.hasCc()) {
      payload.cc = this.getCc()
    }

    if (this.replyTo) { payload.replyTo = this.getReplyTo() }
    return payload
  }

  formatContact(contact) {
    return `"${contact.firstname} ${contact.lastname}" <${contact.email}>`
  }
}

module.exports = SMTPPayloadProvider
