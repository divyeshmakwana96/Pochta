const axios = require('axios')
const uniqueString = require('unique-string')
const _ = require('lodash')

const APIController = require('../../api-controller')

const ProfileController = require('../../profiles/profile-controller')
const ContactController = require('../../contacts/contact-controller')

class RedmineController extends APIController {
  test() {
    return axios.get('/my/account.json', {
      auth: {
        username: this.object.apiKey,
        password: uniqueString()
      },
      baseURL: this.object.baseURL
    })
  }

  async sync() {
    const config = {
      auth: {
        username: this.object.apiKey,
        password: uniqueString()
      },
      baseURL: this.object.baseURL
    }

    try {
      await axios.all([
        axios.get('/my/account.json', config),
        axios.get('/users.json', config)
      ]).then(res => {
        // 1) profiles
        let account = res[0].data && res[0].data.user
        let profileController = new ProfileController()
        let profiles = profileController.get()
        this.putContact(account, profiles, profileController)

        // 2) contacts
        let contactController = new ContactController()
        let users = res[1].data && res[1].data.users
        if (users) {
          let user

          console.log(users)

          for (user of users) {
            this.putContact(user, users, contactController)
          }
        }
      })

    } catch (e) {
      return Promise.reject(e)
    }

  }

  putContact(contact, list, controller) {
    let existing = _.find(list, (profile) => {
      return profile.connection && profile.connection.id === this.object.id && profile.connection.refId === contact.id
    })

    if (existing) {
      // update
      existing.label = this.object.label
      existing.firstname = contact.firstname
      existing.lastname = contact.lastname
      existing.email = contact.mail
      controller.update(existing)

    } else {
      // add
      let object = {
        label: this.object.label,
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.mail,
        connection: {
          id: this.object.id,
          refId: contact.id
        }
      }
      controller.add(object)
    }
  }
}

module.exports = RedmineController
