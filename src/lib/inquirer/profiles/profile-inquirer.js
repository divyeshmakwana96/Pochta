const ContactInquirer = require('../contacts/contact-inquirer')

class ProfileInquirer extends ContactInquirer {
  constructor() {
    super('profile', false)
  }
}

module.exports = ProfileInquirer
