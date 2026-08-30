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
recorded here after publication.
