const Enum = require('enum')

const OptionType = new Enum(['New', 'View', 'Edit', 'Delete', 'Test', 'Sync', 'Cancel'], { freeze: true })
const HostType = new Enum(['S3', 'Cloudinary', 'ImageKit'], { freeze: true })
const EspType = new Enum(['SendGrid', 'MailJet', 'SMTP'], { freeze: true })
const ConnectionType = new Enum(['Redmine'], { freeze: true })
const AuthType = new Enum(['Login', 'OAuth2'], { freeze: true })
const OAuth2Type = new Enum(['AccessToken', 'a3L0', 'a2L0'], { freeze: true })

module.exports = {
  OptionType,
  HostType,
  EspType,
  ConnectionType,
  AuthType,
  OAuth2Type
}
