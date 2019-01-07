/* @flow */
/* eslint-env mocha */

const { strictEqual, ok } = require('assert')
const sinon = require('sinon')
const cookie = require('../cookie')

describe('markdown', () => {
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
    global.window = { location: { host: 'clienthost' } }
    global.document = {}

    cookie.setCookie('cookie-name', 'cookie-value')
    strictEqual(
      global.document.cookie,
      'cookie-name=cookie-value;path=/;domain=.clienthost;max-age=10000000000;'
    )
  })

  it('setSessionCookie', () => {
    global.window = { location: { host: 'clienthost' } }
    global.document = {}

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
    global.document = {
      cookie: 'cookie-name=cookie-value;path=/;domain=.clienthost;'
    }
    strictEqual(cookie.getCookie('cookie-name'), 'cookie-value')

    global.document = { cookie: '' }
    strictEqual(cookie.getCookie('cookie-name'), '')
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
      expires: 'Thu, 01 Jan 1970 00:00:00 UTC'
    }))
  })

  it('removeCookie client', () => {
    global.document = {
      cookie: 'cookie-name=cookie-value;path=/;domain=.clienthost;'
    }

    cookie.removeCookie('cookie-name')
    strictEqual(
      global.document.cookie,
      'cookie-name=;path=/;domain=.clienthost;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    )
  })

  it('setReturnTo', () => {
    global.window = { location: { host: 'clienthost', href: 'clienthref' } }
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
    global.document = {
      cookie: 'return-to=%3Fx%3Dcookie-value;path=/;domain=.clienthost;'
    }
    strictEqual(cookie.getReturnTo(), '?x=cookie-value')

    global.document = { cookie: '' }
    strictEqual(cookie.getReturnTo(), '')
  })
})
