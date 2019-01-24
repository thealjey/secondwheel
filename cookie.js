/* @flow */

const reduce = require('lodash/reduce')
const kebabCase = require('lodash/kebabCase')
const get = require('lodash/get')

/**
 * tools for working with cookies
 * @namespace cookie
 */

/**
 * cookie options
 *
 * @typedef {Object} CookieOptions
 * @property {string}   [path]
 * @property {string}   [domain]
 * @property {number}   [maxAge]
 * @property {string}   [expires]
 * @property {boolean}  [secure]
 * @property {boolean}  [httpOnly]
 * @property {Request}  [req] - request object (must be privided server side)
 * @property {Response} [res] - response object (must be privided server side)
 */
/*::
type CookieOptions = {
  domain?: string;
  expires?: string;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  secure?: boolean;
  signed?: boolean;
  req?: Request;
  res?: Response;
};
declare class Request {
  hostname: string;
  originalUrl: string;
  cookies: Object;
  signedCookies: Object;
}
declare class Response {
  cookie(name: string, value: string | Object,
    options?: CookieOptions): Response;
  clearCookie(name: string, options?: CookieOptions): Response;
}
*/

const getConfig = (options/*: ?CookieOptions */)/*: CookieOptions */ => {
  const { req, res, ...rest } = options || {}

  return {
    path: '/',
    domain: `.${get(req, 'hostname') || window.location.host}`,
    ...rest
  }
}

const serialize = (options/*: ?CookieOptions */)/*: string */ => reduce(
  options,
  (result, value, key) => `${result}${kebabCase(String(key))}=${value};`,
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
  const config = getConfig({
    expires: 'Thu, 01 Jan 1970 00:00:00 UTC',
    ...options
  })

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
