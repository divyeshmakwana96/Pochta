const fs = require('fs')
const path = require('path')

const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('.cache')
const db = low(adapter)

db._.mixin(lodashId)

module.exports = {

    // The function upload images if new or modified
    analyzeImagePaths: (baseDir, html, paths) => {
        return new Promise((resolve, reject) => {

            let uploadable = []
            paths.forEach((imagePath) => {
                const finalImagePath = path.join(baseDir, imagePath)
                const lastModified = fs.statSync(finalImagePath).mtime
                const date = new Date(lastModified).getTime()

                const uploads = db
                    .defaults({ uploads: [] })
                    .get('uploads')

                const find = uploads.find({ path: imagePath }).value()
                if (!find || (find && find.date !== date)) {
                    uploadable.push(imagePath)
                }
            })

            resolve({html, uploadable})
        })
    },

    // save to database
    cacheUploads: (baseDir, uploads, html) => {

        return new Promise((resolve, reject) => {

            const cache = db
                .defaults({ uploads: [] })
                .get('uploads')

            uploads.forEach((upload) => {
                const finalImagePath = path.join(baseDir, upload.path)
                const lastModified = fs.statSync(finalImagePath).mtime
                const date = new Date(lastModified).getTime()

                Object.assign(upload, { date })
                cache.upsert(upload).write()
            })

            resolve({html, cache: cache.value()})
        })
    }
}