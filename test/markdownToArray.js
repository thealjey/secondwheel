/* @flow */

const { describe, it } = require('mocha')
const { deepStrictEqual } = require('assert')
const markdownToArray = require('../markdownToArray')

describe('markdownToArray', () => {
  it('optional parameters', () => {
    deepStrictEqual(markdownToArray(), [])
  })

  it('unwrapped', () => {
    deepStrictEqual(
      markdownToArray('hello <%= name %>', { name: 'world' }),
      ['hello world']
    )
  })

  it('wrapped', () => {
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
})
