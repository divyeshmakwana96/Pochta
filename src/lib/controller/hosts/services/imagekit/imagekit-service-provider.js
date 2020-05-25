const ImageKit = require("imagekit")
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const APIServiceProvider = require('../../../api-service-provider')

class ImageKitServiceProvider extends APIServiceProvider {

  test() {
    return this.getImageKit().upload({
      file: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      fileName: 'TEST-FILE'
    })
  }

  upload(filepath, dir, tags) {
    try {
      let data = fs.readFileSync(filepath)

      return this.getImageKit().upload({
        file: data,
        folder: dir,
        fileName: path.basename(filepath),
        tags: tags && _.join(_.map(tags, 'value'))
      })
    } catch (e) {
      throw e
    }
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
