/* @flow */

const { createElement: h, Fragment } = require('react')
const map = require('lodash/map')
const get = require('lodash/get')
const trim = require('lodash/trim')
const slug = require('../slug')
const { LinkerStack, createFormatters } = require('documentation').util
const { highlight, languages: { javascript } } = require('prismjs')

let linkerStack
let formatters

const getLinkerStack = (comments, options) =>
  linkerStack ||
  new LinkerStack(options)
    .namespaceResolver(comments, namespace => `#${slug(namespace)}`)

const getFormatters = (comments, options) =>
  formatters ||
  createFormatters(getLinkerStack(comments, options).link)

const md = (ast, comments, options) => {
  const firstChild = get(ast, 'children.0')

  return getFormatters(comments, options)
    .markdown(
      get(firstChild, 'type') === 'paragraph'
        ? {
          type: 'root',
          children: get(firstChild, 'children').concat(ast.children.slice(1))
        }
        : ast
    )
}

const link = (text, comments, options) =>
  getFormatters(comments, options).autolink(text)

const formatType = (type, comments, options) =>
  getFormatters(comments, options).type(type)

const Section = ({ title, content }) =>
  content.length
    ? h(Fragment, null,
      h('h4', null, title),
      ...content
    )
    : null

const Parameters = ({ title, content, comments, options }) =>
  h(Section, {
    title,
    content: content && content.length
      ? [h('pre', { className: 'language-flow' },
        h('code', {
          className: 'language-flow',
          dangerouslySetInnerHTML: {
            __html: map(content, ({ name, type, default: defaultVal, description }) => {
              const desc = trim(md(description, comments, options))

              return highlight(
                `${name || ''}${name ? ': ' : ''}PlaceholderPrismType${defaultVal ? ' = ' : ''}${defaultVal || ''}${desc.length ? ' // ' : ''}${desc}`,
                javascript,
                'flow'
              ).replace('PlaceholderPrismType', formatType(type, comments, options))
            }).join('\n')
          }
        })
      )]
      : []
  })

const Content = ({ comments, options }/*: Object */) =>
  comments.length
    ? h('article', { className: 'shift' },
      ...map(comments, ({ namespace, name, description, augments, params, returns, throws, examples, sees, members }, key) => {
        const id = slug(namespace || name)
        const see = trim(map(sees, item => md(item, comments, options)).join(''))
        const aug = map(augments, ({ name }) => link(name, comments, options)).join(', ')

        return h('section', { key, id },
          h('a', { href: `#${id}`, className: 'section-link gray-link nav-link' }, name),
          h('div', { dangerouslySetInnerHTML: { __html: md(description, comments, options) } }),
          h(Section, {
            title: 'Extends',
            content: aug.length
              ? [h('div', { dangerouslySetInnerHTML: { __html: aug } })]
              : []
          }),
          h(Parameters, { title: 'Parameters', content: params, comments, options }),
          h(Parameters, { title: 'Returns', content: returns, comments, options }),
          h(Parameters, { title: 'Throws', content: throws, comments, options }),
          h(Section, {
            title: 'Examples',
            content: map(examples, ({ description }, key) =>
              h('pre', { className: 'language-flow' },
                h('code', {
                  className: 'language-flow',
                  dangerouslySetInnerHTML: {
                    __html: highlight(description, javascript, 'flow')
                  }
                })
              )
            )
          }),
          h(Section, {
            title: 'See',
            content: see.length
              ? [h('div', { dangerouslySetInnerHTML: { __html: see } })]
              : []
          }),
          ...map(members, (comments, key) =>
            h(Content, { key, comments, options })
          )
        )
      }))
    : null

module.exports = Content
