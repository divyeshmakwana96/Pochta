class APIServiceProvider {
  constructor(object) {
    this.object = object
  }

  test(payload) {
    throw new Error(`subclass doesn't override test method`)
  }

  getServiceProvider(type) {
    return null
  }
}

module.exports = APIServiceProvider
