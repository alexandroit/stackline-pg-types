import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))

assert.equal(packageJson.name, '@stackline/pg-types')
assert.equal(packageJson.main, './index.js')
assert.equal(packageJson.module, './index.mjs')
assert.equal(packageJson.types, './index.d.ts')
assert.deepEqual(packageJson.dependencies, {})

for (const file of [
  'index.js',
  'index.mjs',
  'index.d.ts',
  'index.d.cts',
  'index.d.mts',
  'LICENSE',
  'NOTICE',
  'SECURITY.md'
]) {
  await access(path.join(root, file))
}

async function JavaScriptFiles(directory) {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name)
    if (entry.isDirectory()) output.push(...await JavaScriptFiles(location))
    else if (entry.name.endsWith('.js')) output.push(location)
  }
  return output
}

for (const file of [path.join(root, 'index.js'), ...await JavaScriptFiles(path.join(root, 'lib'))]) {
  const source = await readFile(file, 'utf8')
  for (const match of source.matchAll(/require\(['"]([^'"]+)['"]\)/g)) {
    assert.ok(match[1].startsWith('.'), `${path.relative(root, file)} imports external runtime package ${match[1]}`)
  }
}

const timestampParser = await readFile(path.join(root, 'lib/vendor/postgres-date/index.js'), 'utf8')
assert.match(timestampParser, /var DATE_TIME = \/\^/)

console.log('Dependency-free CommonJS source build passed.')
