/* @flow */

const { describe, it } = require('mocha')
const assertArray = require('../assertArray')
const { strictEqual } = require('assert')

describe('assertArray', () => {
  it('should not throw', () => {
    assertArray([])
  })

  it('should throw', () => {
    try {
      assertArray('wrong')
    } catch (error) {
      strictEqual(error.name, 'AssertionError [ERR_ASSERTION]')
    }
  })
})
