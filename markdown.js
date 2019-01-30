/* @flow */

const memoize = require('lodash/memoize')
const marked = require('marked')
const template = require('./template')
const { htmlToJSX } = require('./jsx')

const compileMarkdown = memoize(marked)

/**
 * converts a markdown string to
 * {@link https://github.com/hyperhype/hyperscript|HyperScript}
 * compatible nodes
 *
 * @example
 * import markdown from 'secondwheel/markdown'
 *
 * // use with any HyperScript compatible framework
 * import { createElement as h } from 'react'
 * import { h } from 'preact'
 * import { h } from 'inferno-hyperscript'
 *
 * markdown(h, 'hello <%= name %>', { name: 'foo' }) // <p>hello foo</p>
 */
const markdown = (
  h/*: Function */,
  tpl/*: string */ = '',
  data/*: Object */ = {}
) => htmlToJSX(h, compileMarkdown(template(tpl, data)))

module.exports = markdown
