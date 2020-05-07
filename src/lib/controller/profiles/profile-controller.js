const packageJson = require('../../../../package.json')
const collectionName = 'profiles'

const configstore = require('configstore')
const configs = new configstore(packageJson.name + '-' + collectionName, { profiles: [] })

const uniqueString = require('unique-string')
const _ = require('lodash')

const ProfileController = {
  get: () => {
    return configs.get(collectionName)
  },

  getMapped: () => {
    let profiles = configs.get(collectionName)
    let mapped = _.map(profiles, (sender) => {
      let title = sender.name
      if (sender.label.length > 0) {
        title += ' (' + sender.label + ')'
      }
      return {
        name: title,
        value: { title, sender }
      }
    })

    return _.sortBy(mapped, 'name')
  },

  add: (profile) => {
    let profiles = configs.get(collectionName)
    profile.id = profile.id || uniqueString()
    profiles.push(profile)
    configs.set(collectionName, profiles)
  },

  update: (profile) => {
    let profiles = configs.get(collectionName)
    let index = _.findIndex(profiles, { id: profile.id })
    profiles.splice(index, 1, profile)
    configs.set(collectionName, profiles)
  },

  delete: (profile) => {
    let profiles = configs.get(collectionName)
    let index = _.findIndex(profiles, { id: profile.id })
    profiles.splice(index, 1)
    configs.set(collectionName, profiles)
  }
}

module.exports = ProfileController
