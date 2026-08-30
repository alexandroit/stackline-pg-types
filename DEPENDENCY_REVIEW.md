# Production Dependency Review

Review date: 2026-08-30. Recheck by: 2026-11-30.

## Published Runtime Graph

`@stackline/pg-types@1.0.0` declares zero runtime dependencies. Its recursive
production graph therefore stops at the package root.

## Maintained In-Tree Components

| Component baseline | License | Runtime dependencies removed | Decision |
| --- | --- | ---: | --- |
| `pg-int8@1.0.1` | ISC | 0 | Preserve the exact binary `int8` parser in-tree |
| `postgres-array@2.0.0` | MIT | 0 | Preserve the exact array contract in-tree |
| `postgres-bytea@1.0.1` | MIT | 0 | Preserve the exact bytea decoder in-tree |
| `postgres-date@1.0.7` | MIT | 0 | Preserve outputs and anchor timestamp input for bounded malformed processing |
| `postgres-interval@1.2.0` | MIT | 1 (`xtend@4.0.2`) | Replace fixed-key object extension with native assignment and remove archived `xtend` |

These are derived source components, not separately installed npm packages.
Complete notices ship in `licenses/`. Their former package versions are
recorded so changes can be reviewed against exact source rather than an
unbounded dependency range.

Primary sources:

- https://www.npmjs.com/package/pg-types/v/2.2.0
- https://github.com/brianc/node-pg-types/tree/v2.2.0
- https://www.npmjs.com/package/pg-int8/v/1.0.1
- https://www.npmjs.com/package/postgres-array/v/2.0.0
- https://www.npmjs.com/package/postgres-bytea/v/1.0.1
- https://www.npmjs.com/package/postgres-date/v/1.0.7
- https://www.npmjs.com/package/postgres-interval/v/1.2.0

Every release rebuilds a clean lockfile, validates that the production
dependency set is empty, installs the exact tarball under direct and legacy
names, runs `npm ls --all`, and requires zero findings from both production
and full npm audits.
