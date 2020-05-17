const fs = require('fs')

function isDir(path) {
  return fs.statSync(path).isDirectory()
}

function readFileSyncBase64(path) {
  return fs.readFileSync(path, { encoding: 'base64' })
}

module.exports = {
  ...fs,
  isDir,
  readFileSyncBase64
}
