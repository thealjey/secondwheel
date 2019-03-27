/* @flow */

const { describe, it, before } = require('mocha')
const proxyquire = require('proxyquire')
const constant = require('lodash/constant')
const identity = require('lodash/identity')
const { strictEqual, deepStrictEqual } = require('assert')

let ApolloClient

class Socket {}
class Client {}
class InMemoryCache {
  /*:: data:? Object; */
  restore (data) {
    this.data = data

    return this
  }
}

global.WebSocket = Socket

const req = options => proxyquire('../ApolloClient', {
  'isomorphic-unfetch': async () => ({}),
  'apollo-utilities': { getMainDefinition: identity },
  'apollo-client': { ApolloClient: Client },
  'apollo-cache-inmemory': { InMemoryCache },
  'apollo-link-error': { onError: identity },
  'apollo-link': {
    from: arr => ['link', ...arr],
    split: (test, left, right) => op => test(op) ? left : right
  },
  ...options
})

describe('ApolloClient', () => {
  it('NativeWebSocket', () => {
    ApolloClient = req({
      './constants': { NativeWebSocket: Socket, isNode: false }
    })

    new ApolloClient({ wsUri: 'test' }) // eslint-disable-line no-new
    const { createHttpLink, createWSLink } = ApolloClient

    ApolloClient.createHttpLink = constant('http')
    ApolloClient.createWSLink = constant('ws')

    const link = ApolloClient.createLink()

    strictEqual(
      link({
        query: { kind: 'OperationDefinition', operation: 'subscription' }
      }),
      'ws'
    )
    strictEqual(link({ query: {} }), 'http')

    ApolloClient.createHttpLink = createHttpLink
    ApolloClient.createWSLink = createWSLink
  })

  describe('default import', () => {
    before(() => {
      ApolloClient = req()
    })

    it('no socket', () => {
      new ApolloClient() // eslint-disable-line no-new
      deepStrictEqual(
        ApolloClient.createCache({ cache: { testKey: 'testVal' } }).data,
        { testKey: 'testVal' }
      )
      const onError = ApolloClient.createErrorLink({})

      onError({})

      onError({
        graphQLErrors: [
          { message: 'message', locations: 'locations', path: 'path' }
        ],
        networkError: 'networkError'
      })
    })

    it('webSocketImpl', () => {
      new ApolloClient({ wsUri: 'test', webSocketImpl: Socket }) // eslint-disable-line no-new
      const { createErrorLink, createRetryLink, createBatchLink } = ApolloClient

      ApolloClient.createErrorLink = constant('error')
      ApolloClient.createRetryLink = constant('retry')
      ApolloClient.createBatchLink = constant('batch')

      deepStrictEqual(
        ApolloClient.createHttpLink(),
        ['link', 'error', 'retry', 'batch']
      )
      deepStrictEqual(
        ApolloClient.getLinks(),
        ['error', 'retry', 'batch']
      )
      ApolloClient.createRetryLink = constant(null)
      deepStrictEqual(
        ApolloClient.createHttpLink(),
        ['link', 'error', 'batch']
      )

      ApolloClient.createErrorLink = createErrorLink
      ApolloClient.createRetryLink = createRetryLink
      ApolloClient.createBatchLink = createBatchLink
    })
  })
})
