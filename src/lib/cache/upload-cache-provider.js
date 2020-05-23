const CacheProvider = require('./cache-provider')
const crypto = require('../helpers/crypto')

class UploadCacheProvider extends CacheProvider {

  getRemoteUrl(path) {
    let find = this.db.get('uploads').find({ id: crypto.hashForFileAtPath(path) }).value()
    return find && find.url
  }

  putRemoteUrl(url, path) {
    this.db.get('uploads').upsert({
      id: crypto.hashForFileAtPath(path),
      url: url
    }).write()
  }
}

module.exports = UploadCacheProvider
