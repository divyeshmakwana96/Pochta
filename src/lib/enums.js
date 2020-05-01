const Enum = require('enum')

const HostType = new Enum(['S3', 'Cloudinary', 'ImageKit'], { ignoreCase: true })

module.exports = {
  HostType : HostType
}
