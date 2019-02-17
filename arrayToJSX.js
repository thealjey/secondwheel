/* @flow */

const map = require('lodash/map')
const isString = require('lodash/isString')

/**
 * converts an array of objects and strings to
 * {@link https://github.com/hyperhype/hyperscript|HyperScript}
 * compatible nodes
 *
 * @example
 * import arrayToJSX from 'secondwheel/arrayToJSX'
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

module.exports = arrayToJSX
