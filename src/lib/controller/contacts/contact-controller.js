const packageJson = require('../../../../package.json')
const collectionName = 'contacts'

const configstore = require('configstore')
const configs = new configstore(packageJson.name + '-' + collectionName, { contacts: [] })

const uniqueString = require('unique-string')
const _ = require('lodash')

const ProfileController = {
  get: () => {
    return configs.get(collectionName)
  },

  getMapped: () => {
    let contacts = configs.get(collectionName)
    let mapped = _.map(contacts, (contact) => {
      let title = contact.name
      if (contact.label.length > 0) {
        title += ' (' + contact.label + ')'
      }
      return {
        name: title,
        value: { title, contact }
      }
    })

    return _.sortBy(mapped, 'name')
  },

  add: (contact) => {
    let contacts = configs.get(collectionName)
    contact.id = contact.id || uniqueString()
    contacts.push(contact)
    configs.set(collectionName, contacts)
  },

  update: (contact) => {
    let contacts = configs.get(collectionName)
    let index = _.findIndex(contacts, { id: contact.id })
    contacts.splice(index, 1, contact)
    configs.set(collectionName, contacts)
  },

  delete: (contact) => {
    let contacts = configs.get(collectionName)
    let index = _.findIndex(contacts, { id: contact.id })
    contacts.splice(index, 1)
    configs.set(collectionName, contacts)
  }
}

module.exports = ProfileController
