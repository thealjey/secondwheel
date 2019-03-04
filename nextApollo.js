/* @flow */

const { createElement, PureComponent } = require('react')
const Head = require('next/head').default
const { getDataFromTree } = require('react-apollo')
const { isNode } = require('./constants')
const noop = require('lodash/noop')

/*::
import ApolloClient from 'apollo-client'
import App from 'next/app'
*/

/**
 * Apollo-Client HOC for the Next.js
 * {@link https://nextjs.org/docs/#custom-app|App} component.
 *
 * A simpler way to achieve the same result as in
 * {@link https://github.com/zeit/next.js/tree/master/examples/with-apollo|with-apollo},
 * which does not require any boilerplate code.
 *
 * The `ctx` object is equivalent to the one received in all
 * {@link https://nextjs.org/docs/#fetching-data-and-component-lifecycle|getInitialProps}
 * hooks.
 *
 * @example
 * import React from 'react'
 * import App, { Container } from 'next/app'
 * import { ApolloProvider } from 'react-apollo'
 * import nextApollo from 'secondwheel/nextApollo'
 * import ApolloClient from 'secondwheel/ApolloClient'
 *
 * class MyApp extends App {
 *   render () {
 *     const { Component, pageProps, client } = this.props
 *
 *     return (
 *       <Container>
 *         <ApolloProvider client={client}>
 *           <Component {...pageProps} />
 *         </ApolloProvider>
 *       </Container>
 *     )
 *   }
 * }
 *
 * export default nextApollo(
 *   props => new ApolloClient({ uri: 'http://localhost:4000', ...props })
 * )(MyApp)
 */
const nextApollo = (
  getClient/*: (props: Object, ctx?: Object) => ApolloClient */,
  getProps/*: (ctx: Object) => ?Object | Promise<?Object> */ = noop
) => (app/*: App */) => class extends PureComponent/*:: <any> */ {
  /*:: client: ApolloClient; */

  static async getInitialProps (config/*: Object */) {
    const { Component, router, ctx } = config
    const props = {
      ...(app.getInitialProps ? await app.getInitialProps(config) : {}),
      ...(await getProps(ctx))
    }
    const client = getClient(props, ctx)

    if (isNode) {
      try {
        await getDataFromTree(
          createElement(app, { ...props, Component, router, client })
        )
      } catch (error) {
        console.error('Error while running `getDataFromTree`', error)
      }
      Head.rewind()
    }

    return { ...props, cache: client.cache.extract() }
  }

  constructor (props/*: Object */) {
    super(props)

    this.client = getClient(props)
  }

  render () {
    return createElement(app, { ...this.props, client: this.client })
  }
}

module.exports = nextApollo
