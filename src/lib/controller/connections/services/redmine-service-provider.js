const axios = require('axios')
const uniqueString = require('unique-string')
const _ = require('lodash')

const APIController = require('../../api-service-provider')

const ProfileController = require('../../profiles/profile-controller')
const ContactController = require('../../contacts/contact-controller')

class RedmineServiceProvider extends APIController {
  test() {
    return axios.get('/my/account.json', {
      auth: {
        username: this.object.apiKey,
        password: uniqueString()
      },
      baseURL: this.object.config.baseURL
    })
  }

  async sync() {
    const config = {
      auth: {
        username: this.object.config.apiKey,
        password: uniqueString()
      },
      baseURL: this.object.config.baseURL
    }

    try {
      await axios.all([
        axios.get('/my/account.json', config),
        axios.get('/users.json', config)
      ]).then(res => {
        // 1) profiles
        let account = res[0].data && res[0].data.user
        if (account) {
          this.update([account], new ProfileController())
        }

        // 2) contacts
        let users = res[1].data && res[1].data.users
        if (users) {
          this.update(users, new ContactController())
        }

        // Return Promise
        return Promise.resolve()
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  update(collection, controller) {

    let existing = controller.get()
    let updates = []

    for (let obj of collection) {
      // update
      let update = {
        firstname: obj.firstname,
        lastname: obj.lastname,
        email: obj.mail,
        connection: {
          id: this.object.id,
          refId: obj.id
        }
      }

      let object = _.find(existing, (profile) => {
        return profile.connection && profile.connection.id === this.object.id && profile.connection.refId === obj.id
      })

      if (!object) { object = {} }
      updates.push(_.mergeWith(object, update))
    }

    controller.putBatch(updates)
  }
}

module.exports = RedmineServiceProvider
