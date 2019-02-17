/* @flow */

const { describe, it } = require('mocha')
const { strictEqual, deepStrictEqual } = require('assert')
const { createElement: h, Fragment } = require('react')
const reactElementToJSXString = require('react-element-to-jsx-string')
const { markdownToArray, markdownToJSX } = require('../markdown')

describe('markdown', () => {
  it('markdownToArray unwrapped', () => {
    deepStrictEqual(
      markdownToArray('hello <%= name %>', { name: 'world' }),
      ['hello world']
    )
  })

  it('markdownToArray wrapped', () => {
    deepStrictEqual(
      markdownToArray(`hello

<%= name %>`, { name: 'world' }),
      [
        { type: 'p', props: {}, children: ['hello'] },
        '\n',
        { type: 'p', props: {}, children: ['world'] }
      ]
    )
  })

  it('markdownToJSX', () => {
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
