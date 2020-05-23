const crypto = require('crypto')
const cryptoRandomString = require('crypto-random-string');
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

function randomString(length) {
  return cryptoRandomString({ length: length || 32 })
}

module.exports = {
  md5Hash,
  sha256Hash,
  randomString,
  hashForFileAtPath
}
