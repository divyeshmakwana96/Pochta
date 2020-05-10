const ContactInquirer = require('../contacts/contact-inquirer')

class ProfileInquirer extends ContactInquirer {
  constructor() {
    super('profile')
  }
}

module.exports = ProfileInquirer
