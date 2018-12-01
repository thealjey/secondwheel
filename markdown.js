/* @flow */

const memoize = require('lodash/memoize')
const marksy = require('marksy').default
const template = require('./template')

const compileMarkdown = memoize(
  (
    createElement/*: Function */
  ) =>
    marksy({ createElement })
)

/**
 * converts a markdown string to
 * {@link https://github.com/hyperhype/hyperscript|HyperScript}
 * compatible nodes
 *
 * @example
 * import template from 'webutilities/markdown'
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
) =>
  compileMarkdown(h)(template(tpl, data)).tree

module.exports = markdown
