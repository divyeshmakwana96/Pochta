const APIController = require('../../api-service-provider')

class BaseESPServiceProvider extends APIController {

  constructor(object) {
    super(object)

    this.subjectForTest = '[TEST] Connection Test'
    this.bodyForTest = 'This is a just a test email.'
  }

  test(contact) {
    if (!contact) {
      throw new Error(`MailJet connection can't be tested without a contact`)
    }
  }
}

module.exports = BaseESPServiceProvider
