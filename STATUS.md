# Milestone Handoff — GameLoop Async Backlog & Lifecycle Hardening

**Handoff date:** 2026-09-10 / 2026-09-11 CI window  
**Current `main` at handoff:** `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Milestone package state:** `COMPLETE / REPOSITORY-QUALIFIED / NOT YET INTEGRATED`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**Product Direction Decision:** `PENDING`  
**M26:** `NOT AUTHORIZED`

## Purpose

This is the canonical repository handoff for the three-package GameLoop safety/policy milestone completed after the earlier timed-Quest normalization work.

The milestone closed three bounded technical questions:

1. what async producer/consumer backlog contract should govern the live fixed-step scheduler;
2. whether the current unbounded already-minted `TickData` backlog can be repaired without dropping/coalescing logical work or widening unrelated authority; and
3. what should happen to fractional fixed-step accumulator remainder across pause, restart, remount, and canonical save/load lifecycle boundaries.

All three packages are complete at the repository/hermetic level. **None of the three is merged into `main` at this handoff.** Each candidate passed the repository Build Validation workflow on its exact head, while the separate Gemini review workflow failed before producing a review because its configured external API key is invalid.

Do not treat package completion as current-main behavior until the candidates are replayed/composed and integrated with fresh exact-head CI.

## Current-main authority

`main` remains at:

```text
96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71
```

Therefore current `main` still contains the previously merged timed-Quest normalization milestone and M25 qualification, but **does not yet contain**:

- the Package 1 `SERIAL_BACKPRESSURE_V1` policy artifacts;
- the Package 2 production bounded-backlog repair;
- the Package 3 `FRESH_LOOP_RESET_V1` lifecycle policy artifacts.

The three final package candidates were all branched from the same synchronized base. Their independent passing runs prove each candidate against that base, not a composed final tree.

## Work-package outcomes

### Package 1 — Async Tick Backlog Policy Contract

**Terminal package state:** `COMPLETE / REPOSITORY-QUALIFIED / NOT MERGED`  
**PR:** #91 — `Define async tick backlog policy contract`  
**Branch:** `work/async-tick-backlog-policy-contract`  
**Candidate head:** `842c54acd1b2d0ba52b2e9c16fa2480e289c33fb`  
**Zone:** `HERMETIC_VALIDATION`  
**Decision:** `BACKLOG_POLICY_AUTHORIZED / SERIAL_BACKPRESSURE_V1`  
**Build Validation:** #296 — `PASS`  
**Gemini AI Code Review:** #326 — `FAIL / API_KEY_INVALID`

Delivered:

- an explicit scheduler/consumer contract for Promise-returning `onTick` work;
- `producerLead <= 1` for unresolved async work;
- zero queued per-tick `TickData` backlog objects;
- deferred logical milliseconds remain in the fixed-step accumulator;
- no tick dropping, skipping, coalescing, or concurrent async consumers;
- consumer fulfillment or rejection releases exactly one admission slot;
- large unpaused frames remain logical time but do not mint an unbounded object queue;
- pause blocks deferred admission while preserving pre-pause logical remainder;
- unmount prevents stale post-cleanup callback admission;
- executable negative/rejection cases for invalid candidate policies.

Package 1 deliberately changed no production GameLoop mechanics. It authorized the bounded repair scope for Package 2.

Focused evidence:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
```

### Package 2 — Bounded Backlog Control Repair & Integration Qualification

**Terminal package state:** `COMPLETE / REPOSITORY-QUALIFIED / NOT MERGED`  
**PR:** #92 — `Bound async GameLoop backlog with serial backpressure`  
**Branch:** `work/bounded-backlog-control-repair`  
**Candidate head:** `f11b421724e25ff5a90d0539036b65dd9cadaef1`  
**Zone:** `REPOSITORY_ONLY + HERMETIC_VALIDATION`  
**Decision:** `BACKLOG_CONTROL_REPAIR_QUALIFIED`  
**Build Validation:** #297 — `PASS`  
**Gemini AI Code Review:** #327 — `FAIL / API_KEY_INVALID`

Delivered on the candidate branch:

