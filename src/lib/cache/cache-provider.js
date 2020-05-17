const fs = require('fs')
const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

class CacheProvider {

  constructor(name) {
    this.db = low(new FileSync(name || '.pochta'))
    this.db._.mixin(lodashId)
    this.db.defaults({ meta: {}, uploads: [] }).write()
  }
}

module.exports = CacheProvider
