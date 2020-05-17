const fs = require('../../../../helpers/fs')
const PayloadProvider = require('../payload-provider')

class SendGridPayloadProvider extends PayloadProvider {

  payload() {
    let personalization = {
      to: this.getTo(),
      subject: this.subject
    }

    if (this.hasCc()) {
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

    if (this.hasReplyTo()) { payload.replyTo = this.getReplyTo() }
    if (this.hasAttachments()) { payload.attachments = this.getAttachments() }
    return payload
  }

  formatAttachment(attachment) {
    return {
      content: fs.readFileSyncBase64(attachment.path),
      type: attachment.contentType,
      filename: attachment.filename,
      disposition: attachment.contentDisposition,
      content_id: attachment.cid
    }
  }
}

module.exports = SendGridPayloadProvider
