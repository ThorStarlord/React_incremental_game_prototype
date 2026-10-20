# Owner Personal-Release Decision — Campaign One / 1.0

**Status:** CURRENT AUTHORITY — OWNER DECISION RECORDED 2026-10-20  
**Decision owner:** repository owner (product authority under `AGENTS.md`)  
**Decision date:** 2026-10-20  
**Supersedes for 1.0 promotion only:** the human-evidence floor as a 1.0 prerequisite in `BetaCompletionContract.md` and `ReleaseQualificationContract.md`  
**Does not change:** feature scope, content scope, evidence classes, technical release gates

## Context

The repository began as a learning prototype for working with coding agents. Campaign One is recorded `FEATURE_COMPLETE / HUMAN-UNVALIDATED`, and the deterministic Beta and release-promotion tooling is qualified. External playtesting was already recorded as `DEFERRED / TBD` with no owner or date on 2026-10-12 (`.sensemaking/intent.md`).

Under the previous contracts, 1.0 could not ship until 5 fresh-player first sessions and 3 external full playthroughs were accepted. With playtesting deferred indefinitely, that rule meant the game could never ship.

## Decisions

### D1 — 1.0 is a personal release; the human Beta floor is waived, not satisfied

The owner waives the human-evidence floor (5 first sessions + 3 external full playthroughs) as a prerequisite for RC entry and 1.0 promotion.

The waiver is **not** a `BETA_PASS`:

```text
BETA_PASS = NO
BETA_OWNER_WAIVED / HUMAN-UNVALIDATED
```

Non-human evidence must still never be relabeled as human evidence. Human-experience claims (comprehension, fun, pacing, fairness, retention, preference) remain unproven and must not be stated or implied anywhere, including release notes.

The replacement 1.0 bar is:

```text
every deterministic gate in ReleaseQualificationContract.md
AND exact-head Build Validation on the release candidate
AND one ordinary-UI clean-storage New Game -> Epilogue run (SYNTHETIC_FINDING class)
AND two materially divergent histories
AND save/load/import-export/recovery evidence at the contract's checkpoints
AND Chromium + Firefox evidence on the exact candidate
AND release-like static hosting evidence
AND no open release-blocking KnownDefects row
AND release notes that state plainly the game was not externally playtested
```

`KD-001` (human Beta evidence) is therefore **accepted for release** under this decision rather than closed.

Issue #109 stays open as an optional post-1.0 evidence lane. Human sessions recorded later keep their normal evidence class and may motivate 1.0.x/1.1 repairs.

### D2 — the universal Trait redesign (PR #165) is parked until after 1.0

1.0 ships the already-merged, qualified Trait model (save schema v2). Draft PR #165 (`work/universal-trait-ontology`) stays unmerged and becomes candidate 1.1 work. Its Trait-construction reopening does not apply to Campaign One / 1.0.

### D3 — agent merge authority

A coding agent may merge its own pull requests into `main` once exact-head Build Validation passes on the pull request's current head. This does not waive Build Validation and does not let an agent merge anyone else's pull request.

## Unchanged authorities

- `FeatureScopeMatrix.md` scope lock: no Chapters 8+, Skills, Crafting, Inventory/Equipment economy, autonomous Copy planning, offline narrative decisions, or New Game+.
- `AGENTS.md` evidence classes and the rule against relabeling evidence.
- All timing, persistence, offline and content-integrity contracts.
- `ReleaseQualificationContract.md` candidate immutability, browser matrix, known-defect policy and versioning rules.

## Current state after this decision

```text
FEATURE_COMPLETE / HUMAN-UNVALIDATED
TECHNICAL_BETA_READY
BETA_PASS = NO
BETA_OWNER_WAIVED / HUMAN-UNVALIDATED
current strategic stage = RC_QUALIFICATION / OWNER_WAIVED_HUMAN_BETA
RC entry = OPEN under owner waiver once 1.0.0-rc.N metadata is set and no release blocker remains
1.0 = NOT YET PROMOTED
```

## Machine enforcement

`scripts/check-release-eligibility.js` accepts `BETA_PASS` **or** a Beta result whose status starts `OWNER_WAIVED` while this record exists with the markers above. The `final` stage additionally requires `docs/release/ReleaseNotes.md` to say the release was not externally playtested. `GC14ReleaseEligibility.test.ts` covers the acceptance and rejection paths.
