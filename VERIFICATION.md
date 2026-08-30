# Verification

The release gate requires:

- complete upstream parser fixtures;
- API and dangerous-key regressions;
- bounded malformed-input stress tests;
- TypeScript 3.9 and current compiler checks;
- Node.js runtime matrix from 4 through current LTS/current;
- warning-free direct and legacy-name installation of the packed artifact;
- valid recursive `npm ls --all` output;
- zero declared runtime dependencies;
- `publint` and Are The Types Wrong package checks;
- complete source-license inventory;
- zero production and full npm audit findings;
- npm registry signature verification.

Immutable hashes, source commit, registry comparison, CI and CodeQL URLs are
recorded below after publication.

## Verified `1.0.0` release evidence — 2026-08-30

- Source commit: `14f3e2103f190259a1ca515493034d159c08707a`.
- Release-candidate CI: https://github.com/alexandroit/stackline-pg-types/actions/runs/33305037653 (`SUCCESS`).
- Release-candidate CodeQL: https://github.com/alexandroit/stackline-pg-types/actions/runs/33305037640 (`SUCCESS`).
- Tag-triggered CI: https://github.com/alexandroit/stackline-pg-types/actions/runs/33305103245 (`SUCCESS`).
- Official npm publication: `2026-08-30T09:54:39.191Z` at
  https://www.npmjs.com/package/@stackline/pg-types/v/1.0.0.
- Immutable GitHub release:
  https://github.com/alexandroit/stackline-pg-types/releases/tag/stackline-v1.0.0.
- Artifact: 16,581 packed bytes, 54,718 unpacked bytes, 29 files.
- SHA-1: `b4df3539743965a763e3707b52f3cb0b607b74b1`.
- SHA-256:
  `e627fe7a74bb5c83e1b4bbdccd06eef27cb216c1ac25ab38c9c50caf3fd4a488`.
- SHA-512:
  `c145acd72e89e1569da9731e78079f8e1736afc03690a7460e7009c5fbb142983a7f28e13e184456f315a4fff8ab4998ebd6b4815066210e728c12cf701e48af`.
- Integrity:
  `sha512-wUWs1y6J4VadqXMeeAefjhc2r8A2kKdGDnAJxfuxQpg6fyjhPhhEVvMVpP/4q0mY69a0gVBmIQ5yjBLPcB5Irw==`.
- Verdaccio, official npm, and the GitHub release tarballs match the SHA-256
  above. Official npm exposes a registry signature; provenance is absent.

## Tag-order variance

Annotated tag object `5d8dbef1db0a8016dc47f16eac1929ad0e3e0ef5`
points to the source commit and records `2026-08-30T09:52:23Z`. That precedes
official npm publication by 136 seconds. The release used the supported staged-
tag flow: the tag bound the verified source and triggered release checks before
the registry accepted the exact artifact. The tag and release are immutable
and must not be moved or recreated. Preserve this variance in every final
release record.

## Public documentation and catalog verification

- `node docs-site/check.mjs` passes all 18 documentation/source inputs.
- Deployed 18-file normalized manifest SHA-256:
  `b0658494196ed1188da6a54418cfe9adbc8ed90d79592abd9c51763a398a3393`.
- Catalog payload SHA-256:
  `1d796a4b8399642dc82651dc4532b3314b67d9093e53bb8f5481d4efb6adad24`.
- The authenticated API write and exact public `en`, `pt`, `fr` snapshot
  readbacks passed for `@stackline/pg-types@1.0.0`.
- The server-rendered home, live browser search, package/root robots, package
  and aggregate sitemaps, package metadata, and LLM references passed through
  public Cloudflare addresses. All 14 package-sitemap routes return HTTP 200.
- Alexandro.Net branding and the task-focused `Open source package registry`
  H1 are preserved. `@stackline` remains only the technical npm namespace.
- Origin and Cloudflare HTTP/HTTPS checks passed over IPv4 and IPv6 with path
  and query preservation. One hundred IPv4 and twenty IPv6 bounded requests
  returned 200; `TcpExtListenDrops` stayed 694 and
  `TcpExtListenOverflows` stayed zero. Required Nginx and systemd limits are
  unchanged; no shared infrastructure was replaced or reloaded.

All release gates are complete. The immutable 136.191-second tag-before-npm
ordering variance was reconciled at `2026-08-30T12:05:00Z` under the supported
staged-tag policy after exact artifact, registry signature, source/tag workflow,
and immutable identity verification. The remaining program state is public
adoption work and does not invalidate the published release.
