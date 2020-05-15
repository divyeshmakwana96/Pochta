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

  getTo() {
    return _.map(this.toRecipients, this.formatContact)
  }

  getCc() {
    return _.map(this.ccRecipients, this.formatContact)
  }

  getFrom() {
    return this.from && this.formatContact(this.from)
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
    }

    throw new Error('This class shouldn\'t be used directly.')
  }

  formatContact(contact) {
    return {
      name: `${contact.firstname} ${contact.lastname}`,
      email: contact.email
    }
  }
}

module.exports = PayloadProvider
