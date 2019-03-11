/* @flow */

const { describe, it } = require('mocha')
const proxyquire = require('proxyquire').noPreserveCache()
const { strictEqual } = require('assert')

describe('md5', () => {
  it('node', () => {
    const md5 = proxyquire('../md5', {})

    strictEqual(md5('42'), 'a1d0c6e83f027327d8461063f4ac58a6')
  })

  it('browser', () => {
    const md5 = proxyquire('../md5', { './constants': { isNode: false } })

    strictEqual(md5(), 'd41d8cd98f00b204e9800998ecf8427e')
  })
})
