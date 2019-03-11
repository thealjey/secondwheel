/* @flow */

const { describe, it } = require('mocha')
const proxyquire = require('proxyquire').noCallThru().noPreserveCache()
const { strictEqual } = require('assert')

let constants

describe('constants', () => {
  it('is node', () => {
    constants = proxyquire('../constants', {})

    strictEqual(constants.isNode, true)
    strictEqual(constants.isBrowser, false)
  })

  it('neither', () => {
    constants = proxyquire('../constants', {
      global: {
        WebSocket: 'WebSocket',
        MozWebSocket: null
      }
    })

    strictEqual(constants.isNode, false)
    strictEqual(constants.isBrowser, false)
    strictEqual(constants.NativeWebSocket, 'WebSocket')
  })

  it('is browser', () => {
    constants = proxyquire('../constants', {
      global: {
        document: {},
        WebSocket: null,
        MozWebSocket: 'MozWebSocket'
      }
    })

    strictEqual(constants.isNode, false)
    strictEqual(constants.isBrowser, true)
    strictEqual(constants.NativeWebSocket, 'MozWebSocket')
  })
})
