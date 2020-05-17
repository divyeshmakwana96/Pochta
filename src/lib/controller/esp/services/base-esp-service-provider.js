const APIController = require('../../api-service-provider')
const _ = require('lodash')

class BaseESPServiceProvider extends APIController {

  constructor(object) {
    super(object)

    this.subjectForTest = '[TEST] Connection Test'
    this.bodyForTest = 'This is a just a test email.'
  }

  getSenderEmail() {
    return this.object.config && (this.object.config.sender || (this.object.config.auth && this.object.config.auth.user))
  }

  test(contact) {
    if (!contact) {
      throw new Error(`connection can't be tested without a contact`)
    }

    let provider = this.getPayloadProvider()
    provider.from = _.mergeWith(_.clone(contact), { email: this.object.config && this.object.config.sender })
    provider.subject = this.subjectForTest
    provider.html = this.bodyForTest
    provider.addTo(contact)

    // let payload = provider.payload()
    // console.log(JSON.stringify(payload))

    return this.sendPayload(provider.payload())
  }

  send(from, to, cc, replyTo, subject, body, attachments) {
    let provider = this.getPayloadProvider()
    provider.from = _.mergeWith(_.clone(from), { email: this.getSenderEmail() })
    provider.subject = subject
    provider.replyTo = replyTo
    provider.html = body
    provider.addTo(to)
    provider.addCC(cc)
    provider.addAttachment(attachments)

    // let payload = provider.payload()
    // console.log(JSON.stringify(payload))

    return this.sendPayload(provider.payload())
  }

  getPayloadProvider() {
    throw new Error(`subclass should override get payload provider method`)
  }

  sendPayload(payload) {
    throw new Error(`subclass should override sendPayload method`)
  }
}

module.exports = BaseESPServiceProvider
