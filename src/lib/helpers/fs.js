const fs = require('fs')
const _path = require('./path')

function isDir(path) {
  return fs.statSync(path).isDirectory()
}

function readFileSyncBase64(path) {
  return fs.readFileSync(path, { encoding: 'base64' })
}

function base64Encoded(path) {
  return `data:${_path.mimeType(path)};base64,${fs.readFileSync(path, { encoding: 'base64' })}`
}

function mkdirSyncIfNeeded(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

module.exports = {
  ...fs,
  isDir,
  readFileSyncBase64,
  base64Encoded,
  mkdirSyncIfNeeded
}
