const inquirer = require('inquirer')
const chalk = require('chalk')
const _ = require('lodash')

const OptionType = require('../enums').OptionType

class CrudInquirer {

  constructor(entityName , objectOptions) {
    this.entityName = entityName
    this.objectOptions = objectOptions || [OptionType.View, OptionType.Edit, OptionType.Delete]
  }

  askSelection(objects, message) {
    if (objects && objects.length > 0) {
      const question = [
        {
          name: 'profile',
          type: 'list',
          message: message || `Which ${this.entityName || 'profile'} would you like to select?`,
          choices: objects
        }
      ]
      return inquirer.prompt(question)
    } else {
      throw new Error(`${this.entityName} list empty`)
    }
  }

  askOptions(title) {
    this.objectOptions.push(OptionType.Cancel)
    const options = _.map(this.objectOptions, (enm) => {
      return {
        name: enm.key,
        value: enm
      }
    })

    if (options.length > 2) {
      options.splice(options.length - 1, 0, new inquirer.Separator())
    }

    const question = [
      {
        name: 'option',
        type: 'list',
        message: `What would you like to do with ${chalk.cyan(title)}?`,
        choices: options
      }
    ]
    return inquirer.prompt(question)
  }

  askDeleteConfirm(title) {
    const question = [
      {
        name: 'confirm',
        type: 'confirm',
        message: `Are you sure you want to delete ${chalk.cyan(title)}?`
      }
    ]
    return inquirer.prompt(question)
  }

  askConnectionTestConfirm() {
    const question = [
      {
        name: 'confirm',
        type: 'confirm',
        message: `Would you like to test this ${this.entityName || 'profile'}?`
      }
    ]
    return inquirer.prompt(question)
  }

  askSetupQuestions(object) {
    console.log('controller needs to override setup method')
  }
}

module.exports = CrudInquirer
