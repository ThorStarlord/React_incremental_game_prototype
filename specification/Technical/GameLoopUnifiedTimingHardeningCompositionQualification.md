# Unified Timing-Hardening Composition Qualification — Package 2

**Package:** Unified Timing-Hardening Composition  
**Zone:** `REPOSITORY_ONLY + HERMETIC_VALIDATION`  
**Base main:** `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Source candidate A:** PR #95 / `b11101273323b3ff242eaf4ccf5f24b4b104c642`  
**Source candidate B:** PR #88 / `b5387622e2abac222ccd1249dde6094aa1efeada`  
**External authority required for implementation:** No  
**External authority required for merge under the standing all-CI rule:** Yes, if the configured Gemini credential remains invalid.

## Purpose

This package composes two independently repository-qualified timing lines onto one exact candidate tree:

1. the GameLoop backlog/lifecycle stack from PR #95; and
2. the post-M25 timing-hardening stack from PR #88.

The package does not select a new product timing policy. It reconciles the already-authorized contracts where the old pre-backpressure characterization expected scheduler state to run ahead of an unresolved async consumer.

## Composed production authorities

### `SERIAL_BACKPRESSURE_V1`

The live scheduler:

- keeps excess logical milliseconds in the fixed-step accumulator;
- admits at most one unresolved async consumer tick;
- does not allocate an unbounded FIFO of already-minted `TickData` objects;
- does not drop, skip, or coalesce fixed logical ticks;
- keeps async consumer concurrency at one;
- releases the admission slot after fulfillment or rejection;
- advances scheduler `currentTick` / fixed-step `totalGameTime` only for admitted work.

### `FRESH_LOOP_RESET_V1`

Sub-step accumulator remainder:

- is preserved during continuous live execution;
- is preserved through pause/resume while paused wall time is rejected;
- is discarded on stop/start;
- is discarded on unmount/remount;
- is discarded on canonical save/load followed by a fresh mount;
- is not persisted and does not widen offline authority.

### Timed-Quest precision comparison

The Quest timing repair from PR #88 is composed unchanged:

- accumulated and persisted `elapsedSeconds` remain raw;
- timeout qualification uses the shared bounded comparison helper;
- 10 Hz and 20 Hz resolve machine-noise-equivalent authored timeout boundaries consistently;
- materially early values remain rejected;
- no Quest duration, reward, save-schema, or offline-progress policy is changed.

## Reconciliation of historical async timing characterizations

PR #88 incorporated pre-backpressure evidence in which a large unpaused frame could advance scheduler state for every fixed step immediately while `onTick` callbacks remained serialized behind one unresolved Promise.

That intermediate scheduler-ahead behavior is superseded by `SERIAL_BACKPRESSURE_V1` in the composed tree.

The composed large-frame qualification therefore requires:

```text
5,000 ms unpaused elapsed at 10 Hz
+ first async consumer unresolved
=> currentTick = 1
=> totalGameTime = 100 ms
=> one consumer entered
=> remaining 4,900 ms stays deferred
```

After the active consumer settles and the following async consumers settle, all fifty 100 ms logical steps must still be admitted in order. The final logical result remains:

```text
currentTick = 50
totalGameTime = 5,000 ms
no dropped/coalesced ticks
peak async consumer concurrency = 1
```

Synchronous large-frame behavior remains unchanged: a synchronous consumer can drain all available fixed steps in the same deterministic pass.

## Cadence-transition reconciliation

The cadence contract remains:

- accumulated logical milliseconds are not reset or repartitioned merely because tick rate changes;
- deferred logical milliseconds are evaluated against the currently authoritative fixed-step threshold when an admission slot becomes available;
- pause/resume still rejects paused wall time;
- the reducer's finite `1..60 Hz` clamp remains authoritative.

Two distinct cases are qualified so the test harness does not conflate them:

1. **Ordinary phase transition with a draining consumer.** Each 10 Hz / 20 Hz / 10 Hz phase is allowed to drain before the next rate change. One live second therefore produces the same elapsed-time progression as the existing cadence qualification while retaining the intended per-phase tick widths.
2. **Rate change while an async consumer is blocked.** Scheduler lead remains bounded to one admitted tick; elapsed time that arrives behind the blocked consumer remains accumulator time and adopts the current fixed-step threshold when settlement opens the next slot.

This is not a new cadence policy. It is the direct composition of PR #88's accumulator-threshold semantics with PR #95's one-in-flight admission rule.

## Combined hermetic qualification

The exact candidate Build Validation must run, on one tree:

- synthetic review validation and action-binding rejection checks;
- localhost UI-only smoke;
- TypeScript;
- GameLoop timing characterization;
- async backlog policy contract;
- bounded backlog production repair;
- lifecycle remainder / restart-save-resume qualification;
- large-frame/background-stall qualification;
- mid-session cadence-transition qualification;
- cross-progression determinism;
- long-horizon cross-progression drift;
- timed-Quest unit/save compatibility;
- Quest timing integration;
- timed-Quest precision preflight regression;
- timed-Quest precision resolution;
- live/offline boundary and M21;
- M20-M25;
- active-loop and historical regression sets;
- accumulated M4-M19 baseline;
- production build.

## Negative / rejection requirements

The candidate must continue rejecting or proving absence of:

- producer lead greater than one behind an unresolved async consumer;
- queued per-tick `TickData` backlog allocation;
- tick dropping, skipping, or coalescing;
- overlapping async consumers;
- deadlock after consumer rejection;
- paused-wall-time replay;
- offline-wall-time replay through the live scheduler;
- implicit persistence of accumulator remainder;
- unauthorized save-schema or migration changes;
- widening the M21 offline allowlist;
- offline timed-Quest progression;
- materially early timed-Quest timeout qualification;
- accumulator reset/repartition solely because cadence changes;
- a max-frame clamp, Page Visibility rule, or background/offline handoff that has not been separately authorized.

## Explicitly unchanged

This package does not change:

- default tick rate;
- game speed semantics;
- authored Quest durations or rewards;
- Essence, Copy, Player, relationship, or other progression formulas;
- save envelope/schema/migrations;
- M21 offline authority;
- product pacing, fairness, balance, responsiveness, enjoyment, or retention claims;
- real-device/browser-throttling claims;
- Product Direction;
- M26 authority;
- production credentials or external services.

## Historical-document interpretation

The source qualification documents from PR #88 and PR #95 are retained as evidence of the questions they originally answered. Where a PR #88 document describes scheduler-ahead async backlog behavior, that statement is historical pre-backpressure characterization and is superseded for current composed authority by this document plus `SERIAL_BACKPRESSURE_V1`.

No historical evidence is rewritten into a false claim that it was originally observed under the bounded scheduler.

## Package decision

If the exact composed candidate passes the repository-native Build Validation stack, record:

```text
UNIFIED_POST_M25_TIMING_COMPOSITION
= REPOSITORY_QUALIFIED

SERIAL_BACKPRESSURE_V1
+ FRESH_LOOP_RESET_V1
+ TIMED_QUEST_PRECISION_REPAIR
+ LARGE_FRAME_CHARACTERIZATION
+ CADENCE_TRANSITION_QUALIFICATION
+ LONG_HORIZON_DRIFT_QUALIFICATION
= COMPOSED ON ONE EXACT TREE
```

Merge remains governed by the standing rule that every configured CI workflow must pass. An invalid external review credential is not authorization to bypass that rule and is not repaired inside this package.
