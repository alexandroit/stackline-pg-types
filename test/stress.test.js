'use strict'

var assert = require('node:assert/strict')
var spawnSync = require('node:child_process').spawnSync
var path = require('node:path')
var test = require('node:test')

var worker = path.join(__dirname, 'stress-worker.js')

;['date', 'timestamp', 'interval', 'array', 'bytea'].forEach(function (name) {
  test(name + ' malformed multi-megabyte input is bounded', function () {
    var result = spawnSync(process.execPath, [worker, name], {
      encoding: 'utf8',
      timeout: 3000
    })

    assert.equal(result.error && result.error.code, undefined, result.error && result.error.message)
    assert.equal(result.signal, null, 'worker exceeded the hard deadline')
    assert.equal(result.status, 0, result.stderr)
  })
})
