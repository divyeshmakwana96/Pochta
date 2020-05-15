const _ = require('lodash')

const PayloadProvider = require('../payload-provider')

class MailJetPayloadProvider extends PayloadProvider {

  payload() {

    let payload = {
      From: this.getFrom(),
      To: this.getTo(),
      Subject: this.subject,
      HTMLPart: this.html
    }

    if (this.hasCc()) {
      payload.Cc = this.getCc()
    }
    if (this.replyTo) { payload.ReplyTo = this.getReplyTo() }

    return { Messages: [payload] }
  }

  formatContact(contact) {
    return {
      Name: `${contact.firstname} ${contact.lastname}`,
      Email: contact.email
    }
  }
}

module.exports = MailJetPayloadProvider
