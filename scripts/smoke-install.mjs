import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-pg-types-smoke-'))
const consumer = path.join(temporary, 'consumer')

function run(arguments_, cwd = root) {
  return execFileSync(npm, arguments_, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  })
}

try {
  await mkdir(consumer)
  const packedOutput = run([
    'pack', '--silent', '--json', '--ignore-scripts',
    '--pack-destination', temporary
  ]).trim()
  const jsonStart = packedOutput.lastIndexOf('\n[')
  const packed = JSON.parse(jsonStart === -1 ? packedOutput : packedOutput.slice(jsonStart + 1))
  assert.equal(packed.length, 1)

  await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
    name: 'stackline-pg-types-packed-consumer',
    private: true,
    version: '1.0.0',
    dependencies: {
      '@stackline/pg-types': `file:../${packed[0].filename}`,
      'pg-types': `file:../${packed[0].filename}`
    }
  }, null, 2) + '\n')

  const installOutput = run([
    'install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund'
  ], consumer)
  assert.doesNotMatch(installOutput, /npm (?:warn|error)/i)

  await writeFile(path.join(consumer, 'verify.cjs'), `
const assert = require('node:assert/strict')
const scoped = require('@stackline/pg-types')
const legacy = require('pg-types')
assert.deepEqual(Object.keys(scoped), Object.keys(legacy))
assert.equal(scoped.getTypeParser(scoped.builtins.INT4)('42'), 42)
assert.equal(legacy.getTypeParser(legacy.builtins.INT8)('9223372036854775807'), '9223372036854775807')
assert.deepEqual(scoped.getTypeParser(1007)('{1,2,NULL}'), [1, 2, null])
console.log('packed direct and legacy alias consumers passed')
`)
  execFileSync(process.execPath, ['verify.cjs'], { cwd: consumer, stdio: 'inherit' })

  await writeFile(path.join(consumer, 'verify.mjs'), `
import assert from 'node:assert/strict'
import scoped, { TypeId, getTypeParser } from '@stackline/pg-types'
import legacy from 'pg-types'
assert.equal(TypeId, scoped.builtins)
assert.equal(getTypeParser(TypeId.INT4)('42'), 42)
assert.equal(legacy.getTypeParser(legacy.builtins.BOOL)('t'), true)
console.log('packed ESM exports passed')
`)
  execFileSync(process.execPath, ['verify.mjs'], { cwd: consumer, stdio: 'inherit' })

  const scopedPackage = JSON.parse(await readFile(
    path.join(consumer, 'node_modules', '@stackline', 'pg-types', 'package.json'),
    'utf8'
  ))
  const legacyPackage = JSON.parse(await readFile(
    path.join(consumer, 'node_modules', 'pg-types', 'package.json'),
    'utf8'
  ))
  assert.deepEqual(scopedPackage.dependencies, {})
  assert.deepEqual(legacyPackage.dependencies, {})

  const tree = JSON.parse(run(['ls', '--omit=dev', '--all', '--json'], consumer))
  assert.equal(tree.problems, undefined)
  const productionAudit = JSON.parse(run(['audit', '--omit=dev', '--json'], consumer))
  const fullAudit = JSON.parse(run(['audit', '--json'], consumer))
  assert.equal(productionAudit.metadata.vulnerabilities.total, 0)
  assert.equal(fullAudit.metadata.vulnerabilities.total, 0)
  console.log('Packed install, recursive tree, and zero-audit gates passed.')
} finally {
  await rm(temporary, { force: true, recursive: true })
}
