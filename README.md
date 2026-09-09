# React Incremental RPG Prototype

A React/TypeScript incremental RPG prototype combining active relational/strategic play with earned delegation and bounded offline progression.

## Current authority

The automated implementation program through **M25 — Complete Chapter Vertical Slice** is complete and qualified. The current governing boundary is product evidence:

```text
M25 Complete Chapter Vertical Slice: PASS
Automated post-M17 implementation program: COMPLETE
Human Integrated Playability / Product Review: NEXT
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

## Post-M25 synthetic-review tooling

The synthetic-review tooling exists to collect **Level-2 synthetic product-risk evidence**. It does not prove human comprehension, enjoyment, pacing, retention, or product-market fit.

### Validate protocol and configuration

```bash
npm run simulated-review:validate
```

This validates the UI observer, action contract, configuration, campaign/protocol bindings, and repository-side review invariants.

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

For a candidate that changes the post-M25 review apparatus or evidence-facing behavior, run at least:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx playwright install --with-deps chromium
npx tsc --noEmit
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

The post-M25 authority order is:

```text
M25 technical composition PASS
-> fresh-player evidence
-> finding classification / adjudication
-> explicit Product Direction Decision
-> new bounded roadmap
-> M26+ only if authorized
```

Do **not** add tutorials, mechanics, progression systems, balance changes, or generalized infrastructure merely because M25 passed. First classify observed failures as discoverability, state-legibility, causal-explanation, terminology, mechanical contradiction, content/dramatization, pacing, strategic-choice, or system-value problems, then repair the smallest justified layer.

Key references:

- [`STATUS.md`](STATUS.md) — current engineering/session handoff
- [`specification/README.md`](specification/README.md) — specification and milestone authority chain
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
