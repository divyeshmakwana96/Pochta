const fs = require('fs')
const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('.pochta')
const db = low(adapter)

db._.mixin(lodashId)

module.exports = {
  getCloudanaryImage: (path, lastModified) => {

    const date = new Date(lastModified).getTime()
    console.log(date)

    const uploads = db
        .defaults({ uploads: [] })
        .get('uploads')

    return uploads
        .find({ path, date })
        .value()
  },

  setCloudanaryImage: (path, remoteImage) => {

    const uploads = db
        .defaults({ uploads: [] })
        .get('uploads')

    const lastModified = fs.statSync(path).mtime
    const date = new Date(lastModified).getTime()

    const find = uploads.find({ path: path }).value()
    if (find) {
      console.log('found')
      let result = uploads.updateWhere({ path }, { remoteImage, date })
          .write()

      console.log(result)
    } else {
      console.log('inserting')
      uploads.insert({ path, remoteImage, date})
          .write()
    }
  }
}
