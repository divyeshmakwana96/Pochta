const crypto = require('crypto')
const path = require('path')

const cliProgress = require('cli-progress')
const cloudinary = require('cloudinary').v2
const _ = require('lodash')

module.exports = {

  uploadToCloudinary: async (configs, baseDir, files, html) => {

    let uploads = []

    if (files.length > 0) {

      let progress = new cliProgress.SingleBar({
        clearOnComplete: true,
        format: 'Uploading images... [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | File: {filename}'
      }, cliProgress.Presets.shades_classic)

      progress.start(files.length, 0, {
        filename: path.basename(files[0])
      })

      // Loop through each files
      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        let hash = crypto.createHash('md5').update(file).digest("hex")
        let day = new Date().toISOString().slice(0, 10)

        let folder = path.join('pochta', day, hash)
        let actualPath = path.join(baseDir, file)

        let image = await _uploadToCloudanary(configs, actualPath, folder, ['pochta'])
        if (image != null) {
          uploads.push({
            id: hash,
            path: file,
            url: image.secure_url
          })
        }

        // update progress bar
        let next = i + 1
        let filename = (next < files.length) ? files[next] : file
        progress.increment(1, { filename: path.basename(filename) })
      }

      progress.stop()
    }

    return { html, uploads }
  }
}

// Private functions
function _uploadToCloudanary(configs, path, folder, tags) {
  return new Promise((resolve, reject) => {
    cloudinary.config(configs)
    let options = { tags: tags, folder: folder, overwrite: true }
    cloudinary.uploader.upload(path, options, function (err, image) {
      if (err) {
        reject(err)
      } else {
        resolve(image)
      }
    })
  })
}
