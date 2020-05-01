const configstore = require('configstore')

module.exports = {
  get: (id, defaults, options = {}) => {
    new configstore(id, defaults, options)
  }
}
