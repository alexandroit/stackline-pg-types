# Contributing

Run the complete release gate before opening a pull request:

```bash
npm ci
npm run verify
```

Compatibility changes must include a regression fixture and explain whether
the behavior is valid PostgreSQL output or malformed attacker-controlled
input. Runtime dependencies are not accepted without a recursive maintenance,
security and license review.

Security reports belong in GitHub private vulnerability reporting, not public
issues.
