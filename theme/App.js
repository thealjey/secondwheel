/* @flow */

const { createElement: h, Fragment } = require('react')
const Header = require('./Header')
const Navigation = require('./Navigation')
const Content = require('./Content')

module.exports = ({ comments, options }/*: Object */) =>
  h(Fragment, null,
    h(Header, { options }),
    h('aside', null,
      h(Navigation, { comments })
    ),
    h('main', null,
      h(Content, { comments, options })
    )
  )
