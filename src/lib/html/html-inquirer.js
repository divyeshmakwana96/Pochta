const inquirer = require('inquirer')

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
    const question = [
      {
        name: 'subject',
        type: 'input',
        message: 'Enter a subject line:',
        validate: key => {
          return !validator.isEmpty(key, { ignore_whitespace: true }) || 'Enter a valid subject line'
        },
        default: subject || '[TEST]'
      }
    ]
    return inquirer.prompt(question)
  }
}

module.exports = HTMLInquirer
