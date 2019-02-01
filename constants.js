/* @flow */

const get = require('lodash/get')

/** @namespace constants */

const g = typeof global === 'undefined'
  ? (typeof window === 'undefined' ? {} : window)
  : global

/**
 * truthy when running in Node.js
 *
 * @memberof constants
 * @example
 * import { isNode } from 'secondwheel/constants'
 *
 * if (isNode) {
 *   // Node.js
 * } else {
 *   // not Node.js
 * }
 */
const isNode = exports.isNode = get(g, 'process.versions.node')

/**
 * truthy when running in a browser
 *
 * @memberof constants
 * @example
 * import { isBrowser } from 'secondwheel/constants'
 *
 * if (isBrowser) {
 *   // browser
 * } else {
 *   // not browser
 * }
 */
exports.isBrowser = !isNode && get(g, 'document')

/**
 * contains `WebSocket` or `MozWebSocket` from the global scope if available
 *
 * @memberof constants
 * @example
 * import { NativeWebSocket } from 'secondwheel/constants'
 */
exports.NativeWebSocket = g.WebSocket || g.MozWebSocket
