# React Incremental RPG Prototype

A React/TypeScript incremental RPG prototype combining active relational/strategic play with earned delegation and bounded offline progression.

## Current authority

The automated implementation program through **M25 — Complete Chapter Vertical Slice** remains complete and qualified. The post-scheduler progression-timing milestone is also complete: cross-progression determinism was characterized, Player vitality was normalized to elapsed logical time, and the canonical live/save/offline/resume seam now has permanent hermetic qualification.

```text
M25 Complete Chapter Vertical Slice: PASS
GameLoop Timing Characterization: COMPLETE
Deterministic Live Tick Scheduler Repair: COMPLETE
Cross-Progression Tick Determinism Characterization: COMPLETE
Delta-Time-Normalized Vital Regeneration Repair: COMPLETE
Live/Persistence/Offline Progression Boundary Qualification: COMPLETE
Timed Quest seconds-vs-milliseconds discrepancy: KNOWN / UNREPAIRED
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

Covers:

- default 10 Hz fixed-step behavior;
- irregular and approximately 60 Hz RAF accumulation;
- fractional accumulator remainder continuity;
- monotonic same-frame catch-up tick identities;
- serialized Promise-returning `onTick` handling;
- rejected async-handler recovery;
- pause/resume wall-clock rejection;
- game-speed and tick-rate changes.

### Cross-progression determinism and vitality repair

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
```

Covers representative Essence, Copy, Player, and timed-Quest progression under equivalent logical time across:

- regular 10 Hz delivery;
- irregular RAF chunking;
- same-frame catch-up;
- 10 Hz vs 20 Hz schedules; and
- pause/resume boundaries.

The suite also qualifies Player vitality regeneration as elapsed-time based rather than tick-count based. With the package seed, one logical second converges on the same health/mana recovery at 10 Hz and 20 Hz.

The timed-Quest path intentionally retains a known characterization: Quest fields are seconds-named, while `processQuestTimersThunk` currently consumes millisecond `TickData.deltaTime` directly. That mismatch remains unrepaired and must not be silently normalized without a separately scoped change.

### Live / persistence / offline boundary

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
```

This hermetic seam test exercises production authorities across:

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

It verifies:

- canonical save timestamp persistence and restore;
- bounded M21 offline settlement;
- offline advancement limited to passive Essence plus already-running M20 Copy production tasks;
- online-only GameLoop time, Copy maturity/loyalty, Player vitals, and timed Quest state remain frozen during absence;
- duplicate settlement rejects without duplicate progress;
- paused and stopped saved states reject offline settlement;
- offline Copy completion rewards exactly once; and
- resumed live scheduling emits an ordinary fixed step rather than replaying the wall-clock absence as a giant delta.

### M21 bounded offline settlement

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

The live GameLoop is **not** the authority for replaying arbitrary wall-clock absence. M21 remains a separate, explicit two-consumer offline allowlist. Do not qualify offline progress by feeding a giant absence delta through ordinary live ticks.

Key GameLoop/progression references:

- [`specification/Technical/GameLoopTimingCharacterization.md`](specification/Technical/GameLoopTimingCharacterization.md)
- [`specification/Technical/GameLoopDeterministicLiveSchedulerRepair.md`](specification/Technical/GameLoopDeterministicLiveSchedulerRepair.md)
- [`specification/Technical/GameLoopProgressionDeterminismCharacterization.md`](specification/Technical/GameLoopProgressionDeterminismCharacterization.md)
- [`specification/Technical/GameLoopDeltaTimeVitalRegenerationRepair.md`](specification/Technical/GameLoopDeltaTimeVitalRegenerationRepair.md)
- [`specification/Technical/GameLoopLiveOfflineProgressionBoundaryQualification.md`](specification/Technical/GameLoopLiveOfflineProgressionBoundaryQualification.md)
- [`src/features/GameLoop/hooks/useGameLoop.ts`](src/features/GameLoop/hooks/useGameLoop.ts)
- [`src/features/GameLoop/GameLoopProgressionDeterminism.test.tsx`](src/features/GameLoop/GameLoopProgressionDeterminism.test.tsx)
- [`src/features/GameLoop/GameLoopLiveOfflineBoundary.test.tsx`](src/features/GameLoop/GameLoopLiveOfflineBoundary.test.tsx)
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

These are focused regression entrypoints used by Build Validation.

### GameLoop — Deterministic live scheduler

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
```

### GameLoop — Cross-progression determinism / vitality

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
```

### GameLoop — Live/save/offline/resume boundary

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
```

### M25 — Complete Chapter Vertical Slice

```bash
CI=true npm test -- --watchAll=false --runInBand M25CompleteChapterVerticalSlice.test.tsx
```

### M24 — Objective World State

```bash
CI=true npm test -- --watchAll=false --runInBand M24ObjectiveWorldState.test.tsx
```

### M23 — Faction Reputation

```bash
CI=true npm test -- --watchAll=false --runInBand M23FactionReputation.test.tsx
```

### M22 — Social Knowledge Propagation

```bash
CI=true npm test -- --watchAll=false --runInBand M22SocialKnowledgePropagation.test.tsx
```

### Checkpoint C — Incremental Integration Repair

```bash
CI=true npm test -- --watchAll=false --runInBand CheckpointCIncrementalIntegrationRepair.test.tsx
```

### M21 — Bounded Offline Progress

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

### M20 — Copy Production Automation

```bash
CI=true npm test -- --watchAll=false --runInBand CopyM20ProductionTaskAutomation.test.tsx
```

## CI-parity validation sequence

For a candidate touching GameLoop scheduling, progression timing, persistence/offline boundaries, or the post-M25 review apparatus, run at least:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx playwright install --with-deps chromium
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
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

The workflow also runs active-loop and historical regression suites; consult `.github/workflows/build-validation.yml` for the complete exact list.

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

Scheduler and progression correctness do not replace this chain. Do **not** infer pacing quality, balance quality, comprehension, fun, retention, or M26 authorization from deterministic execution.

The previous three-package progression-timing queue is complete. Before creating a new queue, reconcile the latest `main` and current authority. The known timed-Quest seconds-vs-milliseconds mismatch is the leading bounded repository-local candidate for investigation, but it is **not implicitly authorized** by this completed milestone.

If that repair is later authorized, preserve the existing authored Quest time limits and keep M21 offline authority separate; add regression coverage for equivalent logical time, pause/resume, persistence, and live/offline rejection rather than broadening offline simulation.

Key references:

- [`STATUS.md`](STATUS.md) — current engineering/session handoff
- [`specification/README.md`](specification/README.md) — specification and milestone authority chain
- [`specification/Technical/PostM25ProductDirection.md`](specification/Technical/PostM25ProductDirection.md) — product boundary and next evidence gate
- [`specification/Technical/SimulatedIntegratedProductReview.md`](specification/Technical/SimulatedIntegratedProductReview.md) — base synthetic-review protocol
- [`specification/Technical/SimulatedIntegratedProductReviewV2Amendment.md`](specification/Technical/SimulatedIntegratedProductReviewV2Amendment.md) — V2 action/evidence amendment
- [`.github/workflows/build-validation.yml`](.github/workflows/build-validation.yml) — exact merge qualification stack

## Standard npm scripts

```bash
npm start
npm test
npm run build
```

`npm run eject` is inherited from Create React App and is not part of the normal repository workflow.
