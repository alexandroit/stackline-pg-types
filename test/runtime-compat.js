'use strict'

var assert = require('assert')
var types = require('../')

assert.deepEqual(Object.keys(types), [
  'getTypeParser',
  'setTypeParser',
  'arrayParser',
  'builtins'
])
assert.equal(types.getTypeParser(types.builtins.INT4)('42'), 42)
assert.equal(types.getTypeParser(types.builtins.INT8)('9223372036854775807'), '9223372036854775807')
assert.deepEqual(types.getTypeParser(1007)('{1,2,NULL}'), [1, 2, null])
types.setTypeParser(999999, function (value) { return 'custom:' + value })
assert.equal(types.getTypeParser(999999)('ok'), 'custom:ok')
assert.equal(Object.prototype.polluted, undefined)
console.log('pg-types 2.2.0 runtime contract passed')
