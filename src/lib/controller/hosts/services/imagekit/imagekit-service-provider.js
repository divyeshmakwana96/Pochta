const ImageKit = require("imagekit")
const fs = require('fs')
const APIServiceProvider = require('../../../api-service-provider')

class ImageKitServiceProvider extends APIServiceProvider {

  test() {
    return this.getImageKit().upload({
      file: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      fileName: 'TEST-FILE'
    })
  }

  upload(filepath, dir) {

  }

  getImageKit() {
    return new ImageKit({
      publicKey : this.object.config.publicKey,
      privateKey : this.object.config.privateKey,
      urlEndpoint : `https://ik.imagekit.io/${this.object.config.id}/`
    })
  }
}

module.exports = ImageKitServiceProvider
