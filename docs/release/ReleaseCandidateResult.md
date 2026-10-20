# Release Candidate Result — Campaign One / 1.0

**Status:** RC-1 DECLARED — QUALIFICATION PENDING
**Basis:** owner waiver (`specification/Technical/OwnerPersonalReleaseDecision.md`); BETA_PASS = NO / HUMAN-UNVALIDATED
**Last updated:** 2026-10-20

## Candidate identity

| Field | Value |
| --- | --- |
| Version | `1.0.0-rc.1` |
| Source baseline | `ea7ea010b8f22bfa13aa06deb7d5a672517b7b12` (main before the version change; the candidate adds only version metadata and release records) |
| Commit SHA | Recorded here once the candidate's exact-head Build Validation passes |
| Build Validation run | Recorded with the commit SHA |
| Static hosting | `npm run release:serve` (root) in Build Validation; GitHub Pages via `.github/workflows/deploy-pages.yml` once enabled |
| Browser matrix | Chromium + Firefox — see `docs/release/BrowserQualification.md` |
| Known defects | `docs/release/KnownDefects.md` — no open release-blocking row |
| Release notes | `docs/release/ReleaseNotes.md` — states the game was not externally playtested |

## Qualification plan

The candidate's exact-head Build Validation provides:

- documentation authority, content integrity, Alpha/Content Alpha/Beta-technical, timing, offline and persistence qualifications;
- TypeScript and production build;
- Chromium + Firefox visible-UI browser qualification (`gc13-browser-qualification`);
- the ordinary-UI full campaign on the static production build in Chromium and Firefox: two divergent histories, four save → Main Menu → Continue checkpoints each, and an export → import → load round trip (`full-campaign-release-run`).

## Human evidence

None. The human Beta floor is waived for 1.0, not satisfied. No human-experience claim is made.

## Historical deterministic candidate (2026-09-20)

Commit `4afa8aad6c074110a9e54295fb60e3e7f1ac6f0a` passed local deterministic gates (63 suites / 280 tests, production build) before the owner decision. It is superseded by the 1.0.0-rc.1 candidate and grants no promotion authority.
