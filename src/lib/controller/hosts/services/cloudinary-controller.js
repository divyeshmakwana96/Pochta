const cloudinary = require('cloudinary').v2

module.exports = {
  test: (host) => {
    cloudinary.config({
      cloud_name: host.cloudName,
      api_key: host.apiKey,
      api_secret: host.apiSecret
    })
    return cloudinary.uploader.upload('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
  }
}
