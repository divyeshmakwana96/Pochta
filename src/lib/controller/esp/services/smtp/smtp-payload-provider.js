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

    if (this.hasCc()) { payload.cc = this.getCc() }
    if (this.hasReplyTo()) { payload.replyTo = this.getReplyTo() }
    if (this.hasAttachments()) { payload.attachments = this.getAttachments() }
    return payload
  }

  formatContact(contact) {
    return `"${contact.firstname} ${contact.lastname}" <${contact.email}>`
  }
}

module.exports = SMTPPayloadProvider
