const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(require('bluebird'))

module.exports = {
  test: (host) => {
    const s3 = new AWS.S3({
      accessKeyId: host.accessKeyId,
      secretAccessKey: host.secretAccessKey
    })

    const params = {
      Bucket: host.bucketName,
      Key: 'TEST-FILE', // File name you want to save as in S3
      Body: Buffer.alloc(0)
    }

    return s3.upload(params).promise()
  }
}
