/* @flow */

const { describe, it } = require('mocha')
const { strictEqual } = require('assert')
const { createElement: h, Fragment } = require('react')
const reactElementToJSXString = require('react-element-to-jsx-string')
const markdownToJSX = require('../markdownToJSX')

describe('markdownToJSX', () => {
  it('optional parameters', () => {
    strictEqual(
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null,
          ...markdownToJSX(h)
        )
      ),
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null)
      )
    )
  })

  it('should render predictable result', () => {
    strictEqual(
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null,
          ...markdownToJSX(h, 'hello <%= name %>', { name: 'world' })
        )
      ),
      /* @flowignore */
      reactElementToJSXString(
        h(Fragment, null, 'hello world')
      )
    )
  })
})
