/* @flow */

const { createElement: h } = require('react')

module.exports = ({ options, svg }/*: Object */) =>
  h('header', { role: 'banner', className: 'navbar navbar-expand navbar-dark bg-dark' },
    h('a', {
      href: '#',
      className: 'navbar-brand',
      dangerouslySetInnerHTML: {
        __html: (svg ? svg.toString() : '') + (options['project-name'] || '')
      }
    }),
    h('div', { className: 'justify-content-end navbar-collapse collapse' },
      options['project-homepage']
        ? h('div', { className: 'navbar-nav' },
          h('a', { href: options['project-homepage'], className: 'nav-link' }, 'GitHub')
        )
        : null
    )
  )
