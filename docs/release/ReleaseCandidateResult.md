# Release Candidate Result — Campaign One / 1.0

**Status:** DETERMINISTIC CANDIDATE VERIFIED; PROMOTION BLOCKED
**Reason:** The historical deterministic candidate is not current promotion authority. Beta human evidence, full production playthrough evidence, an intentionally versioned immutable RC/deployment identity, and release approval are not yet present.
**Last updated:** 2026-09-20

## Candidate identity

| Field | Value |
| --- | --- |
| Version | `1.0.0` in package metadata; promotion not approved |
| Commit SHA | `4afa8aad6c074110a9e54295fb60e3e7f1ac6f0a` |
| Build Validation run | Local clean detached worktree at the candidate SHA; CI run not recorded |
| Production artifact/deployment | Local `CI=true npm run build` passed; deployment not recorded |
| Release date | Not assigned |
| Browser matrix | See `docs/release/BrowserQualification.md` |
| Known defects | See `docs/release/KnownDefects.md` |

## Deterministic gates

| Gate | Result |
| --- | --- |
| Documentation authority | PASS — `npm run docs:authority:validate` |
| Content integrity/reachability | PASS — 0 warnings / 0 errors |
| Alpha qualification | PASS — deterministic production-action gate |
| TypeScript | PASS — clean-install verification |
| Release evidence metadata | PASS — candidate SHA and external evidence blockers validated by `npm run release:evidence:validate` |
| Full tests | PASS — 63 suites / 280 tests |
| Production build | PASS — `CI=true npm run build`; main bundle 278.25 kB gzip |
| Browser qualification | GC-13 CI visible-UI smoke now passes Chromium 153.0.8010.12 and Firefox 155.0; future immutable RC still needs its own exact-candidate evidence |
| Dependency security review | Candidate policy PASS — 0 high/critical; 2 React Router moderate findings documented for review |

## Current promotion guard

GC-14 Build Validation #405 / run `35550537898` qualifies the explicit
promotion guard.

The current repository identity remains `0.9.0-beta.1`; no current
`1.0.0-rc.N` candidate exists.

Expected current commands:

```text
npm run release:rc:eligibility
-> BLOCKED: BetaCompletionContract is not PASS

npm run release:promotion:eligibility
-> BLOCKED: BetaCompletionContract is not PASS
```

This is intentional. The historical candidate table below does not grant current
RC or 1.0 authority.

## Release blockers

1. Record Beta PASS using the required human evidence.
2. Run the whole-game qualification through the production UI, including two
   materially divergent histories.
3. Record save/load/recovery at campaign boundaries, import/export and invalid
   import behavior.
4. After Beta PASS, create an intentionally versioned immutable `1.0.0-rc.N` candidate.
5. Run Build Validation, Chromium+Firefox qualification, full UI release scenarios, deployment/static-host checks and recovery evidence against that exact RC.

This record is deliberately conservative: the candidate is immutable and its
deterministic gates are verified, but that does not silently convert missing
human and CI evidence into release approval.
