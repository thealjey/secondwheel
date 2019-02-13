/* @flow */

const memoize = require('lodash/memoize')
const GithubSlugger = require('github-slugger')

const slugger = new GithubSlugger()

/**
 * generate a slug just like GitHub does for markdown headings
 *
 * @example
 * import slug from 'secondwheel/slug'
 *
 * slug('hello world') // hello-world
 */
const slug = (value/*: string */ = '') => {
  slugger.reset()

  return slugger.slug(value)
}

module.exports = memoize(slug)
