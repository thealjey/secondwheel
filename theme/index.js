/* @flow */

const { createElement: h } = require('react')
const File = require('vinyl')
const { renderToStaticMarkup } = require('react-dom/server')
const Html = require('./Html')

module.exports = (comments/*: Object[] */, options/*: Object */) => [
  new File({
    path: 'index.html',
    contents: Buffer.from(
      `<!doctype html>\n${renderToStaticMarkup(h(Html, { comments, options }))}`,
      'utf8'
    )
  })
]
