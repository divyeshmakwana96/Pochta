const ora = require('ora')
const _ = require('lodash')

module.exports = async (promise, loadingMsg, successMsg, errorFormatter) => {
  let spinner = ora(loadingMsg || 'loading..').start()
  await promise.then(res => {
    spinner.succeed(successMsg || 'success!!')
  }).catch(e => {
    let errorMsg = _.isFunction(errorFormatter) ? errorFormatter(e) : errorFormatter
    spinner.fail(errorMsg || 'error!!')
  })
}
