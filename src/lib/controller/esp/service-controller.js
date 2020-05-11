const APIController = require('../api-controller')
const ora = require('../../ora')
const EspType = require('../../enums').EspType

const MailJetController = require('./services/mailjet-controller')
const SMTPController = require('./services/smtp-controller')

const ProfileController = require('../../controller/profiles/profile-controller')
const ProfileInquirer = require('../profiles/profile-inquirer')

class ServiceController extends APIController {
  async test(payload) {
    let type = EspType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid esp type')
    }

    let controller
    switch (type) {
      case EspType.SendGrid:
        controller = new MailJetController(this.object)
        break
      case EspType.MailJet:
        controller = new MailJetController(this.object)
        break
      case EspType.SMTP:
        controller = new SMTPController(this.object)
        break
    }

    if (controller) {
      // Ask which sender profile to select
      let profileController = new ProfileController()
      let profileInquirer = new ProfileInquirer()
      let choice = await profileInquirer.askSelection(profileController.getMapped(), 'Which profile would you like to send a test email to?')

      if (choice) {
        return ora(controller.test(choice.profile.object), 'sending a test email..', 'email sent successfully!!', function (e) {
          if (e instanceof Error) {
            return (e && e.response && e.response.data && e.response.data.ErrorMessage)
          } else {
            return e
          }
        })
      }
    }
  }
}

module.exports = ServiceController
