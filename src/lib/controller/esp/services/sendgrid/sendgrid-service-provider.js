const axios = require('axios')

module.exports = {
  test: (esp) => {
    return axios.get('https://api.sendgrid.com/v3/user/profile', {
      headers: { Authorization: `Bearer ${esp.apiKey}` }
    })
  }
}
