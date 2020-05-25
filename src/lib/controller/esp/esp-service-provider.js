const _ = require('lodash')
const APIServiceProvider = require('../api-service-provider')
const ora = require('../../helpers/ora')
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

    let controller = this.getServiceProvider(type)
    if (controller) {
      // Ask which sender profile to select
      let profileController = new ProfileController()
      let profileInquirer = new ProfileInquirer()
      let choice = await profileInquirer.askSelection(profileController.getMapped(), 'Which profile would you like to send a test email to?')

      if (choice) {
        return ora.task(controller.test(choice.profile.object), 'sending a test email...', 'email sent successfully!!', function (e) {

          if (e instanceof Error) {
            return (e && e.response && e.response.data && (
              e.response.data.ErrorMessage || _.join(_.map(e.response.data.errors, (error) => { return error.message }))
            )) || e.message
          } else {
            return e
          }
        })
      }
    }
  }

  send(from, to, cc, replyTo, subject, body, attachments) {
    let type = ESPType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid esp type')
    }

    let controller = this.getServiceProvider(type)
    return ora.task(controller.send(from, to, cc, replyTo, subject, body, attachments), 'sending email...', 'email sent successfully!!', function (e) {
      if (e instanceof Error) {
        console.log(e)
        return (e && e.response && e.response.data && (
          e.response.data.ErrorMessage || _.join(_.map(e.response.data.errors, (error) => { return error.message }))
        )) || e.message
      } else {
        return e
      }
    })
  }

  getServiceProvider(type) {
    switch (type) {
      case ESPType.MailJet:
        return new MailJetServiceProvider(this.object)
      case ESPType.SendGrid:
        return new SendGridServiceProvider(this.object)
      case ESPType.SES:
        return new SESServiceProvider(this.object)
      default:
        return new SMTPServiceProvider(this.object)
    }
  }
}

module.exports = ESPServiceProvider
