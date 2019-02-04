/* @flow */

const { describe, it } = require('mocha')
const proxyquire = require('proxyquire').noPreserveCache()
const { strictEqual } = require('assert')

let constants

describe('constants', () => {
  it('isBrowser', () => {
    global.WebSocket = null
    global.MozWebSocket = 'test'
    constants = proxyquire('../constants', {})

    strictEqual(constants.NativeWebSocket, 'test')
  })
})
