/* @flow */

const assert = require('./assert')
const isArray = require('lodash/isArray')

/**
 * verifies that `actual` is an array
 *
 * @throws {AssertionError} test failure
 * @example
 * import assertArray from 'secondwheel/assertArray'
 *
 * describe('assertArray', () => {
 *   it('should be an array', () => {
 *     assertArray([])
 *   })
 * })
 */
const assertArray = (
  actual/*: any */,
  message/*:: ?:string */ = 'expected value to be an array'
) => {
  assert(actual, isArray, message)
}

module.exports = assertArray
