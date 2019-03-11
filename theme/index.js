/* @flow */

const { createElement: h } = require('react')
const File = require('vinyl')
const { renderToStaticMarkup } = require('react-dom/server')
const Html = require('./Html')
const svg2png = require('svg2png')
const toIco = require('to-ico')
const { promisify } = require('util')
const fs = require('fs')

const readFile = promisify(fs.readFile)

module.exports = async (comments/*: Object[] */, options/*: Object */) => {
  const files = []
  let svg

  if (options.favicon) {
    svg = await readFile(options.favicon)
    const png = await svg2png(svg, { width: 64, height: 64 })
    const ico = await toIco([png])

    files.push(
      new File({
        path: 'favicon.ico',
        contents: ico
      })
    )
  }

  files.push(
    new File({
      path: 'index.html',
      contents: Buffer.from(
        `<!doctype html>\n${renderToStaticMarkup(h(Html, { comments, options, svg }))}`,
        'utf8'
      )
    })
  )

  return files
}
