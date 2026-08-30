# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| Latest `1.x` | Yes |
| Older releases | Upgrade required |

## Reporting a Vulnerability

Do not open a public issue for an undisclosed vulnerability. Use GitHub's
private vulnerability reporting for
[`alexandroit/stackline-pg-types`](https://github.com/alexandroit/stackline-pg-types/security/advisories/new).

Include the affected version, runtime, minimal reproduction, impact and any
known mitigation. Reports are acknowledged as soon as practical and
coordinated disclosure is preferred.

## Dependency Standard

The published package has zero runtime dependencies. Parser components derived
from the former production dependency chain are maintained in-tree with exact
provenance and complete license notices. A release is blocked by an advisory,
warning, invalid recursive tree, missing notice or nonzero production/full npm
audit.

## Security Baseline

Parser registries use null-prototype dictionaries. Regression tests verify
that dangerous keys cannot alter `Object.prototype`. Multi-megabyte malformed
date, interval, array and bytea inputs run under hard child-process deadlines
to prevent regular-expression or parser denial of service regressions.
