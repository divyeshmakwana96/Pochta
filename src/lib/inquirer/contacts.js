const inquirer = require('inquirer')
const chalk = require('chalk')

const Inquirer = {
  askContactOptions: (title) => {
    const question = [
      {
        name: 'value',
        type: 'list',
        message: `What would you like to do with ${chalk.cyan(title)}?`,
        choices: ['view', 'edit', 'delete', new inquirer.Separator(), 'cancel']
      }
    ]
    return inquirer.prompt(question)
  },

  askContactSelection: (contacts) => {
    const question = [
      {
        name: 'profile',
        type: 'list',
        message: 'Which contact would you like to view?',
        choices: contacts
      }
    ]
    return inquirer.prompt(question)
  },

  askContactRemoveConfirmation: (title) => {
    const question = [
      {
        name: 'delete',
        type: 'confirm',
        message: `Are you sure you want to delete ${chalk.cyan(title)}?`
      }
    ]
    return inquirer.prompt(question)
  },

  askContactSetupQuestions: (contact) => {
    const questions = [
      {
        name: 'label',
        type: 'input',
        message: `Enter a label ${chalk.gray('(optional)')}:`,
        default: contact && contact.label || null
      },
      {
        name: 'name',
        type: 'input',
        message: 'Enter the name:',
        default: contact && contact.name || null
      },
      {
        name: 'email',
        type: 'input',
        message: 'Enter email address:',
        default: contact && contact.email || null
      }
    ]
    return inquirer.prompt(questions)
  }
}

module.exports = Inquirer
