# GC-14 Release Eligibility / Blocked Promotion Result

**Disposition:** `TECHNICAL_RELEASE_PREPARED / PROMOTION_BLOCKED`  
**Product maturity:** `CONTENT_ALPHA / HUMAN-UNVALIDATED`  
**Beta technical state:** `TECHNICAL_BETA_READY / HUMAN_EVIDENCE_BLOCKED`  
**RC entry:** `BLOCKED`  
**1.0 promotion:** `BLOCKED`  
**Qualified candidate:** `521b7aa5f32f683069dc751724ebc07d88796d75`  
**Build Validation:** #405 / run `35550537898` — PASS, 62/62 workflow steps  
**PR:** #137  
**Prepared:** 2026-09-20

## What GC-14 now proves

The repository has an explicit, executable separation between:

1. deterministic release preparation; and
2. authority to enter RC or promote 1.0.

`npm run release:validate` remains a technical preparation command.

Promotion-aware commands now exist:

- `npm run release:rc:eligibility`;
- `npm run release:promotion:eligibility`;
- `npm run release:rc:validate`;
- `npm run release:promote:validate`.

## Current fail-closed behavior

The GC-14 qualification executes both eligibility stages against the current
repository.

Both must reject, and do reject, because the authoritative Beta result is not
`BETA_PASS`.

Current valid state:

```text
CONTENT_ALPHA
TECHNICAL_BETA_READY
HUMAN_EVIDENCE_BLOCKED
BETA_PASS = NO
RC_ENTRY_BLOCKED
1.0_PROMOTION_BLOCKED
```

The rejection is the expected success condition of this package.

## RC entry requirements encoded by the guard

Before RC qualification can even begin:

- `docs/release/BetaResult.md` status must be exactly `BETA_PASS`;
- no open release-blocking Known Defect may remain;
- package and in-app version metadata must be intentionally aligned to
  `1.0.0-rc.N`.

No RC version was written by this package.

## Final 1.0 promotion requirements encoded by the guard

Final promotion additionally requires:

- exact package/app version `1.0.0`;
- a promotable Release Candidate result rather than a BLOCKED/PREPARED record;
- current Chromium release evidence = PASS;
- current Firefox release evidence = PASS.

The guard itself does not create tags, publish artifacts, or modify release
records to make those conditions true.

## Non-actions

GC-14 did **not**:

- fabricate `BETA_PASS`;
- count synthetic/LLM/browser automation as human evidence;
- bump the current prerelease identity beyond `0.9.0-beta.1`;
- create a `1.0.0-rc.N` candidate;
- create a Git tag;
- publish a GitHub/npm release;
- close issue #109;
- close full-UI/deployment evidence blockers without evidence.

## Remaining external gates

### 1. Human Beta evidence — issue #109 / KD-001

Still required:

- 5 accepted fresh-player first-session observations;
- 3 accepted external beginning-to-ending fresh-save playthroughs;
- exact provenance;
- classification and resolution/acceptance of recurring severe findings.

Current count remains `0/5 + 0/3`.

### 2. Release full-UI campaign evidence — KD-002

A future immutable RC must satisfy the Release Qualification Contract's ordinary
visible-UI full-campaign/divergent-history evidence. Current deterministic
production-action tests and browser smoke do not substitute for that release
artifact.

### 3. Immutable RC / deployment identity — KD-004

An immutable release candidate and deployment identity do not yet exist, because
RC entry is correctly blocked before Beta PASS.

### 4. Repository branch-protection enforcement — issue #122

Documentation requires exact-head Build Validation, but repository admin branch
protection remains an external governance action outside the currently available
connector authority.

## Stop condition

The release disposition remains fail-closed: incomplete external gates do not
authorize RC entry, 1.0 promotion, or speculative feature/scope expansion.

This result does **not** impose a universal repository implementation freeze.
Current higher-level agent/state authority may continue bounded hardening of the
already-authorized Campaign One when deterministic, heuristic, synthetic,
accessibility, reliability, presentation, pacing, balance, persistence,
release-readiness, or human evidence identifies a concrete improvement.

The promotion sequence remains:

```text
collect real Beta human evidence + continue bounded evidence-classified hardening
-> resolve release-relevant findings without expanding scope
-> record BETA_PASS on exact supported build
-> intentionally version an immutable 1.0.0-rc.N candidate
-> run release:rc:validate + required full-UI/deployment evidence
-> repair only release blockers and requalify
-> set 1.0.0 only when final promotion guard passes
```

Until then, RC/1.0 promotion must remain blocked.
