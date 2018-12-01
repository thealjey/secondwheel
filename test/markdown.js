/* @flow */
/* eslint-env mocha */

const { strictEqual } = require('assert')
const { createElement, Fragment } = require('react')
const reactElementToJSXString = require('react-element-to-jsx-string')
const markdown = require('../markdown')

describe('markdown', () => {
  it('should render predictable result', () => {
    strictEqual(
      reactElementToJSXString(
        createElement(
          Fragment,
          null,
          ...markdown(createElement, 'hello <%= name %>', { name: 'world' })
        )
      ),
      `<>
  <p>
    hello world
  </p>
</>`
    )
  })
})
