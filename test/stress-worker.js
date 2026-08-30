'use strict'

var types = require('../')
var name = process.argv[2]
var size = 2 * 1024 * 1024
var input
var parser

if (name === 'date') {
  parser = types.getTypeParser(types.builtins.DATE)
  input = new Array(size + 1).join('9') + 'x'
} else if (name === 'timestamp') {
  parser = types.getTypeParser(types.builtins.TIMESTAMP)
  input = '2026-08-30 12:00:00' + new Array(size + 1).join('x')
} else if (name === 'interval') {
  parser = types.getTypeParser(types.builtins.INTERVAL)
  input = new Array(size + 1).join(' ') + 'x'
} else if (name === 'array') {
  parser = types.getTypeParser(1009)
  input = '{' + new Array(Math.floor(size / 2) + 1).join('x,') + 'x}'
} else if (name === 'bytea') {
  parser = types.getTypeParser(types.builtins.BYTEA)
  input = new Array(size + 1).join('\\')
} else {
  throw new Error('unknown stress case: ' + name)
}

try {
  parser(input)
} catch (error) {
  if (!(error instanceof Error)) throw error
}
