import Host from './base'
import { HostType } from '../../enums'

module.exports = class extends Host {
  constructor(label, bucketName, accessKeyId, secretAccessKey) {
    super(HostType.S3, label)
    this.bucketName = bucketName
    this.accessKeyId = accessKeyId
    this.secretAccessKey = secretAccessKey
  }
}
