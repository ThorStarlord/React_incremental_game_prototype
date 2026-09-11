# React Incremental RPG Prototype

A React/TypeScript incremental RPG prototype combining active relational/strategic play with earned delegation and bounded offline progression.

## Current authority

The automated implementation program through **M25 — Complete Chapter Vertical Slice** remains complete and qualified on `main`. The merged timed-Quest milestone normalized the GameLoop milliseconds -> Quest seconds boundary and qualified scheduler, persistence, pause/resume, timeout, notification, and M21 offline-settlement seams.

A later three-package **post-M25 timing-hardening milestone** is complete at the repository/hermetic level but is **not yet merged to `main`**. All three final package candidates passed repository Build Validation on their exact heads, while the separate Gemini review workflow failed before review with `API_KEY_INVALID`. See [`STATUS.md`](STATUS.md) before assuming branch-only behavior is current-main authority.

```text
M25 Complete Chapter Vertical Slice: PASS
Merged timed-Quest seconds normalization: COMPLETE
Package 1 — Unified Timing-Hardening Integration Candidate: REPOSITORY-QUALIFIED / NOT MERGED (PR #88)
Package 2 — Async Catch-Up Backlog Safety Preflight: REPOSITORY-QUALIFIED / NOT MERGED (PR #89)
Package 3 — Sub-Step Restart & Save/Resume Remainder Preflight: REPOSITORY-QUALIFIED / NOT MERGED (PR #90)
Human Integrated Playability / Product Review: DEFERRED / UNPROVEN
Product Direction Decision: PENDING
M26: NOT AUTHORIZED
```

Start with [`STATUS.md`](STATUS.md) for the milestone handoff and [`specification/README.md`](specification/README.md) for the merged technical authority chain.

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

The authoritative pull-request gate is `.github/workflows/build-validation.yml`. Always use the version on the exact candidate head being qualified.

## Current-main GameLoop / progression qualification

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

### Timed Quest unit / save compatibility

```bash
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
```

Current merged production boundary:

```text
GameLoop deltaTimeMs
-> processQuestTimersThunk
-> positive finite validation
-> deltaSeconds = deltaTimeMs / 1000
-> Quest elapsedSeconds / timeLimitSeconds
```

Current schema-v1 stored Quest timer values are preserved exactly. Do not guess-convert persisted values without a new provenance/migration contract.

### Quest timing integration

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
```

Exercises real GameLoop -> Quest timing, catch-up, pause/resume, canonical save/load, failure notification, and M21 offline separation.

### Live / persistence / offline boundary

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
```

Canonical seam:

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

### M21 bounded offline settlement

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

M21 remains an explicit offline allowlist for:

1. passive Essence;
2. already-running M20 Copy production tasks.

Timed Quests remain online-only during offline settlement.

## Post-M25 timing-hardening milestone runbook

The following packages are **complete but unmerged**. The commands below are re-entry aids for their package branches. They do not make branch-only behavior current-main authority.

### Package 1 — PR #88: unified timing-hardening integration

Branch:

```text
work/unified-timing-hardening-integration
```

Exact candidate evidence:

```text
head: b5387622e2abac222ccd1249dde6094aa1efeada
Build Validation #292: PASS
Gemini AI Code Review #322: FAIL / API_KEY_INVALID
```

Focused commands:

```bash
git fetch origin
git switch work/unified-timing-hardening-integration
npm ci
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLargeFrameBackgroundStallPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopMidSessionCadenceTransitionQualification.test.tsx
npm run build
```

Package 1 composes the previously independent precision/drift, large-frame/background-stall, and cadence-transition work into one candidate. If PR #88 is the chosen integration candidate, do not independently merge superseded PRs #85/#86/#87 as another stack.

Important boundaries:

- comparison-time timed-Quest precision is repaired without rewriting persisted timer values;
- current large-frame catch-up behavior is characterized, not replaced by a new background policy;
- current cadence-transition accumulator behavior is qualified, not replaced by a new cadence policy;
- no save migration, M21 widening, product pacing claim, Product Direction change, or M26 authorization is implied.

### Package 2 — PR #89: async catch-up backlog safety preflight

Branch:

```text
work/async-catch-up-backlog-safety-preflight
```

Exact candidate evidence:

```text
head: 06e4f5930dfafd27f9a509b135af5cfa911da7c1
Build Validation #293: PASS
Gemini AI Code Review #323: FAIL / API_KEY_INVALID
preflight: BACKLOG_RISK_CONFIRMED / NO_PRODUCTION_REPAIR_AUTHORIZED
```

Focused command:

```bash
git fetch origin
git switch work/async-catch-up-backlog-safety-preflight
npm ci
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncCatchUpBacklogSafetyPreflight.test.tsx
npm run build
```

The preflight proves serialized/FIFO callback delivery and rejection recovery while confirming that scheduler production can advance ahead of an unresolved async consumer. It does **not** authorize a queue cap, backpressure, coalescing, tick dropping, or concurrent callback policy.

