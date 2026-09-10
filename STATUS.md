# Milestone Handoff — Timed Quest Unit Normalization & Integration Qualification

**Handoff date:** 2026-09-10  
**Implementation milestone tip before this docs handoff:** `d704bc6f1cc45b0414447aff2fe2ba19a14751ad`  
**Product authority:** `M25 Complete Chapter Vertical Slice = PASS`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**Product Direction Decision:** `PENDING`  
**M26:** `NOT AUTHORIZED`

## Purpose

This is the repository-grounded handoff for future engineers and future chat sessions after the three-package timed-Quest timing milestone.

The milestone began from a characterized unit mismatch:

```text
GameLoop TickData.deltaTime = milliseconds
Quest elapsedSeconds/timeLimitSeconds = seconds
processQuestTimersThunk previously forwarded milliseconds directly
```

The milestone closed three bounded questions:

1. where milliseconds become Quest seconds and how persisted timer state constrains a safe repair;
2. whether the live timed-Quest path can be repaired without rewriting existing saves, authored durations, scheduler cadence, or M21 offline authority; and
3. whether the repaired contract composes correctly with the real fixed-step GameLoop, catch-up, pause/resume, save/load, timeout notification, and bounded offline-settlement seams.

All three packages are complete and merged. Do **not** carry this three-package queue forward as pending work.

This milestone does **not** establish player-facing pacing, balance, comprehension, enjoyment, retention, production scalability, anti-cheat resistance, Product Direction, or authorization for M26.

## Current repository state

The automated implementation program through M25 remains qualified. The deterministic fixed-step GameLoop, cross-progression timing qualification, elapsed-time-based Player vitality repair, live/save/offline/resume boundary qualification, and timed-Quest seconds repair are now all present together on `main`.

The timed-Quest live contract is now:

```text
GameLoop fixed-step deltaTimeMs
-> processQuestTimersThunk(deltaTimeMs)
-> reject non-finite / non-positive input
-> deltaSeconds = deltaTimeMs / 1000
-> use the same deltaSeconds for timeout prediction and reducer dispatch
-> Quest elapsedSeconds / timeLimitSeconds remain seconds
```

Important persistence boundary:

- current schema-v1 saves still preserve stored Quest timer values exactly;
- no v1 -> v2 migration was introduced for this repair;
- existing schema-v1 timer values have no unit-provenance marker, so blind conversion would risk corrupting legitimate seconds values;
- only **future live increments** are normalized at the GameLoop -> Quest boundary;
- M21 remains an explicit two-consumer offline allowlist: passive Essence plus already-running M20 Copy production tasks;
- timed Quests remain online-only during offline settlement.

Key references:

- `specification/Technical/TimedQuestUnitAndSaveCompatibilityPreflight.md`
- `specification/Technical/GameLoopTimedQuestSecondsNormalizationRepair.md`
- `specification/Technical/GameLoopQuestTimingIntegrationQualification.md`
- `src/features/Quest/state/QuestThunks.ts`
- `src/features/Quest/QuestTimerUnitCompatibilityPreflight.test.ts`
- `src/features/GameLoop/GameLoopProgressionDeterminism.test.tsx`
- `src/features/GameLoop/GameLoopQuestTimingIntegrationQualification.test.tsx`
- `src/features/GameLoop/GameLoopLiveOfflineBoundary.test.tsx`
- `.github/workflows/build-validation.yml`

## Work-package outcomes

### Package 1 — Timed-Quest Unit & Save-Compatibility Preflight

**Terminal state:** `COMPLETE / MERGED`  
**PR:** #77 — `Preflight timed Quest unit and save compatibility`  
**Candidate head:** `0e720033a8ed88a1f288ac2c44a7c5caec44ab2f`  
**Merge commit:** `bad49e7faeef09acf9d16a0e039c8b1f8bd4099c`  
**Build Validation:** #275 — `PASS`

Delivered:

- executable characterization of the live milliseconds-vs-seconds mismatch;
- confirmation that reducer, helper, UI, and public Quest field semantics are seconds-based;
- current schema-v1 and legacy-v0 persistence characterization;
- malformed/zero/negative delta characterization;
- a producer/consumer/persistence/offline dependency map;
- the authorized repair boundary for Package 2;
- permanent focused CI coverage.

Preflight decision:

- normalize exactly once inside `processQuestTimersThunk`;
- preserve `incrementQuestElapsed`, `elapsedSeconds`, `timeLimitSeconds`, and display semantics as seconds;
- do not guess-convert existing schema-v1 stored values because no unit-provenance marker exists;
- do not widen M21 offline authority;
- do not retune Quest durations/rewards, tick rate, game speed, or product pacing.

