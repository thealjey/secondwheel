/* @flow */

const assert = require('./assert')
const isString = require('lodash/isString')

/**
 * verifies that `actual` is a string
 *
 * @throws {AssertionError} test failure
 * @example
 * import assertString from 'secondwheel/assertString'
 *
 * describe('assertString', () => {
 *   it('should be a string', () => {
 *     assertString('')
 *   })
 * })
 */
const assertString = (
  actual/*: any */,
  message/*:: ?:string */ = 'expected value to be a string'
) => {
  assert(actual, isString, message)
}

module.exports = assertString
