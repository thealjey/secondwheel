/* @flow */

const isMatchWith = require('lodash/isMatchWith')
const { AssertionError } = require('assert')

/**
 * verifies that `expected` is a subset of `actual`
 *
 * @throws {AssertionError} test failure
 * @example
 * import matching from 'secondwheel/matching'
 *
 * describe('matching', () => {
 *   it('should match', () => {
 *     matching(
 *       { value: ['45'], something: 'here' },
 *       { value: [45] }
 *     )
 *   })
 * })
 */
const matching = (
  actual/*: any */,
  expected/*: any */,
  message/*:: ?:string */ = 'expected values to match'
) => {
  if (!isMatchWith(actual, expected, (a, b) => {
    if (a == b) return true // eslint-disable-line eqeqeq
  })) throw new AssertionError({ message, actual, expected })
}

module.exports = matching
