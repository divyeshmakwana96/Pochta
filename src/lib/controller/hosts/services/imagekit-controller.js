const axios = require('axios')
const APIController = require('../../api-controller')

const BASE_URL = 'https://api.imagekit.io/v1'

class ImageKitController extends APIController {
  test(payload) {
    return axios.get('/files', {
      auth: {
        username: this.object.privateKey,
        password: ''
      },
      baseURL: BASE_URL
    })
  }
}

module.exports = ImageKitController
