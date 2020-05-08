const APIController = require('../api-controller')
const HostType = require('../../enums').HostType

const AWSController = require('./services/aws-controller')
const CloudinaryController = require('./services/cloudinary-controller')
const ImageKitController = require('./services/imagekit-controller')

class ServiceController extends APIController {
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
      return controller.test()
    }
  }
}

module.exports = ServiceController
