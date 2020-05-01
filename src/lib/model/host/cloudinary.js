import Host from './base'
import { HostType } from '../../enums'

module.exports = class extends Host {
  constructor(label, cloudName, apiKey, apiSecret) {
    super(HostType.CLOUDINARY, label)
    this.cloudName = cloudName
    this.apiKey = apiKey
    this.apiSecret = apiSecret
  }
}
