/* @flow */
/* eslint-env mocha */

const { createElement } = require('react')
const reactShallowStrictEqual = require('../reactShallowStrictEqual')
const classNames = require('classnames')

const MyButton = ({ children, className, ...props }) =>
  createElement('button', {
    className: classNames('my-button', className),
    ...props
  }, ...children)

describe('MyButton', () => {
  it('should render predictable result', () => {
    reactShallowStrictEqual(
      createElement(MyButton, {
        className: 'test-class',
        id: 'test-id'
      }, 'test children'),
      createElement('button', {
        className: 'my-button test-class',
        id: 'test-id'
      }, 'test children')
    )
  })
})
