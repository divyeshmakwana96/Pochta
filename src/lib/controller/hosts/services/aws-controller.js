const AWS = require('aws-sdk')
const APIController = require('../../api-controller')

AWS.config.setPromisesDependency(require('bluebird'))

class AWSController extends APIController {
  test(payload) {
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
}

module.exports = AWSController
