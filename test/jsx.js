/* @flow */

const { describe, it } = require('mocha')
const { deepStrictEqual, strictEqual } = require('assert')
const { htmlToArray, htmlToJSX } = require('../jsx')
const { createElement: h, Fragment } = require('react')
const reactElementToJSXString = require('react-element-to-jsx-string')

describe('jsx', () => {
  it('htmlToArray', () => {
    deepStrictEqual(
      htmlToArray('<input checked value="a" /><textarea style="background-color: red; -ms-transition: all 4s ease;">b</textarea>'),
      [{
        type: 'input',
        props: { defaultChecked: '', defaultValue: 'a' },
        children: []
      }, {
        type: 'textarea',
        props: { defaultValue: 'b', style: { backgroundColor: 'red', msTransition: 'all 4s ease' } },
        children: []
      }]
    )
  })

  it('htmlToJSX', () => {
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
