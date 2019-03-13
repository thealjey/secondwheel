/* @flow */

const { describe, it } = require('mocha')
const { strictEqual, ok } = require('assert')
const env = require('../env')
const { join } = require('path')
const { stub } = require('sinon')

describe('env', () => {
  it('should throw on example mismatch', () => {
    try {
      env({
        path: join(__dirname, 'fixture', '.env.mismatch'),
        example: join(__dirname, 'fixture', '.env.example')
      })
    } catch (error) {
      strictEqual(error.name, 'EnvError')
      strictEqual(error.missing.size, 1)
      ok(error.missing.has('TEST2'))
    }
  })

  it('should throw on invalid interpolation', () => {
    try {
      env({
        path: join(__dirname, 'fixture', '.env.interpolation'),
        example: join(__dirname, 'fixture', '.env.example')
      })
    } catch (error) {
      strictEqual(error.name, 'EnvError')
      strictEqual(error.missing.size, 1)
      ok(error.missing.has('TEST_VAR'))
    }
  })

  it('valid', () => {
    env({
      path: join(__dirname, 'fixture', '.env.valid'),
      example: join(__dirname, 'fixture', '.env.example')
    })
    strictEqual(process.env.SUB_VAR, 'world')
    strictEqual(process.env.TEST_VAR, 'world')
    strictEqual(process.env.TEST1, 'foo')
    strictEqual(process.env.TEST2, 'hello world')
    strictEqual(process.env.TEST3, 'bar')

    const log = stub(console, 'log')

    env({
      path: join(__dirname, 'fixture', '.env.valid'),
      example: join(__dirname, 'fixture', '.env.example')
    })

    ok(!log.called)

    log.restore()
  })

  it('debug', () => {
    const log = stub(console, 'log')

    env({
      path: join(__dirname, 'fixture', '.env.valid'),
      example: join(__dirname, 'fixture', '.env.example'),
      debug: true
    })

    ok(log.calledWithExactly('"SUB_VAR" is already defined in process.env'))
    ok(log.calledWithExactly('"TEST_VAR" is already defined in process.env'))
    ok(log.calledWithExactly('"TEST1" is already defined in process.env'))
    ok(log.calledWithExactly('"TEST2" is already defined in process.env'))
    ok(log.calledWithExactly('"TEST3" is already defined in process.env'))

    log.restore()
  })
})
