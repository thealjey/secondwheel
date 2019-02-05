/* @flow */

const reduce = require('lodash/reduce')
const kebabCase = require('lodash/kebabCase')
const get = require('lodash/get')
const isDate = require('lodash/isDate')
const pick = require('lodash/pick')

/**
 * tools for working with cookies
 *
 * #### Types
 * ```js
 * import type { CookieOptions, $Response, $Request } from 'express'
 *
 * export type Options = {
  *   req?: $Request;
  *   res?: $Response;
  *   ...$Exact<CookieOptions>;
 * }
 * ```
 *
 * @namespace cookie
 */

/*::
import type { CookieOptions, $Response, $Request } from 'express'

export type Options = {
  req?: $Request;
  res?: $Response;
  ...$Exact<CookieOptions>;
}
*/

const expires = new Date(0)
const allowed = [
  'domain',
  'encode',
  'expires',
  'httpOnly',
  'maxAge',
  'path',
  'req',
  'res',
  'secure',
  'signed'
]

const getConfig = (options/*: ?Options */)/*: Options */ => {
  const { req, res, ...rest } = pick(options, allowed)

  return {
    path: '/',
    domain: `.${get(req, 'hostname') || window.location.host}`,
    ...rest
  }
}

const serialize = (options/*: ?Options */)/*: string */ => reduce(
  options,
  (result, value, key) =>
    `${result}${kebabCase(String(key))}=${isDate(value) ? value.toUTCString() : value};`,
  ''
)

function set (
  name/*: string */,
  value/*: string */,
  options/*: ?Options */
) {
  const res = get(options, 'res')
  const config = getConfig(options)

  if (res) {
    res.cookie(name, value, config)
  } else {
    document.cookie = `${name}=${value};${serialize(config)}`
  }
}

/**
 * sets a cookie
 *
 * @memberof cookie
 * @example
 * import { setCookie } from 'secondwheel/cookie'
 *
 * setCookie('cookie-name', 'cookie-value')               // browser
 * setCookie('cookie-name', 'cookie-value', { req, res }) // server
 */
const setCookie = (
  name/*: string */,
  value/*: string */,
  options/*: ?Options */
) => set(name, value, { maxAge: 10 ** 10, ...options })

exports.setCookie = setCookie

/**
 * sets a session (temporary) cookie
 *
 * @memberof cookie
 * @example
 * import { setSessionCookie } from 'secondwheel/cookie'
 *
 * setSessionCookie('cookie-name', 'cookie-value')               // browser
 * setSessionCookie('cookie-name', 'cookie-value', { req, res }) // server
 */
const setSessionCookie = (
  name/*: string */,
  value/*: string */,
  options/*: ?Options */
) => set(name, value, options)

exports.setSessionCookie = setSessionCookie

/**
 * retrieves a cookie by name
 *
 * @memberof cookie
 * @example
 * import { getCookie } from 'secondwheel/cookie'
 *
 * const cookieValue = getCookie('cookie-name')               // browser
 * const cookieValue = getCookie('cookie-name', { req, res }) // server
 */
const getCookie = (
  name/*: string */,
  options/*: ?Options */
)/*: string */ => {
  const req = get(options, 'req')
  let match

  return req
    ? (req.cookies[name] || req.signedCookies[name])
    : (
      (match = document.cookie.match('(?:^|;) ?' + name + '=([^;]*)(?:;|$)')
      ) && match[1]) || ''
}

exports.getCookie = getCookie

/**
 * removes a cookie
 *
 * @memberof cookie
 * @example
 * import { removeCookie } from 'secondwheel/cookie'
 *
 * removeCookie('cookie-name')               // browser
 * removeCookie('cookie-name', { req, res }) // server
 */
const removeCookie = (name/*: string */, options/*: ?Options */) => {
  const res = get(options, 'res')
  const config = getConfig({ expires, ...options })

  if (res) {
    res.clearCookie(name, config)
  } else {
    document.cookie = `${name}=;${serialize(config)}`
  }
}

exports.removeCookie = removeCookie

/**
 * sets the "return to" value (current URL) into a session cookie
 *
 * @memberof cookie
 * @example
 * import { setReturnTo } from 'secondwheel/cookie'
 *
 * setReturnTo()             // browser
 * setReturnTo({ req, res }) // server
 */
const setReturnTo = (options/*: ?Options */) => exports.setSessionCookie(
  'return-to',
  get(options, 'req.originalUrl') || window.location.href,
  options
)

exports.setReturnTo = setReturnTo

/**
 * returns and removes the "return to" value
 *
 * @memberof cookie
 * @example
 * import { getReturnTo } from 'secondwheel/cookie'
 *
 * const cookieValue = getReturnTo()             // browser
 * const cookieValue = getReturnTo({ req, res }) // server
 */
const getReturnTo = (options/*: ?Options */)/*: string */ => {
  const value = getCookie('return-to', options)

  removeCookie('return-to', options)

  return value && decodeURIComponent(value)
}

exports.getReturnTo = getReturnTo
