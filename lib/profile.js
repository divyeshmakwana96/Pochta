const inquirer = require('./inquirer')
const configstore = require('configstore')
const configs = new configstore('pochta')

module.exports = {

  getStoredGlobalProfile: () => {
    return configs.get('profile')
  },
  getGlobalProfile: async () => {
    const profile = await inquirer.setupGlobalProfile()
    configs.set('profile', profile)
    return profile
  }
}
