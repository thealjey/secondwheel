/* @flow */

const { describe, it } = require('mocha')
const { strictEqual } = require('assert')
const htmlToJSX = require('../htmlToJSX')
const { createElement: h, Fragment } = require('react')
const reactElementToJSXString = require('react-element-to-jsx-string')

describe('htmlToJSX', () => {
  it('optional parameters', () => {
    strictEqual(
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null,
          ...htmlToJSX(h)
        )
      ),
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null)
      )
    )
  })

  it('should return predictable result', () => {
    strictEqual(
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null,
          ...htmlToJSX(h, 'hello <%= name %>', { name: 'world' })
        )
      ),
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null, 'hello world')
      )
    )
  })
})
