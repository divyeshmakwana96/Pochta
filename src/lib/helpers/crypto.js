const crypto = require('crypto')
const fs = require('fs')

function md5Hash(data) {
  return crypto.createHash('md5').update(data).digest("hex")
}

function sha256Hash(data) {
  return crypto.createHash('sha256').update(data).digest("hex")
}

function hashForFileAtPath(filepath, algorithm = 'md5') {
  return crypto.createHash(algorithm).update(fs.readFileSync(filepath)).digest("hex")
}

module.exports = {
  md5Hash,
  sha256Hash,
  hashForFileAtPath
}
