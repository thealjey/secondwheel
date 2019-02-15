/* @flow */

const { createElement: h } = require('react')
const map = require('lodash/map')
const compact = require('lodash/compact')
const slug = require('../slug')

const Navigation = ({ comments }/*: Object */) =>
  comments.length
    ? h('div', { className: 'flex-column shift nav' },
      ...map(comments, ({ name, members, namespace }, key) => {
        const hash = `#${slug(namespace || name)}`

        return h('div', { key, className: 'nav-item' },
          h('a', { href: hash, 'data-rb-event-key': hash, className: 'aside-link js-link gray-link nav-link' }, name),
          ...compact(map(members, (comments, key) =>
            h(Navigation, { key, comments })
          ))
        )
      })
    )
    : null

module.exports = Navigation
