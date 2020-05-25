const fs = require('fs')
const _path = require('./path')
const _ = require('lodash')

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
  let dirs = _.split(path, _path.sep)

  let currentPath = ''
  dirs.forEach(dir => {
    let makePath = _path.join(currentPath, dir)
    if (!fs.existsSync(makePath)) { fs.mkdirSync(makePath) }
    currentPath = makePath
  })
}

module.exports = {
  ...fs,
  isDir,
  readFileSyncBase64,
  base64Encoded,
  mkdirSyncIfNeeded
}
