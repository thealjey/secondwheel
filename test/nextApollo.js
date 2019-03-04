/* @flow */

const { describe, it } = require('mocha')
const App = require('next/app').default
const ApolloClient = require('../ApolloClient')
const constant = require('lodash/constant')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')
const { ok } = require('assert')
const { createElement } = require('react')
const { renderToString } = require('react-dom/server')

const Component = constant(null)
const testError = new Error('test error')

const req = options => proxyquire('../nextApollo', options)

describe('nextApollo', () => {
  it('app', async () => {
    const nextApollo = req({})
    const MyApp = nextApollo(
      options => new ApolloClient(options),
      ctx => ({ test: 'test' })
    )(App)
    renderToString(createElement(MyApp, { ...(await MyApp.getInitialProps({ Component, router: {} })), Component, router: {} }))
  })

  it('empty component', async () => {
    const error = stub(console, 'error')

    const nextApollo = req({
      'react-apollo': {
        getDataFromTree () {
          throw testError
        }
      }
    })
    const MyApp = nextApollo(
      options => new ApolloClient(options),
      ctx => ({ test: 'test' })
    )(Component)
    renderToString(createElement(MyApp, { ...(await MyApp.getInitialProps({ Component, router: {} })), Component, router: {} }))

    ok(error.calledOnceWithExactly('Error while running `getDataFromTree`', testError))

    error.restore()
  })
})
