# React Incremental RPG Prototype

A React/TypeScript incremental RPG prototype combining active relational/strategic play with earned delegation and bounded offline progression.

## Current authority

The automated implementation program through **M25 — Complete Chapter Vertical Slice** is complete and qualified. The live GameLoop has additionally completed the characterization and deterministic scheduler-repair packages documented in `STATUS.md`.

```text
M25 Complete Chapter Vertical Slice: PASS
GameLoop Timing Characterization: COMPLETE
Deterministic Live Tick Scheduler Repair: COMPLETE
Progression Determinism & Tick-Boundary Harness: PENDING / CARRIED FORWARD
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

The repository's authoritative pull-request gate is `.github/workflows/build-validation.yml`; when qualifying a candidate for merge, prefer the exact workflow commands rather than assuming a single local command reproduces every CI step.

## GameLoop determinism qualification

The live fixed-step scheduler is covered by a deterministic fake-`requestAnimationFrame` / controlled-clock suite:

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
```

The suite covers:

- default 10 Hz fixed-step behavior;
- approximately 60 Hz RAF chunking and irregular frame accumulation;
- preservation of fractional accumulator remainder across Redux rerenders;
- monotonic `TickData.currentTick` identities during same-frame catch-up;
- serialized Promise-returning `onTick` processing;
- recovery after rejected async tick handlers;
- pause/resume wall-clock rejection;
- game-speed changes; and
- tick-rate changes.

Key scheduler references:

- [`specification/Technical/GameLoopTimingCharacterization.md`](specification/Technical/GameLoopTimingCharacterization.md) — Package 1 diagnostic evidence and original failure characterization
- [`specification/Technical/GameLoopDeterministicLiveSchedulerRepair.md`](specification/Technical/GameLoopDeterministicLiveSchedulerRepair.md) — Package 2 repair contract
- [`src/features/GameLoop/hooks/useGameLoop.ts`](src/features/GameLoop/hooks/useGameLoop.ts) — live scheduler implementation
- [`src/features/GameLoop/hooks/useGameLoop.timing-characterization.test.tsx`](src/features/GameLoop/hooks/useGameLoop.timing-characterization.test.tsx) — deterministic regression suite

The live GameLoop is **not** the authority for replaying arbitrary wall-clock absence. M21 bounded offline settlement remains separate. Do not qualify offline progress by feeding a giant absence delta through the live tick loop.

## Post-M25 synthetic-review tooling

The synthetic-review tooling exists to collect **Level-2 synthetic product-risk evidence**. It does not prove human comprehension, enjoyment, pacing, retention, or product-market fit.

### Validate protocol and configuration

```bash
npm run simulated-review:validate
```

This validates the UI observer/action-contract source shape, participant-profile manifests, protocol/configuration bindings, and repository-side review invariants. It does not by itself validate a completed campaign or assign a product verdict.

### Run negative/rejection action-binding qualification

```bash
npm run simulated-review:action-contract
```

This exercises the V2 action-binding contract, including fail-closed rejection of stale or mismatched observation-bound action IDs.

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

These are the current focused regression entrypoints used by Build Validation.

### GameLoop — Deterministic live scheduler

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
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

For a candidate touching GameLoop scheduling, progression timing, or the post-M25 review apparatus, run at least:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx playwright install --with-deps chromium
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
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

Scheduler correctness does not replace this chain. Do **not** infer pacing quality, balance quality, comprehension, fun, retention, or M26 authorization from deterministic tick execution.

Do **not** add tutorials, mechanics, progression systems, balance changes, or generalized infrastructure merely because M25 or the scheduler repair passed. First classify observed failures as discoverability, state-legibility, causal-explanation, terminology, mechanical contradiction, content/dramatization, pacing, strategic-choice, or system-value problems, then repair the smallest justified layer.

The next pending repository-only scheduler/progression package is documented in `STATUS.md` as **Progression Determinism & Tick-Boundary Regression Harness**. It should validate existing authority across equivalent logical tick streams before any new progression design is proposed.

Key references:

- [`STATUS.md`](STATUS.md) — current engineering/session handoff
- [`specification/README.md`](specification/README.md) — specification and milestone authority chain
- [`specification/Technical/GameLoopTimingCharacterization.md`](specification/Technical/GameLoopTimingCharacterization.md) — GameLoop characterization contract
- [`specification/Technical/GameLoopDeterministicLiveSchedulerRepair.md`](specification/Technical/GameLoopDeterministicLiveSchedulerRepair.md) — deterministic scheduler repair contract
- [`specification/Technical/PostM25ProductDirection.md`](specification/Technical/PostM25ProductDirection.md) — current product boundary and next evidence gate
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
