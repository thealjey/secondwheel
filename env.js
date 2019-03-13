/* @flow */

const { parse } = require('dotenv')
const forOwn = require('lodash/forOwn')
const has = require('lodash/has')
const keys = require('lodash/keys')
const pull = require('lodash/pull')
const { readFileSync } = require('fs')
const { join } = require('path')

/*::
export type EnvOptions = {
  path?: string;
  example?: string;
  debug?: boolean;
}
*/

/**
 * @typedef {Object} EnvOptions
 * @param {string} [path='<cwd>/.env'] - a custom path if your file containing environment variables is located elsewhere
 * @param {string} [example='<cwd>/.env.example'] - path to example environment file
 * @param {boolean} [debug=false] - turns on logging to help debug why certain keys or values are not being set as you expect
 * @example
 * import type { EnvOptions } from 'secondwheel/env'
 */

/**
 * @typedef {Error} EnvError
 * @property {Set<string>} missing - a list of variable names
 */

const pattern = /\${\s*(\w+)\s*}/g

const interpolate = (value, parsed, missing) =>
  value.replace(pattern, (match, key) => {
    if (!has(parsed, key) && !has(process.env, key)) {
      missing.add(key)
    }
    return interpolate(process.env[key] || parsed[key] || '', parsed, missing)
  })

class EnvError extends Error {
  /*:: missing: Set<string>; */

  constructor (missing) {
    super(`missing environment variables: ${Array.from(missing).join(', ')}`)
    Error.captureStackTrace(this, EnvError)
    this.name = 'EnvError'
    this.missing = missing
  }
}

/**
 * Loads environment variables from a file.
 *
 * Performs validation based on the existence of variables rather than their value.
 * Hence, a variable with no value is considered declared.
 *
 * @throws {EnvError} validation failure
 * @example(properties)
 * # .env.example (every key defined here must also be present in the environment)
 * FULL_NAME=John Doe
 * PASSWORD=
 * @example(properties)
 * # .env (supports javascript-style interpolation)
 * AGE=30
 * LAST_NAME=Smith
 * FULL_NAME=${FIRST_NAME} ${LAST_NAME}
 * # EnvError: missing environment variables: FIRST_NAME, PASSWORD
 * @example
 * import env from 'secondwheel/env'
 *
 * env()
 *
 * // process.env is configured
 */
const env = (options/*: ?EnvOptions */) => {
  const cwd = process.cwd()
  const config = {
    path: join(cwd, '.env'),
    example: join(cwd, '.env.example'),
    debug: false,
    ...options
  }
  const { path, example, debug } = config
  const parsed = parse(readFileSync(path), config)
  const missing = new Set(
    pull(
      keys(parse(readFileSync(example), config)),
      ...keys(parsed),
      ...keys(process.env)
    )
  )

  forOwn(parsed, (value, key) => {
    parsed[key] = interpolate(value, parsed, missing)
  })

  if (missing.size) throw new EnvError(missing)

  forOwn(parsed, (value, key) => {
    if (!has(process.env, key)) {
      process.env[key] = value
    } else if (debug) {
      console.log(`"${key}" is already defined in process.env`)
    }
  })
}

module.exports = env