Package 1 changed no production mechanics.

### Package 2 — Seconds-Normalized Timed-Quest Repair

**Terminal state:** `COMPLETE / MERGED`  
**PR:** #78 — `Normalize timed Quest progression to seconds`  
**Candidate head:** `094184cc60c67fbdc23be2a6e96e9f6babe7a235`  
**Merge commit:** `379d3612f4c575e7617aa8129e8e1fef333ce97d`  
**Build Validation:** #276 — `PASS`

Delivered:

- `processQuestTimersThunk` now treats GameLoop input as milliseconds;
- non-finite and non-positive deltas are rejected as no-ops;
- positive input is converted exactly once with `deltaSeconds = deltaTimeMs / 1000`;
- timeout prediction and reducer dispatch use the same normalized seconds value;
- 100 ms -> 0.1 s and 250 ms -> 0.25 s are enforced;
- one logical GameLoop second -> one elapsed Quest second is enforced;
- regular/irregular/catch-up and 10 Hz/20 Hz cross-progression assertions now enforce seconds-based Quest progression;
- exact seeded threshold crossing and single failure notification are covered;
- current schema-v1 save/load preserves stored timer values and resumes with normalized future increments.

Package 2 deliberately did **not** change:

- save schema or persisted Quest timer values;
- authored `timeLimitSeconds` or rewards;
- GameLoop tick rate or game speed;
- M21 offline allowlist;
- offline Quest progression;
- product pacing/balance claims;
- Product Direction or M26 authority.

### Package 3 — Quest Timing Integration Qualification

**Terminal state:** `COMPLETE / MERGED`  
**PR:** #79 — `Qualify integrated timed Quest timing boundaries`  
**Final candidate head:** `525e8d798d6e633292576d900ce69212ab1f011c`  
**Merge commit:** `d704bc6f1cc45b0414447aff2fe2ba19a14751ad`  
**Build Validation:** #279 — `PASS`

Delivered a permanent hermetic suite using the real production seams:

```text
useGameLoop
-> processQuestTimersThunk
-> Quest state / failure notification
-> createSave
-> loadSavedGameWithMigration
-> replaceState
-> settleOfflineProgressThunk
-> resumed useGameLoop
```

The suite verifies:

- one logical Quest second is invariant across regular 10 Hz, irregular 10 Hz, same-frame 10 Hz catch-up, and regular 20 Hz delivery;
- same-frame queued catch-up fails an expiring Quest once, removes it from active timer processing, and later queued ticks neither advance it nor duplicate notification;
- pause/resume excludes paused wall-clock time and resumes with an ordinary fixed step;
- canonical save/load preserves the stored Quest timer value;
- a synthetic 20-second M21 offline settlement leaves timed Quest state frozen;
- resumed live ticks alone advance the Quest and can cross the timeout;
- failed Quest timers remain frozen after failure.

Qualification also exposed an important discrete-timestep detail: repeated decimal `0.1` second additions may land just below an authored decimal threshold because of IEEE floating-point representation. The repository therefore qualifies timeout failure on the **first fixed step whose computed elapsed value satisfies the existing `>= timeLimitSeconds` predicate**, with crossing delay bounded by at most one fixed step. This package did **not** authorize rounding, epsilon comparison, timer clamping, quantization, or other production precision changes.

Package 3 changed only test/CI/documentation surfaces; no production mechanics were changed.

## Evidence ledger

### Verified repository / hermetic evidence

- M25 Complete Chapter Vertical Slice remains `PASS`.
- Deterministic GameLoop scheduler qualification remains green.
- Cross-progression regular/irregular/catch-up and 10 Hz/20 Hz timing qualification remains green.
- Player vitality remains elapsed-logical-time based.
- Timed Quest live progression now normalizes milliseconds to seconds exactly once.
- Timed Quest invalid/non-positive deltas are no-ops.
- Current schema-v1 stored Quest timer values are preserved rather than guessed/migrated.
- Future live increments after restore use normalized seconds.
- Quest timeout prediction and reducer progression consume the same normalized delta.
- Timeout failure emits one failure notification and removes the Quest from active timer processing.
- Paused wall-clock time does not advance timed Quests.
- Equivalent logical Quest time is stable across qualified RAF layouts and supported 10 Hz/20 Hz schedules.
- M21 offline settlement does not advance timed Quest timers or trigger timed-Quest failure.
- Resumed live scheduling advances Quest time from the restored value with ordinary fixed steps.
- Package Build Validation results passed on exact candidate heads: #275, #276, and final #279.
- Final Package 3 Build Validation #279 passed rejection checks, localhost UI smoke, TypeScript, scheduler/cross-progression/timed-Quest/live-offline suites, M20-M25 qualification, active-loop/historical regressions, and production build.

