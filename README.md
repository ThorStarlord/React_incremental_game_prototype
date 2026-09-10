# React Incremental RPG Prototype

A React/TypeScript incremental RPG prototype combining active relational/strategic play with earned delegation and bounded offline progression.

## Current authority

The automated implementation program through **M25 — Complete Chapter Vertical Slice** remains complete and qualified. The timed-Quest timing milestone is also complete: the GameLoop milliseconds -> Quest seconds boundary was preflighted, repaired, and qualified across scheduler, persistence, pause/resume, timeout, notification, and M21 offline-settlement seams. A later bounded precision repair makes timeout comparison insensitive to machine-scale floating-point residue while preserving raw timer accumulation and persistence values.

```text
M25 Complete Chapter Vertical Slice: PASS
GameLoop Timing Characterization: COMPLETE
Deterministic Live Tick Scheduler Repair: COMPLETE
Cross-Progression Tick Determinism Characterization: COMPLETE
Delta-Time-Normalized Vital Regeneration Repair: COMPLETE
Live/Persistence/Offline Progression Boundary Qualification: COMPLETE
Timed Quest Unit & Save-Compatibility Preflight: COMPLETE
Seconds-Normalized Timed Quest Repair: COMPLETE
Quest Timing Integration Qualification: COMPLETE
Timed Quest Precision Semantics Resolution: COMPLETE
Human Integrated Playability / Product Review: PENDING
Product Direction Decision: PENDING
M26: NOT AUTHORIZED
```

Start with [`STATUS.md`](STATUS.md) for the current milestone handoff and [`specification/README.md`](specification/README.md) for the technical authority chain.

## Stack

- React 18 + Create React App
- TypeScript
- Redux Toolkit / React Redux
- Material UI
- Data-driven content and versioned persistence
- Jest / React Testing Library
- Playwright-based UI-only synthetic product-review tooling

## Local setup

Requires Node.js 20 for parity with repository CI.

```bash
npm ci
npm start
```

The development app is served at `http://localhost:3000` by default.

## Core validation

### Type check

```bash
npx tsc --noEmit
```

### Production build

```bash
npm run build
```

### Full Jest suite

```bash
CI=true npm test -- --watchAll=false --runInBand
```

The authoritative pull-request gate is `.github/workflows/build-validation.yml`. When qualifying a candidate for merge, prefer the exact workflow commands rather than assuming one local command reproduces every CI step.

## GameLoop and progression qualification

### Deterministic live scheduler

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
```

Covers fixed-step cadence, irregular RAF accumulation, fractional accumulator continuity, same-frame catch-up, serialized async `onTick`, rejected-handler recovery, pause/resume wall-clock rejection, game-speed changes, and tick-rate changes.

### Cross-progression determinism

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
```

Covers representative Essence, Copy, Player, and timed-Quest progression under equivalent logical time across regular/irregular/catch-up delivery, 10 Hz vs 20 Hz schedules, and pause/resume boundaries.

Player vitality is elapsed-logical-time based rather than tick-count based. Timed Quest progression now also asserts the public seconds contract.

### Timed Quest unit / save-compatibility qualification

```bash
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
```

This focused suite is the regression authority for the repaired unit boundary. It verifies:

- 100 ms -> 0.1 elapsed Quest seconds;
- 250 ms -> 0.25 elapsed Quest seconds;
- non-finite, zero, and negative GameLoop deltas are no-ops;
- reducer/display semantics remain seconds-based;
- one logical GameLoop second advances timed Quest state by one second;
- seeded timeout crossing emits exactly one failure notification;
- current schema-v1 saves preserve stored Quest timer values exactly;
- resumed future live increments are normalized without retroactive timer conversion;
- legacy v0 wrapping migration does not guess-convert Quest timers.

The production boundary is intentionally narrow:

```text
GameLoop deltaTimeMs
-> processQuestTimersThunk
-> positive finite validation
-> deltaSeconds = deltaTimeMs / 1000
-> Quest elapsedSeconds / timeLimitSeconds
```

Do **not** introduce a save migration that divides existing schema-v1 timer values by 1000 unless a new provenance/migration contract is explicitly designed.

