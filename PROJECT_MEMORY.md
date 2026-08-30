# Project Memory

## Identity

- npm: `@stackline/pg-types`
- legacy alias: `pg-types@npm:@stackline/pg-types`
- GitHub: `alexandroit/stackline-pg-types`
- docs: `https://alexandro.net/docs/vanilla/pg-types/`
- canonical Drive record:
  `https://drive.google.com/file/d/1BooBB_OLjrtxMU2w0fmWQJV96wywSNyG/view`
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

### `1.0.0` registry and GitHub evidence — 2026-08-30

- Source commit: `14f3e2103f190259a1ca515493034d159c08707a`.
- Release-candidate CI:
  https://github.com/alexandroit/stackline-pg-types/actions/runs/33305037653
  (`SUCCESS`).
- Release-candidate CodeQL:
  https://github.com/alexandroit/stackline-pg-types/actions/runs/33305037640
  (`SUCCESS`).
- Tag-triggered CI:
  https://github.com/alexandroit/stackline-pg-types/actions/runs/33305103245
  (`SUCCESS`).
- Official npm published `@stackline/pg-types@1.0.0` once at
  `2026-08-30T09:54:39.191Z`. The registry reports 29 files, 54,718 unpacked
  bytes, the expected integrity, and an npm registry signature. npm provenance
  is absent because a Trusted Publisher is not yet registered; never republish
  `1.0.0` to change that fact.
- Verdaccio, official npm, and the GitHub release serve the same 16,581-byte
  tarball. SHA-1:
  `b4df3539743965a763e3707b52f3cb0b607b74b1`; SHA-256:
  `e627fe7a74bb5c83e1b4bbdccd06eef27cb216c1ac25ab38c9c50caf3fd4a488`;
  SHA-512:
  `c145acd72e89e1569da9731e78079f8e1736afc03690a7460e7009c5fbb142983a7f28e13e184456f315a4fff8ab4998ebd6b4815066210e728c12cf701e48af`.
- The annotated tag object is
  `5d8dbef1db0a8016dc47f16eac1929ad0e3e0ef5` and dereferences to the source
  commit. The immutable GitHub release was published at
  `2026-08-30T10:04:25Z`:
  https://github.com/alexandroit/stackline-pg-types/releases/tag/stackline-v1.0.0.

### Immutable tag-order variance

The annotated tag records `2026-08-30T09:52:23Z`, before official npm
publication at `2026-08-30T09:54:39.191Z`. This release used the supported
staged-tag flow: the immutable tag bound the source and triggered release
verification before the official registry accepted the exact artifact. The
ordering variance remains permanent evidence; do not delete, move, recreate,
or repoint the tag.

### Current release state

Alexandro.Net documentation is live at
https://alexandro.net/docs/vanilla/pg-types/. The deployed 18-file normalized
manifest SHA-256 is
`b0658494196ed1188da6a54418cfe9adbc8ed90d79592abd9c51763a398a3393`;
the recoverable prior-absence marker is
`/var/backups/stackline-docs/20260830T100036Z-pg-types`. The authenticated
catalog API accepted payload SHA-256
`1d796a4b8399642dc82651dc4532b3314b67d9093e53bb8f5481d4efb6adad24`
and exact public `en`, `pt`, and `fr` snapshots plus the server-rendered home
passed readback. All 14 package-sitemap routes, aggregate sitemap and LLM
references pass. A headless browser search for `pg-types` exposes exactly the
one intended package. Origin and Cloudflare IPv4/IPv6 checks passed; bounded
100-request IPv4 and 20-request IPv6 verification left listen drops/overflows
unchanged at `694/0`. Nginx, firewall, systemd and private portal source were
not changed.

The release gate was resolved at `2026-08-30T12:05:00Z` under the immutable
release-ordering policy. The source commit and tag workflows are green; npm,
Verdaccio, and GitHub serve byte-identical tarballs; the official registry
signature is valid; and every published identity remains immutable. The
release state is `PUBLISHED`; its remaining program state is
`ADOPTION_PENDING` for one qualified tested pull request and one maintainer-
decision issue in a different repository.

Dependency remediation then completed in strict order through
`@stackline/pg@1.0.0` and `@stackline/ai-rag-postgres@0.0.4`. The parents
consume this exact released leaf through the historical `pg-types` key where
compatibility requires it. The final catalog audit passed all 53 installable
Stackline packages and all 102 unique production dependency nodes.
