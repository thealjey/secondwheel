/* @flow */

const { describe, it, beforeEach, afterEach } = require('mocha')
const { strictEqual, ok } = require('assert')
const sinon = require('sinon')
const cookie = require('../cookie')

describe('cookie', () => {
  beforeEach(() => {
    const win/*: Object */ = global.window = {
      location: { host: 'clienthost', href: 'clienthref' }
    }
    win.document = global.document = { cookie: '' }
  })

  afterEach(() => {
    delete global.document
    delete global.window
  })

  it('setCookie server', () => {
    const spy = sinon.spy()

    cookie.setCookie('cookie-name', 'cookie-value', {
      /* @flowignore */
      req: { hostname: 'serverhost' },
      /* @flowignore */
      res: { cookie: spy },
      test: 'test'
    })
    ok(spy.calledWithMatch('cookie-name', 'cookie-value', {
      maxAge: 10000000000,
      path: '/',
      domain: '.serverhost'
    }))
  })

  it('setCookie client', () => {
    cookie.setCookie('cookie-name', 'cookie-value')
    strictEqual(
      global.document.cookie,
      'cookie-name=cookie-value;path=/;domain=.clienthost;max-age=10000000000;'
    )
  })

  it('setSessionCookie', () => {
    cookie.setSessionCookie('cookie-name', 'cookie-value')
    strictEqual(
      global.document.cookie,
      'cookie-name=cookie-value;path=/;domain=.clienthost;'
    )
  })

  it('getCookie server', () => {
    strictEqual(
      cookie.getCookie('cookie-name', {
        /* @flowignore */
        req: {
          cookies: { 'cookie-name': 'cookie-value' }
        }
      }),
      'cookie-value'
    )
    strictEqual(
      cookie.getCookie('cookie-name', {
        /* @flowignore */
        req: {
          cookies: {},
          signedCookies: { 'cookie-name': 'signed-cookie-value' }
        }
      }),
      'signed-cookie-value'
    )
  })

  it('getCookie client', () => {
    strictEqual(cookie.getCookie('cookie-name'), '')

    document.cookie = 'cookie-name=cookie-value;path=/;domain=.clienthost;'
    strictEqual(cookie.getCookie('cookie-name'), 'cookie-value')
  })

  it('removeCookie server', () => {
    const spy = sinon.spy()

    cookie.removeCookie('cookie-name', {
      /* @flowignore */
      req: { hostname: 'serverhost' },
      /* @flowignore */
      res: { clearCookie: spy }
    })
    ok(spy.calledWithMatch('cookie-name', {
      expires: new Date(0)
    }))
  })

  it('removeCookie client', () => {
    document.cookie = 'cookie-name=cookie-value;path=/;domain=.clienthost;'

    cookie.removeCookie('cookie-name')
    strictEqual(
      document.cookie,
      'cookie-name=;path=/;domain=.clienthost;expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    )
  })

  it('setReturnTo', () => {
    sinon.spy(cookie, 'setSessionCookie')

    cookie.setReturnTo({ path: '/test' })
    /* @flowignore */
    strictEqual(cookie.setSessionCookie.callCount, 1)
    ok(
      /* @flowignore */
      cookie.setSessionCookie.calledWithMatch(
        'return-to',
        'clienthref',
        { path: '/test' }
      )
    )
  })

  it('getReturnTo', () => {
    strictEqual(cookie.getReturnTo(), '')

    document.cookie = 'return-to=%3Fx%3Dcookie-value;path=/;domain=.clienthost;'
    strictEqual(cookie.getReturnTo(), '?x=cookie-value')
  })
})
