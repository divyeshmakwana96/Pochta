const Enum = require('enum')
const _ = require('lodash')

const OptionType = new Enum(['New', 'View', 'Edit', 'Delete', 'Test', 'Sync', 'Cancel'], { freeze: true, ignoreCase: true })
const HostType = new Enum(['S3', 'Cloudinary', 'ImageKit'], { freeze: true, ignoreCase: true })
const ESPType = new Enum(['Gmail', 'MES','SendGrid', 'MailJet', 'SES'], { freeze: true, ignoreCase: true })
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
    case 'mailjet':
      return 'MailJet'
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
