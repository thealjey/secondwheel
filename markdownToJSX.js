/* @flow */

const markdownToArray = require('./markdownToArray')
const arrayToJSX = require('./arrayToJSX')

/**
 * converts a markdown string to
 * {@link https://github.com/hyperhype/hyperscript|HyperScript}
 * compatible nodes
 *
 * @example
 * import markdownToJSX from 'secondwheel/markdownToJSX'
 *
 * // use with any HyperScript compatible framework
 * import { createElement as h } from 'react'
 * import { h } from 'preact'
 * import { h } from 'inferno-hyperscript'
 *
 * markdownToJSX(h, '# hello <%= name %>', { name: 'foo' })
 */
const markdownToJSX = (
  h/*: Function */,
  tpl/*: string */ = '',
  data/*: Object */ = {}
) => arrayToJSX(h, markdownToArray(tpl, data))

module.exports = markdownToJSX
