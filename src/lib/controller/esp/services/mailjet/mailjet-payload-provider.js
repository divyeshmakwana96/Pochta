const _ = require('lodash')
const fs = require('../../../../helpers/fs')
const PayloadProvider = require('../payload-provider')

class MailJetPayloadProvider extends PayloadProvider {

  payload() {

    let payload = {
      From: this.getFrom(),
      To: this.getTo(),
      Subject: this.subject,
      HTMLPart: this.html
    }

    if (this.hasCc()) { payload.Cc = this.getCc() }
    if (this.hasReplyTo()) { payload.ReplyTo = this.getReplyTo() }

    /*
    Since Mailjet has different properties for Inline and regular attachments,
    we need to sort out both by it's content disposition type :(
     */
    if (this.hasAttachments()) {
      let inlineAttachments = []
      let otherAttachments = []

      this.attachments.forEach((attachment) => {
        if (attachment.contentDisposition === 'inline') {
          inlineAttachments.push(attachment)
        } else {
          otherAttachments.push(attachment)
        }
      })

      if (inlineAttachments.length > 0) {
        payload.InlinedAttachments = _.map(inlineAttachments, this.formatAttachment)
      }

      if (otherAttachments.length > 0) {
        payload.Attachments = _.map(otherAttachments, this.formatAttachment)
      }
    }

    return { Messages: [payload] }
  }

  formatContact(contact) {
    return {
      Name: `${contact.firstname} ${contact.lastname}`,
      Email: contact.email
    }
  }

  formatAttachment(attachment) {
    return {
      Base64Content: fs.readFileSyncBase64(attachment.path),
      ContentType: attachment.contentType,
      Filename: attachment.filename,
      ContentID: attachment.cid
    }
  }
}

module.exports = MailJetPayloadProvider
