/* @flow */

const memoize = require('lodash/memoize')
const replace = require('lodash/replace')
const marked = require('marked')
const template = require('./template')
const { htmlToArray, arrayToJSX } = require('./jsx')

/** @namespace markdown */

const compileMarkdown = memoize(marked)
const pattern = /\n$/

/**
 * converts a markdown string to an array of plain objects and strings
 *
 * @memberof markdown
 * @example
 * import { markdownToArray } from 'secondwheel/markdown'
 *
 * // stringify to transmit over the network, cache, etc.
 * markdownToArray('hello <%= name %>', { name: 'foo' })
 */
const markdownToArray = (
  tpl/*: string */ = '',
  data/*: Object */ = {}
) => {
  const arr = htmlToArray(
    replace(
      compileMarkdown(template(tpl, data)),
      pattern,
      ''
    )
  )

  /* @flowignore */
  return arr.length === 1 && arr[0].type === 'p' ? arr[0].children : arr
}

exports.markdownToArray = markdownToArray

/**
 * converts a markdown string to
 * {@link https://github.com/hyperhype/hyperscript|HyperScript}
 * compatible nodes
 *
 * @memberof markdown
 * @example
 * import { markdownToJSX } from 'secondwheel/markdown'
 *
 * // use with any HyperScript compatible framework
 * import { createElement as h } from 'react'
 * import { h } from 'preact'
 * import { h } from 'inferno-hyperscript'
 *
 * markdownToJSX(h, '# hello <%= name %>', { name: 'foo' }) // <h1>hello foo</h1>
 */
const markdownToJSX = (
  h/*: Function */,
  tpl/*: string */ = '',
  data/*: Object */ = {}
) => arrayToJSX(h, markdownToArray(tpl, data))

exports.markdownToJSX = markdownToJSX
