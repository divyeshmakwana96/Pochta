const cloudinary = require('cloudinary').v2
const _ = require('lodash')
const { uuid } = require('uuidv4')

module.exports = {

  upload: (config, files, tags, folder, callback) => {
    cloudinary.config(config)

    const uploads = []
    let responseCount = 0

    // generate public ids and map
    try {
      files.forEach(function (file) {

        let id = uuid()
        uploads.push({id, file})

        console.log("uploading file: " + file)
        let options = { tags: tags, folder: folder, context: "id=" + id, overwrite: true }
        cloudinary.uploader.upload(file, options, function (err, image) {

          if (err) {
            throw err
          }

          if (image && image.context.custom.id) {
            let upload = _.find(uploads, ['id', image.context.custom.id])
            if (upload) {
              upload.image = image
            }
          }

          // increment response count
          responseCount++
          if (responseCount == files.length) {
            callback(undefined, uploads)
          }
        })
      })
    }
    catch (error) {
      callback(error, undefined)
    }
  },
}
