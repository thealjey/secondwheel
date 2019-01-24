/* @flow */

const { describe, it } = require('mocha')
const { strictEqual } = require('assert')
const template = require('../template')

describe('markdown', () => {
  it('should render predictable result', () => {
    strictEqual(
      template('hello <%= name %>', { name: 'world' }),
      'hello world'
    )
  })
})
