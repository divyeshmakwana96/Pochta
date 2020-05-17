const fs = require('../helpers/fs')
const path = require('path')

const _ = require('lodash')

module.exports = {
  files: (dir = './', types = ['html', 'mjml'], recursive = false) => {
    if (!fs.isDir(dir)) {
      throw new Error(`${dir} is not a directory`)
    }

    return _.map(_.filter(fs.readdirSync(dir, { withFileTypes: true }), file => {
      return !file.isDirectory() && _.includes(types, file.name.split('.').pop())
    }), (file) => {
      return {
        name: file.name,
        path: path.join(dir, file.name)
      }
    })
  },

    findFilesInDirectory: (dir) => {
        return new Promise((resolve, reject) => {

            fs.stat(dir, (err, stats) => {

                if (err) {
                    reject(err)
                } else if (stats.isDirectory()) {
                    // read files
                    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
                        if (err) {
                            reject(err)
                        } else {
                            let filtered = _.filter(files, (file) => {
                                return !((/(^|\/)\.[^\/\.]/g).test(file.name) || file.isDirectory())
                                    && (/^.*\.(mjml|html)$/).test(file.name)
                            })

                            if (filtered.length > 0) {
                                resolve(_.map(filtered, (file) => { return file.name }))
                            } else {
                                reject('Directory must contain mjml or html files')
                            }
                        }
                    })
                } else {
                    reject('Provided path must be a directory')
                }
            })
        })
    }
}
