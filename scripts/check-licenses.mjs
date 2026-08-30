import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'))
const license = await readFile(path.join(root, 'LICENSE'), 'utf8')
const notice = await readFile(path.join(root, 'NOTICE'), 'utf8')
const inventory = await readFile(path.join(root, 'THIRD_PARTY_LICENSES.md'), 'utf8')

assert.deepEqual(packageJson.dependencies, {})
assert.match(license, /Brian M\. Carlson/)
assert.match(notice, /brianc\/node-pg-types/)

const expected = [
  ['pg-int8', '1.0.1', 'ISC', 'pg-int8-1.0.1-ISC.txt', /Charmander/, 'f991b0a41119bce0efbb471275dbd02de31a79fe6f87f8f5e5678e373a0f1627'],
  ['postgres-array', '2.0.0', 'MIT', 'postgres-array-2.0.0-MIT.txt', /Ben Drucker/, '807ba580ed423e518672c27b4022a56acb693be04349733ffc1fe6f324fbcee2'],
  ['postgres-bytea', '1.0.1', 'MIT', 'postgres-bytea-1.0.1-MIT.txt', /Ben Drucker/, 'c078b99e1009c4bcf6e3ab59d9fe808b12caee3461204ae599cdd9cccd990801'],
  ['postgres-date', '1.0.7', 'MIT', 'postgres-date-1.0.7-MIT.txt', /Ben Drucker/, '3a9e22b7c7e286531bc73914726f40b733e61ebdb81ab64717f739065ab1804a'],
  ['postgres-interval', '1.2.0', 'MIT', 'postgres-interval-1.2.0-MIT.txt', /Ben Drucker/, '051ce8b21c7347b9470190fa17909da7d35d648ec8fc27ce1a333da6042bab64']
]

for (const [name, version, licenseId, filename, copyright, sourceSha256] of expected) {
  const text = await readFile(path.join(root, 'licenses', filename), 'utf8')
  const source = await readFile(path.join(root, 'lib', 'vendor', name, 'index.js'))
  assert.match(text, copyright, `${name} full license notice`)
  assert.equal(createHash('sha256').update(source).digest('hex'), sourceSha256,
    `${name} reviewed in-tree source hash`)
  assert.match(inventory, new RegExp(`${name.replaceAll('-', '\\-')}@${version}`))
  assert.match(inventory, new RegExp(`\\| ${licenseId.replace('-', '\\-')} \\|`))
}

const productionLocations = Object.entries(lock.packages)
  .filter(([location, metadata]) => location && !metadata.dev)
  .map(([location]) => location)
assert.deepEqual(productionLocations, [])

console.log('License provenance passed and the installed production graph is empty.')
