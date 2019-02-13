/* @flow */

const { describe, it } = require('mocha')
const matching = require('../matching')
const { strictEqual } = require('assert')

describe('matching', () => {
  it('should not throw', () => {
    matching(
      { value: ['45'], something: 'here' },
      { value: [45] }
    )
  })

  it('should throw', () => {
    try {
      matching(
        { value: ['45'], something: 'here' },
        { value: [45], test: true }
      )
    } catch (error) {
      strictEqual(error.name, 'AssertionError [ERR_ASSERTION]')
    }
  })
})
