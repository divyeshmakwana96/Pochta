const inquirer = require('inquirer')

const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

module.exports = {

  // Question for rendering HTML/MJML files
  askFileSelection: (files) => {

    let choices = []
    let html = []

    files.forEach((file) => {
      if (file.endsWith('.html')) {
        html.push(file)
      } else if (file.endsWith('.mjml')) {
        choices.push(file)
      }
    })

    if (html.length > 0) {
      if (choices.length > 0) {
        choices.push(new inquirer.Separator()) // separator not needed if there aren't any mjml files
      }
      choices = choices.concat(html)
    }

    const question = [
      {
        name: 'file',
        type: 'list',
        message: 'Which file would you like to test send?',
        choices: choices,
        default: 'index.mjml'
      }
    ]

    return inquirer.prompt(question)
  },

  // Question for image optimization
  askFileImageOptimization: () => {

    const question = [
      {
        name: 'optimize',
        type: 'confirm',
        message: 'Would you like to optimize images?',
        default: true
      }
    ]

    return inquirer.prompt(question)
  },

  setupGlobalProfile: () => {
    const questions = [
      {
        name: 'name',
        type: 'input',
        message: 'Enter your name:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter your name.'
          }
        }
      },
      {
        name: 'email',
        type: 'input',
        message: 'Enter your email address:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter your name.'
          }
        }
      },
      // *
      // Image hosts provider
      {
        name: 'host',
        type: 'list',
        message: 'Preferred image hosts provider:',
        choices: ['Cloudinary']
      },
      {
        name: 'cloudinary.cloud_name',
        type: 'input',
        message: 'Enter cloud name for Cloudinary:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter a valid cloud name.'
          }
        },
        when: (answers) => { return answers.hosting === "Cloudinary" }
      },
      {
        name: 'cloudinary.api_key',
        type: 'input',
        message: 'Enter API key for Cloudinary:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter a valid API key.'
          }
        },
        when: (answers) => { return answers.hosting === "Cloudinary" }
      },
      {
        name: 'cloudinary.api_secret',
        type: 'input',
        message: 'Enter API secret for Cloudinary:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter a valid API secret.'
          }
        },
        when: (answers) => { return answers.hosting === "Cloudinary" }
      },
      // *
      // Mail service provider
      {
        name: 'mailer',
        type: 'list',
        message: 'Preferred email delivery service provider:',
        choices: ['Mailjet']
      },
      {
        name: 'mailjet.from',
        type: 'input',
        message: 'Enter sender email address:',
        validate: (value) => {
          if (value.match(mailFormat)) {
            return true
          } else {
            return 'Please enter a valid email address.'
          }
        },
        when: (answers) => { return answers.mailer === "Mailjet" }
      },
      {
        name: 'mailjet.api_key',
        type: 'input',
        message: 'Enter API key for Mailjet:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter a valid API key.'
          }
        },
        when: (answers) => { return answers.mailer === "Mailjet" }
      },
      {
        name: 'mailjet.api_secret',
        type: 'input',
        message: 'Enter API secret for Mailjet:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter a valid API secret.'
          }
        },
        when: (answers) => { return answers.mailer === "Mailjet" }
      }
    ]
    return inquirer.prompt(questions)
  },

  // HELPERS
  collectSubject: async () => {
    const prompts = [
      {
        name: 'subject',
        type: 'input',
        message: 'Enter a subject:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter a valid subject.'
          }
        }
      }
    ]

    return inquirer.prompt(prompts)
  },

  shouldCollectCC: async () => {
    const prompts = [
      {
        name: 'add',
        type: 'confirm',
        message: 'Want to add cc?'
      }
    ]

    return inquirer.prompt(prompts)
  },

  collectRecipient: async () => {
    const prompts = [
      {
        name: 'name',
        type: 'input',
        message: 'Enter recipient\'s name:',
        validate: function( value ) {
          if (value.length) {
            return true
          } else {
            return 'Please enter a valid recipient name.'
          }
        }
      },
      {
        name: 'email',
        type: 'input',
        message: 'Enter recipient\'s email address:',
        validate: (value) => {
          if (value.match(mailFormat)) {
            return true
          } else {
            return 'Please enter a valid email address.'
          }
        }
      },
      {
        name: 'more',
        type: 'confirm',
        message: 'Add new recipient?'
      }
    ]

    return inquirer.prompt(prompts)
  }
}
