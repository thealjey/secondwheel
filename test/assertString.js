/* @flow */

const { describe, it } = require('mocha')
const assertString = require('../assertString')
const { strictEqual } = require('assert')

describe('assertString', () => {
  it('should not throw', () => {
    assertString('')
  })

  it('should throw', () => {
    try {
      assertString(42)
    } catch (error) {
      strictEqual(error.name, 'AssertionError [ERR_ASSERTION]')
    }
  })
})
