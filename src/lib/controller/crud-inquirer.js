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
      throw new Error(`${this.entityName || 'profile'} list empty`)
    }
  }

  askMultiSelection(objects, message, minChoiceCount = 0) {
    if (objects && objects.length > 0) {
      const question = [
        {
          name: 'profile',
          type: 'checkbox',
          message: message || `Select ${this.entityName || 'profile'}s you like to choose:`,
          choices: objects,
          validate: (value) => {
            if (value.length < minChoiceCount) {
              return `Min ${minChoiceCount} selection${minChoiceCount > 0 && 's'} required`
            }
            return  true
          }
        }
      ]
      return inquirer.prompt(question)
    } else {
      throw new Error(`${this.entityName || 'profile'} list empty`)
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
      options.splice(options.length - 1, 0, this.separator())
    }

    // build prompt
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

  // Extra
  separator(separatorString) {
    return new inquirer.Separator(separatorString)
  }


}

module.exports = CrudInquirer
