const packageJson = require('../../../../package.json')
const collectionName = 'hosts'

const configstore = require('configstore')
const configs = new configstore(packageJson.name + '-' + collectionName, { hosts: [] })

const uniqueString = require('unique-string')
const _ = require('lodash')

const HostType = require('../../enums').HostType

const awsController = require('./services/aws-controller')
const cloudinaryController = require('./services/cloudinary-controller')
const imageKitController = require('./services/imagekit-controller')

const HostController = {
  get: () => {
    return configs.get(collectionName)
  },

  getMapped: () => {
    let hosts = configs.get(collectionName)
    let mapped = _.map(hosts, (host) => {
      let title = HostType.get(host.type).key
      if (host.label.length > 0) {
        title += ' (' + host.label + ')'
      }
      return {
        name: title,
        value: { title, host }
      }
    })

    return _.sortBy(mapped, 'name')
  },

  add: (host) => {
    let hosts = configs.get(collectionName)
    host.id = host.id || uniqueString()
    hosts.push(host)
    configs.set(collectionName, hosts)
  },

  update: (host) => {
    let hosts = configs.get(collectionName)
    let index = _.findIndex(hosts, { id: host.id })
    hosts.splice(index, 1, host)
    configs.set(collectionName, hosts)
  },

  delete: (host) => {
    let hosts = configs.get(collectionName)
    let index = _.findIndex(hosts, { id: host.id })
    hosts.splice(index, 1)
    configs.set(collectionName, hosts)
  },

  test: (host) => {
    let type = HostType.get(host.type)
    if (!type) {
      throw new Error('Invalid host type')
    }

    switch (type) {
      case HostType.S3:
        return awsController.test(host)
      case HostType.Cloudinary:
        return cloudinaryController.test(host)
      case HostType.ImageKit:
        return imageKitController.test(host)
    }
  }
}

module.exports = HostController