- removed the unbounded per-tick async FIFO from production `useGameLoop`;
- retained excess logical time in the existing accumulator;
- admitted at most one logical tick while an async consumer is unresolved;
- advanced scheduler `currentTick` / fixed-step `totalGameTime` only for admitted work;
- preserved synchronous fixed-step catch-up without drop/coalescing;
- preserved serialized async execution with peak concurrency one;
- made rejection release the slot so later deferred work remains live;
- blocked deferred admission while paused and preserved paused-wall-time rejection;
- prevented an active consumer settlement after unmount from starting stale work;
- retained current cadence semantics for deferred logical milliseconds;
- updated timing characterization so scheduler-ahead behavior is no longer expected on this repaired candidate.

The repair did **not** change default tick rate, game speed, save schema, accumulator persistence, M21 authority, background-stall policy, progression/reward formulas, or timed-Quest durations.

Focused evidence:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopBoundedBacklogControlRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
```

### Package 3 — Lifecycle Remainder Policy Preflight

**Terminal package state:** `COMPLETE / REPOSITORY-QUALIFIED / NOT MERGED`  
**PR:** #93 — `Authorize fresh-loop lifecycle remainder policy`  
**Branch:** `work/lifecycle-remainder-policy-preflight`  
**Candidate head:** `391b9fd82fd4ea11852907b85ef2d5749762702c`  
**Zone:** `HERMETIC_VALIDATION`  
**Decision:** `FRESH_LOOP_RESET_ACCEPTED / FRESH_LOOP_RESET_V1`  
**Build Validation:** #298 — `PASS`  
**Gemini AI Code Review:** #328 — `FAIL / API_KEY_INVALID`

Selected lifecycle contract:

| Boundary | Sub-step remainder | Wall-time replay |
| --- | --- | --- |
| continuous live loop | preserve | live time only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

Delivered:

- promoted the prior restart/save-resume characterization into explicit lifecycle policy;
- defined a scheduling epoch as the owner of transient fixed-step remainder;
- accepted pause/resume as the same epoch;
- accepted stop/start, remount, and canonical save/load as fresh epoch boundaries;
- quantified per-boundary remainder loss at 10 Hz and 20 Hz;
- proved repeated resets can accumulate more than one fixed step of discarded logical time;
- rejected the false claim that cumulative lifecycle loss is globally bounded by one fixed step;
- rejected paused/offline wall-time replay through the live scheduler;
- rejected `DURABLE_REMAINDER_PRESERVATION_V1` under this package because it would require new persisted scheduler state plus save-schema/migration authority;
- retained current persistence, M21, progression, reward, cadence, and product-authority boundaries.

Package 3 changed no production GameLoop code or save schema.

Focused evidence:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
```

## Evidence ledger

### Verified repository / hermetic evidence

- Package 1 exact head `842c54ac...`: Build Validation #296 PASS.
- Package 2 exact head `f11b4217...`: Build Validation #297 PASS.
- Package 3 exact head `391b9fd8...`: Build Validation #298 PASS.
- The package CI stacks included TypeScript, synthetic review contract/rejection checks, localhost UI smoke, GameLoop timing qualification, cross-progression determinism, timed-Quest qualification, live/offline authority, M20–M25 suites, historical regressions, accumulated M4–M19 baseline, and production build as applicable to each candidate workflow.
- `SERIAL_BACKPRESSURE_V1` is executable as a bounded scheduler/consumer contract.
- The Package 2 production candidate satisfies bounded one-in-flight async admission while retaining exact fixed-step semantics under the qualified cases.
- Consumer rejection remains live rather than deadlocking the deferred accumulator.
- Pause/resume continues to reject paused wall-clock time.
- `FRESH_LOOP_RESET_V1` explicitly defines fractional remainder lifecycle semantics without adding persistence fields.
- Canonical save/load remains Redux-state persistence; no accumulator remainder field or migration was added.
- M21 remains a separate bounded offline allowlist; this milestone does not route live scheduler backlog or timed-Quest time through offline settlement.

### Not yet verified as one composed tree

Because Packages 1–3 were independently branched from the same base, the repository does **not** yet have exact-head evidence for the final composition:

```text
Package 1 policy artifacts
+ Package 2 production scheduler repair
+ Package 3 lifecycle policy artifacts
```

That combined-tree qualification is mandatory during integration.

### External-authority blocker

The separate Gemini AI Code Review workflow failed on all three final package candidates before producing review output:

```text
Package 1: Gemini #326 -> API_KEY_INVALID
Package 2: Gemini #327 -> API_KEY_INVALID
Package 3: Gemini #328 -> API_KEY_INVALID
```

