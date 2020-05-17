const CacheProvider = require('./cache-provider')
const crypto = require('../helpers/crypto')

class UploadCacheProvider extends CacheProvider {

  getRemoteUrl(imagePath) {
    let find = this.db.get('uploads').find({ id: crypto.hashForFileAtPath(imagePath) })
    return find && find.url
  }

  getRemoteUrls(imagePaths) {
    let out = {}

    let uploads = this.db.get('uploads')
    imagePaths.forEach(imagePath => {
      let find = uploads.find({ id: crypto.hashForFileAtPath(imagePath) })
      if (find) {
        out[imagePath] = find.url
      }
    })
    return out
  }

  putRemoteUrl(url, imagePath) {
    this.db.get('uploads').upsert({
      id: crypto.hashForFileAtPath(imagePath),
      url: url
    }).write()
  }
}

module.exports = UploadCacheProvider
