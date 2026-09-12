# Dependency Security Record

**Status:** POLICY PASS; RESIDUAL AUDIT FINDINGS MUST BE REVIEWED
**Command:** `npm run security:release`  
**Last updated:** 2026-09-12

## Policy

- Production dependencies and the lockfile must be installed with `npm ci`.
- Release security checks run `npm audit --omit=dev --audit-level=high` and retain
  machine-readable output for review.
- Build/test tooling belongs in `devDependencies`; it is not part of the shipped
  runtime dependency surface.
- `npm audit fix --force` is prohibited for release remediation because it can
  silently introduce major-version behavior changes.
- Every residual high/critical advisory must be classified as fixed, accepted
  with a documented mitigation, or release-blocking.

## Current record

The release command writes `audit.json` and `audit.md` to its output directory.
The current audit has no high or critical findings after moving build tooling to
`devDependencies` and updating the safe React Router 6 line. Three moderate
findings remain: React Router 6 is below the patched React Router 7 line, and
`yaml` is reachable through the deprecated CRA build toolchain. The application
is client-only, uses static/internal navigation targets, and does not use the
affected SSR hydration path. The executable policy gate reports `PASS` because
there are no high or critical findings; the moderate findings remain visible in
the artifact and require review. They are not silently removed with a forced
major upgrade. The Router finding must be revisited as part of a separately
qualified CRA-to-modern-build migration; a major Router upgrade was tested and
reverted because CRA/Jest 27 cannot resolve its `react-router/dom` export.
