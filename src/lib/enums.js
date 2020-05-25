const Enum = require('enum')
const _ = require('lodash')

const OptionType = new Enum(['New', 'View', 'Edit', 'Delete', 'Test', 'Sync', 'Cancel'], { freeze: true, ignoreCase: true })
const HostType = new Enum(['S3', 'Cloudinary', 'ImageKit'], { freeze: true, ignoreCase: true })
const ESPType = new Enum(['Gmail', 'MES','SendGrid', 'SendGrid_SMTP', 'MailJet', 'MailJet_SMTP', 'SES'], { freeze: true, ignoreCase: true })
const ConnectionType = new Enum(['Redmine'], { freeze: true, ignoreCase: true })

const describe = function (key) {
  let lowecase = key.toString().toLowerCase()

  switch (lowecase) {
    case 's3':
      return 'AWS S3'
    case 'imagekit':
      return 'ImageKit'
    case 'mes':
      return 'Microsft Exchange'
    case 'sendgrid':
      return 'SendGrid'
    case 'sendgrid_smtp':
      return 'SendGrid [SMTP]'
    case 'mailjet':
      return 'MailJet'
    case 'mailjet_smtp':
      return 'MailJet [SMTP]'
    case 'ses':
      return 'Amazon SES'
    default:
      return _.upperFirst(lowecase)
  }
}

module.exports = {
  OptionType,
  HostType,
  ESPType,
  ConnectionType,
  describe
}
