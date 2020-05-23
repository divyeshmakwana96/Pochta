const SMTPServiceProvider = require("../smtp/smtp-service-provider")
const nodemailer = require("nodemailer")
let AWS = require('aws-sdk')
const _ = require('lodash')

class SESServiceProvider extends SMTPServiceProvider {
  constructor(object) {

    super(object, nodemailer.createTransport({
      SES: new AWS.SES({
        apiVersion: '2010-12-01',
        accessKeyId: object.config.accessKeyId,
        secretAccessKey: object.config.secretAccessKey,
        region: object.config.region
      })
    }))
  }
}

module.exports = SESServiceProvider
