/* @flow */

const repeat = require('lodash/repeat')

/**
 * produces a string of the same length as the original with every character
 * replaced by a `"*"`
 *
 * @example
 * import maskPassword from 'secondwheel/maskPassword'
 *
 * maskPassword('secret') // ******
 */
const maskPassword = (value/*: string */ = '') => repeat('*', value.length)

module.exports = maskPassword
