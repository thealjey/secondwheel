/* @flow */

const reduce = require('lodash/reduce')
const kebabCase = require('lodash/kebabCase')
const get = require('lodash/get')
const isDate = require('lodash/isDate')
const pick = require('lodash/pick')

/**
 * The `req` object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 *
 * @external Request
 * @see {@link http://expressjs.com/en/4x/api.html#req|Request}
 */

/**
 * The `res` object represents the HTTP response that an Express app sends when
 * it gets an HTTP request.
 *
 * @external Response
 * @see {@link http://expressjs.com/en/4x/api.html#res|Response}
 */

/**
 * {@link cookie} configuration options
 * @typedef {Object} CookieOptions
 * @param {Request} [req]
 * @param {Response} [res]
 * @param {string} [domain=req.hostname || window.location.host] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @param {Function} [encode] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @param {Date} [expires] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @param {boolean} [httpOnly] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @param {number} [maxAge] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @param {string} [path='/'] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @param {boolean} [secure] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @param {boolean} [signed] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @param {boolean | string} [sameSite] - see {@link http://expressjs.com/en/4x/api.html#res.cookie|res.cookie}
 * @example
 * import type { CookieOptions } from 'secondwheel/cookie'
 */

/** @namespace cookie */

/*::
import type { CookieOptions as Options, $Response, $Request } from 'express'

export type CookieOptions = {
  req?: $Request;
  res?: $Response;
  ...$Exact<Options>;
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

const getConfig = (options/*: ?CookieOptions */)/*: CookieOptions */ => {
  const { req, res, ...rest } = pick(options, allowed)

  return {
    path: '/',
    domain: `.${get(req, 'hostname') || window.location.host}`,
    ...rest
  }
}

const serialize = (options/*: ?CookieOptions */)/*: string */ => reduce(
  options,
  (result, value, key) =>
    `${result}${kebabCase(String(key))}=${isDate(value) ? value.toUTCString() : value};`,
  ''
)

function set (
  name/*: string */,
  value/*: string */,
  options/*: ?CookieOptions */
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
  options/*: ?CookieOptions */
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
  options/*: ?CookieOptions */
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
  options/*: ?CookieOptions */
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
const removeCookie = (name/*: string */, options/*: ?CookieOptions */) => {
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
const setReturnTo = (options/*: ?CookieOptions */) => exports.setSessionCookie(
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
const getReturnTo = (options/*: ?CookieOptions */)/*: string */ => {
  const value = getCookie('return-to', options)

  removeCookie('return-to', options)

  return value && decodeURIComponent(value)
}

exports.getReturnTo = getReturnTo
