const inquirer = require('inquirer')
const chalk = require('chalk')
const _ = require('lodash')

const OptionType = require('../enums').OptionType

class CrudInquirer {

  constructor(entityName , objectOptions) {
    this.entityName = entityName
    this.objectOptions = objectOptions || [OptionType.View, OptionType.Edit, OptionType.Delete]
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
    const options = _.map(this.objectOptions, (enm) => {
      return {
        name: enm.key,
        value: enm
      }
    })

    options.push(new inquirer.Separator())
    options.push('Cancel')


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

  askSetupQuestions(object) {
    console.log('controller needs to override setup method')
  }
}

module.exports = CrudInquirer
