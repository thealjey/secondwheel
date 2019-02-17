/* @flow */

const { describe, it } = require('mocha')
const { strictEqual } = require('assert')
const arrayToJSX = require('../arrayToJSX')
const { createElement: h, Fragment } = require('react')
const reactElementToJSXString = require('react-element-to-jsx-string')

describe('arrayToJSX', () => {
  it('should return predictable result', () => {
    strictEqual(
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null,
          ...arrayToJSX(h, [{ type: 'div', props: {}, children: ['test'] }])
        )
      ),
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null, h('div', { key: 0 }, 'test'))
      )
    )
  })
})
