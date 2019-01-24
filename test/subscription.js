/* @flow */

const { describe, it } = require('mocha')
const { deepStrictEqual } = require('assert')
const subscription = require('../subscription')

describe('subscription', () => {
  it('created', () => {
    const data = { path: { to: { list: [] } } }
    const node = { id: 5, value: 'test' }

    deepStrictEqual(
      subscription.created(data, 'path.to.list', { mutation: 'DELETED', node }),
      data
    )
    deepStrictEqual(
      subscription.created(data, 'path.to.list', { mutation: 'CREATED', node }),
      { path: { to: { list: [{ id: 5, value: 'test' }] } } }
    )
  })

  it('updated', () => {
    const data = { path: { to: { list: [{ id: 5, value: 'old' }] } } }
    const node = { id: 5, value: 'new' }

    deepStrictEqual(
      subscription.updated(data, 'path.to.list', { mutation: 'DELETED', node }),
      data
    )
    deepStrictEqual(
      subscription.updated(data, 'path.to.list', { mutation: 'UPDATED', node }),
      { path: { to: { list: [{ id: 5, value: 'new' }] } } }
    )
    deepStrictEqual(
      subscription.updated(data, 'path.to.list', { mutation: 'UPDATED', node: [node] }),
      { path: { to: { list: [{ id: 5, value: 'new' }] } } }
    )
  })

  it('deleted', () => {
    const data = { path: { to: { list: [{ id: 5, value: 'old' }] } } }
    const node = { id: 5, value: 'new' }

    deepStrictEqual(
      subscription.deleted(data, 'path.to.list', { mutation: 'UPDATED', node }),
      data
    )
    deepStrictEqual(
      subscription.deleted(data, 'path.to.list', { mutation: 'DELETED', node }),
      { path: { to: { list: [] } } }
    )
    deepStrictEqual(
      subscription.deleted(data, 'path.to.list', { mutation: 'DELETED', node: [node] }),
      { path: { to: { list: [] } } }
    )
  })
})
