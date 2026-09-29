# @stackline/pg-types

> Dependency-free PostgreSQL type parsers compatible with pg-types 2.2.0.

[![npm version](https://img.shields.io/npm/v/@stackline/pg-types.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/pg-types)
[![license](https://img.shields.io/npm/l/@stackline/pg-types.svg?style=flat-square)](https://github.com/alexandroit/stackline-pg-types)
[![GitHub repository](https://img.shields.io/badge/GitHub-alexandroit%2Fstackline-pg-types-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-pg-types)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/pg-types/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/pg-types/)** | **[npm](https://www.npmjs.com/package/@stackline/pg-types)** | **[Issues](https://github.com/alexandroit/stackline-pg-types/issues)** | **[Repository](https://github.com/alexandroit/stackline-pg-types)**

**Current package version:** `1.0.2`

---

## Why this package?

Dependency-free PostgreSQL result parsers with the public CommonJS and
TypeScript contract of `pg-types@2.2.0`. This independent, maintained fork is
the compatibility leaf used by `@stackline/pg`.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/pg-types@1.0.2` |
| Node.js runtime | `>=4` |
| CommonJS / primary entry | `./index.js` |
| ES module entry | `./index.mjs` |
| Type declarations | `./index.d.ts` |

- `getTypeParser(oid, format?)`
- `setTypeParser(oid, parser)`
- `setTypeParser(oid, format, parser)`
- `arrayParser.create(source, transform?)`
- `builtins`
- `TypeId` as the runtime value promised by the historical declarations
- CommonJS, Node.js 4 or newer and TypeScript 3.9 declarations
- historical `pg-types` package name through npm aliasing

Valid PostgreSQL values retain the `2.2.0` parser behavior. Dangerous parser
map keys are isolated, and malformed timestamp processing is bounded instead
of retrying a regular expression at every input position.

See [COMPATIBILITY.md](https://github.com/alexandroit/stackline-pg-types/blob/main/COMPATIBILITY.md) and [MIGRATION.md](https://github.com/alexandroit/stackline-pg-types/blob/main/MIGRATION.md) for
the complete contract.

## Installation

<a id="install"></a>

### Install

Direct scoped use:

```bash
npm install @stackline/pg-types
```

Drop-in replacement without changing existing imports:

## Usage

```bash
npm install pg-types@npm:@stackline/pg-types
```

```js
var types = require('pg-types')

types.setTypeParser(types.builtins.INT8, function (value) {
  return parseInt(value, 10)
})
```

The scoped form exposes the same API:

```js
var types = require('@stackline/pg-types')
var parseTimestamp = types.getTypeParser(types.builtins.TIMESTAMPTZ)

console.log(parseTimestamp('2026-08-30 12:00:00+00'))
```

## Features and Integrations

<a id="documentation"></a>

### Documentation

Public documentation: https://alexandro.net/docs/vanilla/pg-types/

## Security

Report vulnerabilities through [GitHub private vulnerability
reporting](https://github.com/alexandroit/stackline-pg-types/security/advisories/new).
Do not disclose an unpatched vulnerability in a public issue. See
[SECURITY.md](https://github.com/alexandroit/stackline-pg-types/blob/main/SECURITY.md).

## Local Development

```sh
git clone https://github.com/alexandroit/stackline-pg-types.git
cd stackline-pg-types
npm ci
npm run verify
```

Release tooling uses Node.js 24.20.0 and npm 11.19.0. The consumer runtime contract remains the one documented above.

## Consumer Smoke Test

Run the repository's existing consumer/package check after installing development dependencies:

```sh
npm run test:smoke
```

## Release Checklist

<a id="dependency-standard"></a>

### Dependency Standard

The published package has zero runtime dependencies. Exact source from the
five historical parser dependencies is maintained in-tree so an abandoned
transitive package cannot re-enter the install graph. Every release verifies
a warning-free packed install, `npm ls --all`, production and full audits,
license inventory, package metadata and runtime/type matrices.

The source inventory and license notices are documented in
[DEPENDENCY_REVIEW.md](https://github.com/alexandroit/stackline-pg-types/blob/main/DEPENDENCY_REVIEW.md) and
[THIRD_PARTY_LICENSES.md](https://github.com/alexandroit/stackline-pg-types/blob/main/THIRD_PARTY_LICENSES.md).

Run `npm run verify` and inspect the package contents before release. Publish a new version through the [GitHub Actions publishing workflow](https://github.com/alexandroit/stackline-pg-types/actions/workflows/publish.yml), using the SHA-512 digest of the reviewed tarball. Verify the exact published version, tarball integrity, and npm provenance after the run.

## License

MIT. This fork preserves Brian M. Carlson's original notice and the complete
notices for derived parser source. See [LICENSE](https://github.com/alexandroit/stackline-pg-types/blob/main/LICENSE), [NOTICE](https://github.com/alexandroit/stackline-pg-types/blob/main/NOTICE) and
[THIRD_PARTY_LICENSES.md](https://github.com/alexandroit/stackline-pg-types/blob/main/THIRD_PARTY_LICENSES.md).

## Credits and original authors

- Stackline Maintainers.
- Brian M. Carlson.
- Ben Drucker.
- Charmander.
- Copyright (c) 2014 Brian M. Carlson.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.
