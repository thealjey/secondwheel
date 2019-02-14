/* @flow */

const { describe, it } = require('mocha')
const assert = require('../assert')
const { strictEqual } = require('assert')

describe('assert', () => {
  it('should not throw', () => {
    assert(100, value => value < 1000)
  })

  it('should throw', () => {
    try {
      assert(10000, value => value < 1000)
    } catch (error) {
      strictEqual(error.name, 'AssertionError [ERR_ASSERTION]')
    }
  })
})
