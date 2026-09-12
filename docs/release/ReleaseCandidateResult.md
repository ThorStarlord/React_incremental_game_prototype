# Release Candidate Result — Campaign One / 1.0

**Status:** DETERMINISTIC CANDIDATE VERIFIED; PROMOTION BLOCKED
**Reason:** The immutable candidate gates pass locally, but Beta human evidence, full production playthrough evidence, Firefox CI evidence and release approval are not yet present.
**Last updated:** 2026-09-12

## Candidate identity

| Field | Value |
| --- | --- |
| Version | `1.0.0` in package metadata; promotion not approved |
| Commit SHA | `f27ee04349c4e94a76e773cb7ecee5e9c91d634d` |
| Build Validation run | Local clean detached worktree at the candidate SHA; CI run not recorded |
| Production artifact/deployment | Local `CI=true npm run build` passed; deployment not recorded |
| Release date | Not assigned |
| Browser matrix | See `docs/release/BrowserQualification.md` |

## Deterministic gates

| Gate | Result |
| --- | --- |
| Documentation authority | PASS — `npm run docs:authority:validate` |
| Content integrity/reachability | PASS — 0 warnings / 0 errors |
| Alpha qualification | PASS — deterministic production-action gate |
| TypeScript | PASS — clean-install verification |
| Release evidence metadata | PASS — candidate SHA and external evidence blockers validated by `npm run release:evidence:validate` |
| Full tests | PASS — 62 suites / 279 tests |
| Production build | PASS — `CI=true npm run build`; main bundle 278.28 kB gzip |
| Browser qualification | Candidate Chromium smoke PASS; candidate Firefox host execution blocked; CI rerun required |
| Dependency security review | Candidate policy PASS — 0 high/critical; 2 React Router moderate findings documented for review |

## Release blockers

1. Record Beta PASS using the required human evidence.
2. Run the whole-game qualification through the production UI, including two
   materially divergent histories.
3. Record save/load/recovery at campaign boundaries, import/export and invalid
   import behavior.
4. Run Chromium and Firefox browser qualification and attach the exact artifacts.
5. Run the CI build-validation workflow against the recorded candidate SHA and
   attach its browser artifacts.

This record is deliberately conservative: the candidate is immutable and its
deterministic gates are verified, but that does not silently convert missing
human and CI evidence into release approval.
