const cloudinary = require('cloudinary').v2

module.exports = {
  test: (host) => {
    cloudinary.config({
      cloud_name: host.cloudName,
      api_key: host.apiKey,
      api_secret: host.apiSecret
    })
    return cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP6DwABBQECz6AuzQAAAABJRU5ErkJggg==')
  }
}
