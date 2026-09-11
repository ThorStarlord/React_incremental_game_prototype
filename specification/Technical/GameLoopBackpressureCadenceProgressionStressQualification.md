# GameLoop Backpressure x Cadence Progression Stress Qualification — Package 3

## Status

**Zone:** `HERMETIC_VALIDATION`  
**Production mechanics changed:** none  
**Prerequisite candidate:** Package 2 exact tree at `ed1762fabaa99a4bd266b303f9f188579dd7898f`  
**Purpose:** stress the already-selected scheduler/backpressure/cadence contracts together with real cross-progression consumers before any broader timing work is considered.

`main` is still `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`; Packages 1 and 2 remain unmerged because the configured Gemini review is externally blocked by an invalid API key. This package therefore follows the same composition rule as Package 2: start from current `main`, carry forward the exact repository-qualified Package 2 tree, then add only this bounded validation package.

## Authorities under test

This qualification does not create a new timing policy. It stress-composes the existing authorities:

- `SERIAL_BACKPRESSURE_V1`
  - at most one unresolved async `onTick` consumer is admitted;
  - excess logical milliseconds stay in the accumulator;
  - no per-tick `TickData` FIFO is minted ahead of the active consumer;
  - fulfillment and rejection both release the admission slot;
  - no drop, coalescing, retry, or concurrent consumer execution is introduced.
- Mid-session cadence semantics
  - deferred logical milliseconds are evaluated against the cadence that is authoritative when an admission slot becomes available;
  - cadence changes do not rewrite already-admitted `TickData`;
  - current reducer clamping remains authoritative.
- Existing cross-progression elapsed-time semantics
  - Essence generation, Copy growth/loyalty/tasks, Player vitality/stat recalculation, and timed-Quest advancement consume the admitted `deltaTime` values;
  - equivalent admitted logical time must remain progression-equivalent even when tick counts differ.
- Existing timed-Quest precision semantics
  - timer accumulation stays raw;
  - timeout comparison remains comparison-only tolerant of machine-scale floating-point residue.

## Stress matrix

### A. Two-second cadence flap behind one blocked progression consumer

The first 100 ms / 10 Hz tick is admitted and deliberately held unresolved while RAF time advances to 2000 ms and the configured cadence repeatedly moves through 20, 5, 25, and 10 Hz before ending at 20 Hz.

Required observations while blocked:

- scheduler state is exactly one tick ahead, not a generated backlog;
- `currentTick === 1` and `totalGameTime === 100`;
- only one consumer invocation exists;
- peak consumer concurrency is one.

On settlement, the retained 1900 ms is drained at the current 20 Hz / 50 ms step. The expected delivery is therefore one 100 ms tick plus thirty-eight 50 ms ticks: 39 admitted ticks covering exactly 2000 ms.

The real progression state is compared with a 20 x 100 ms reference execution. Tick count is intentionally allowed to differ; elapsed-time progression must not.

### B. Successive backlog windows across three cadence authorities

Three consecutive admitted ticks are independently held so deferred time is re-evaluated multiple times instead of only once:

1. tick 1: 100 ms at 10 Hz;
2. while tick 1 is blocked, cadence changes to 20 Hz; settlement admits tick 2 at 50 ms;
3. while tick 2 is blocked, cadence changes to 5 Hz; settlement admits tick 3 at 200 ms;
4. while tick 3 is blocked, cadence returns to 20 Hz; the remaining retained time drains as thirteen 50 ms ticks.

Expected admitted sequence:

```text
100, 50, 200, 50 x 13 = 1000 ms total
```

Required invariants:

- tick identities remain contiguous and monotonic;
- each blocked window permits exactly one admitted consumer;
- peak consumer concurrency remains one;
- no logical milliseconds are lost;
- the resulting Essence, Copy, Player, and timed-Quest state matches a direct reference replay of the same admitted `deltaTime` sequence.

### C. Async rejection while cadence changes

The first 100 ms tick remains unresolved while cadence switches to 20 Hz and another 200 ms of wall time is retained. The first consumer then rejects deliberately.

Required rejection behavior:

- the failure is logged once through the existing `GameLoop onTick handler rejected` path;
- the failed tick identity is not retried;
- the admission slot is released;
- four retained 50 ms ticks drain immediately and serially;
- a subsequent 50 ms RAF step is still admitted normally;
- peak concurrency remains one;
- no deadlock occurs;
- progression side effects are produced only for successfully fulfilled consumer calls, not synthesized for the rejected call.

This is a negative/rejection qualification, not a request for retry semantics.

## Test artifact

```text
src/features/GameLoop/GameLoopBackpressureCadenceProgressionStressQualification.test.tsx
```

Native command:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopBackpressureCadenceProgressionStressQualification.test.tsx
```

The package is also inserted into `.github/workflows/build-validation.yml` immediately after the ordinary mid-session cadence-transition qualification and before general cross-progression determinism. That ordering makes the progression from unit/contract evidence to composed stress evidence explicit.

## Negative / rejection coverage

The suite must reject any implementation that:

- increments `currentTick` repeatedly while a consumer remains unresolved;
- invokes two progression consumers concurrently;
- drops retained logical milliseconds;
- replays a rejected tick identity;
- deadlocks the scheduler after rejection;
- rewrites already-admitted tick cadence after a later rate change;
- fabricates progression work for a rejected consumer call;
- diverges in elapsed-time progression when equivalent admitted logical time is processed through a different tick partition.

## Explicit non-goals

This package does **not** authorize or modify:

- a maximum catch-up frame or catch-up budget;
- Page Visibility / background handoff policy;
- default tick rate, game speed, or reducer clamp ranges;
- save schema, migrations, or accumulator persistence;
- M21 offline allowlist behavior or timed-Quest offline progression;
- Quest duration/reward authoring or economy/progression balance;
- production credentials, live external services, deployments, or destructive migrations;
- subjective pacing, fairness, responsiveness, comprehension, enjoyment, retention, Product Direction, or M26 claims.

## Merge authority

Repository/hermetic qualification is necessary but not sufficient for merge under the current queue rule. The candidate may merge immediately only if **every configured CI workflow** succeeds on the exact candidate head. If the Gemini review again fails because of external credential authority, leave the PR open and do not weaken, replace, expose, or bypass that workflow.
