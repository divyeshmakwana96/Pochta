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
        name: title,
        value: { title, host }
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

  test: async (host) => {
    return new Promise((resolve, reject) => {
      const spinner = ora('testing...').start()

      function handleResponse(response) {
        spinner.succeed('Connection successful!!')
        resolve(response)
      }

      let type = HostType.get(host.type)
      if (!type) {
        reject(new Error('Invalid host type'))
      }

      try {
        switch (type) {
          case HostType.S3:
            awsController.test(host).then(res => handleResponse(res))
            break
          case HostType.Cloudinary:
            cloudinaryController.test(host).then(res => handleResponse(res))
            break
          case HostType.ImageKit:
            imageKitController.test(host).then(res => handleResponse(res))
            break
        }
      } catch (e) {
        spinner.fail('Connection failed!! Reason: ' + e)
        reject(e)
      }
    })
  }
}

module.exports = HostController
