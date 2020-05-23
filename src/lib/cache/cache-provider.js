const low = require('lowdb')
const _ = require('lodash')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

class CacheProvider {

  constructor(name) {
    this.db = low(new FileSync(name || '.pochta'))
    this.db._.mixin(lodashId)
    this.db.defaults({ meta: {}, uploads: [] }).write()
  }

  setMeta(key, value) {
    this.db.set(`meta.${key}`, value).write()
  }

  getMeta(key) {
    return this.db.get(`meta.${key}`).value()
  }

  /*
  setFile(file) {
    this.db.set('meta.file', file.path).write()
  }


  getFile() {
    return this.db.get('meta.file').value()
  }

  setHost(host) {
    this.db.set('meta.host.id', host.id).write()
  }

  getHostId() {
    return this.db.get('meta.host.id').value()
  }

  setUploadPath(path) {
    this.db.set('meta.host.path', path).write()
  }

  getUploadPath() {
    return this.db.get('meta.host.path').value()
  }

  setProfile(profile) {
    this.db.set('meta.profile', profile.id).write()
  }

  getProfileId() {
    return this.db.get('meta.profile').value()
  }

  setESP(esp) {
    this.db.set('meta.esp', esp.id).write()
  }

  getESPId() {
    return this.db.get('meta.esp').value()
  }

  setTo(tos) {
    this.db.set('meta.to', _.map(tos, (to) => { to.id })).write()
  }

  getToIds() {
    return this.db.get('meta.to').value()
  }

  setCc(ccs) {
    this.db.set('meta.cc', _.map(ccs, (cc) => { cc.id })).write()
  }

  getCCIds() {
    return this.db.get('meta.cc').value()
  }

  setAutoCc(autoCc) {
    this.db.set('meta.autoCc', autoCc).write()
  }

  getAutoCc() {
    return this.db.get('meta.autoCc').value()
  }

  setAutoReplyTo(autoReplyTo) {
    this.db.set('meta.autoReplyTo', autoReplyTo).write()
  }

  getAutoReplyTo() {
    return this.db.get('meta.autoReplyTo').value()
  }
   */

}

module.exports = CacheProvider
