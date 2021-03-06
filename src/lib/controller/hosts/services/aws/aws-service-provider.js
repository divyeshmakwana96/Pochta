const path = require('../../../../helpers/path')
const _ = require('lodash')
const fs = require('fs')
const AWS = require('aws-sdk')
const APIServiceProvider = require('../../../api-service-provider')

AWS.config.setPromisesDependency(require('bluebird'))

class AWSServiceProvider extends APIServiceProvider {
  test() {
    const params = {
      Bucket: this.object.config.bucketName,
      Key: 'TEST-FILE', // File name you want to save as in S3
      Body: Buffer.alloc(0)
    }

    return this.getS3().upload(params).promise()
  }

  upload(filepath, dir, tags) {

    let filename = path.basename(filepath)

    const params = {
      Bucket: this.object.config.bucketName,
      Key: dir && path.join(dir, filename) || filepath,
      ContentType: path.mimeType(filepath),
      Body: fs.createReadStream(filepath),
      ACL: 'public-read',
      Tagging: tags && _.join(_.map(tags, tag => `${encodeURIComponent(tag.key)}=${encodeURIComponent(tag.value)}`), '&')
    }

    return this.getS3().upload(params, tags).promise()
  }

  getS3() {
    return new AWS.S3({
      accessKeyId: this.object.config.accessKeyId,
      secretAccessKey: this.object.config.secretAccessKey
    })
  }
}

module.exports = AWSServiceProvider
