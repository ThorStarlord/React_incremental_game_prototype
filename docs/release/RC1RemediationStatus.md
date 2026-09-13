# `1.0.0-rc.1` Remediation Status

**Status:** IMPLEMENTATION PREPARED; RELEASE GATES STILL OPEN  
**Branch:** `codex/rc1-remediation`  
**Last updated:** 2026-09-13

This record reports agent-executable remediation only. It does not grant RC or
final-release approval and does not replace the candidate result record.

## Completed agent-executable work

| Remediation area | Result | Evidence |
| --- | --- | --- |
| Canonical persistence projection and migration | PASS | `src/shared/persistence/`, `src/shared/utils/saveSchema.ts`, full Jest suite |
| Corrupt-save classification and orphan recovery | PASS | `saveUtils.test.ts`: 11 tests passed |
| Runtime import-cycle removal | PASS | `npm run architecture:cycles` — 385 source files checked |
| Legacy persistence authority guard | PASS | `npm run architecture:persistence` |
| Aggregate deterministic RC gates | IMPLEMENTED | `scripts/release-one-point-zero.js` now includes architecture gates and manifest generation |
| Build provenance manifest | PASS locally | `npm run release:manifest` generated `.release-artifacts/release-manifest.json` with commit, version, lockfile, and bundle hashes |
| Version-status consistency | PASS | package/application version is `0.9.0-beta.1`; final `1.0.0` promotion remains explicit and pending |

## Verification recorded

- Full Jest: **66 suites / 291 tests passed**.
- Focused persistence/store verification: **13 tests passed** after final version consolidation.
- TypeScript: **PASS**.
- Release lint: **PASS**.
- Documentation authority: **PASS**.
- Release evidence metadata validation: **PASS**, while preserving blocked status.
- Content-intelligence self-test: **PASS**.
- Import-cycle qualification: **PASS**.
- Persistence-authority qualification: **PASS**.
- Production build: **PASS**; existing CRA/Browserslist maintenance warnings remain.

## Gates deliberately not closed

- `KD-001`: Beta human evidence.
- `KD-002`: full visible-UI Campaign One run and divergent histories.
- `KD-003`: Firefox CI qualification.
- `KD-004`: exact candidate Build Validation and deployment identity.
- Release-owner authorization, final tagging, and publication.

The working tree also retains the pre-existing unrelated modification to
`scripts/chatgpt-loop.js`; therefore this branch is not an immutable release
candidate. A clean candidate must be created and requalified after human and CI
evidence is available.
