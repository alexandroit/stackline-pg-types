'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')
var types = require('../')

test('exports the pg-types 2.2.0 root contract', function () {
  assert.deepEqual(Object.keys(types), [
    'getTypeParser',
    'setTypeParser',
    'arrayParser',
    'builtins'
  ])
  assert.equal(typeof types.getTypeParser, 'function')
  assert.equal(typeof types.setTypeParser, 'function')
  assert.equal(typeof types.arrayParser.create, 'function')
  assert.equal(types.TypeId, types.builtins)
  assert.equal(Object.prototype.propertyIsEnumerable.call(types, 'TypeId'), false)
  assert.equal(types.builtins.INT8, 20)
  assert.equal(types.builtins.TIMESTAMPTZ, 1184)
  assert.equal(types.builtins.JSONB, 3802)
})

test('preserves unknown parser fallback and both registration overloads', function () {
  assert.equal(types.getTypeParser(999999)('42'), '42')
  assert.equal(types.getTypeParser(999999, 'unknown')(42), '42')

  types.setTypeParser(999991, function (value) {
    return Number(value) + 1
  })
  assert.equal(types.getTypeParser(999991)('41'), 42)

  types.setTypeParser(999992, 'binary', function (value) {
    return value.readUInt8(0)
  })
  assert.equal(types.getTypeParser(999992, 'binary')(Buffer.from([42])), 42)
})

test('preserves arrayParser.create behavior', function () {
  var parser = types.arrayParser.create('{{1,2},{3,NULL}}', function (value) {
    return Number(value)
  })
  assert.deepEqual(parser.parse(), [[1, 2], [3, null]])
})

test('preserves representative text and binary parser outputs', function () {
  assert.equal(types.getTypeParser(types.builtins.INT8)('9223372036854775807'), '9223372036854775807')
  assert.equal(types.getTypeParser(types.builtins.BOOL)('t'), true)
  assert.deepEqual(types.getTypeParser(types.builtins.JSON)('{"ok":true}'), { ok: true })

  var maximum = Buffer.from('7fffffffffffffff', 'hex')
  assert.equal(types.getTypeParser(types.builtins.INT8, 'binary')(maximum), '9223372036854775807')
})