Fixing/replacing the credential is `EXTERNAL_AUTHORITY`. Changing the standing rule that every configured CI workflow must pass is also a human/administrative authority decision. Neither action was attempted inside repository/hermetic packages.

### Pending human QA / approval gates

Still unproven or pending:

- fresh-player comprehension and discoverability;
- perceived responsiveness under real interaction;
- pacing, fairness, and balance;
- enjoyment and retention / desire to continue;
- real-device browser throttling/background behavior beyond hermetic characterization;
- any broader product decision about live-vs-offline/background semantics;
- explicit Product Direction Decision;
- authorization for M26.

Technical determinism is not evidence for these product claims.

## Integration plan after external gate resolution

Do **not** merge the three stale-base package PRs in arbitrary order and infer that the result is qualified.

Recommended sequence:

```text
1. Integrate Package 1 / PR #91.
2. Sync latest main.
3. Replay or rebase Package 2 onto that main.
4. Preserve SERIAL_BACKPRESSURE_V1 semantics while resolving only mechanical overlap.
5. Run all configured CI on the exact new Package 2 head.
6. Integrate Package 2 only if every workflow passes.
7. Sync latest main.
8. Replay or rebase Package 3 onto the composed main.
9. Re-run lifecycle evidence against the bounded-backpressure scheduler.
10. Run all configured CI on the exact new Package 3 head.
11. Integrate Package 3 only if every workflow passes.
12. Refresh this STATUS.md with actual merge commits and final composed-main evidence.
```

Package 2 was designed to implement Package 1 semantics from the same old base, but the Package 1 policy files themselves are not contained in Package 2. Package 3 was likewise qualified without Package 2's production change. Fresh replay/requalification is therefore part of integration correctness, not optional cleanup.

## Recommended next priorities

1. **Resolve the external CI authority question separately.** Repair the Gemini credential, replace that review mechanism, or explicitly revise the all-CI merge rule through human/admin authority. Do not place credentials into gameplay/timing commits.
2. **Integrate Packages 1–3 sequentially with fresh exact-head qualification.** The immediate technical goal is one composed main tree that contains policy, repair, and lifecycle contract together.
3. **Run combined scheduler/lifecycle regression after Package 2 + Package 3 composition.** Pay special attention to pause/resume, stop/start, remount, canonical save/load, rejection recovery, large-frame deferred time, and tick-rate changes.
4. **Reconcile remaining timing-policy questions only after integration.** Large-frame/background-suspension authority and discrete timed-Quest timeout precision remain separate topics; do not fold either into backlog/lifecycle integration as incidental work.
5. **Return to human product evidence.** Once technical integration is stable, the next product-facing gate remains fresh-player review followed by an explicit Product Direction Decision. M26 remains unauthorized until that authority exists.

If external human/product work remains unavailable, run a fresh repository reconciliation before creating another REPOSITORY_ONLY/HERMETIC_VALIDATION queue. Do not continue this completed three-package queue.

## Fast re-entry checklist

```text
1. Read STATUS.md.
2. Verify the current main SHA; do not assume it is still 96a87c78...
3. Check PRs #91, #92, and #93 for merge/rebase status and exact heads.
4. Check the Gemini review workflow status before assuming the external blocker still exists.
5. Do not treat independent Build Validation PASS results as final combined-tree evidence.
6. Preserve SERIAL_BACKPRESSURE_V1 during Package 2 replay.
7. Preserve FRESH_LOOP_RESET_V1 unless a separately authorized persistence policy supersedes it.
8. Preserve M21 as a separate bounded offline authority.
9. Run the candidate's exact .github/workflows/build-validation.yml before merge.
10. Do not infer pacing, fairness, fun, retention, Product Direction, or M26 authority from technical PASS.
```

## Runbook

See [`RUNBOOK.md`](RUNBOOK.md) for branch-specific qualification commands, the required integration sequence, and the combined post-integration test set.

## Governing stop conditions

- The milestone queue is complete; do not restart Packages 1–3 as new work.
- Package branches are not current-main authority until integrated.
- Do not add tick dropping/coalescing as an incidental backlog optimization.
- Do not persist accumulator remainder without new save-schema/persistence authority.
- Do not replay paused or arbitrary offline wall time through the live scheduler.
- Do not widen M21 implicitly.
- Do not treat the invalid Gemini credential as permission to bypass the standing merge gate.
- Do not claim human/product validation from repository/hermetic evidence.
- M26 remains unauthorized pending explicit product authority.
