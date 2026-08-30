import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const ignored = new Set(['.git', 'coverage', 'node_modules', 'release-candidate'])
const files = []

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue
    const location = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(location)
    else if (/\.(?:js|mjs)$/.test(entry.name)) files.push(location)
  }
}

await walk(root)

for (const file of files.sort()) {
  const source = await readFile(file, 'utf8')
  if (source.includes('\r')) throw new Error(`${path.relative(root, file)} contains CRLF`)
  if (!source.endsWith('\n')) throw new Error(`${path.relative(root, file)} must end with a newline`)
  source.split('\n').forEach((line, index) => {
    if (/[ \t]+$/.test(line)) {
      throw new Error(`${path.relative(root, file)}:${index + 1} has trailing whitespace`)
    }
  })
  execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' })
}

console.log(`Syntax and whitespace checks passed for ${files.length} JavaScript files.`)
