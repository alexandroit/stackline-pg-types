'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')

function freshTypes () {
  delete require.cache[require.resolve('../')]
  return require('../')
}

test('dangerous format names cannot mutate Object.prototype', function () {
  var types = freshTypes()
  var before = Object.getOwnPropertyNames(Object.prototype)
  var formats = ['__proto__', 'prototype', 'constructor']

  formats.forEach(function (format) {
    assert.throws(function () {
      types.setTypeParser('stacklinePolluted', format, function () {
        return true
      })
    }, TypeError)
    assert.equal(types.getTypeParser('stacklinePolluted', format)('value'), 'value')
  })

  assert.equal(Object.prototype.stacklinePolluted, undefined)
  assert.deepEqual(Object.getOwnPropertyNames(Object.prototype), before)
})

test('dangerous OID-like keys remain isolated in null-prototype registries', function () {
  var types = freshTypes()
  var before = Object.getOwnPropertyNames(Object.prototype)

  ;['__proto__', 'prototype', 'constructor'].forEach(function (oid) {
    types.setTypeParser(oid, function (value) {
      return 'safe:' + value
    })
    assert.equal(types.getTypeParser(oid)('value'), 'safe:value')
  })

  assert.equal(Object.prototype.value, undefined)
  assert.deepEqual(Object.getOwnPropertyNames(Object.prototype), before)
})

test('JSON and array values containing dangerous keys do not pollute prototypes', function () {
  var types = freshTypes()
  var json = '{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}}}'
  var parsed = types.getTypeParser(types.builtins.JSON)(json)
  var array = types.getTypeParser(1009)('{__proto__,prototype,constructor}')

  assert.equal(Object.prototype.polluted, undefined)
  assert.equal(Object.prototype.hasOwnProperty.call(parsed, '__proto__'), true)
  assert.deepEqual(array, ['__proto__', 'prototype', 'constructor'])
})

test('malformed timestamp prefixes return null without scanning for an embedded date', function () {
  var types = freshTypes()
  var parseDate = types.getTypeParser(types.builtins.DATE)
  assert.equal(parseDate('attacker-prefix 2026-08-30 12:00:00'), null)
  assert.equal(parseDate('2026-08-30-not-a-timestamp'), null)
})
