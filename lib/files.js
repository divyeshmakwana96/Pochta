const fs = require('fs')
const path = require('path')

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd())
  },

  fileExists: (filePath) => {
    return fs.existsSync(filePath)
  },

  writeConfig: (config) => {
    fs.writeFileSync('.config', JSON.stringify(config))
  },
  readConfig: () => {
    return JSON.parse(fs.readFileSync('.config'))
  }
}
