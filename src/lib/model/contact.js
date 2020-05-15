class Contact {
  constructor(object) {
    Object.assign(this, object)
    this.name = `${object.firstname} ${object.lastname}`
  }
}

module.exports = Contact
