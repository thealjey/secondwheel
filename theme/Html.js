/* @flow */

const { createElement: h } = require('react')
const App = require('./App')

module.exports = ({ comments, options, svg }/*: Object */) =>
  h('html', { lang: 'en' },
    h('head', null,
      h('meta', { charSet: 'utf-8' }),
      h('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }),
      h('link', {
        rel: 'stylesheet',
        href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
        integrity: 'sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO',
        crossOrigin: 'anonymous'
      }),
      h('link', {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism.css',
        integrity: 'sha256-/Kfdz9pXGPe+bFF+TtxHqbg6F9c3Rb0jN48uy+2b/do=',
        crossOrigin: 'anonymous'
      }),
      options.favicon ? h('link', { rel: 'icon', href: 'favicon.ico' }) : null,
      h('style', { dangerouslySetInnerHTML: { __html: `
#app {
  height: 100vh;
  display: grid;
  grid-template-columns: 20rem 1fr;
  grid-template-rows: 4rem 1fr;
  grid-template-areas:
    "header header"
    "aside main";
}
header { grid-area: header; }
aside { grid-area: aside; overflow-x: hidden; overflow-y: auto; }
main { grid-area: main; overflow-x: hidden; overflow-y: auto; }
.nav-item > .nav, section > article { font-size: .9em; }
.nav-item > .nav, .hide-articles article > section, .hide-articles .section-link { display: none; }
.shift { padding-left: 1em; }
.gray-link { padding-left: 0; color: rgba(26, 26, 26, .75); transition: color .2s ease-out; }
.gray-link:hover { color: #999; }
.aside-link.active { font-weight: 500; color: #1a1a1a; }
.aside-link.active + .nav { display: flex; }
.section-link.active, .section-link.active + section, .section-link:target + section > article > .section-link { display: block; }
section > .section-link { font-size: 1.5em; }
section { margin-bottom: .5em; }
h4 { font-size: 1.1em; margin-top: 1.2em; font-weight: 400; }
code { white-space: pre; }
.navbar-brand svg { height: 2.5rem; margin-right: 1rem; }
` } }),
      h('title', null, options['project-name'], ' documentation')
    ),
    h('body', null,
      h('div', { id: 'app' }, h(App, { comments, options, svg })),
      h('script', { dangerouslySetInnerHTML: { __html: `
var links = Array.from(document.getElementsByClassName('js-link'))
var jumbotron = document.getElementsByClassName('jumbotron')[0]
function handleHashChange () {
  if (jumbotron) {
    jumbotron.style.display = 'block'
  }
  links.forEach(function (link) {
    link.classList.remove('active')
  })
  links.forEach(function (link) {
    if (link.dataset.rbEventKey === location.hash) {
      while(link && link.classList.contains('js-link')) {
        if (jumbotron) {
          jumbotron.style.display = 'none'
        }
        link.classList.add('active')
        link = link.parentNode.parentNode.previousElementSibling
      }
    }
  })
}
addEventListener('hashchange', handleHashChange, false)
handleHashChange()
if (jumbotron) {
  document.body.classList.add('hide-articles')
}
` } })
    )
  )
