const APIServiceProvider = require('../api-service-provider')
const ora = require('../../helpers/ora')
const HostType = require('../../enums').HostType

const AWSServiceProvider = require('./services/aws/aws-service-provider')
const CloudinaryServiceProvider = require('./services/cloudinary/cloudinary-service-provider')
const ImageKitServiceProvider = require('./services/imagekit/imagekit-service-provider')

class HostServiceProvider extends APIServiceProvider {
  test() {
    let type = HostType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid host type')
    }

    let controller = this.getServiceProvider(type)
    if (controller) {
      return ora.task(controller.test(), 'testing..', 'success!!', function (e) {
        if (e instanceof Error) {
          return (e && e.response && e.response.data && e.response.data.ErrorMessage)
        } else {
          return e
        }
      })
    }
  }

  upload(filepath, dir) {
    let type = HostType.get(this.object && this.object.type)
    if (!type) {
      throw new Error('Invalid host type')
    }

    let controller = this.getServiceProvider(type)
    if (controller) {
      return controller.upload(filepath, dir)
    }
  }

  getServiceProvider(type) {
    switch (type) {
      case HostType.S3:
        return new AWSServiceProvider(this.object)
      case HostType.Cloudinary:
        return new CloudinaryServiceProvider(this.object)
      case HostType.ImageKit:
        return new ImageKitServiceProvider(this.object)
    }
    return super.getServiceProvider(type)
  }
}

module.exports = HostServiceProvider
