/* @flow */

const { describe, it } = require('mocha')
const maskPassword = require('../maskPassword')
const { strictEqual } = require('assert')

describe('maskPassword', () => {
  it('optional parameter', () => {
    strictEqual(maskPassword(), '')
  })

  it('verify result', () => {
    strictEqual(maskPassword('super secret password'), '*********************')
  })
})
