/* @flow */

const memoize = require('lodash/memoize')
const replace = require('lodash/replace')
const marked = require('marked')
const template = require('./template')
const htmlToArray = require('./htmlToArray')

const compileMarkdown = memoize(marked)
const pattern = /\n$/

/**
 * converts a markdown string to an array of plain objects and strings
 *
 * @example
 * import markdownToArray from 'secondwheel/markdownToArray'
 *
 * // stringify to transmit over the network, cache, etc.
 * const str = JSON.stringify(markdownToArray('hello <%= name %>', { name: 'foo' }))
 */
const markdownToArray = (
  tpl/*: string */ = '',
  data/*: Object */ = {}
)/*: Array<string | Object> */ => {
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

module.exports = markdownToArray
