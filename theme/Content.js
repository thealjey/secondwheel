/* @flow */

const { createElement: h, Fragment } = require('react')
const map = require('lodash/map')
const has = require('lodash/has')
const get = require('lodash/get')
const trim = require('lodash/trim')
const replace = require('lodash/replace')
const join = require('lodash/join')
const slug = require('../slug')
const { LinkerStack, createFormatters } = require('documentation').util
const prismjs = require('prismjs')

require('prismjs/components/')()

let linkerStack
let formatters
const pattern = /^\((\w+)\)\s*([\s\S]*)/

const getLinkerStack = (comments, options) =>
  linkerStack ||
  (linkerStack = new LinkerStack(options)
    .namespaceResolver(comments, namespace => `#${slug(namespace)}`))

const getFormatters = (comments, options) =>
  formatters ||
  (formatters = createFormatters(getLinkerStack(comments, options).link))

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

const inferLanguage = text => {
  const [, language = 'flow', code = text] = text.match(pattern) || []

  if (has(prismjs.languages, language)) {
    return { language, code }
  }

  return { language: 'flow', code: text }
}

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
            __html: join(map(content, ({ name, type, default: defaultVal, description }) => {
              const desc = replace(trim(md(description, comments, options)), /\n/g, '')

              return replace(
                replace(
                  prismjs.highlight(
                    `${name || ''}${name ? ': ' : ''}PlaceholderPrismType${defaultVal ? ' = ' : ''}${defaultVal || ''}${desc.length ? ' // PlaceholderPrismDescription' : ''}`,
                    prismjs.languages.flow,
                    'flow'
                  ),
                  'PlaceholderPrismType',
                  formatType(type, comments, options)
                ),
                'PlaceholderPrismDescription',
                desc
              )
            }), '\n')
          }
        })
      )]
      : []
  })

const Content = ({ comments, options }/*: Object */) =>
  comments.length
    ? h('article', { className: 'shift' },
      ...map(comments, ({ namespace, name, description, augments, params, properties, returns, throws, examples, sees, members }, key) => {
        const id = slug(namespace || name)
        const hash = `#${id}`
        const see = trim(join(map(sees, item => md(item, comments, options)), ''))
        const aug = join(map(augments, ({ name }) => link(name, comments, options)), ', ')
        const desc = trim(md(description, comments, options))

        return h(Fragment, { key },
          h('a', { id, href: hash, 'data-rb-event-key': hash, className: 'section-link js-link gray-link nav-link' }, name),
          h('section', null,
            desc ? h('div', { dangerouslySetInnerHTML: { __html: desc } }) : null,
            h(Section, {
              title: 'Examples',
              content: map(examples, ({ description }, key) => {
                const { language, code } = inferLanguage(description)
                const className = `language-${language}`

                return h('pre', { className },
                  h('code', {
                    className,
                    dangerouslySetInnerHTML: {
                      __html: prismjs.highlight(code, prismjs.languages[language], language)
                    }
                  })
                )
              })
            }),
            h(Section, {
              title: 'Extends',
              content: aug.length
                ? [h('div', { dangerouslySetInnerHTML: { __html: aug } })]
                : []
            }),
            h(Parameters, { title: 'Parameters', content: params, comments, options }),
            h(Parameters, { title: 'Properties', content: properties, comments, options }),
            h(Parameters, { title: 'Returns', content: returns, comments, options }),
            h(Parameters, { title: 'Throws', content: throws, comments, options }),
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
        )
      }))
    : null

module.exports = Content
