const chalk = require('chalk')
const header = chalk.cyan('[electron-aware]')
const error = chalk.red

/**
 * Logs messages to the console.
 * @param {String} message - Message to be printed to the console.
 * @param {Boolean} [isError] - Determines if the message to be printed is an error message.
 * @returns {Void}
 */
let logger = (message, isError = false) => {
  const text = isError ? error(`(ERROR) ${message}`) : message
  if (logger.enabled) console.log(`${header} - ${text}`)
}

/**
 * @property - Enables or disables the logger.
 */
logger.enabled = true

module.exports = logger