### Still unproven / pending human or external authority

- fresh-player comprehension and discoverability;
- human pacing assessment, including whether timed-Quest durations feel fair or readable;
- emotional impact and enjoyment;
- retention / desire to continue;
- final progression, reward, regeneration, Quest-duration, and offline-cap balance;
- generalized campaign/chapter scalability;
- trusted server time / anti-cheat authority;
- a valid completed human product-review evidence cycle where required;
- explicit post-M25 Product Direction Decision;
- M26 authorization.

### External diagnostic note

The separate Gemini AI Code Review workflow failed on Packages 1-3 before producing a review because its configured Gemini API key is invalid (`API_KEY_INVALID`). Repository-authoritative Build Validation passed independently on all final package candidates.

Fixing or replacing that credential is an **EXTERNAL_AUTHORITY** concern. It should not be mixed into GameLoop/Quest mechanics work and was intentionally not attempted.

## Recommended next priorities

1. **Start the next session with a fresh repository reconciliation.** This timed-Quest queue is complete; do not infer another package from the old queue without checking the latest `main`, `STATUS.md`, recent commits, and current product authority.
2. **Decide whether timeout precision semantics deserve a bounded preflight.** Package 3 documented that decimal floating-point accumulation can delay a `>=` threshold by one fixed step. Do not silently add epsilon/rounding/clamping. If exact authored timeout semantics matter, first define the intended contract and persistence/UI implications, then qualify alternatives hermetically.
3. **Define timed-Quest authoring/persistence readiness before relying on timed Quests as authored product content.** Existing schema-v1 timer values have no unit provenance. If timed Quests become broadly authored or real saved games containing them become important, decide whether a future schema/version/provenance mechanism is required rather than retroactively guessing old values.
4. **Keep M21 offline authority separate.** Timed Quests remain online-only during offline settlement. Any future offline Quest progression requires an explicit product decision and a separate bounded design/qualification package.
5. **Return to human product evidence when available.** Deterministic timing does not prove pacing, fairness, comprehension, fun, or retention. Those remain the gates for an explicit Product Direction Decision and any M26 authorization.
6. **Optionally repair the Gemini credential as a separate external-maintenance task.** Do not let that credential issue redefine repository correctness or merge qualification.

If external human validation is unavailable in the next session, prefer another clearly justified `REPOSITORY_ONLY` or `HERMETIC_VALIDATION` package discovered by reconciliation rather than weakening human/product claims.

## Fast re-entry checklist

```text
1. Read STATUS.md and verify the current main SHA.
2. Read the three timed-Quest technical documents.
3. Confirm Packages 1-3 are complete; do not restart them.
4. Run the focused GameLoop / Quest / live-offline qualification commands below.
5. Reconcile before creating a new work-package queue.
6. Preserve current schema-v1 stored Quest timer values unless a new migration authority is explicitly designed.
7. Preserve M21 as a separate two-consumer offline allowlist.
8. Treat fixed-step decimal timeout precision as documented behavior, not implicit permission to add epsilon/rounding.
9. Do not infer pacing, balance, fun, retention, Product Direction, or M26 authority from deterministic execution.
```

## Validation / tooling entrypoints

Install and type-check:

```bash
npm ci
npx tsc --noEmit
```

Focused GameLoop / timed-Quest qualification:

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

Repository rejection / synthetic-review contract checks:

```bash
npm run simulated-review:validate
npm run simulated-review:action-contract
```

Production bundling:

```bash
npm run build
```

The authoritative merge stack is `.github/workflows/build-validation.yml`; use its exact current command sequence when qualifying a future candidate.

## Governing stop conditions

- This three-package timed-Quest milestone is complete; do not restart Package 1, 2, or 3.
- The old `KNOWN / UNREPAIRED` timed-Quest milliseconds-vs-seconds statement is obsolete.
- Existing persisted Quest timer values must not be guess-converted without new migration/provenance authority.
- Fixed-step floating-point threshold behavior is characterized, not authorization for an unscoped precision repair.
- Deterministic execution is not evidence that the game is well paced, balanced, understandable, or fun.
- Fixed-step live execution is not authority for arbitrary wall-clock absence.
- M21 offline authority must remain explicit and bounded unless separately changed by product authority.
- M26 remains unauthorized until separate product-evidence and Product Direction Decision gates are satisfied.
