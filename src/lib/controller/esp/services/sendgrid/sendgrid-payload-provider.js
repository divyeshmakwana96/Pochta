const _ = require('lodash')

const PayloadProvider = require('../payload-provider')

class SendGridPayloadProvider extends PayloadProvider {
  payload() {

    let personalization = {
      to: this.getTo(),
      subject: this.subject
    }

    if (this.ccRecipients.length > 0) {
      personalization.cc = this.getCc()
    }

    let payload = {
      personalizations: [personalization],
      from: this.getFrom(),
      content: [{
        type: 'text/html',
        value: this.html
      }]
    }

    if (this.replyTo) { payload.reply_to = this.getReplyTo() }
    return payload
  }
}

module.exports = SendGridPayloadProvider
