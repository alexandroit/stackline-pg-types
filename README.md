# @stackline/pg-types

[![npm](https://img.shields.io/npm/v/@stackline/pg-types)](https://www.npmjs.com/package/@stackline/pg-types)
[![downloads](https://img.shields.io/npm/dm/@stackline/pg-types)](https://www.npmjs.com/package/@stackline/pg-types)
[![CI](https://github.com/alexandroit/stackline-pg-types/actions/workflows/ci.yml/badge.svg)](https://github.com/alexandroit/stackline-pg-types/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@stackline/pg-types)](LICENSE)

Dependency-free PostgreSQL result parsers with the public CommonJS and
TypeScript contract of `pg-types@2.2.0`. This independent, maintained fork is
the compatibility leaf used by `@stackline/pg`.

## Install

Direct scoped use:

```bash
npm install @stackline/pg-types
```

Drop-in replacement without changing existing imports:

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

## Compatibility

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

See [COMPATIBILITY.md](COMPATIBILITY.md) and [MIGRATION.md](MIGRATION.md) for
the complete contract.

## Dependency Standard

The published package has zero runtime dependencies. Exact source from the
five historical parser dependencies is maintained in-tree so an abandoned
transitive package cannot re-enter the install graph. Every release verifies
a warning-free packed install, `npm ls --all`, production and full audits,
license inventory, package metadata and runtime/type matrices.

The source inventory and license notices are documented in
[DEPENDENCY_REVIEW.md](DEPENDENCY_REVIEW.md) and
[THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Security

Report vulnerabilities through [GitHub private vulnerability
reporting](https://github.com/alexandroit/stackline-pg-types/security/advisories/new).
Do not disclose an unpatched vulnerability in a public issue. See
[SECURITY.md](SECURITY.md).

## Documentation

Public documentation: https://alexandro.net/docs/vanilla/pg-types/

## License

MIT. This fork preserves Brian M. Carlson's original notice and the complete
notices for derived parser source. See [LICENSE](LICENSE), [NOTICE](NOTICE) and
[THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
