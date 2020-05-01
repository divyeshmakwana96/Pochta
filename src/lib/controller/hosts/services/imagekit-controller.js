const axios = require('axios')

module.exports = {
  test: (host) => {
    return axios.get('https://api.imagekit.io/v1/files', {
      auth: {
        username: host.privateKey,
        password: ''
      }
    })
  }
}
