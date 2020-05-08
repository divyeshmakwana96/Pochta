const axios = require('axios')
const APIController = require('../../api-controller')

class ImageKitController extends APIController {
  test(payload) {
    return axios.get('https://api.imagekit.io/v1/files', {
      auth: {
        username: this.object.privateKey,
        password: ''
      }
    })
  }
}

module.exports = ImageKitController
