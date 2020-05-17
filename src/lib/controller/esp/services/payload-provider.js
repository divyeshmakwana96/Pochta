const _ = require('lodash')

class PayloadProvider {
  constructor() {
    this.from = null
    this.replyTo = null
    this.subject = null
    this.html = null

    this.toRecipients = []
    this.ccRecipients = []
    this.attachments = []
  }

  addTo(recipient) {
    this.toRecipients = _.concat(this.toRecipients, recipient)
  }

  addCC(recipient) {
    this.ccRecipients = _.concat(this.ccRecipients, recipient)
  }

  addAttachment(attachment) {
    this.attachments = _.concat(this.attachments, attachment)
  }

  hasTo() {
    return this.toRecipients.length > 0
  }

  getTo() {
    return _.map(this.toRecipients, this.formatContact)
  }

  hasCc() {
    return this.ccRecipients.length > 0
  }

  getCc() {
    return _.map(this.ccRecipients, this.formatContact)
  }

  getFrom() {
    return this.from && this.formatContact(this.from)
  }

  hasAttachments() {
    return this.attachments.length > 0
  }

  getAttachments() {
    return _.map(this.attachments, this.formatAttachment)
  }

  hasReplyTo() {
    return this.replyTo != null
  }

  getReplyTo() {
    return this.replyTo && this.formatContact(this.replyTo)
  }

  payload() {
    if (this.from == null) {
      throw new Error('From can\'t be empty')
    } else if (this.subject == null) {
      throw new Error('Subject can\'t be empty')
    } else if (this.html == null) {
      throw new Error('Email body can\'t be empty')
    } else if (!this.hasTo()) {
      throw new Error('Email must have recipients')
    }

    throw new Error('This class shouldn\'t be used directly.')
  }

  formatContact(contact) {
    return {
      name: `${contact.firstname} ${contact.lastname}`,
      email: contact.email
    }
  }

  formatAttachment(attachment) {
    return attachment
  }
}

module.exports = PayloadProvider
