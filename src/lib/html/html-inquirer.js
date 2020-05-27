const inquirer = require('inquirer')
const validator = require('validator')
const _ = require('lodash')

class HTMLInquirer {
  // minify
  askShouldMinify(shouldMinify = false) {
    const question = [
      {
        name: 'minify',
        type: 'confirm',
        message: 'Would you like to minify HTML?',
        default: shouldMinify
      }
    ]
    return inquirer.prompt(question)
  }

  // ask subject
  askSubjectLine(subject) {
    subject = _.trim(subject)
    const question = [
      {
        name: 'subject',
        type: 'input',
        message: 'Enter a subject line:',
        validate: subject => !validator.isEmpty(subject, { ignore_whitespace: true }) || 'Enter a valid subject line',
        default: _.trim(subject) || '[TEST]'
      }
    ]
    return inquirer.prompt(question)
  }
}

module.exports = HTMLInquirer
