/* @flow */

const identity = require('lodash/identity')
const { AssertionError } = require('assert')

/**
 * verifies that executing `resolver` on `actual` results in a truthy value
 *
 * @throws {AssertionError} test failure
 * @example
 * import assert from 'secondwheel/assert'
 *
 * describe('assert', () => {
 *   it('should be less than a 1000', () => {
 *     assert(100, value => value < 1000)
 *   })
 * })
 */
const assert = /*:: <T: any> */(
  actual/*: T */,
  resolver/*:: ?:(actual: T) => any */ = identity,
  message/*:: ?:string */ = 'expected value to be truthy'
) => {
  if (!resolver(actual)) throw new AssertionError({ message, actual })
}

module.exports = assert
