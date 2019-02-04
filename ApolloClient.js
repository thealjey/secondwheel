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
const { NativeWebSocket, isBrowser } = require('./constants')

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

export type Options = {
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
 * #### Types
 * ```js
 * export type Options = {
 *
 *   uri?: string = '/graphql';
 *   // used in the browser
 *   browserUri?: string = uri;
 *   // used in Node.js
 *   serverUri?: string = browserUri;
 *   // if provided a WebSocketLink will be configured
 *   wsUri?: string;
 *   // use on the client to restore server state, no the need to re-run queries
 *   cache?: Object = {};
 *   // by default prints errors to console
 *   onError?: error => void;
 *
 *   // "apollo-client" options
 *   ssrForceFetchDelay?: number;
 *   connectToDevTools?: boolean;
 *   queryDeduplication?: boolean;
 *   name?: string;
 *   version?: string;
 *   defaultOptions?: { watchQuery?: Object; query?: Object; mutate?: Object; };
 *
 *   // "apollo-link-ws" options
 *   wsOptions?: Object = { reconnect: true };
 *   webSocketImpl?: WebSocket;
 *
 *   // "apollo-link-retry" options
 *   delay?: { initial?: number; max?: number; jitter?: number; };
 *   attempts?: { max?: number; retryIf?: (error, operation) => boolean; };
 *
 *   // "apollo-link-batch-http" options
 *   includeExtensions?: boolean;
 *   headers?: Object = {};
 *   credentials?: string = 'same-origin';
 *   fetchOptions?: Object = {};
 *   useGETForQueries?: boolean;
 *   batchMax?: number;
 *   batchInterval?: number;
 *   batchKey?: () => string;
 *
 * }
 * ```
 *
 * @example
 * import ApolloClient from 'secondwheel/ApolloClient'
 *
 * // connecting to a simple "graphql-yoga" server with default options
 * const client = new ApolloClient({
 *   uri: 'http://localhost:4000',
 *   wsUri: 'ws://localhost:4000'
 * });
 */
class ApolloClient extends Client {
  constructor (options/*: Options */ = {}) {
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
      ssrMode: !isBrowser,
      ssrForceFetchDelay,
      connectToDevTools,
      queryDeduplication,
      name,
      version,
      defaultOptions
    })
  }

  /** creates the final instance of ApolloLink */
  static createLink (options/*: Options */)/*: ApolloLink */ {
    const httpLink = ApolloClient.createHttpLink(options)
    const wsLink = ApolloClient.createWSLink(options)

    return wsLink ? split(testOperation, wsLink, httpLink) : httpLink
  }

  /** creates an instance of ApolloCache */
  static createCache (options/*: Options */)/*: ApolloCache */ {
    const { cache = {} } = options

    return new InMemoryCache().restore(cache)
  }

  /** creates an instance of ApolloLink */
  static createHttpLink (options/*: Options */)/*: ApolloLink */ {
    return from(compact(ApolloClient.getLinks(options)))
  }

  /** creates an instance of WebSocketLink */
  static createWSLink (options/*: Options */)/*: ?ApolloLink */ {
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
  static getLinks (options/*: Options */)/*: Array<?ApolloLink> */ {
    return [
      ApolloClient.createErrorLink(options),
      ApolloClient.createRetryLink(options),
      ApolloClient.createBatchLink(options)
    ]
  }

  /** creates an instance of ErrorLink */
  static createErrorLink (options/*: Options */)/*: ?ApolloLink */ {
    const { onError: errorCallback = defaultErrorCallback } = options

    return onError(errorCallback)
  }

  /** creates an instance of RetryLink */
  static createRetryLink (options/*: Options */)/*: ?ApolloLink */ {
    const { delay, attempts } = options

    return new RetryLink({ delay, attempts })
  }

  /** creates an instance of HttpLink */
  static createBatchLink (options/*: Options */)/*: ?ApolloLink */ {
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
      uri: isBrowser ? browserUri : serverUri,
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
