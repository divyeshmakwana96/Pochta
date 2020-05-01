import Host from './base'
import { HostType } from '../../enums'

module.exports = class extends Host {
  constructor(label, privateKey) {
    super(HostType.IMAGEKIT, label)
    this.privateKey = privateKey
  }
}
