const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

module.exports = {
  database: (path, name) => {
    const adapter = new FileSync(path)
    const db = low(adapter)
    db._.mixin(lodashId)
    return db
  }
}
