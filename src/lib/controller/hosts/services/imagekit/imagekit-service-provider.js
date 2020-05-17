const axios = require('axios')
const APIServiceProvider = require('../../../api-service-provider')

const BASE_URL = 'https://api.imagekit.io/v1'

class ImageKitServiceProvider extends APIServiceProvider {
  test() {
    return axios.get('/files', {
      auth: {
        username: this.object.privateKey,
        password: ''
      },
      baseURL: BASE_URL
    })
  }

  upload(filepath, dir) {

  }
}

module.exports = ImageKitServiceProvider
