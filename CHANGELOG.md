# Changelog

All notable changes are documented in this file.

## 1.0.0 - 2026-08-30

- preserve the public API, parser outputs and TypeScript declarations from
  `pg-types@2.2.0`;
- replace five runtime packages and the archived transitive `xtend` package
  with reviewed, attributed in-tree parser source;
- publish with zero runtime dependencies;
- isolate parser registries with null-prototype dictionaries to prevent
  dangerous format or OID keys from reaching object prototypes;
- provide the `TypeId` runtime value promised by the historical declarations
  without changing the four enumerable root keys;
- anchor malformed timestamp parsing to remove position-by-position regex
  retry behavior;
- add upstream parser fixtures, malicious-input regressions, bounded stress
  tests, TypeScript 3.9/current checks and Node.js runtime coverage;
- add warning-free packed-install, recursive tree, package, license, signature
  and zero-vulnerability release gates.
