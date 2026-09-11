# Milestone Handoff — Post-M25 Timing Hardening, Backlog, and Lifecycle Remainder

**Handoff date:** 2026-09-10  
**Synchronized `main`:** `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Milestone package state:** `PACKAGES 1-3 COMPLETE / REPOSITORY-QUALIFIED`  
**Integration state:** `NOT MERGED TO MAIN — EXTERNAL CI BLOCKED`  
**Product authority:** `M25 Complete Chapter Vertical Slice = PASS`  
**Human Integrated Playability / Product Review:** `DEFERRED / UNPROVEN`  
**Product Direction Decision:** `PENDING`  
**M26:** `NOT AUTHORIZED`

## Purpose

This is the authoritative handoff for the completed three-package post-M25 timing-hardening milestone executed after the timed-Quest seconds-normalization work.

The milestone closed three bounded repository/hermetic questions:

1. compose the previously independent precision/drift, large-frame/background-stall, and cadence-transition timing work into one unified candidate;
2. characterize async `onTick` catch-up backlog safety without inventing a production backpressure/capping policy; and
3. characterize sub-step accumulator remainder behavior across pause/resume, stop/start, unmount/remount, and canonical save/load boundaries.

All three packages are complete at the `REPOSITORY_ONLY` / `HERMETIC_VALIDATION` level. None is merged to `main` because repository Build Validation passed on each exact candidate head while the separate Gemini AI Code Review workflow failed before review with `API_KEY_INVALID`. The standing merge rule required every CI workflow on the exact candidate head to pass.

Package completion is therefore **not** current-main integration.

## Current `main` authority

`main` remains at:

```text
96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71
Merge PR #80: timed Quest milestone handoff
```

Current merged timing contract remains:

```text
GameLoop fixed-step deltaTimeMs
-> processQuestTimersThunk(deltaTimeMs)
-> reject non-finite / non-positive input
-> deltaSeconds = deltaTimeMs / 1000
-> Quest elapsedSeconds / timeLimitSeconds remain seconds
```

Current merged M21 authority remains the separate two-consumer offline allowlist:

1. passive Essence;
2. already-running M20 Copy production tasks.

Timed Quests remain online-only during M21 offline settlement.

## Package outcomes

### Package 1 — Unified Timing-Hardening Integration Candidate

**State:** `COMPLETE / REPOSITORY-QUALIFIED / NOT MERGED`  
**PR:** #88 — `Integrate unified post-M25 timing hardening candidate`  
**Branch:** `work/unified-timing-hardening-integration`  
**Candidate head:** `b5387622e2abac222ccd1249dde6094aa1efeada`  
**Build Validation:** #292 — `PASS`  
**Gemini AI Code Review:** #322 — `FAIL / API_KEY_INVALID`

Package 1 created one candidate from synchronized `main` and composed the timing work that had previously existed on PRs #85, #86, and #87.

Delivered on the Package 1 branch:

- bounded timed-Quest comparison-time precision repair without rewriting raw accumulated `elapsedSeconds` or persisted timer values;
- 60-second long-horizon cross-progression drift qualification;
- large-frame/background-stall characterization;
- mid-session cadence-transition qualification;
- one combined Build Validation workflow proving these timing surfaces together;
- preserved pause, catch-up, persistence, Quest-unit, live/offline, M20-M25, historical, and production-build gates.

Package 1 did **not** authorize a new background-stall policy, tick-rate policy, offline Quest policy, persistence migration, balance retune, or Product Direction change.

Important integration fact:

```text
PR #88 supersedes the need to integrate PRs #85/#86/#87 independently.
Do not treat #85/#86/#87 as a sequential merge stack after #88 exists.
```

### Package 2 — Async Catch-Up Backlog Safety Preflight

**State:** `COMPLETE / REPOSITORY-QUALIFIED / NOT MERGED`  
**PR:** #89 — `Preflight async GameLoop catch-up backlog safety`  
**Branch:** `work/async-catch-up-backlog-safety-preflight`  
**Candidate head:** `06e4f5930dfafd27f9a509b135af5cfa911da7c1`  
**Build Validation:** #293 — `PASS`  
**Gemini AI Code Review:** #323 — `FAIL / API_KEY_INVALID`

Preflight decision:

```text
BACKLOG_RISK_CONFIRMED / NO_PRODUCTION_REPAIR_AUTHORIZED
```

Verified behavior:

- scheduler tick production can advance while one Promise-returning `onTick` consumer remains unresolved;
- the scheduler-vs-consumer gap can grow under both regular production and large catch-up bursts;
- queued `onTick` delivery remains serialized and FIFO;
- no overlapping async handler execution occurs in the qualified cases;
- a rejecting queued handler is logged and later queued work continues draining;
- pause rejects new scheduler intake while already-produced queued work remains drainable;
- unmount clears queued stale callback work after the active promise settles.

Current implementation has no explicit backlog cap, producer backpressure gate, coalescing rule, or tick-dropping policy. This package characterizes that risk only; it does not choose production semantics.

### Package 3 — Sub-Step Restart & Save/Resume Remainder Preflight

**State:** `COMPLETE / REPOSITORY-QUALIFIED / NOT MERGED`  
**PR:** #90 — `Preflight sub-step restart and save-resume remainder semantics`  
**Branch:** `work/sub-step-restart-save-resume-preflight`  
**Candidate head:** `98fc6e82d2cee4108d52693385690de35d52910b`  
**Build Validation:** #294 — `PASS`  
**Gemini AI Code Review:** #324 — `FAIL / API_KEY_INVALID`

Preflight decision:

```text
DETERMINISTIC_REMAINDER_DISCONTINUITY_CONFIRMED / POLICY_REQUIRED / NO_PRODUCTION_REPAIR_AUTHORIZED
```

Verified behavior:

- sub-step accumulation behaves as expected at representative 10 Hz and 20 Hz cadences;
- pause/resume preserves the in-memory pre-pause accumulator remainder while rejecting paused wall time;
- stop/start reconstructs the live loop with zero hook-local remainder;
- unmount/remount reconstructs the live loop with zero hook-local remainder;
- canonical `createSave -> loadSavedGameWithMigration -> replaceState -> fresh useGameLoop` preserves persisted Redux progression exactly but has no persisted accumulator remainder field;
- after a restart, a fresh full fixed step advances representative Essence, Copy task, Player vitality, timed Quest, and GameLoop state normally;
- each discarded remainder is individually below one fixed step, but repeated reset boundaries can accumulate lost logical time beyond one fixed step across multiple transitions.

This package did not add a persisted accumulator, change the save schema, add a migration, widen offline authority, or redefine scheduler lifecycle semantics.

## Evidence ledger

### Repository / hermetic evidence verified

- Package 1 candidate `b5387622...` passed Build Validation #292.
- Package 2 candidate `06e4f593...` passed Build Validation #293.
- Package 3 candidate `98fc6e82...` passed Build Validation #294.
- Each exact candidate passed repository rejection/action-binding checks, localhost synthetic UI smoke, TypeScript, the relevant focused GameLoop/Quest/progression suites, M20-M25 qualification, active-loop/historical regressions, accumulated M4-M19 baseline, and production build.
- Package 1 proves precision/drift + large-frame + cadence-transition work together on one candidate tree.
- Package 2 proves ordered/serialized async callback drain and confirms backlog-growth risk without production-policy changes.
- Package 3 proves lifecycle-specific accumulator remainder semantics and confirms deterministic restart/save-resume discontinuity without persistence-policy changes.

### Not yet verified as one integrated `main` state

- PR #88 on `main`.
- Package 2 replayed/requalified after PR #88 integration.
- Package 3 replayed/requalified after PR #88 and Package 2 integration.
- one final combined current-main tree containing all three package results.
- successful Gemini review on PR #88, #89, or #90.

Package 2 and Package 3 began from the synchronized pre-integration `main`, not from Package 1. Their independent green runs are not evidence that all three package trees compose without replay/requalification.

## External CI blocker

The separate Gemini AI Code Review workflow failed before review output on all three package candidates:

```text
400 INVALID_ARGUMENT
reason: API_KEY_INVALID
message: API key not valid. Please pass a valid API key.
```

This is `EXTERNAL_AUTHORITY`. Do not expose, fabricate, replace, or bypass credentials from a repository-only gameplay/timing package. If the all-CI merge rule remains in force, the credential/review gate must be resolved separately before any blocked package is merged.

## Pending human / product authority

Still unproven:

- fresh-player comprehension and discoverability;
- perceived responsiveness under large catch-up or high cadence;
- whether timed Quests and progression feel fair/readable;
- pacing and balance quality;
- enjoyment / emotional impact;
- retention / desire to continue;
- production browser/device performance under sustained catch-up backlog;
- acceptable lifecycle semantics for losing sub-step remainder across restart/save-resume boundaries;
- acceptable production policy for async callback backlog;
- generalized campaign/chapter scalability;
- trusted server time / anti-cheat authority;
- explicit Product Direction Decision;
- M26 authorization.

Human Integrated Playability / Product Review remains `DEFERRED / UNPROVEN`. Product Direction remains `PENDING`. M26 remains `NOT AUTHORIZED`.

## Recommended next priorities

1. **Fresh reconciliation first.** Read current `main`, this handoff, PRs #88/#89/#90, recent commits, and current product authority.
2. **Resolve the external CI authority separately if available.** Repair/replace the Gemini credential or explicitly revise merge policy in a dedicated maintenance decision. Do not mix credentials with gameplay/timing work.
3. **Integrate sequentially once the merge gate is resolvable.** Merge/requalify PR #88 first; then replay Package 2 onto the resulting latest `main`, run full exact-head CI, and merge only if every required check passes; then replay Package 3 onto that resulting `main` and repeat the full gate.
4. **Do not merge #85/#86/#87 independently after choosing #88.** PR #88 is the unified timing-hardening integration candidate that already composes those earlier timing branches.
5. **If async backlog becomes the active bottleneck, design policy before repair.** Candidate families include producer backpressure, bounded queue + explicit overflow semantics, proven-safe coalescing, or separating deterministic per-tick state changes from slow async side effects. No option is currently authorized.
6. **If lifecycle remainder becomes the active bottleneck, choose lifecycle semantics before persistence changes.** Decide whether fresh-loop reset is intended or whether a logical-clock/remainder concept should survive lifecycle boundaries. Any save-schema or migration work requires its own contract.
7. **Keep large-frame/background behavior as a separate policy seam.** Package 1 characterizes current catch-up behavior but does not authorize a frame clamp, visibility pause, background cutoff, or offline-settlement handoff.
8. **Return to human product evidence when available.** Deterministic timing correctness cannot establish pacing, comprehension, fun, retention, Product Direction, or M26.

If external credentials and human review remain unavailable, future work may continue with justified `REPOSITORY_ONLY` / `HERMETIC_VALIDATION` packages discovered through reconciliation, but external/human claims must not be weakened merely to continue implementation.

## Fast re-entry checklist

```text
1. Read STATUS.md and verify latest main SHA.
2. Inspect PRs #88, #89, and #90.
3. Confirm whether API_KEY_INVALID still blocks the all-CI merge rule.
4. Do not claim branch-only Package 1/2/3 behavior is on main until integrated.
5. Prefer integration order: #88 -> replay/requalify #89 -> replay/requalify #90.
6. Do not independently integrate superseded timing branches #85/#86/#87 if #88 is the chosen candidate.
7. Use exact-head Build Validation after every replay/integration candidate.
8. Preserve M21 as a separate bounded offline allowlist unless explicitly redesigned.
9. Preserve schema-v1 Quest timer values unless new provenance/migration authority is designed.
10. Treat async backlog policy and lifecycle remainder policy as explicit future decisions, not incidental fixes.
11. Keep human product evidence, Product Direction, and M26 as separate authority gates.
```

## Validation / runbook entrypoints

### Current-main baseline

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
npm run build
```

