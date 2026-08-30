import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  access,
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const destination = path.join(root, 'release-candidate')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function npmRun(arguments_, cwd = root) {
  return execFileSync(npm, arguments_, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  })
}

function command(executable, arguments_) {
  return execFileSync(executable, arguments_, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim()
}

function digest(algorithm, bytes, encoding = 'hex') {
  return createHash(algorithm).update(bytes).digest(encoding)
}

async function pack(directory, cwd = root) {
  const output = npmRun([
    'pack', '--silent', '--json', '--ignore-scripts',
    '--pack-destination', directory
  ], cwd).trim()
  const jsonStart = output.lastIndexOf('\n[')
  const result = JSON.parse(jsonStart === -1 ? output : output.slice(jsonStart + 1))
  assert.equal(result.length, 1)
  const archive = path.join(directory, result[0].filename)
  return { details: result[0], archive, bytes: await readFile(archive) }
}

try {
  await access(destination)
  throw new Error(`release candidate already exists: ${destination}`)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

execFileSync(npm, ['run', 'verify'], {
  cwd: root,
  env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
  stdio: 'inherit'
})

assert.equal(command('git', ['status', '--porcelain', '--untracked-files=normal']), '',
  'release source must be committed and the worktree must be clean')

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const expectedTag = `stackline-v${packageJson.version}`
const tagsAtHead = command('git', ['tag', '--points-at', 'HEAD']).split('\n')
assert(tagsAtHead.includes(expectedTag), `${expectedTag} must point at the frozen source commit`)

let staging = await mkdtemp(path.join(root, '.release-candidate-staging-'))

try {
  const sourceStaging = await mkdtemp(path.join(staging, '.source-'))
  const trackedFiles = command('git', ['ls-files', '-z']).split('\0').filter(Boolean)
  for (const file of trackedFiles) {
    const target = path.join(sourceStaging, file)
    await mkdir(path.dirname(target), { recursive: true })
    await copyFile(path.join(root, file), target)
    await chmod(target, 0o644)
  }

  const packed = await pack(staging, sourceStaging)
  assert(packed.details.files.every(({ mode }) => mode === 0o644),
    'every shipped regular file must have mode 0644')
  await rm(sourceStaging, { force: true, recursive: true })

  const sha1 = digest('sha1', packed.bytes)
  const sha256 = digest('sha256', packed.bytes)
  const sha512 = digest('sha512', packed.bytes)
  const integrity = `sha512-${digest('sha512', packed.bytes, 'base64')}`
  assert.equal(packed.details.shasum, sha1)
  assert.equal(packed.details.integrity, integrity)

  const manifest = {
    schema: 'stackline-release-artifact-v1',
    package: `${packed.details.name}@${packed.details.version}`,
    filename: packed.details.filename,
    sha1,
    sha256,
    sha512,
    integrity,
    packedSize: packed.details.size,
    unpackedSize: packed.details.unpackedSize,
    entryCount: packed.details.entryCount,
    modePolicy: 'all shipped regular files are 0644',
    sourceCommit: command('git', ['rev-parse', 'HEAD']),
    sourceTag: expectedTag,
    builder: {
      node: process.version,
      npm: command(npm, ['--version']),
      platform: `${process.platform}-${process.arch}`,
      environment: 'local-stackline-release-gate'
    },
    files: packed.details.files.map(({ path: file, size, mode }) => ({ file, size, mode }))
  }

  await writeFile(path.join(staging, 'artifact-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n')
  await writeFile(path.join(staging, 'inventory.json'),
    JSON.stringify({ package: manifest.package, files: manifest.files }, null, 2) + '\n')
  await writeFile(path.join(staging, 'SHA1SUMS'), `${sha1}  ${packed.details.filename}\n`)
  await writeFile(path.join(staging, 'SHA256SUMS'), `${sha256}  ${packed.details.filename}\n`)
  await writeFile(path.join(staging, 'SHA512SUMS'), `${sha512}  ${packed.details.filename}\n`)

  const licenses = {
    package: { name: packageJson.name, license: 'MIT', file: 'LICENSE' },
    productionDependencies: [],
    maintainedInTreeSources: [
      { name: 'pg-int8', version: '1.0.1', license: 'ISC', file: 'licenses/pg-int8-1.0.1-ISC.txt' },
      { name: 'postgres-array', version: '2.0.0', license: 'MIT', file: 'licenses/postgres-array-2.0.0-MIT.txt' },
      { name: 'postgres-bytea', version: '1.0.1', license: 'MIT', file: 'licenses/postgres-bytea-1.0.1-MIT.txt' },
      { name: 'postgres-date', version: '1.0.7', license: 'MIT', file: 'licenses/postgres-date-1.0.7-MIT.txt' },
      { name: 'postgres-interval', version: '1.2.0', license: 'MIT', file: 'licenses/postgres-interval-1.2.0-MIT.txt' }
    ],
    notices: ['NOTICE', 'THIRD_PARTY_LICENSES.md']
  }
  await writeFile(path.join(staging, 'licenses.json'), JSON.stringify(licenses, null, 2) + '\n')

  const provenance = {
    compatibilityBaseline: {
      package: 'pg-types@2.2.0',
      commit: 'd9d9dfb87eb50914043cbc178c301b7dd3b0c50d',
      shasum: '2d0250d636454f7cfa3b6ae0382fdfa8063254a3',
      integrity: 'sha512-qTAAlrEsl8s4OiEQY69wDvcMIdQN6wdz5ojQiOy6YRMuynxenON0O5oCpJI6lshc6scgAY8qvJ2On/p+CXY0GA=='
    },
    sourcePackages: [
      ['pg-int8', '1.0.1', '943bd463bf5b71b4170115f80f8efc9a0c0eb78c', 'sha512-WCtabS6t3c8SkpDBUlb1kjOs7l66xsGdKpIPZsg4wR+B3+u9UAum2odSsF9tnvxg80h4ZxLWMy4pRjOsFIqQpw==', 'f991b0a41119bce0efbb471275dbd02de31a79fe6f87f8f5e5678e373a0f1627'],
      ['postgres-array', '2.0.0', '48f8fce054fbc69671999329b8834b772652d82e', 'sha512-VpZrUqU5A69eQyW2c5CA1jtLecCsN2U/bD6VilrFDWq5+5UIEVO7nazS3TEcHf1zuPYO/sqGvUvW62g86RXZuA==', '807ba580ed423e518672c27b4022a56acb693be04349733ffc1fe6f324fbcee2'],
      ['postgres-bytea', '1.0.1', 'c40b3da0222c500ff1e51c5d7014b60b79697c7a', 'sha512-5+5HqXnsZPE65IJZSMkZtURARZelel2oXUEO8rH83VS/hxH5vv1uHquPg5wZs8yMAfdv971IU+kcPUczi7NVBQ==', 'c078b99e1009c4bcf6e3ab59d9fe808b12caee3461204ae599cdd9cccd990801'],
      ['postgres-date', '1.0.7', '51bc086006005e5061c591cee727f2531bf641a8', 'sha512-suDmjLVQg78nMK2UZ454hAG+OAW+HQPZ6n++TNDUX+L0+uUlLywnoxJKDou51Zm+zTCjrCl0Nq6J9C5hP9vK/Q==', '3a9e22b7c7e286531bc73914726f40b733e61ebdb81ab64717f739065ab1804a'],
      ['postgres-interval', '1.2.0', 'b460c82cb1587507788819a06aa0fffdb3544695', 'sha512-9ZhXKM/rw350N1ovuWHbGxnGh/SNJ4cnxHiM0rxE4VN41wsg8P8zWn9hv/buK00RP4WvlOyr/RBDiptyxVbkZQ==', '051ce8b21c7347b9470190fa17909da7d35d648ec8fc27ce1a333da6042bab64']
    ].map(([name, version, shasum, sourceIntegrity, inTreeSha256]) => ({
      package: `${name}@${version}`,
      shasum,
      integrity: sourceIntegrity,
      inTreeSha256
    }))
  }
  await writeFile(path.join(staging, 'source-provenance.json'),
    JSON.stringify(provenance, null, 2) + '\n')
  await copyFile(path.join(root, 'CHANGELOG.md'), path.join(staging, 'RELEASE_NOTES.md'))

  const sbomConsumer = await mkdtemp(path.join(staging, '.sbom-consumer-'))
  await writeFile(path.join(sbomConsumer, 'package.json'), JSON.stringify({
    name: 'stackline-pg-types-sbom-consumer',
    private: true,
    version: '1.0.0'
  }, null, 2) + '\n')
  npmRun([
    'install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund',
    packed.archive
  ], sbomConsumer)
  const sbom = npmRun(['sbom', '--omit=dev', '--sbom-format', 'cyclonedx'], sbomConsumer)
  const parsedSbom = JSON.parse(sbom)
  const components = [
    parsedSbom.metadata && parsedSbom.metadata.component,
    ...(parsedSbom.components || [])
  ].filter(Boolean)
  const packageComponent = components.find(({ name, version }) =>
    name === '@stackline/pg-types' && version === packageJson.version)
  assert(packageComponent, 'SBOM must contain the release package')
  const packageEdge = (parsedSbom.dependencies || []).find(({ ref }) =>
    ref === packageComponent['bom-ref'])
  assert(packageEdge, 'SBOM must contain the package dependency edge')
  assert.deepEqual(packageEdge.dependsOn || [], [], 'release package must have no runtime dependencies')
  await writeFile(path.join(staging, 'sbom.cdx.json'), sbom)
  await rm(sbomConsumer, { force: true, recursive: true })

  await rename(staging, destination)
  staging = null
  console.log(`Prepared immutable ${packed.details.filename} (${sha256}).`)
} finally {
  if (staging) await rm(staging, { force: true, recursive: true })
}
