# GC-14 Release Eligibility Preregistration

**Status:** RELEASE PREPARATION / PROMOTION GUARD  
**Program:** Campaign One / 1.0 Game Completion  
**Prepared:** 2026-09-20

## Purpose

GC-14 must not convert deterministic repository health into an RC or 1.0 promotion.

The repository already contains substantial release-hardening utilities. This package adds the missing **promotion authority guard** so those utilities can be run safely before external evidence exists.

## Separation of responsibilities

### Deterministic preparation

`npm run release:validate` may run before human evidence is complete. It answers:

> Is the repository technically healthy enough to continue release preparation?

It does **not** grant RC or publication authority.

### RC entry

`npm run release:rc:validate` first requires:

- `BETA_PASS` in the authoritative Beta result;
- zero open release-blocking Known Defects;
- package and in-app version metadata intentionally set to `1.0.0-rc.N`.

Only then may the deterministic release pipeline be treated as an RC qualification attempt.

### Final 1.0 promotion

`npm run release:promote:validate` first requires:

- `BETA_PASS`;
- zero open release-blocking Known Defects;
- package and in-app version `1.0.0`;
- a promotable Release Candidate result rather than a blocked/prepared record;
- Chromium release evidence = PASS;
- Firefox release evidence = PASS.

Only then does it run the deterministic release pipeline.

## Current expected state

With issue #109 incomplete, the eligibility guard **must fail closed**.

Expected current result:

```text
RC_ENTRY_BLOCKED
FINAL_PROMOTION_BLOCKED
reason = BetaCompletionContract is not PASS
```

That blocked result is success of the guard, not a repository failure.

## Non-goals

This package does not:

- fabricate human playtest evidence;
- change version metadata to 1.0.0;
- create a release tag;
- publish an artifact;
- close release blockers without evidence;
- downgrade browser or campaign requirements.

## Exit

Before external evidence exists, the strongest valid repository state is:

```text
CONTENT_ALPHA
TECHNICAL_BETA_READY
HUMAN_EVIDENCE_BLOCKED
RC_ENTRY_BLOCKED
1.0_PROMOTION_BLOCKED
```

After real Beta evidence arrives, rerun the guard on an intentionally versioned immutable candidate.
