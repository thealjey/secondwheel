/* @flow */

const cloneDeep = require('lodash/cloneDeep')
const set = require('lodash/set')
const get = require('lodash/get')
const has = require('lodash/has')
const isArray = require('lodash/isArray')
const map = require('lodash/map')
const reject = require('lodash/reject')
const concat = require('lodash/concat')
const includes = require('lodash/includes')
const toPath = require('lodash/toPath')
const forEach = require('lodash/forEach')
const merge = require('lodash/merge')
const tail = require('lodash/tail')

/**
 * {@link cookie} configuration options
 * @typedef {Object} SubscriptionPayload
 * @property {'CREATED' | 'UPDATED' | 'DELETED'} mutation
 * @property {Object | Object[]} node
 * @example
 * import type { SubscriptionPayload } from 'secondwheel/subscription'
 */

/** @namespace subscription */

/*::
export type SubscriptionPayload = {
  mutation: 'CREATED' | 'UPDATED' | 'DELETED';
  node: Object | Object[];
}
*/

const updateItem = (
  result/*: Object */,
  path/*: string[] */,
  values/*: any */
) => {
  if (path.length) {
    const child = result[path[0]]
    const newPath = tail(path)

    if (child) {
      if (isArray(child)) {
        forEach(child, item => {
          updateItem(item, newPath, values)
        })
      } else {
        updateItem(child, newPath, values)
      }
    }
  } else {
    forEach(values, value => {
      if (
        has(result, 'id') &&
        has(value, 'id') &&
        result.id == value.id // eslint-disable-line eqeqeq
      ) {
        merge(result, value)
      }
    })
  }
}

const updateList = (
  result/*: Object */,
  path/*: string */,
  callback/*: (arr: any[]) => any[] */
)/*: Object */ => {
  const clone = cloneDeep(result)

  return set(clone, path, callback(get(clone, path, [])))
}

/**
 * updates object to reflect created nodes at path
 *
 * @memberof subscription
 * @example
 * import { created } from 'secondwheel/subscription'
 *
 * const newData = created(data, 'path.to.nested.list', payload)
 */
const created = (
  result/*: Object */,
  path/*: string */,
  payload/*: SubscriptionPayload */
)/*: Object */ =>
  payload.mutation === 'CREATED'
    ? updateList(result, path, arr => concat(arr, payload.node))
    : result

exports.created = created

/**
 * updates object to reflect updated nodes at path
 *
 * @memberof subscription
 * @example
 * import { updated } from 'secondwheel/subscription'
 *
 * const newData = updated(data, 'path', payload)
 */
const updated = (
  result/*: Object */,
  path/*: string */,
  payload/*: SubscriptionPayload */
)/*: Object */ => {
  let clone

  return payload.mutation !== 'UPDATED'
    ? result
    : (
      (clone = cloneDeep(result)),
      updateItem(clone, toPath(path),
        isArray(payload.node) ? payload.node : [payload.node]),
      clone
    )
}

exports.updated = updated

/**
 * updates object to reflect deleted nodes at path
 *
 * @memberof subscription
 * @example
 * import { deleted } from 'secondwheel/subscription'
 *
 * const newData = deleted(data, 'path', payload)
 */
const deleted = (
  result/*: Object */,
  path/*: string */,
  payload/*: SubscriptionPayload */
)/*: Object */ => {
  let ids

  return payload.mutation !== 'DELETED'
    ? result
    : (
      (ids = map(isArray(payload.node) ? payload.node : [payload.node], 'id')),
      updateList(
        result,
        path,
        arr => reject(arr, ({ id }) => includes(ids, id))
      )
    )
}

exports.deleted = deleted
