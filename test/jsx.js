/* @flow */

const { describe, it } = require('mocha')
const { deepStrictEqual } = require('assert')
const { htmlToArray } = require('../jsx')

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
})
