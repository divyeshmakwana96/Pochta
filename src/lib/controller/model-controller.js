const packageJson = require('../../../package.json')
const configstore = require('configstore')

const uniqueString = require('unique-string')
const chalk = require('chalk')
const _ = require('lodash')

class ModelController {
  constructor(collectionKey) {
    this.collectionKey = collectionKey
    this.configs = new configstore(packageJson.name + '-' + collectionKey, { [collectionKey]: [] })
  }

  get() {
    return this.configs.get(this.collectionKey)
  }

  getMapped() {
    let objects = this.configs.get(this.collectionKey)
    let mapped = _.map(objects, (object) => {
      let title = this.getTitle(object)
      if (object.label && object.label.length > 0) {
        title += ' (' + object.label + ')'
      }

      // Highlight if from a connection
      let name = (object.connection && object.connection.id) ? chalk.yellow(title) : title

      return {
        name: name,
        value: { title, object }
      }
    })
    return _.sortBy(mapped, 'value.title')
  }

  add(object) {
    let objects = this.configs.get(this.collectionKey)
    object.id = object.id || uniqueString()
    objects.push(object)
    this.configs.set(this.collectionKey, objects)
  }

  update(object) {
    let objects = this.configs.get(this.collectionKey)
    let index = _.findIndex(objects, { id: object.id })
    objects.splice(index, 1, object)
    this.configs.set(this.collectionKey, objects)
  }

  delete(object) {
    let objects = this.configs.get(this.collectionKey)
    let index = _.findIndex(objects, { id: object.id })
    objects.splice(index, 1)
    this.configs.set(this.collectionKey, objects)
  }

  // Getters
  getTitle(object) {
    return object.name || object.type || 'Unknown Profile'
  }
}

module.exports = ModelController