### Package 3 — PR #90: sub-step restart/save-resume remainder preflight

Branch:

```text
work/sub-step-restart-save-resume-preflight
```

Exact candidate evidence:

```text
head: 98fc6e82d2cee4108d52693385690de35d52910b
Build Validation #294: PASS
Gemini AI Code Review #324: FAIL / API_KEY_INVALID
preflight: DETERMINISTIC_REMAINDER_DISCONTINUITY_CONFIRMED / POLICY_REQUIRED / NO_PRODUCTION_REPAIR_AUTHORIZED
```

Focused command:

```bash
git fetch origin
git switch work/sub-step-restart-save-resume-preflight
npm ci
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx
npm run build
```

The preflight qualifies current lifecycle behavior:

- pause/resume preserves hook-local sub-step remainder while rejecting paused wall time;
- stop/start and unmount/remount start with zero hook-local remainder;
- canonical save/load persists Redux progression but not accumulator remainder;
- repeated reset boundaries can accumulate discarded sub-step logical time.

It does **not** authorize a new persisted remainder field, save-schema change, migration, lifecycle replay, or scheduler-policy repair.

## Integration rule for the completed milestone

Package 2 and Package 3 were qualified from the same synchronized pre-integration `main`, not stacked on Package 1. Their independent green runs therefore do not prove one final combined tree.

When the all-CI merge gate is resolvable, use this sequence:

```text
PR #88
-> latest main
-> replay/requalify Package 2 (#89 work) on new main
-> full exact-head CI
-> latest main
-> replay/requalify Package 3 (#90 work) on new main
-> full exact-head CI
```

Do not mark branch-only results as integrated until the resulting current-main commits and exact-head CI evidence exist.

## Post-M25 synthetic-review tooling

The synthetic-review tooling collects Level-2 synthetic product-risk evidence. It does not prove human comprehension, enjoyment, pacing, retention, or product-market fit.

### Validate protocol/configuration

```bash
npm run simulated-review:validate
```

### Negative/rejection action-binding qualification

```bash
npm run simulated-review:action-contract
```

### Install Playwright Chromium

```bash
npx playwright install --with-deps chromium
```

### Live UI-only smoke

Terminal 1:

```bash
HOST=127.0.0.1 PORT=3000 BROWSER=none npm start
```

Terminal 2:

```bash
npm run simulated-review:smoke
```

Lower-level observer help:

```bash
npm run simulated-review:observe -- --help
```

Do not use Redux state, local-storage inspection, repository content, or debug injection as a player oracle when collecting product-review evidence.

## Current-main milestone qualification commands

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand M25CompleteChapterVerticalSlice.test.tsx
CI=true npm test -- --watchAll=false --runInBand M24ObjectiveWorldState.test.tsx
CI=true npm test -- --watchAll=false --runInBand M23FactionReputation.test.tsx
CI=true npm test -- --watchAll=false --runInBand M22SocialKnowledgePropagation.test.tsx
CI=true npm test -- --watchAll=false --runInBand CheckpointCIncrementalIntegrationRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
CI=true npm test -- --watchAll=false --runInBand CopyM20ProductionTaskAutomation.test.tsx
```

## CI-parity sequence

For timing/progression/persistence candidates, run at least:

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

Then run any package-specific focused suites listed above. The exact candidate's `.github/workflows/build-validation.yml` remains authoritative and also includes localhost UI smoke, active-loop qualification, modified historical qualification, and the accumulated M4-M19 baseline.

## Product / evidence runbook

The product-authority order remains:

```text
M25 technical composition PASS
-> fresh-player / human evidence
-> finding classification and adjudication
-> explicit Product Direction Decision
-> new bounded roadmap
-> M26+ only if authorized
```

Timing precision, deterministic scheduler behavior, backlog characterization, and lifecycle remainder characterization do not replace this chain.

Future production-policy candidates should be explicit rather than incidental:

- async backlog: backpressure, bounded queue/overflow, proven-safe coalescing, or separation of deterministic tick work from slow async effects;
- lifecycle remainder: accept fresh-loop reset semantics or define a logical-clock/remainder persistence contract;
- background/large-frame behavior: replay, cap, discard, visibility pause, or handoff to another authority.

None of those policy choices is currently authorized by the completed preflights.

## External review diagnostic

The separate Gemini AI Code Review workflow currently fails before producing review output because its configured Gemini API key is invalid (`API_KEY_INVALID`). This is an `EXTERNAL_AUTHORITY` maintenance issue.

Do not expose or inject production credentials from gameplay/timing work. If repository policy continues to require all CI to pass, resolve the credential/review gate separately before merging blocked package branches.

## Repository hygiene note

Old/no-op refs such as `noop-unused` and `work/unified-timing-hardening-integration-2` through `-7` may still be visible. They contain none of the Package 1 implementation and should not be treated as package candidates.

## Standard npm scripts

```bash
npm start
npm test
npm run build
```

`npm run eject` is inherited from Create React App and is not part of the normal repository workflow.