### Quest timing integration qualification

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
```

This hermetic integration suite composes the real production seams and verifies:

- equivalent one-second timed-Quest progression under regular 10 Hz, irregular 10 Hz, one-frame 10 Hz catch-up, and regular 20 Hz delivery;
- catch-up timeout failure occurs once, removes the Quest from active timer processing, and later queued ticks do not duplicate failure or advance the failed timer;
- paused wall-clock time contributes zero Quest time;
- canonical save/load preserves stored Quest timing;
- M21 offline settlement leaves timed Quest state frozen;
- resumed live fixed steps alone advance the restored Quest timer and can trigger failure.

Timed-Quest timeout comparison is intentionally **comparison-only tolerant** of machine-scale floating-point residue. Raw `elapsedSeconds` remains unrounded and may be infinitesimally below an authored limit on the nominal timeout step. The shared comparison helper treats only a small magnitude-relative `Number.EPSILON` tolerance as equality; it does not clamp, quantize, rewrite saves, or create a gameplay-scale grace/penalty window.

### Timed Quest precision semantics resolution

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
```

This suite qualifies the bounded precision repair. It verifies that:

- supported 10 Hz and 20 Hz schedules agree on the `1.0` second timeout boundary;
- regular, irregular, and same-frame catch-up layouts agree;
- machine-noise undershoot is accepted but materially early values are rejected;
- exact and accumulated save histories resolve on the same next nominal fixed step;
- raw accumulated and persisted timer values are not rounded or rewritten;
- invalid/non-positive deltas remain no-ops;
- failure notification remains exact-once and failed timers remain frozen.

### Live / persistence / offline boundary

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
```

This seam qualification exercises:

```text
useGameLoop
-> ordinary online progression
-> createSave
-> CurrentSaveEnvelope.timestamp
-> loadSavedGameWithMigration
-> replaceState
-> settleOfflineProgressThunk
-> resumed useGameLoop
```

It verifies canonical save timestamp persistence/restore, bounded M21 settlement, duplicate-settlement rejection, paused/stopped save rejection, exact-once offline Copy completion rewards, and ordinary fixed-step resume without giant-delta replay.

### M21 bounded offline settlement

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

The live GameLoop is **not** the authority for replaying arbitrary wall-clock absence. M21 remains a separate explicit two-consumer offline allowlist:

1. passive Essence;
2. already-running M20 Copy production tasks.

Timed Quests remain online-only during offline settlement.

## Timed Quest technical authority chain

- [`specification/Technical/TimedQuestUnitAndSaveCompatibilityPreflight.md`](specification/Technical/TimedQuestUnitAndSaveCompatibilityPreflight.md)
- [`specification/Technical/GameLoopTimedQuestSecondsNormalizationRepair.md`](specification/Technical/GameLoopTimedQuestSecondsNormalizationRepair.md)
- [`specification/Technical/GameLoopQuestTimingIntegrationQualification.md`](specification/Technical/GameLoopQuestTimingIntegrationQualification.md)
- [`specification/Technical/GameLoopTimedQuestPrecisionResolution.md`](specification/Technical/GameLoopTimedQuestPrecisionResolution.md)
- [`src/features/Quest/state/QuestThunks.ts`](src/features/Quest/state/QuestThunks.ts)
- [`src/features/Quest/state/QuestTimerPrecision.ts`](src/features/Quest/state/QuestTimerPrecision.ts)
- [`src/features/Quest/QuestTimerUnitCompatibilityPreflight.test.ts`](src/features/Quest/QuestTimerUnitCompatibilityPreflight.test.ts)
- [`src/features/GameLoop/GameLoopProgressionDeterminism.test.tsx`](src/features/GameLoop/GameLoopProgressionDeterminism.test.tsx)
- [`src/features/GameLoop/GameLoopQuestTimingIntegrationQualification.test.tsx`](src/features/GameLoop/GameLoopQuestTimingIntegrationQualification.test.tsx)
- [`src/features/GameLoop/GameLoopTimedQuestPrecisionResolution.test.tsx`](src/features/GameLoop/GameLoopTimedQuestPrecisionResolution.test.tsx)
- [`.github/workflows/build-validation.yml`](.github/workflows/build-validation.yml)

## Post-M25 synthetic-review tooling

The synthetic-review tooling collects **Level-2 synthetic product-risk evidence**. It does not prove human comprehension, enjoyment, pacing, retention, or product-market fit.

### Validate protocol and configuration

```bash
npm run simulated-review:validate
```

### Run negative/rejection action-binding qualification

```bash
npm run simulated-review:action-contract
```

### Install Playwright Chromium

```bash
npx playwright install --with-deps chromium
```

### Run the live UI-only smoke

The smoke expects the real application at `http://127.0.0.1:3000`.

