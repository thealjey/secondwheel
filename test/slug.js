/* @flow */

const { describe, it } = require('mocha')
const { strictEqual } = require('assert')
const slug = require('../slug')

describe('slug', () => {
  it('optional parameter', () => {
    strictEqual(slug(), '')
  })

  it('should return predictable result', () => {
    strictEqual(slug('hello world'), 'hello-world')
  })
})
