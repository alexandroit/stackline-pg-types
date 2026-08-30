# Compatibility Policy

`@stackline/pg-types` is a dependency-free maintained fork of
`pg-types@2.2.0`.

## Preserved Contract

- `require("pg-types")` when installed through an npm alias;
- `require("@stackline/pg-types")` for direct scoped use;
- root exports `getTypeParser`, `setTypeParser`, `arrayParser` and `builtins`;
- text and binary parser registration overloads;
- all built-in OID constants from `2.2.0`;
- non-enumerable `TypeId` as a runtime alias of `builtins`, matching the
  historical TypeScript declaration while retaining the original root-key set;
- valid PostgreSQL scalar, array, date, interval, bytea, JSON and binary parser
  outputs covered by the complete upstream fixture set;
- CommonJS behavior and published `lib/*` files;
- explicit ESM default and named exports with the same function identities;
- Node.js 4 or newer;
- the original TypeScript declaration surface, compiled with TypeScript 3.9
  and the current compiler.

## Intentional Security Behavior

The keys `__proto__`, `prototype` and `constructor` cannot escape the parser
registry. Unknown formats still fail or fall back according to the original
method being used, but cannot mutate shared prototypes.

Malformed timestamp text is required to begin with a year. PostgreSQL already
emits that form; rejecting an attacker-controlled prefix removes the legacy
quadratic scan without changing valid database output.

## Version Mapping

| Stackline release | Upstream behavior baseline |
| --- | --- |
| `1.0.0+` | `pg-types@2.2.0` with dependency and security hardening |

Patch releases may add tests, documentation and non-breaking hardening. An
intentional public API break requires a new major version.
