# Project Memory

## Identity

- npm: `@stackline/pg-types`
- legacy alias: `pg-types@npm:@stackline/pg-types`
- GitHub: `alexandroit/stackline-pg-types`
- docs: `https://alexandro.net/docs/vanilla/pg-types/`
- license: MIT with all derived-source notices preserved
- upstream: `brianc/node-pg-types`
- compatibility baseline: `2.2.0`, commit
  `d9d9dfb87eb50914043cbc178c301b7dd3b0c50d`

## Immutable Decisions

- Preserve the complete `pg-types@2.2.0` CommonJS and TypeScript contract.
- Preserve Node.js 4 compatibility and TypeScript 3.9 declarations.
- Keep the published runtime dependency graph empty.
- Maintain exact former parser dependency source in-tree with complete notices.
- Reject any release with install warnings, invalid `npm ls`, missing license
  evidence, or a nonzero production/full npm audit.
- Test malformed parser input under hard process deadlines.
- Never remove upstream attribution, git history or license notices.
- Never publish a tarball different from the immutable verified artifact.

## Dependency Chain Role

This package is the dependency leaf for `@stackline/pg`, which in turn is the
dependency leaf for `@stackline/ai-rag-postgres`. Remediation is always
published and verified in that order.

## Release Record

The `1.0.0` release record is completed only after official npm publication,
registry byte comparison, CI, CodeQL, documentation deployment and Drive
readback verification.
