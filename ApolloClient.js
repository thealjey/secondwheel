/* @flow */

const { ApolloClient: Client } = require('apollo-client')
const { from, split } = require('apollo-link')
const { onError } = require('apollo-link-error')
const { RetryLink } = require('apollo-link-retry')
const { BatchHttpLink } = require('apollo-link-batch-http')
const fetch = require('isomorphic-unfetch')
const { WebSocketLink } = require('apollo-link-ws')
const { getMainDefinition } = require('apollo-utilities')
const { InMemoryCache } = require('apollo-cache-inmemory')
const compact = require('lodash/compact')
const { NativeWebSocket, isNode } = require('./constants')

const defaultWSOptions = { reconnect: true }

const testOperation = ({ query }) => {
  const { kind, operation } = getMainDefinition(query)

  return kind === 'OperationDefinition' && operation === 'subscription'
}

const defaultErrorCallback = ({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message: m, locations: l, path: p }) => console.log(
      `[GraphQL error]: Message: ${m}, Location: ${l}, Path: ${p}`
    ))
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
}

/*::
import ApolloLink from 'apollo-link'
import { ApolloCache } from 'apollo-cache'

export type ApolloClientOptions = {
  uri?: string;
  browserUri?: string;
  serverUri?: string;
  wsUri?: string;
  cache?: Object;
  onError?: (error?: any) => void;
  ssrForceFetchDelay?: number;
  connectToDevTools?: boolean;
  queryDeduplication?: boolean;
  name?: string;
  version?: string;
  defaultOptions?: { watchQuery?: Object; query?: Object; mutate?: Object; };
  wsOptions?: Object;
  webSocketImpl?: WebSocket;
  delay?: { initial?: number; max?: number; jitter?: number; };
  attempts?: { max?: number; retryIf?: (error?: any, operation?: any) => boolean; };
  includeExtensions?: boolean;
  headers?: Object;
  credentials?: string;
  fetchOptions?: Object;
  useGETForQueries?: boolean;
  batchMax?: number;
  batchInterval?: number;
  batchKey?: () => string;
}
*/

/**
 * `ApolloLink` is a standard interface for modifying control flow of GraphQL
 * requests and fetching GraphQL results.
 *
 * @external ApolloLink
 * @see {@link https://www.apollographql.com/docs/link/index.html|ApolloLink}
 */

/**
 * @external ApolloCache
 * @see {@link https://www.apollographql.com/docs/angular/basics/caching.html|ApolloCache}
 */

/**
 * {@link ApolloClient} configuration options
 * @typedef {Object} ApolloClientOptions
 * @param {string} [uri='/graphql']
 * @param {string} [browserUri=uri] - used in the browser
 * @param {string} [serverUri=browserUri] - used in Node.js
 * @param {string} [wsUri] - if provided a WebSocketLink will be configured
 * @param {Object} [cache={}] - use on the client to restore server state
 * @param {Function} [onError] - by default prints errors to console
 * @param {number} [ssrForceFetchDelay] - see {@link https://www.apollographql.com/docs/react/api/apollo-client.html|apollo-client}
 * @param {boolean} [connectToDevTools] - see {@link https://www.apollographql.com/docs/react/api/apollo-client.html|apollo-client}
 * @param {boolean} [queryDeduplication] - see {@link https://www.apollographql.com/docs/react/api/apollo-client.html|apollo-client}
 * @param {string} [name] - see {@link https://www.apollographql.com/docs/react/api/apollo-client.html|apollo-client}
 * @param {string} [version] - see {@link https://www.apollographql.com/docs/react/api/apollo-client.html|apollo-client}
 * @param {Object} [defaultOptions] - see {@link https://www.apollographql.com/docs/react/api/apollo-client.html|apollo-client}
 * @param {Object} [wsOptions={ reconnect: true }] - see {@link https://www.npmjs.com/package/apollo-link-ws|apollo-link-ws}
 * @param {WebSocket} [webSocketImpl] - see {@link https://www.npmjs.com/package/apollo-link-ws|apollo-link-ws}
 * @param {Object} [delay] - see {@link https://www.npmjs.com/package/apollo-link-retry|apollo-link-retry}
 * @param {Object} [attempts] - see {@link https://www.npmjs.com/package/apollo-link-retry|apollo-link-retry}
 * @param {boolean} [includeExtensions] - see {@link https://www.npmjs.com/package/apollo-link-batch-http|apollo-link-batch-http}
 * @param {Object} [headers={}] - see {@link https://www.npmjs.com/package/apollo-link-batch-http|apollo-link-batch-http}
 * @param {string} [credentials='same-origin'] - see {@link https://www.npmjs.com/package/apollo-link-batch-http|apollo-link-batch-http}
 * @param {Object} [fetchOptions={}] - see {@link https://www.npmjs.com/package/apollo-link-batch-http|apollo-link-batch-http}
 * @param {boolean} [useGETForQueries] - see {@link https://www.npmjs.com/package/apollo-link-batch-http|apollo-link-batch-http}
 * @param {number} [batchMax] - see {@link https://www.npmjs.com/package/apollo-link-batch-http|apollo-link-batch-http}
 * @param {number} [batchInterval] - see {@link https://www.npmjs.com/package/apollo-link-batch-http|apollo-link-batch-http}
 * @param {Function} [batchKey] - see {@link https://www.npmjs.com/package/apollo-link-batch-http|apollo-link-batch-http}
 * @example
 * import type { ApolloClientOptions } from 'secondwheel/ApolloClient'
 */