Terminal 1:

```bash
HOST=127.0.0.1 PORT=3000 BROWSER=none npm start
```

Terminal 2:

```bash
npm run simulated-review:smoke
```

The lower-level observer entrypoint is also available:

```bash
npm run simulated-review:observe -- --help
```

Do not use repository state, Redux inspection, local-storage inspection, debug injection, or content files as a player oracle when running evidence collection. Follow the frozen campaign/runbook documents under `specification/Technical/SimulatedProductReviewRuns/`.

## Milestone qualification commands

These are the focused regression entrypoints currently used by Build Validation.

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand M25CompleteChapterVerticalSlice.test.tsx
CI=true npm test -- --watchAll=false --runInBand M24ObjectiveWorldState.test.tsx
CI=true npm test -- --watchAll=false --runInBand M23FactionReputation.test.tsx
CI=true npm test -- --watchAll=false --runInBand M22SocialKnowledgePropagation.test.tsx
CI=true npm test -- --watchAll=false --runInBand CheckpointCIncrementalIntegrationRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
CI=true npm test -- --watchAll=false --runInBand CopyM20ProductionTaskAutomation.test.tsx
```

## CI-parity validation sequence

For a candidate touching GameLoop scheduling, progression timing, timed Quests, persistence/offline boundaries, or the post-M25 review apparatus, run at least:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx playwright install --with-deps chromium
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand M25CompleteChapterVerticalSlice.test.tsx
CI=true npm test -- --watchAll=false --runInBand M24ObjectiveWorldState.test.tsx
CI=true npm test -- --watchAll=false --runInBand M23FactionReputation.test.tsx
CI=true npm test -- --watchAll=false --runInBand M22SocialKnowledgePropagation.test.tsx
CI=true npm test -- --watchAll=false --runInBand CheckpointCIncrementalIntegrationRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
CI=true npm test -- --watchAll=false --runInBand CopyM20ProductionTaskAutomation.test.tsx
npm run build
```

The workflow also runs the localhost UI smoke, active-loop qualification, modified historical qualification, and accumulated M4-M19 baseline. Consult `.github/workflows/build-validation.yml` for the exact current list.

## Product / evidence runbook

The post-M25 product-authority order remains:

```text
M25 technical composition PASS
-> fresh-player evidence
-> finding classification / adjudication
-> explicit Product Direction Decision
-> new bounded roadmap
-> M26+ only if authorized
```

Scheduler, progression, and timed-Quest correctness do not replace this chain. Do **not** infer pacing quality, balance quality, comprehension, fun, retention, or M26 authorization from deterministic execution.

The original three-package timed-Quest unit-normalization queue is complete. The later timeout-precision question is now resolved by a bounded comparison-only contract; it does not authorize broader timer or product changes.

One repository-local question may still be worth future bounded preflight **only if reconciliation confirms it is the active bottleneck**:

- whether timed-Quest authoring eventually requires explicit persisted timer-unit provenance or a future schema contract.

Human pacing, fairness, comprehension, enjoyment, retention, and Product Direction remain separate authority gates.

## External review diagnostic

The separate Gemini AI Code Review workflow currently fails before producing review output because its configured Gemini API key is invalid. This is an `EXTERNAL_AUTHORITY` maintenance issue. Repository Build Validation remains the authoritative hermetic correctness gate for the gameplay/timing packages.

Do not inject production credentials or mix Gemini credential repair into gameplay/timing packages.

## Standard npm scripts

```bash
npm start
npm test
npm run build
```

`npm run eject` is inherited from Create React App and is not part of the normal repository workflow.
