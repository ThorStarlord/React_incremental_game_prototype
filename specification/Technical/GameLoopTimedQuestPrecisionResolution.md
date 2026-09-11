# GameLoop Timed Quest Precision Semantics Resolution

**Package:** 2 — Timed-Quest Precision Semantics Resolution  
**Zone:** REPOSITORY_ONLY + HERMETIC_VALIDATION  
**Base:** `main` at `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Preflight evidence:** Package 1 PR #81 candidate `aa5d8d6ab4d77669cbd937393d209becb1cd2c50`, Build Validation #281 PASS  
**Production scope:** timeout comparison semantics only

## Purpose

The Package 1 preflight characterized a concrete precision defect at the timed-Quest timeout boundary:

- an authored `1.0` second Quest can remain `IN_PROGRESS` after ten `0.1` second steps because the accumulated value is `0.9999999999999999`;
- the same authored limit can already be `FAILED` after twenty `0.05` second steps because the accumulated value is slightly above `1.0`;
- save/load correctly preserves the raw accumulated timer value, so hidden floating-point history can affect which live fixed step first satisfies the old raw `>=` comparison.

Package 1 therefore authorized only a bounded comparison-time repair. It did **not** authorize timer rounding, clamping, quantization, save migration, duration retuning, tick-rate changes, offline Quest progression, or broader progression redesign.

Package 1 remains unmerged only because the separate Gemini AI Code Review workflow is blocked by an external invalid API credential. Its repository-authoritative Build Validation passed. This Package 2 branch is based on current `main` and does not modify that external workflow or credential.

## Repair

A shared helper now defines the timed-Quest timeout comparison:

```text
hasReachedQuestTimeLimit(elapsedSeconds, timeLimitSeconds)
```

The helper preserves ordinary numeric ordering first:

```text
elapsedSeconds >= timeLimitSeconds -> reached
```

If the value is infinitesimally below the limit, it then permits only a machine-scale tolerance:

```text
scale = max(1, abs(elapsedSeconds), abs(timeLimitSeconds))
tolerance = Number.EPSILON * scale * 4
reached when timeLimitSeconds - elapsedSeconds <= tolerance
```

The factor is deliberately expressed in floating-point precision units rather than gameplay units. It is not a millisecond-, frame-, or authored-duration epsilon. The intent is only to treat representational residue at an otherwise nominally reached boundary as equality.

## Shared comparison authority

The same helper is consumed by both timeout authorities:

1. `QuestSlice.incrementQuestElapsed` uses it to decide whether the Quest state becomes `FAILED` and leaves `activeQuestIds`.
2. `processQuestTimersThunk` uses it to predict the same boundary crossing and emit the single `Quest Failed` notification.

This prevents state and notification semantics from disagreeing at the repaired precision boundary.

## Preserved contracts

This package deliberately preserves all of the following:

- GameLoop continues supplying milliseconds.
- `processQuestTimersThunk` continues rejecting non-finite and non-positive deltas.
- The thunk still converts exactly once with `deltaTimeMs / 1000`.
- `Quest.elapsedSeconds` and `Quest.timeLimitSeconds` remain seconds-based public fields.
- Accumulated `elapsedSeconds` is not rounded or clamped to the authored limit.
- Existing schema-v1 persisted timer values are not rewritten, converted, normalized, or migrated.
- Save/load continues preserving the raw stored timer value.
- M21 remains the existing two-consumer offline allowlist; timed Quests remain online-only during offline settlement.
- GameLoop tick rate, game speed, Quest durations, rewards, progression curves, and product pacing are unchanged.
- Failed Quest timers remain removed from active timer processing and later live/catch-up ticks cannot advance them or duplicate the failure notification.

## Rejection boundary

The repair must not cause materially early timeout.

The focused qualification therefore distinguishes machine noise from real remaining time:

```text
1 - Number.EPSILON seconds vs 1 second -> reached
1 - 1e-12 seconds vs 1 second          -> not reached
0.999 seconds vs 1 second              -> not reached
```

This keeps the tolerance many orders of magnitude below supported fixed-step progression and avoids turning the repair into a gameplay-scale grace/penalty rule.

## Hermetic qualification

`src/features/GameLoop/GameLoopTimedQuestPrecisionResolution.test.tsx` qualifies the production seams.

It verifies:

- machine-noise undershoot is accepted while materially early values are rejected;
- one logical second produces the same timeout state at supported 10 Hz and 20 Hz schedules;
- regular, irregular, and same-frame catch-up 10 Hz layouts agree at the nominal `1.0` second boundary;
- raw accumulated values remain untouched, including the `0.9999999999999999` 10 Hz representation;
- exact `0.9` and nine-step accumulated timer histories both resolve on the same next nominal 100 ms step;
- schema-v1 save/migration preserves the accumulated raw value exactly;
- invalid/non-positive live deltas remain no-ops even when a stored timer is inside comparison tolerance;
- timeout notification remains exact-once;
- failed timers remain frozen.

Focused command:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
```

## Native and rejection qualification

Merge qualification still requires the repository-native stack, including:

```bash
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
npm run build
```

The complete authoritative sequence remains `.github/workflows/build-validation.yml`.

## External authority deliberately deferred

This repair does not establish or claim:

- player-facing fairness of any specific Quest duration;
- pacing, balance, comprehension, discoverability, enjoyment, or retention;
- trusted server-time or anti-cheat authority;
- Product Direction Decision;
- M26 authorization;
- validity of Gemini or any other external review credential.

Those remain separate `EXTERNAL_AUTHORITY` or product-evidence concerns.

## Stop boundary

Package 2 resolves only machine-noise dependence in timed-Quest timeout comparison semantics.

Do not use this repair as authority to change timer storage, persistence schema, offline Quest progression, authored content, tick cadence, or product balance.
