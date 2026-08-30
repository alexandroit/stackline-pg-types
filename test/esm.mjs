import assert from 'node:assert/strict'
import types, {
  TypeId,
  arrayParser,
  builtins,
  getTypeParser,
  setTypeParser
} from '../index.mjs'

assert.equal(types.builtins, builtins)
assert.equal(TypeId, builtins)
assert.equal(getTypeParser(builtins.INT4)('42'), 42)
assert.equal(typeof arrayParser.create, 'function')
setTypeParser(999998, (value) => `esm:${value}`)
assert.equal(getTypeParser(999998)('ok'), 'esm:ok')
console.log('CommonJS default and synthetic ESM named exports passed.')
