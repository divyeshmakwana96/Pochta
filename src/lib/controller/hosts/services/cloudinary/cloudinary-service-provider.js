const _ = require('lodash')
const cloudinary = require('cloudinary').v2
const APIServiceProvider = require('../../../api-service-provider')

class CloudinaryServiceProvider extends APIServiceProvider {
  test() {
    return this.getCloudinary().uploader.upload('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
  }

  upload(filepath, dir, tags) {
    let options = {
      folder: dir,
      overwrite: true,
      tags: tags && _.join(_.map(tags, 'value'))
    }

    return this.getCloudinary().uploader.upload(filepath, options)
  }

  getCloudinary() {
    cloudinary.config({
      cloud_name: this.object.config.cloudName,
      api_key: this.object.config.apiKey,
      api_secret: this.object.config.apiSecret
    })
    return cloudinary
  }
}

module.exports = CloudinaryServiceProvider
