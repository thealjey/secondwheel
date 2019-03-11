/* @flow */

const has = require('lodash/has')
const g = require('global')

/** @namespace constants */

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
const isNode = exports.isNode = has(g, 'process.versions.node')

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
exports.isBrowser = !isNode && has(g, 'document')

/**
 * contains `WebSocket` or `MozWebSocket` from the global scope if available
 *
 * @memberof constants
 * @example
 * import { NativeWebSocket } from 'secondwheel/constants'
 */
exports.NativeWebSocket = g.WebSocket || g.MozWebSocket
