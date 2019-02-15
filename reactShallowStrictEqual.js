/* @flow */

const { strictEqual } = require('assert')
const ShallowRenderer = require('react-test-renderer/shallow')
const reactElementToJSXString = require('react-element-to-jsx-string')

/**
 * This represents any node that can be rendered in a React application.
 * `ReactNode` can be null, a boolean, a number, a string, a React element,
 * or an array of any of those types recursively.
 *
 * @external ReactNode
 * @see {@link https://flow.org/en/docs/react/types/#toc-react-node|ReactNode}
 */

/**
 * a unit testing helper for React components
 *
 * performs a **shallow** render of `actual` and compares the result to
 * `expected`
 *
 * uses the native Node.js
 * {@link https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message|assert.strictEqual}
 * to perform the assertion
 *
 * @param {ReactNode} actual
 * @param {ReactNode} expected
 * @param {string} [message]
 * @throws {AssertionError} test failure
 * @example
 * // MyButton.js
 * import classNames from 'classnames'
 *
 * export default ({children, className, ...props}) => (
 *   <button className={classNames('my-button', className)} {...props}>{children}</button>
 * )
 * @example
 * // MyButton.test.js
 * import reactShallowStrictEqual from 'secondwheel/reactShallowStrictEqual'
 * import MyButton from './MyButton'
 *
 * describe('MyButton', () => {
 *   it('should render predictable result', () => {
 *     reactShallowStrictEqual(
 *       (<MyButton className="test-class" id="test-id">test children</MyButton>),
 *       (<button className="my-button test-class" id="test-id">test children</button>)
 *     )
 *   })
 * })
 */
const reactShallowStrictEqual = (
  actual/*: any */,
  expected/*: any */,
  message/*:: ?:string */
) => {
  const renderer = new ShallowRenderer()

  renderer.render(actual)

  strictEqual(
    /* @flowignore */
    reactElementToJSXString(renderer.getRenderOutput()),
    /* @flowignore */
    reactElementToJSXString(expected),
    message
  )
}

module.exports = reactShallowStrictEqual
