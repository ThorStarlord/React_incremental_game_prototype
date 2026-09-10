# GameLoop Timed-Quest Seconds Normalization Repair

**Package:** 2 — Seconds-Normalized Timed-Quest Repair  
**Zone:** REPOSITORY_ONLY  
**Preflight authority:** `TimedQuestUnitAndSaveCompatibilityPreflight.md`  
**Base:** `main` at `bad49e7faeef09acf9d16a0e039c8b1f8bd4099c`

## Scope

This package repairs the previously characterized unit mismatch between GameLoop `TickData.deltaTime` and timed-Quest state.

The repair is intentionally narrow:

```text
TickData.deltaTime (milliseconds)
-> App.tsx
-> processQuestTimersThunk(deltaTimeMs)
-> reject non-finite / non-positive values
-> elapsedDeltaSeconds = deltaTimeMs / 1000
-> incrementQuestElapsed({ deltaSeconds: elapsedDeltaSeconds })
-> elapsedSeconds / timeLimitSeconds remain seconds
```

No authored Quest duration, reward, GameLoop tick rate, game speed, offline allowlist, save schema, or persisted Quest timer value is changed by this package.

## Production change

`src/features/Quest/state/QuestThunks.ts#processQuestTimersThunk` now owns the milliseconds-to-seconds boundary.

For every positive finite GameLoop delta:

1. the thunk converts milliseconds to seconds exactly once;
2. failure prediction uses the normalized seconds value;
3. `incrementQuestElapsed` receives the same normalized seconds value;
4. Quest state and display consumers continue to interpret `elapsedSeconds` and `timeLimitSeconds` as seconds.

For zero, negative, `NaN`, or infinite input, the thunk returns without mutating Quest state or emitting a failure notification.

## Persistence compatibility

The Package 1 preflight established that current schema-v1 saves contain no timer-unit provenance marker. This package therefore does **not** introduce a v1 -> v2 migration and does not reinterpret stored values.

A saved `elapsedSeconds` value remains byte-for-byte semantically unchanged through the existing save/migration pipeline. After restore, subsequent live GameLoop increments use the corrected seconds-normalized boundary.

This is deliberate: blindly dividing existing schema-v1 values by 1000 could corrupt legitimate seconds-valued state because the two possible histories are structurally indistinguishable.

## Offline authority

M21 remains unchanged. Timed Quests are still online-only and `settleOfflineProgressThunk` does not call `processQuestTimersThunk`.

This package does not replay wall-clock absence through live GameLoop ticks and does not broaden offline progression.

## Enforced invariants

`QuestTimerUnitCompatibilityPreflight.test.ts` now enforces:

- `100 ms -> 0.1 s`;
- `250 ms -> 0.25 s`;
- ten 100 ms logical ticks -> exactly one elapsed Quest second;
- Quest reducer and remaining-time display semantics remain seconds-based;
- zero, negative, `NaN`, and infinite deltas are no-ops;
- exact threshold crossing fails the Quest once and emits one failure notification;
- current schema-v1 save/load preserves stored timer values and resumed live increments use normalized seconds;
- legacy v0 -> v1 wrapping still preserves Quest timer values without unit conversion.

`GameLoopProgressionDeterminism.test.tsx` promotes the old desired invariant into the integrated progression harness:

- regular, irregular, and same-frame catch-up layouts remain equivalent for one second of logical time;
- 10 Hz and 20 Hz schedules both yield one elapsed Quest second;
- pause/resume continues to reject paused wall time.

Existing `GameLoopLiveOfflineBoundary.test.tsx` and `GameLoopM21OfflineProgress.test.ts` remain the authority that offline settlement does not advance timed Quests.

## Deferred authority

This repair does not establish:

- human-facing pacing or balance quality;
- comprehension, enjoyment, or retention;
- final authored timed-Quest duration policy;
- product-direction authority or M26 authorization;
- validity of the external Gemini review credential.

Those remain separate from this repository-local timing correction.
