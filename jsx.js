/* @flow */

const has = require('lodash/has')
const map = require('lodash/map')
const trim = require('lodash/trim')
const split = require('lodash/split')
const reject = require('lodash/reject')
const compact = require('lodash/compact')
const toLower = require('lodash/toLower')
const memoize = require('lodash/memoize')
const isString = require('lodash/isString')
const camelCase = require('lodash/camelCase')
const transform = require('lodash/transform')
const { load } = require('cheerio')
const template = require('./template')

/**
 * tools for working with jsx
 *
 * @namespace jsx
 */

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
  compact(
    map(
      reject(elements, ['type', 'comment']),
      el => el.type === 'text' ? trim(el.data) : transformElement(el)
    )
  )

/**
 * converts an array of objects and strings to
 * {@link https://github.com/hyperhype/hyperscript|HyperScript}
 * compatible nodes
 *
 * @memberof jsx
 * @example
 * import { arrayToJSX } from 'secondwheel/jsx'
 *
 * // use with any HyperScript compatible framework
 * import { createElement as h } from 'react'
 * import { h } from 'preact'
 * import { h } from 'inferno-hyperscript'
 *
 * // render dynamic content without `dangerouslySetInnerHTML`
 * (<div>{arrayToJSX(h, <result of htmlToArray>)}</div>)
 */
const arrayToJSX = (h/*: Function */, arr/*: Array<string | Object> */ = []) =>
  map(
    arr,
    (el, key) =>
      isString(el)
        ? el
        : h(el.type, { ...el.props, key }, ...arrayToJSX(h, el.children))
  )

exports.arrayToJSX = arrayToJSX

/**
 * converts an html string to an array of plain objects and strings
 *
 * @memberof jsx
 * @example
 * import { htmlToArray } from 'secondwheel/jsx'
 *
 * // stringify to transmit over the network, cache, etc.
 * const str = JSON.stringify(htmlToArray('<b>hello <%= name %></b>', { name: 'foo' }))
 */
const htmlToArray = (
  tpl/*: string */ = '',
  data/*: Object */ = {}
)/*: Array<string | Object> */ =>
  transformElements(parseHTML(template(tpl, data)))

exports.htmlToArray = htmlToArray

/**
 * converts an html string to
 * {@link https://github.com/hyperhype/hyperscript|HyperScript}
 * compatible nodes
 *
 * @memberof jsx
 * @example
 * import { htmlToJSX } from 'secondwheel/jsx'
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

exports.htmlToJSX = htmlToJSX
