const ora = require('ora')
const _ = require('lodash')

async function task(promise, loadingMsg, successMsg, errorFormatter) {
  let spinner = ora(loadingMsg || 'loading..').start()

  let out
  await promise.then(res => {
    spinner.succeed(successMsg || 'success!!')
    out = res
  }).catch(e => {
    let errorMsg = _.isFunction(errorFormatter) ? errorFormatter(e) : errorFormatter
    spinner.fail(errorMsg || 'error!!')
  })
  return out
}

module.exports = {
  spinner: ora,
  task
}
