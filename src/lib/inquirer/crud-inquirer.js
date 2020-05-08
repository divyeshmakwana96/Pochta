const inquirer = require('inquirer')
const chalk = require('chalk')
const _ = require('lodash')

const OptionType = require('../enums').OptionType

class CrudInquirer {

  constructor(entityName , hasConnectionTestOption) {
    this.entityName = entityName
    this.hasConnectionTestOption = hasConnectionTestOption
  }

  askSelection(objects) {
    if (objects && objects.length > 0) {
      const question = [
        {
          name: 'profile',
          type: 'list',
          message: `Which ${this.entityName || 'profile'} would you like to select?`,
          choices: objects
        }
      ]
      return inquirer.prompt(question)
    } else {
      throw new Error(`${entityName} list empty`)
    }
  }

  askOptions(title) {
    let options = [OptionType.View, OptionType.Edit, OptionType.Delete, OptionType.Cancel]
    if (this.hasConnectionTestOption) {
      options.splice(3, 0, OptionType.Test)
    }

    const question = [
      {
        name: 'option',
        type: 'list',
        message: `What would you like to do with ${chalk.cyan(title)}?`,
        choices: _.map(options, (enm) => {
          return {
            name: enm.key,
            value: enm
          }
        })
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

  askSetupQuestions(object) {
    console.log('controller needs to override setup method')
  }
}

module.exports = CrudInquirer
