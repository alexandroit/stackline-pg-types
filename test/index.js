
'use strict'

var assert = require('node:assert/strict')
var legacyAssert = require('node:assert')
var test = require('node:test')
var getTypeParser = require('../').getTypeParser
var types = require('./types')

var assertions = {
  equal: function (actual, expected, message) {
    assert.equal(actual, expected, message)
  },
  deepEqual: function (actual, expected, message) {
    legacyAssert.deepEqual(actual, expected, message)
  },
  ok: function (value, message) {
    assert.ok(value, message)
  }
}

Object.keys(types).forEach(function (typeName) {
  test(typeName, function () {
    var type = types[typeName]
    var parser = getTypeParser(type.id, type.format)
    type.tests.forEach(function (tests) {
      var input = tests[0]
      var expected = tests[1]
      var result = parser(input)
      if (typeof expected === 'function') {
        return expected(assertions, result)
      }
      assert.equal(result, expected)
    })
  })
})
