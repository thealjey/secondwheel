/* @flow */

const memoize = require('lodash/memoize')
const lodashTemplate = require('lodash/template')

const compileLodash = memoize(
  lodashTemplate
)

/**
 * a wrapper around
 * {@link https://lodash.com/docs/4.17.11#template|lodash/template},
 * which caches compiled templates in memory
 *
 * @example
 * import template from 'webutilities/template';
 *
 * template('hello <%= name %>', { name: 'foo' })
 * template('hello <%= name %>', { name: 'bar' }) // only compiled once
 */
const template = (
  tpl/*: string */ = '',
  data/*: Object */ = {}
)/*: string */ =>
  compileLodash(tpl)(data)

module.exports = template
