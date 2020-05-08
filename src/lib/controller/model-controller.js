const packageJson = require('../../../package.json')
const configstore = require('configstore')

const uniqueString = require('unique-string')
const _ = require('lodash')

class ModelController {
  constructor(collectionKey) {
    this.collectionKey = collectionKey
    this.configs = new configstore(packageJson.name + '-' + collectionKey, { [collectionKey]: [] })
  }

  getMapped() {
    let objects = this.configs.get(this.collectionKey)
    let mapped = _.map(objects, (object) => {
      let title = object.name || object.type || 'Unknown Profile'
      if (object.label && object.label.length > 0) {
        title += ' (' + object.label + ')'
      }
      return {
        name: title,
        value: { title, object }
      }
    })
    return _.sortBy(mapped, 'name')
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
}

module.exports = ModelController