/**
 * - like {@link https://www.npmjs.com/package/apollo-boost|apollo-boost}, but
 *   allows for a greater degree of configurability
 * - augments {@link https://www.npmjs.com/package/apollo-client|apollo-client}
 *   with usefull defaults
 * - batches requests, retries failed requests
 * - works on Node.js and in the browser alike
 * - subscriptions baked in
 * - provides static methods, overriding which any aspect of the default
 *   functionality can be changed
 *
 * @example
 * import ApolloClient from 'secondwheel/ApolloClient'
 *
 * // connecting to a simple "graphql-yoga" server with default options
 * const client = new ApolloClient({
 *   uri: 'http://localhost:4000',
 *   wsUri: 'ws://localhost:4000'
 * })
 */
class ApolloClient extends Client {
  constructor (options/*: ApolloClientOptions */ = {}) {
    const {
      ssrForceFetchDelay,
      connectToDevTools,
      queryDeduplication,
      name,
      version,
      defaultOptions
    } = options

    super({
      link: ApolloClient.createLink(options),
      cache: ApolloClient.createCache(options),
      ssrMode: isNode,
      ssrForceFetchDelay,
      connectToDevTools,
      queryDeduplication,
      name,
      version,
      defaultOptions
    })
  }

  /** creates the final instance of ApolloLink */
  static createLink (options/*: ApolloClientOptions */)/*: ApolloLink */ {
    const httpLink = ApolloClient.createHttpLink(options)
    const wsLink = ApolloClient.createWSLink(options)

    return wsLink ? split(testOperation, wsLink, httpLink) : httpLink
  }

  /** creates an instance of ApolloCache */
  static createCache (options/*: ApolloClientOptions */)/*: ApolloCache */ {
    const { cache = {} } = options

    return new InMemoryCache().restore(cache)
  }

  /** creates an instance of ApolloLink */
  static createHttpLink (options/*: ApolloClientOptions */)/*: ApolloLink */ {
    return from(compact(ApolloClient.getLinks(options)))
  }

  /** creates an instance of WebSocketLink */
  static createWSLink (options/*: ApolloClientOptions */)/*: ?ApolloLink */ {
    const { wsUri, wsOptions = defaultWSOptions, webSocketImpl } = options

    return wsUri && (webSocketImpl || NativeWebSocket) && new WebSocketLink({
      uri: wsUri,
      options: wsOptions,
      webSocketImpl
    })
  }

  /**
   * returns an array of ApolloLink to be used in the creation of the final link
   * falsy values are filtered out
   */
  static getLinks (options/*: ApolloClientOptions */)/*: Array<?ApolloLink> */ {
    return [
      ApolloClient.createErrorLink(options),
      ApolloClient.createRetryLink(options),
      ApolloClient.createBatchLink(options)
    ]
  }

  /** creates an instance of ErrorLink */
  static createErrorLink (options/*: ApolloClientOptions */)/*: ?ApolloLink */ {
    const { onError: errorCallback = defaultErrorCallback } = options

    return onError(errorCallback)
  }

  /** creates an instance of RetryLink */
  static createRetryLink (options/*: ApolloClientOptions */)/*: ?ApolloLink */ {
    const { delay, attempts } = options

    return new RetryLink({ delay, attempts })
  }

  /** creates an instance of HttpLink */
  static createBatchLink (options/*: ApolloClientOptions */)/*: ?ApolloLink */ {
    const {
      uri = '/graphql',
      browserUri = uri,
      serverUri = browserUri,
      includeExtensions,
      headers = {},
      credentials = 'same-origin',
      fetchOptions = {},
      useGETForQueries,
      batchMax,
      batchInterval,
      batchKey
    } = options

    return new BatchHttpLink({
      uri: isNode ? serverUri : browserUri,
      includeExtensions,
      fetch,
      headers,
      credentials,
      fetchOptions,
      useGETForQueries,
      batchMax,
      batchInterval,
      batchKey
    })
  }
}

module.exports = ApolloClient
