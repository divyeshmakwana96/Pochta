const ApiServiceProvider = require('../api-service-provider')
const ora = require('../../ora')
const HostType = require('../../enums').HostType

const AWSController = require('./services/aws-service-provider')
const CloudinaryController = require('./services/cloudinary-service-provider')
const ImageKitController = require('./services/imagekit-service-provider')

class HostServiceProvider extends ApiServiceProvider {
  test(payload) {
    let type = HostType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid host type')
    }

    let controller
    switch (type) {
      case HostType.S3:
        controller = new AWSController(this.object)
        break
      case HostType.Cloudinary:
        controller = new CloudinaryController(this.object)
        break
      case HostType.ImageKit:
        controller = new ImageKitController(this.object)
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
