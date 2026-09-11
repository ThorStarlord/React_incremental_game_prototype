# Timed Quest Precision Contract Preflight

**Package:** 1 — Timed-Quest Precision Contract Preflight  
**Zone:** HERMETIC_VALIDATION  
**Base:** `main` at `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Production mechanics changed by this package:** none

## Purpose

The prior timed-Quest milestone repaired the GameLoop milliseconds -> Quest seconds unit boundary and qualified the current timeout rule:

```text
before = quest.elapsedSeconds
elapsedDeltaSeconds = deltaTimeMs / 1000
after = before + elapsedDeltaSeconds
fail when before < timeLimitSeconds && after >= timeLimitSeconds
```

That qualification also recorded that repeated decimal additions may land infinitesimally below an authored threshold. This package answers the narrower follow-up question: **is the current first-qualifying-step behavior sufficiently invariant across supported schedules and persisted history, or is a bounded precision repair justified?**

This is a preflight/characterization package only. It does not change `QuestThunks.ts`, `QuestSlice.ts`, GameLoop cadence, authored Quest durations, save schema, stored timer values, M21 offline authority, or product balance.

## Executable evidence

`src/features/GameLoop/GameLoopTimedQuestPrecisionPreflight.test.tsx` exercises the real fixed-step GameLoop and the real Quest timer thunk.

### Finding 1 — some decimal thresholds land on the nominal step

An authored `0.6` second limit reaches the current `>=` predicate on the nominal logical boundary at both supported schedules used by the qualification:

```text
10 Hz: 6 x 0.1s  -> timeout at 0.6s
20 Hz: 12 x 0.05s -> timeout at 0.6s
```

This shows that the problem is not simply "all decimals are late".

### Finding 2 — the same 1.0 second authored limit diverges by tick rate

For an authored `1.0` second limit:

```text
10 Hz after 10 ticks / 1000 ms:
  elapsedSeconds = 0.9999999999999999
  status = IN_PROGRESS

10 Hz after 11 ticks / 1100 ms:
  elapsedSeconds = 1.0999999999999999
  status = FAILED

20 Hz after 20 ticks / 1000 ms:
  elapsedSeconds = 1.0000000000000002
  status = FAILED
```

So two supported schedules representing the same one second of logical GameLoop time can disagree about whether the Quest has timed out.

That is stronger than the previously documented "bounded by one fixed step" observation: the timeout boundary is currently **tick-rate dependent** for at least one ordinary authored value.

### Finding 3 — RAF layout is not the source of the divergence

At 10 Hz, regular RAF delivery, irregular RAF delivery, and one-frame catch-up all converge on the same current result: the `1.0` second Quest remains below the threshold after ten logical steps and fails on the eleventh.

The defect boundary is therefore decimal accumulation/comparison under the selected fixed step, not ordinary RAF chunking.

### Finding 4 — persisted floating history can affect the next timeout step

Schema-v1 persistence correctly preserves stored Quest timer values without reinterpretation. That preservation exposes a second semantic inconsistency:

- a stored exact `elapsedSeconds = 0.9` plus one 100 ms live tick reaches exactly `1.0` and fails;
- a value produced by nine prior 100 ms increments is slightly below `0.9`; after save/restore, one more 100 ms tick remains slightly below `1.0` and does not fail until the following tick.

Both values are numerically equivalent for ordinary display and author reasoning, but their hidden floating history changes timeout timing.

This is not authority to rewrite saved values. It is evidence that the **comparison boundary** should not depend on representational residue.

### Finding 5 — invalid deltas remain rejection-only

Zero, negative, NaN, and infinite deltas remain no-ops even when a Quest is infinitesimally below its limit. The precision problem does not justify weakening the existing positive-finite input contract.

## Decision

**PREFLIGHT DECISION: AUTHORIZE A BOUNDED TIMEOUT-COMPARISON PRECISION REPAIR.**

Retaining the current contract unchanged is rejected because it permits:

1. different timeout states after equivalent logical time at supported 10 Hz and 20 Hz schedules; and
2. different next-step timeout behavior for numerically equivalent persisted timer states whose only difference is floating-point accumulation history.

The authorized repair boundary for Package 2 is intentionally narrow.

## Package 2 authorized invariants

Package 2 may change only the timeout-reached comparison semantics needed to remove machine-noise dependence. It must preserve all of the following:

1. `elapsedSeconds` and `timeLimitSeconds` remain public seconds-based fields.
2. `processQuestTimersThunk` continues accepting GameLoop milliseconds and converts exactly once with `/ 1000`.
3. Positive finite deltas remain the only accepted live timer inputs; zero, negative, NaN, and infinities remain no-ops.
4. The reducer/thunk must not fail a Quest a meaningful gameplay step before its authored limit.
5. An authored threshold that is reached within ordinary floating-point representation noise must resolve on the nominal fixed step consistently across supported 10 Hz and 20 Hz schedules.
6. Regular, irregular, and catch-up RAF layouts representing equivalent logical time must agree on timeout state.
7. Timeout still emits exactly one failure notification and removes the Quest from active timer processing.
8. Failed Quest timers remain frozen on later queued/live ticks.
9. Existing schema-v1 stored Quest timer values must not be rounded, divided, rewritten, guess-converted, or migrated.
10. Save/load must preserve stored timer values exactly as the current schema contract requires; the repair belongs at comparison time, not persistence time.
11. M21 offline settlement remains unchanged and timed Quests remain online-only there.
12. Authored Quest durations, rewards, GameLoop tick rate, game speed, progression curves, and product pacing remain unchanged.

## Option assessment

### A. Keep first-qualifying-step semantics unchanged

**Rejected.** The new characterization proves tick-rate and floating-history dependence at ordinary boundaries such as `1.0` second.

### B. Round or quantize `elapsedSeconds` on every increment

**Rejected for this package family.** This mutates the state/persistence contract and could create broader progression or migration consequences than the observed defect requires.

### C. Clamp the stored timer to `timeLimitSeconds` near the boundary

**Not authorized by this preflight.** Clamping changes persisted timer state and is unnecessary to decide whether a timeout has been reached.

### D. Introduce a comparison-only numeric tolerance at the timeout predicate

**Preferred repair shape for Package 2.** A narrowly bounded comparison helper can treat machine-noise undershoot as threshold equality while leaving accumulated/stored values untouched.

Package 2 must choose and test the tolerance deliberately. It must not use an arbitrary gameplay-scale epsilon that could cause materially early failure.

### E. Replace Quest timing with integer milliseconds or a new canonical clock field

**Rejected as disproportionate.** It would widen the domain model, persistence contract, and migration surface beyond the demonstrated defect.

## Verification authority

Package 1 adds the focused preflight suite to Build Validation:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
```

Merge qualification also retains the repository's existing native and rejection gates, including:

```bash
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
npm run build
```

The complete authoritative sequence remains `.github/workflows/build-validation.yml`.

## External authority deliberately deferred

This preflight makes no claim about:

- whether any particular timed-Quest duration feels fair;
- player comprehension or discoverability;
- progression balance or reward tuning;
- enjoyment or retention;
- Product Direction Decision;
- M26 authorization;
- trusted server-time or anti-cheat authority;
- Gemini or other external review credentials.

Those remain separate product or `EXTERNAL_AUTHORITY` concerns.

## Stop boundary

Package 1 authorizes only a bounded timeout-comparison precision repair for Package 2. It does **not** authorize implementing that repair here.

Do not change production mechanics as part of this preflight.
