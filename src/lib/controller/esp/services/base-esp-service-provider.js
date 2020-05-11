const APIController = require('../../api-service-provider')

class BaseEspServiceProvider extends APIController {

  constructor(object) {
    super(object)

    this.subjectForTest = '[TEST] Connection Test'
    this.subjectForMessage = 'This is a just a test email.'
  }

  test(contact) {
    if (!contact) {
      throw new Error(`MailJet connection can't be tested without a contact`)
    }
  }

  payload(esp, to, cc, from, subject, html, autoIncludeMeAsCc = true, autoIncludeMeAsReplyTo = true) {
    throw new Error('payload method must be overwritten by a subclass')
  }
}

module.exports = BaseEspServiceProvider
