const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

const inquirer = require('./lib/inquirer')

// local helpers
const files = require('./lib/files')
const profile = require('./lib/profile')
const parser = require('./lib/parser')
const uploader = require('./lib/uploader')

// clear()

// console.log(
//     chalk.yellow(
//         figlet.textSync('Pochta', { horizontalLayout: 'full' })
//     )
// )

/// Upload files
// uploader.upload({
//         cloud_name: 'dadf1dqn7',
//         api_key: '626932881987941',
//         api_secret: '7S6IGTGQjJHVAz55KywLX3OXHWA'
//     },
//     ['tmp/marker.png', 'tmp/pacific_logo.png'],
//     ['pochta', 'cloud', 'upload'],
//     'pochta/test/inner',
//     function (err, images) {
//         console.log(images)
// })

// const run = async () => {
//   let config = await profile.getStoredGlobalProfile()
//   if (!config) {
//     config = await profile.getGlobalProfile()
//   }
//
//   console.log(config)
// }
//
// run()

const run = async () => {

  try {
    parser.parse()
  } catch (e) {
    console.log(chalk.red(e))
  }

  return

  // setup global profile
  let globalProfile = await profile.getStoredGlobalProfile()
  if (!globalProfile) {
    console.log("Let's setup a global profile first.")
    console.log(chalk.bgGreen("Global Profile:"))
    globalProfile = await profile.getGlobalProfile()
  }

  // Create local profile it needed
  let config
  if (!files.fileExists('.config')) {
    console.log("Let's setup project settings.")
    console.log(chalk.bgGreen("Project Settings:"))

    // subject
    const subject = await inquirer.collectSubject()
    config = { subject: subject.subject }

    // to
    let toRecipients = []
    console.log(chalk.bgCyan("TO:"))
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
      console.log(chalk.bgCyan("CC:"))
      shouldContinue = true
      while (shouldContinue) {
        const recipient = await inquirer.collectRecipient()
        ccRecipients.push({ name: recipient.name, email: recipient.email })
        shouldContinue = recipient.more
      }

      config.cc = ccRecipients
    }

    // save to config
    files.writeConfig(config)

  } else {
    config = files.readConfig()
  }

  console.log(config)

  // Check if empty empty

  // console.log(chalk.green("Please enter 'To' Recipients"))
  //
  // while (true) {
  //   await inquirer.collectRecipients()
  // }
  // console.log("end")
}

run()
