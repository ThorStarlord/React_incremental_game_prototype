# Release Candidate Result — Campaign One / 1.0

**Status:** NOT A RELEASE CANDIDATE  
**Reason:** Beta human evidence, full production playthrough evidence and an exact immutable candidate record are not yet present.  
**Last updated:** 2026-09-12

## Candidate identity

| Field | Value |
| --- | --- |
| Version | `1.0.0` in package metadata; promotion not approved |
| Commit SHA | Current working head must be recorded after a clean candidate commit |
| Build Validation run | Not recorded for the current working tree |
| Production artifact/deployment | Not recorded |
| Release date | Not assigned |
| Browser matrix | See `docs/release/BrowserQualification.md` |

## Deterministic gates

| Gate | Result |
| --- | --- |
| Documentation authority | PASS — `npm run docs:authority:validate` |
| Content integrity/reachability | PASS — 0 warnings / 0 errors |
| Alpha qualification | PASS — deterministic production-action gate |
| TypeScript | PASS — clean-install verification |
| Full tests | PASS — 61 suites / 278 tests |
| Production build | PASS — `CI=true npm run build` |
| Browser qualification | Chromium local PASS; Firefox host execution blocked; CI rerun required |
| Dependency security review | PASS — 0 high/critical; 3 moderate findings documented for review |

## Release blockers

1. Record Beta PASS using the required human evidence.
2. Run the whole-game qualification through the production UI, including two
   materially divergent histories.
3. Record save/load/recovery at campaign boundaries, import/export and invalid
   import behavior.
4. Run Chromium and Firefox browser qualification and attach the exact artifacts.
5. Create a clean immutable candidate commit/tag and rerun all gates against that
   exact identity.

This record is deliberately conservative: passing deterministic checks does not
silently convert an uncommitted worktree into a releasable candidate.
