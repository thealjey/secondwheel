/* @flow */

const has = require('lodash/has')
const map = require('lodash/map')
const trim = require('lodash/trim')
const split = require('lodash/split')
const reject = require('lodash/reject')
const toLower = require('lodash/toLower')
const memoize = require('lodash/memoize')
const isString = require('lodash/isString')
const camelCase = require('lodash/camelCase')
const transform = require('lodash/transform')
const { load } = require('cheerio')
const template = require('./template')

const msPattern = /^-ms-/

const parseHTML = memoize(
  html => load(html, { xmlMode: true }).root().toArray()[0].children
)

const toJSXKey = memoize(key => {
  const lower = toLower(key)

  return camelCase(msPattern.test(lower) ? lower.substr(1) : lower)
})

const transformStyle = object => {
  if (isString(object.style)) {
    object.style = transform(split(object.style, ';'), (result, style) => {
      const firstColon = style.indexOf(':')
      const key = trim(style.substr(0, firstColon))

      if (key) {
        result[toJSXKey(key)] = trim(style.substr(firstColon + 1))
      }
    }, {})
  }
}

const rename = (object, fromKey, toKey) => {
  if (has(object, fromKey)) {
    object[toKey] = object[fromKey]
    delete object[fromKey]
  }
}

const transformElement = ({
  name: type,
  attribs: props,
  children: childElements
}) => {
  transformStyle(props)
  rename(props, 'for', 'htmlFor')
  rename(props, 'class', 'className')
  if (type === 'input') {
    rename(props, 'checked', 'defaultChecked')
    rename(props, 'value', 'defaultValue')
  }
  let children = transformElements(childElements)

  if (type === 'textarea' && children.length) {
    props.defaultValue = children[0]
    children = []
  }

  return { type, props, children }
}

const transformElements = (elements = []) =>
  map(
    reject(elements, ['type', 'comment']),
    el => el.type === 'text' ? el.data : transformElement(el)
  )

/**
 * converts an html string to an array of plain objects and strings
 *
 * @example
 * import htmlToArray from 'secondwheel/htmlToArray'
 *
 * // stringify to transmit over the network, cache, etc.
 * const str = JSON.stringify(htmlToArray('<b>hello <%= name %></b>', { name: 'foo' }))
 */
const htmlToArray = (
  tpl/*: string */ = '',
  data/*: Object */ = {}
)/*: Array<string | Object> */ =>
  transformElements(parseHTML(template(tpl, data)))

module.exports = htmlToArray
