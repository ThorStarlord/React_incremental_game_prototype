# Repository Runbook — Post-M25 GameLoop Timing Hardening

**Milestone:** post-M25 timing hardening  
**Integrated main recorded by this runbook:** `88c1b5114995cd6702936f414823b783de97bb23`  
**Canonical integration:** PR #97  
**Final reconciled candidate:** `4c503ccaa63147c53a733ac6aad65262adcbb026`  
**Build Validation:** #305 — `PASS`

Read `STATUS.md` first. It is the authority for milestone state, product/human evidence ceilings, and next-session priorities.

## CI authority

The repository has one active PR correctness workflow:

```text
.github/workflows/build-validation.yml
```

The former `.github/workflows/gemini-review.yml` and `gemini.md` were retired in PR #97. `GEMINI_API_KEY` is no longer consumed by repository CI.

Current merge rule:

```text
Build Validation
+ preregistered package / milestone acceptance criteria
+ any explicitly declared authoritative human/external gate for that change
```

Optional AI review is advisory unless a future explicit policy says otherwise.

## Environment

Repository CI uses Node.js 20.

```bash
npm ci
npx tsc --noEmit
npm run build
```

## Current-main verification

Before starting future work:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

This handoff recorded:

```text
88c1b5114995cd6702936f414823b783de97bb23
```

If `main` has moved, treat the newer SHA as authority after reconciliation. Do not assume old exact-head evidence proves compatibility with later changes.

## Focused timing qualification

### Scheduler characterization

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
```

### Async backpressure policy and repair

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopBoundedBacklogControlRepair.test.tsx
```

Expected authority:

```text
SERIAL_BACKPRESSURE_V1
logical milliseconds remain in the accumulator while async work is unresolved
-> at most one unresolved admitted tick
-> no queued TickData FIFO
-> no drop / skip / coalescing
-> no concurrent async consumers
-> fulfillment or rejection releases the slot
```

### Lifecycle remainder semantics

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
```

Expected authority:

| Boundary | Remainder | Wall-time replay |
| --- | --- | --- |
| continuous live execution | preserve | live only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

### Large-frame and cadence qualification

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLargeFrameBackgroundStallPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopMidSessionCadenceTransitionQualification.test.tsx
```

These tests characterize large-frame/background-stall behavior and cadence transitions. They do **not** authorize a max-frame budget, Page Visibility policy, or new offline semantics.

### Backpressure × cadence × progression stress

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopBackpressureCadenceProgressionStressQualification.test.tsx
```

The suite must preserve:

1. one-admission producer lead while a real progression consumer is blocked;
2. deferred-time re-evaluation against the currently authoritative fixed-step threshold;
3. contiguous tick identities and serial async concurrency;
4. elapsed-time-equivalent Essence, Copy, Player, and timed-Quest progression;
5. rejection liveness without retry or deadlock.

### Cross-progression and long-horizon drift

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
```

### Timed Quest qualification

```bash
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
```

Timed-Quest precision remains comparison-only. Do not round, clamp, quantize, or rewrite raw/persisted timer values as an incidental repair.

### Live/offline authority

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

M21 remains a separate bounded offline authority. Timed Quests do not progress during offline settlement.

## Synthetic-review / rejection checks

```bash
npm run simulated-review:validate
npm run simulated-review:action-contract
```

For the UI-only smoke:

```bash
npx playwright install --with-deps chromium
```

Terminal 1:

```bash
HOST=127.0.0.1 PORT=3000 BROWSER=none npm start
```

Terminal 2:

```bash
npm run simulated-review:smoke
```

Do not use Redux inspection, local-storage inspection, debug injection, repository state, or source content as a player oracle when collecting synthetic player-facing evidence.

## Focused cumulative sequence

For changes near GameLoop scheduling, cadence, progression, Quest timing, persistence, or offline seams:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopBoundedBacklogControlRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopLargeFrameBackgroundStallPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopMidSessionCadenceTransitionQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopBackpressureCadenceProgressionStressQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
npm run build
```

The exact Build Validation workflow additionally runs milestone and historical regression gates. Use `.github/workflows/build-validation.yml` as the authoritative current command set.

## Historical milestone evidence

| Stage | PR / head | Build Validation | Current state |
| --- | --- | --- | --- |
| Package 1 | #95 / `b1110127...` | #300 PASS | closed, superseded predecessor |
| Package 2 | #96 / `ed1762fa...` | #301 PASS | closed, superseded predecessor |
| Package 3 original stress | #97 / `87cc91a3...` | #302 PASS | cumulative lineage |
| Gemini-retirement candidate | #97 / `365e2509...` | #304 PASS | superseded by fresh-main reconciliation |
| Final reconciled candidate | #97 / `4c503cca...` | #305 PASS | merged |
| Integration | merge `88c1b511...` | exact candidate #305 PASS | current-main authority at handoff |
| Candidate handoff | #98 / `64ff96f...` | #303 PASS | closed, superseded |

Historical Gemini failures (#330–#333) explain the earlier blocked state but no longer constitute an active CI gate.

## Safe future integration procedure

```text
1. Pull latest main.
2. Read STATUS.md and this RUNBOOK.md.
3. Identify the bounded package and its explicit authority/evidence ceiling.
4. Branch from current main.
5. Run focused local/repository qualification.
6. Open a PR.
7. Require Build Validation on the exact candidate head.
8. If main moves before merge, reconcile/rebase/merge current main into the candidate and rerun Build Validation.
9. Merge only after current-base exact-head qualification succeeds.
10. Record actual integration evidence in STATUS.md when closing a milestone.
```

## Do-not-cross boundaries

- Do not reintroduce the retired Gemini workflow as an implicit merge gate.
- Do not widen M21 offline authority without an explicit product/design decision.
- Do not make timed Quests advance during offline settlement implicitly.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not introduce drop/skip/coalescing as incidental backpressure optimization.
- Do not add a max-frame catch-up budget or Page Visibility handoff policy under test-cleanup scope.
- Do not change default cadence/game speed as part of timing qualification.
- Do not rewrite stored Quest timer values to solve floating-point comparison noise.
- Do not infer pacing, fairness, comprehension, enjoyment, retention, Product Direction, or M26 authority from deterministic execution.