### Package 1 branch — PR #88

```bash
git fetch origin
git switch work/unified-timing-hardening-integration
npm ci
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLargeFrameBackgroundStallPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopMidSessionCadenceTransitionQualification.test.tsx
npm run build
```

### Package 2 branch — PR #89

```bash
git fetch origin
git switch work/async-catch-up-backlog-safety-preflight
npm ci
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncCatchUpBacklogSafetyPreflight.test.tsx
npm run build
```

### Package 3 branch — PR #90

```bash
git fetch origin
git switch work/sub-step-restart-save-resume-preflight
npm ci
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx
npm run build
```

For merge qualification, the authoritative command list is always the exact candidate's `.github/workflows/build-validation.yml`; the focused commands above are re-entry aids, not substitutes for the complete CI gate.

## Repository hygiene note

Several old/no-op refs may still be visible, including `noop-unused` and `work/unified-timing-hardening-integration-2` through `-7`. They point to the unchanged historical `main` baseline and contain none of the Package 1 implementation. Do not treat them as package candidates.

## Governing stop conditions

- The milestone queue is complete; do not restart Packages 1-3 as if unimplemented.
- None of the three final package candidates is current-main authority until merged.
- Do not bypass or silently redefine the all-CI merge rule.
- Do not expose or inject production credentials to repair Gemini from a gameplay/timing task.
- Do not infer an async backlog repair from characterization alone.
- Do not persist/replay accumulator remainder without an explicit lifecycle/persistence contract.
- Do not infer a large-frame catch-up/background policy from characterization alone.
- Do not widen M21 offline authority without a separate product/technical decision.
- Deterministic execution is not evidence of pacing, balance, comprehension, enjoyment, retention, or product-market fit.
- M26 remains unauthorized.
