# Timed Quest Unit & Save-Compatibility Preflight

**Package:** 1 — Timed-Quest Unit & Save-Compatibility Preflight  
**Zone:** REPOSITORY_ONLY  
**Base:** `main` at `9d25094b40bcbf5c73bb7b0871ae20d234dfa59a`  
**Production mechanics changed by this package:** none

## Decision summary

The timed-Quest defect is a boundary-unit mismatch, not a scheduler defect and not an offline-progression defect.

The authorized repair shape for the next package is:

```text
TickData.deltaTime (milliseconds)
-> App.tsx
-> processQuestTimersThunk(deltaTimeMs)
-> validate finite / positive
-> convert once: elapsedDeltaSeconds = deltaTimeMs / 1000
-> incrementQuestElapsed({ deltaSeconds: elapsedDeltaSeconds })
-> Quest.elapsedSeconds / Quest.timeLimitSeconds (seconds)
-> getTimeRemaining(...) / QuestsPage display (seconds)
```

The conversion belongs at the Quest thunk boundary. `incrementQuestElapsed`, `elapsedSeconds`, `timeLimitSeconds`, and the display helper should remain seconds-based.

**Do not add a save-schema migration for this repair based on current evidence.** Existing schema-v1 timed-Quest state is unit-ambiguous: the save layer serializes RootState without a marker that can distinguish a millisecond-scaled `elapsedSeconds` value from a legitimate seconds value. Blindly dividing persisted values by 1000 would therefore be an unsafe destructive guess. Repository search also found no current authored quest-data occurrence of `timeLimitSeconds`; the timed-Quest path is presently exercised by technical/test probes rather than a known shipped authored timer contract.

Package 2 should preserve existing saved values byte-for-byte, repair only new live elapsed-time increments, and explicitly reject non-finite/non-positive timer deltas. If timed Quests later become product-authored, persistence semantics must be versioned before relying on cross-version timer conversion.

## Current dependency map

### Producer

`src/features/GameLoop/hooks/useGameLoop.ts` produces `TickData.deltaTime` in milliseconds as part of the deterministic fixed-step scheduler contract.

### Live integration boundary

`src/App.tsx` passes `tickData.deltaTime` directly to `processQuestTimersThunk` after the other ordinary online progression consumers.

### Quest thunk

`src/features/Quest/state/QuestThunks.ts` currently:

1. selects active quests with numeric `timeLimitSeconds`;
2. reads `elapsedSeconds`;
3. adds raw `deltaTime` directly to that seconds-named value for failure prediction;
4. dispatches `incrementQuestElapsed` with the same raw value under the field name `deltaSeconds`.

This is the single mismatched boundary.

### Quest reducer

`src/features/Quest/state/QuestSlice.ts` receives `deltaSeconds`, adds it to `elapsedSeconds`, and compares the result against `timeLimitSeconds`. Its public field names and behavior are internally consistent with seconds.

### Display consumer

`src/shared/utils/time.ts#getTimeRemaining` treats both `timeLimitSeconds` and `elapsedSeconds` as seconds. `src/pages/QuestsPage.tsx` renders the result as seconds.

### Persistence

`src/shared/utils/saveSchema.ts#createCurrentSaveEnvelope` JSON-clones the complete RootState into the current schema-v1 envelope. `migrateSavePayload` performs no migration for schema v1. The only registered production migration is v0 -> v1 and it changes schema identity without transforming Quest timer values.

Therefore a schema-v1 save containing `elapsedSeconds: 1250` preserves `1250` exactly, with no metadata indicating whether the author intended 1250 seconds or whether it resulted from 1.25 seconds of the current millisecond-scaled live timer.

### Offline authority

M21 bounded offline settlement intentionally excludes `processQuestTimersThunk`. Timed Quests remain online-only. The timer repair must not widen the M21 allowlist or replay wall-clock absence through the live GameLoop.

## Executable characterization added by this package

`src/features/Quest/QuestTimerUnitCompatibilityPreflight.test.ts` freezes these current facts:

1. a `100` millisecond thunk input currently produces `elapsedSeconds === 100`;
2. the Quest reducer and remaining-time helper interpret their public fields as seconds;
3. current schema-v1 save/load preserves a millisecond-scaled timed-Quest value without normalization;
4. legacy v0 -> v1 wrapping also preserves that value without unit conversion;
5. zero and negative timer deltas currently produce no progress;
6. desired rejection of non-finite deltas remains an explicit repair target;
7. the desired invariant "1 second logical time -> 1 Quest elapsed second" remains an explicit repair target.

The preflight suite is wired into Build Validation so this evidence is checked on the exact candidate head.

## Persistence compatibility decision

### Why no v1 -> v2 normalization is authorized now

A deterministic migration requires a deterministic source-state interpretation. Current schema v1 has no timer-unit provenance marker. These two states are structurally indistinguishable:

```text
elapsedSeconds = 1250  // legitimate 1250 seconds
elapsedSeconds = 1250  // 1.25 seconds incorrectly accumulated as milliseconds
```

A universal `/ 1000` migration would corrupt the first state. Preserving the value may leave the second state semantically inflated, but current repository evidence does not establish a product-authored timed-Quest path that could have generated such a player save. The least-destructive repository-only decision is therefore to preserve old state and repair future live increments.

### Revisit trigger

Introduce an explicit schema/versioned timer migration before shipping or depending on authored timed Quests if any of the following becomes true:

- production quest data gains `timeLimitSeconds`;
- external evidence establishes real player saves containing timed Quests;
- a timer-unit provenance marker is added;
- product authority chooses a reset/restart policy for active timed Quests across the semantic change.

## Package 2 repair contract

Package 2 may change production mechanics only within this narrow contract:

- interpret `processQuestTimersThunk` input as GameLoop milliseconds;
- reject non-finite, zero, and negative deltas as no-ops;
- convert positive finite milliseconds to seconds exactly once inside the Quest timer thunk;
- use the same normalized seconds value for threshold prediction and reducer dispatch;
- preserve authored `timeLimitSeconds` values;
- preserve `incrementQuestElapsed` as a seconds-based reducer action;
- preserve existing save schema and previously persisted Quest timer values unchanged;
- preserve timed Quests as online-only under M21;
- promote the existing desired timer invariant into enforced tests.

Package 2 must not retune Quest durations, rewards, GameLoop tick rate, game speed, offline progression, or product pacing.

## Required Package 2 verification

At minimum:

- 100 ms -> 0.1 seconds;
- 250 ms -> 0.25 seconds;
- one logical second -> one elapsed Quest second;
- 10 Hz and 20 Hz equivalence;
- irregular RAF and same-frame catch-up equivalence;
- exact timeout threshold crossing and single failure notification;
- zero, negative, NaN, and infinite deltas are no-ops;
- pause/resume rejects paused wall time;
- current v1 save/load preserves stored timed-Quest values and resumes using normalized future increments;
- M21 offline settlement leaves timed Quest state frozen.

## Deferred external authority

This preflight does not establish or change:

- human pacing, comprehension, fun, or retention;
- final timer/balance values;
- product-direction authority;
- M26 authorization;
- external Gemini credential validity.

Those remain separate from the repository-local timer defect.
