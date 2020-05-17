const path = require('path')
const mime = require('mime-types')

function filename(filePath, includeExtension = false) {
  return path.basename(filePath, includeExtension ? path.extname(filePath) : null)
}

function extension(filePath) {
  let ext = path.extname(filePath || '').split('.');
  return ext[ext.length - 1]
}

function mimeType(filePath) {
  return mime.lookup(path.extname(filePath))
}

module.exports = {
  ...path,
  filename,
  extension,
  mimeType
}
