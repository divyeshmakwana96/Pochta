const packageJson = require('../../../../package.json')
const collectionName = 'providers'

const configstore = require('configstore')
const configs = new configstore(packageJson.name + '-' + collectionName, { providers: [] })

const uniqueString = require('unique-string')
const _ = require('lodash')

const EspType = require('../../enums').EspType

const sendgridController = require('./services/sendgrid-controller')
const mailjetController = require('./services/mailjet-controller')

const EspController = {
  get: () => {
    return configs.get(collectionName)
  },

  getMapped: () => {
    let providers = configs.get(collectionName)
    let mapped = _.map(providers, (esp) => {
      let title = EspType.get(esp.type).key
      if (esp.label.length > 0) {
        title += ' (' + esp.label + ')'
      }
      return {
        name: title,
        value: { title, esp }
      }
    })

    return _.sortBy(mapped, 'name')
  },

  add: (esp) => {
    let providers = configs.get(collectionName)
    esp.id = esp.id || uniqueString()
    providers.push(esp)
    configs.set(collectionName, providers)
  },

  update: (esp) => {
    let providers = configs.get(collectionName)
    let index = _.findIndex(providers, { id: esp.id })
    providers.splice(index, 1, esp)
    configs.set(collectionName, providers)
  },

  delete: (esp) => {
    let providers = configs.get(collectionName)
    let index = _.findIndex(providers, { id: esp.id })
    providers.splice(index, 1)
    configs.set(collectionName, providers)
  },

  test: (esp, profile) => {
    let type = EspType.get(esp.type)
    if (!type) {
      throw new Error('Invalid esp type')
    }

    switch (type) {
      case EspType.SendGrid:
        return sendgridController.test(esp, profile)
      case EspType.MailJet:
        return mailjetController.test(esp, profile)
      case EspType.SMTP:
        return sendgridController.test(esp, profile)
    }
  }
}

module.exports = EspController
