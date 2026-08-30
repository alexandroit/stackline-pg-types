import { rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))

for (const directory of ['coverage', '.nyc_output']) {
  await rm(path.join(root, directory), { force: true, recursive: true })
}
