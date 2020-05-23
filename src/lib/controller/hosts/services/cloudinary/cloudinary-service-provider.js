const cloudinary = require('cloudinary').v2
const APIServiceProvider = require('../../../api-service-provider')

class CloudinaryServiceProvider extends APIServiceProvider {
  test() {
    cloudinary.config({
      cloud_name: this.object.config.cloudName,
      api_key: this.object.config.apiKey,
      api_secret: this.object.config.apiSecret
    })
    return cloudinary.uploader.upload('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
  }

  upload(filepath, dir) {

  }
}

module.exports = CloudinaryServiceProvider
