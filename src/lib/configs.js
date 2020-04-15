const chalk = require('chalk')

const configstore = require('configstore')
const configs = new configstore('pochta')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('.config')
const db = low(adapter)

const inquirer = require('./inquirer')

module.exports = {

  getStoredGlobalProfile: () => {
    return configs.get('profile')
  },

  getGlobalProfile: async () => {
    console.log(chalk.inverse("⣿⣿⣿ Global Profile ⣿⣿⣿"))

    const profile = await inquirer.setupGlobalProfile()
    Object.assign(profile, {version: 1.0})
    configs.set('profile', profile)
    return profile
  },

  getStoredLocalProfile: () => {
    const config = db
        .get('profile')
        .value()
    return config
  },

  getLocalProfile: async () => {
    console.log(chalk.inverse("⣿⣿⣿ Project Settings ⣿⣿⣿"))

    // subject
    const subject = await inquirer.collectSubject()
    let config = { subject: subject.subject }

    // to
    let toRecipients = []
    console.log(chalk.underline("TO:"))
    let shouldContinue = true
    while (shouldContinue) {
      const recipient = await inquirer.collectRecipient()
      toRecipients.push({ name: recipient.name, email: recipient.email })
      shouldContinue = recipient.more
    }

    config.to = toRecipients

    // cc
    const cc = await inquirer.shouldCollectCC()
    if (cc.add) {
      let ccRecipients = []
      console.log(chalk.underline("CC:"))
      shouldContinue = true
      while (shouldContinue) {
        const recipient = await inquirer.collectRecipient()
        ccRecipients.push({ name: recipient.name, email: recipient.email })
        shouldContinue = recipient.more
      }

      config.cc = ccRecipients
    }

    db.set('profile', config).write()
    return config
  }
}
