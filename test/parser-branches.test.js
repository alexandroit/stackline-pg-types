'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')
var types = require('../')

function binary(oid) {
  return types.getTypeParser(oid, 'binary')
}

test('binary signed integers and IEEE-754 edge values', function () {
  assert.equal(binary(types.builtins.INT2)([0xff, 0xff]), -1)
  assert.equal(binary(types.builtins.INT4)([0xff, 0xff, 0xff, 0xfe]), -2)

  var float32 = Buffer.alloc(4)
  float32.writeFloatBE(-12.5)
  assert.equal(binary(types.builtins.FLOAT4)(float32), -12.5)

  var zero = Buffer.alloc(8)
  var infinity = Buffer.alloc(8)
  var negativeInfinity = Buffer.alloc(8)
  var notANumber = Buffer.alloc(8)
  infinity.writeDoubleBE(Infinity)
  negativeInfinity.writeDoubleBE(-Infinity)
  notANumber.writeDoubleBE(NaN)
  assert.equal(binary(types.builtins.FLOAT8)(zero), 0)
  assert.equal(binary(types.builtins.FLOAT8)(infinity), Infinity)
  assert.equal(binary(types.builtins.FLOAT8)(negativeInfinity), -Infinity)
  // pg-types 2.2.0 historically maps a binary IEEE NaN payload to Infinity.
  // Keep that edge behavior in the compatibility major.
  assert.equal(binary(types.builtins.FLOAT8)(notANumber), Infinity)
})

test('binary int8 supports negative and intermediate magnitudes', function () {
  var negative = Buffer.alloc(8)
  var medium = Buffer.alloc(8)
  negative.writeBigInt64BE(-9223372036854775808n)
  medium.writeBigInt64BE(4294967297n)
  assert.equal(binary(types.builtins.INT8)(negative), '-9223372036854775808')
  assert.equal(binary(types.builtins.INT8)(medium), '4294967297')
})

test('binary numeric handles PostgreSQL NaN', function () {
  var numericNaN = Buffer.from([0, 0, 0, 0, 0xc0, 0, 0, 0])
  assert.equal(Number.isNaN(binary(types.builtins.NUMERIC)(numericNaN)), true)
})

test('binary timestamps preserve UTC/local mode and microseconds', function () {
  var oneDayAndMicros = Buffer.alloc(8)
  oneDayAndMicros.writeBigInt64BE(86400000005n)

  var utc = binary(types.builtins.TIMESTAMPTZ)(oneDayAndMicros)
  var local = binary(types.builtins.TIMESTAMP)(oneDayAndMicros)
  assert.equal(utc.toISOString(), '2000-01-02T00:00:00.000Z')
  assert.equal(utc.getMicroSeconds(), 5)
  utc.setMicroSeconds(42)
  assert.equal(utc.getUTCMicroSeconds(), 42)
  assert.equal(local instanceof Date, true)
})

function binaryArray(elementType, values) {
  var chunks = []
  var header = Buffer.alloc(20)
  header.writeInt32BE(1, 0)
  header.writeInt32BE(0, 4)
  header.writeInt32BE(elementType, 8)
  header.writeInt32BE(values.length, 12)
  header.writeInt32BE(1, 16)
  chunks.push(header)

  values.forEach(function (value) {
    var length = Buffer.alloc(4)
    if (value === null) {
      length.writeUInt32BE(0xffffffff)
      chunks.push(length)
      return
    }
    var body = elementType === 25 ? Buffer.from(value) : Buffer.alloc(4)
    if (elementType !== 25) body.writeInt32BE(value)
    length.writeInt32BE(body.length)
    chunks.push(length, body)
  })
  return Buffer.concat(chunks)
}

test('binary arrays parse integer, text and null elements', function () {
  assert.deepEqual(binary(1007)(binaryArray(23, [1, null, 3])), [1, null, 3])
  assert.deepEqual(binary(1009)(binaryArray(25, ['one', 'two'])), ['one', 'two'])
})

test('date parser covers infinity, BC, timezone and small-year branches', function () {
  var parseDate = types.getTypeParser(types.builtins.TIMESTAMPTZ)
  assert.equal(parseDate('infinity'), Infinity)
  assert.equal(parseDate('-infinity'), -Infinity)
  assert.equal(parseDate('0001-01-01 BC').getFullYear(), 0)
  assert.equal(parseDate('0099-01-01').getFullYear(), 99)
  assert.equal(parseDate('0099-01-01 00:00:00+01').getUTCFullYear(), 98)
  assert.equal(parseDate('2026-08-30 12:00:00Z').toISOString(), '2026-08-30T12:00:00.000Z')
})

test('interval parser supports constructor and formatting branches', function () {
  var parseInterval = types.getTypeParser(types.builtins.INTERVAL)
  var empty = parseInterval('')
  var fractional = parseInterval('2 years 3 mons 4 days 05:06:07.008009')
  assert.equal(empty.toPostgres(), '0')
  assert.equal(fractional.toPostgres(), '7.008009 seconds 6 minutes 5 hours 4 days 3 months 2 years')
  assert.equal(fractional.toISO(), 'P2Y3M4DT5H6M7.008009S')
  assert.equal(fractional.toISOString(), fractional.toISO())
})
