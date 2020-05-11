const ApiServiceProvider = require('../api-service-provider')
const ora = require('../../ora')
const HostType = require('../../enums').HostType

const AWSServiceProvider = require('./services/aws/aws-service-provider')
const CloudinaryServiceProvider = require('./services/cloudinary/cloudinary-service-provider')
const ImageKitServiceProvider = require('./services/imagekit/imagekit-service-provider')

class HostServiceProvider extends ApiServiceProvider {
  test(payload) {
    let type = HostType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid host type')
    }

    let controller
    switch (type) {
      case HostType.S3:
        controller = new AWSServiceProvider(this.object)
        break
      case HostType.Cloudinary:
        controller = new CloudinaryServiceProvider(this.object)
        break
      case HostType.ImageKit:
        controller = new ImageKitServiceProvider(this.object)
        break
    }

    if (controller) {
      return ora(controller.test(this.object), 'testing..', 'success!!', function (e) {
        if (e instanceof Error) {
          return (e && e.response && e.response.data && e.response.data.ErrorMessage)
        } else {
          return e
        }
      })
    }
  }
}

module.exports = HostServiceProvider
