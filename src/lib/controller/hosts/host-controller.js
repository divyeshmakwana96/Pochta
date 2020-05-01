const configstore = require('configstore')
const packageJson = require('../../../../package.json')
const configs = new configstore(packageJson.name + '-hosts', { hosts: [] })
const uniqueString = require('unique-string')

const ora = require('ora')
const chalk = require('chalk')
const _ = require('lodash')

const HostType = require('../../enums').HostType

const inquirer = require('../../inquirer/hosts')
const awsController = require('./services/aws-controller')
const cloudinaryController = require('./services/cloudinary-controller')
const imageKitController = require('./services/imagekit-controller')

const HostController = {
  get: () => {
    return configs.get('hosts')
  },
  getMapped: () => {
    let hosts = configs.get('hosts')
    return _.map(hosts, (host) => {
      let title = HostType.get(host.type).key
      if (host.label.length > 0) {
        title += ' (' + host.label + ')'
      }
      return {
        title: title,
        host: host
      }
    })
  },
  add: (host) => {
    let hosts = configs.get('hosts')
    host.id = host.id || uniqueString()
    hosts.push(host)
    configs.set('hosts', hosts)
  },
  update: (host) => {
    let hosts = configs.get('hosts')
    let index = _.findIndex(hosts, { id: host.id })
    hosts.splice(index, 1, host)
    configs.set('hosts', hosts)
  },
  delete: (host) => {
    let hosts = configs.get('hosts')
    let index = _.findIndex(hosts, { id: host.id })
    hosts.splice(index, 1)
    configs.set('hosts', hosts)
  },
  test: (host) => {
    let type = HostType.get(host.type)
    switch (type) {
      case HostType.S3:
        return awsController.test(host)
      case HostType.Cloudinary:
        return cloudinaryController.test(host)
        break
      case HostType.ImageKit:
        return imageKitController.test(host)
        break
    }
    return Promise.reject('Invalid host type')
  }
}

module.exports = HostController
