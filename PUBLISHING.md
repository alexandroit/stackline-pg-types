# Publishing

1. Run `npm ci` and `npm run verify` with the supported release toolchain.
2. Commit the frozen source and create `stackline-v<version>` at that commit.
3. Run `npm run artifact:prepare` once to create the immutable candidate.
4. Publish that exact tarball to Verdaccio and verify direct/alias installs.
5. Publish the same bytes to official npm.
6. Compare registry tarballs and verify signatures, tree and audits.
7. Attach the candidate, manifests, checksums, license inventory and SBOM to an
   immutable GitHub release.
8. Deploy public documentation and update catalog/Drive records with readback.

Never publish from a mutable worktree or rebuild between registries.
