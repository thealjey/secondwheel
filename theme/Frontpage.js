/* @flow */

const { createElement: h } = require('react')
const { readFileSync } = require('fs')
const { join } = require('path')
const { markdownToJSX } = require('../markdown')

module.exports = () => {
  try {
    return h('div', { className: 'jumbotron jumbotron-fluid' },
      h('div', { className: 'container' },
        ...markdownToJSX(
          h,
          readFileSync(join(process.cwd(), 'README.md'), 'utf8')
        )
      )
    )
  } catch (error) {
    return null
  }
}
