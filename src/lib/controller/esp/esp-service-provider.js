const APIServiceProvider = require('../api-service-provider')
const ora = require('../../ora')
const ESPType = require('../../enums').ESPType

const MailJetServiceProvider = require('./services/mailjet/mailjet-service-provider')
const SendGridServiceProvider = require('./services/sendgrid/sendgrid-service-provider')
const SESServiceProvider = require('./services/ses/ses-service-provider')
const SMTPServiceProvider = require('./services/smtp/smtp-service-provider')

const ProfileController = require('../../controller/profiles/profile-controller')
const ProfileInquirer = require('../profiles/profile-inquirer')

class ESPServiceProvider extends APIServiceProvider {
  async test(payload) {
    let type = ESPType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid esp type')
    }

    let controller
    switch (type) {
      case ESPType.Gmail:
        controller = new SMTPServiceProvider(this.object)
        break
      case ESPType.MailJet:
        controller = new MailJetServiceProvider(this.object)
        break
      case ESPType.MES:
        controller = new SMTPServiceProvider(this.object)
        break
      case ESPType.SendGrid:
        controller = new SendGridServiceProvider(this.object)
        break
      case ESPType.SES:
        controller = new SESServiceProvider(this.object)
        break
    }

    if (controller) {
      // Ask which sender profile to select
      let profileController = new ProfileController()
      let profileInquirer = new ProfileInquirer()
      let choice = await profileInquirer.askSelection(profileController.getMapped(), 'Which profile would you like to send a test email to?')

      if (choice) {
        return ora(controller.test(choice.profile.object), 'sending a test email..', 'email sent successfully!!', function (e) {
          // Sendgrid e.response.data.errors

          console.log(e)
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

module.exports = ESPServiceProvider
