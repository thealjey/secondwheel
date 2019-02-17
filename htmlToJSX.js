/* @flow */

const arrayToJSX = require('./arrayToJSX')
const htmlToArray = require('./htmlToArray')

/**
 * converts an html string to
 * {@link https://github.com/hyperhype/hyperscript|HyperScript}
 * compatible nodes
 *
 * @example
 * import htmlToJSX from 'secondwheel/htmlToJSX'
 *
 * // use with any HyperScript compatible framework
 * import { createElement as h } from 'react'
 * import { h } from 'preact'
 * import { h } from 'inferno-hyperscript'
 *
 * // bold text without `dangerouslySetInnerHTML`
 * (<div>{htmlToJSX(h, '<b>hello <%= name %></b>', { name: 'foo' })}</div>)
 */
const htmlToJSX = (
  h/*: Function */,
  tpl/*: string */ = '',
  data/*: Object */ = {}
) => arrayToJSX(h, htmlToArray(tpl, data))

module.exports = htmlToJSX
