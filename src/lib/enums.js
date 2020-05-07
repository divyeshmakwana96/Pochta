const Enum = require('enum')

const HostType = new Enum(['S3', 'Cloudinary', 'ImageKit'], { ignoreCase: true })
const EspType = new Enum(['SendGrid', 'MailJet', 'SMTP'], { ignoreCase: true })
const AuthType = new Enum(['Login', 'OAuth2'], { ignoreCase: true })
const OAuth2Type = new Enum(['AccessToken', 'a3L0', 'a2L0'], { ignoreCase: true })

module.exports = {
  HostType,
  EspType,
  AuthType,
  OAuth2Type
}
