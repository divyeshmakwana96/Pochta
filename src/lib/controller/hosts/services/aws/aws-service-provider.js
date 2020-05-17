const path = require('path')
const fs = require('fs')
const AWS = require('aws-sdk')
const APIServiceProvider = require('../../../api-service-provider')

AWS.config.setPromisesDependency(require('bluebird'))

class AWSServiceProvider extends APIServiceProvider {
  test() {
    const s3 = new AWS.S3({
      accessKeyId: this.object.accessKeyId,
      secretAccessKey: this.object.secretAccessKey
    })

    const params = {
      Bucket: this.object.bucketName,
      Key: 'TEST-FILE', // File name you want to save as in S3
      Body: Buffer.alloc(0)
    }

    return s3.upload(params).promise()
  }

  upload(filepath, dir) {
    const s3 = new AWS.S3({
      accessKeyId: this.object.accessKeyId,
      secretAccessKey: this.object.secretAccessKey
    })

    const params = {
      Bucket: this.object.bucketName,
      Key: path.join(dir, path.basename(filepath)),
      Body: fs.createReadStream(filepath)
    }

    return s3.upload(params).promise()
  }
}

module.exports = AWSServiceProvider
