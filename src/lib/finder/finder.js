const fs = require('../helpers/fs')
const path = require('../helpers/path')

const _ = require('lodash')

const finder = {
  defaultHtmlFileNames: ['index.mjml', 'default.mjml', 'main.mjml', 'index.html', 'default.html', 'main.html'],

  files: (dir = '.', options) => {

    if (!fs.isDir(dir)) {
      throw new Error(`${dir} is not a directory`)
    }

    let recursive = options && options.recursive || false
    let types = options && options.types

    let files = fs.readdirSync(dir, { withFileTypes: true })
    let out = []
    files.forEach((file) => {
      let _path = path.join(dir, file.name)

      if (file.isDirectory() && recursive) {
        out = _.concat(out, finder.files(_path, options))
      } else {
        if (!types || (types && _.includes(types, path.extension(_path)))) {
          out.push({
            name: file.name,
            path: _path
          })
        }
      }
    })

    return out
  }
}

module.exports = finder
