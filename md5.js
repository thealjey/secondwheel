/* @flow */

const { isNode } = require('./constants')

let getHasher

if (isNode) {
  const crypto = require('crypto')

  getHasher = () => crypto.createHash('md5')
} else {
  const MD5 = require('md5.js')

  getHasher = () => new MD5()
}

/**
 * produces an md5 hash on Node.js as well as in a browser
 *
 * @example
 * import md5 from 'secondwheel/md5'
 *
 * md5('42') // a1d0c6e83f027327d8461063f4ac58a6
 */
const md5 = (value/*: string */ = '') => getHasher().update(value).digest('hex')

module.exports = md5
