# Repository Runbook

**Current product baseline:** M25 complete chapter + integrated post-M25 timing hardening  
**Last integrated milestone handoff before this documentation-authority package:** `56fbee2758ba734f1db67f40230a0970d67fd531`  
**Canonical timing integration:** PR #97 / Build Validation #305 PASS  
**Canonical prior handoff:** PR #99 / Build Validation #306 PASS

This file owns **operational procedure**. Read [`STATUS.md`](STATUS.md) for current repository state and [`docs/CURRENT.md`](docs/CURRENT.md) before interpreting older documentation.

## Required re-entry order

For every new engineering/coding-agent session:

```text
latest main
-> STATUS.md
-> docs/CURRENT.md
-> RUNBOOK.md
-> specification/README.md
-> affected current contract/result documents
-> fresh bottleneck reconciliation
```

Do not start by searching old milestone files and assuming the first detailed document found is current authority.

## Environment

Repository CI uses Node.js 20 for the project runtime.

```bash
npm ci
npx tsc --noEmit
npm run build
```

## Current-main verification

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

Always compare the result with the most recent `STATUS.md`/PR evidence. If `main` moved, the newer tree is the integration base; old exact-head CI results remain historical evidence and do not automatically prove compatibility with later changes.

## Documentation authority qualification

Run whenever documentation authority, handoff state, CI governance, or top-level documentation entrypoints change:

```bash
npm run docs:authority:validate
```

The validator checks that:

- `docs/CURRENT.md` exists and contains the four authority classifications;
- `README.md`, `STATUS.md`, and `RUNBOOK.md` point to the canonical authority index;
- key current and explicitly superseded technical documents are represented in the index;
- the npm validation entrypoint remains configured;
- Build Validation runs the authority validator;
- retired `.github/workflows/gemini-review.yml` and `gemini.md` are not silently restored.

This is a structural consistency check. It does not replace semantic review of a newly created technical or product authority document.

## CI authority

The authoritative PR correctness workflow is:

```text
.github/workflows/build-validation.yml
```

Current merge rule:

```text
Build Validation
+ preregistered package / milestone acceptance criteria
+ any explicitly declared authoritative human/external gate for that change
```

Optional AI review is advisory unless a future explicit policy deliberately changes that rule.

The former Gemini review workflow and standalone `gemini.md` were retired in PR #97. `GEMINI_API_KEY` is not consumed by repository CI.

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

## Focused GameLoop timing qualification

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

These characterize large-frame/background-stall behavior and cadence transitions. They do **not** authorize a max-frame budget, Page Visibility policy, wider offline authority, or new cadence defaults.

### Backpressure x cadence x progression stress

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

## Timed-Quest qualification

```bash
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
```

Timed-Quest precision remains comparison-only. Do not round, clamp, quantize, or rewrite raw/persisted timer values as an incidental repair.

## Live/offline authority

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

M21 remains a separate bounded offline authority. Timed Quests do not progress during offline settlement.

## Focused cumulative sequence

For changes near GameLoop scheduling, cadence, progression, Quest timing, persistence, or offline seams:

```bash
npm ci
npm run docs:authority:validate
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

The exact Build Validation workflow additionally runs synthetic UI smoke, M20-M25 milestone checks, active-loop qualification, modified historical checks, accumulated M4-M19 baseline, and production build. Use `.github/workflows/build-validation.yml` as executable truth.

## Documentation change procedure

When a package creates, supersedes, or materially reinterprets authority:

```text
1. Update/create the domain-specific contract or result.
2. Update docs/CURRENT.md classification in the same package.
3. Update STATUS.md if current repository state or an evidence/authority gate changed.
4. Update RUNBOOK.md if commands, CI, or operating procedure changed.
5. Update README.md only when repository orientation or entry links changed.
6. Preserve old evidence; prefer classification over destructive relocation.
7. Run npm run docs:authority:validate.
8. Open PR and require exact-head Build Validation.
9. If main moves, reconcile and rerun exact-head Build Validation.
10. Merge only after current-base qualification succeeds.
```

Do not create a second handoff PR before the implementation it describes has reached `main` unless the documentation change itself is the bounded implementation package.

## Historical evidence

The post-M25 timing-hardening lineage remains available as historical evidence:

| Stage | PR / head | Build Validation | Disposition |
| --- | --- | --- | --- |
| Package 1 | #95 / `b1110127...` | #300 PASS | closed, superseded cumulative predecessor |
| Package 2 | #96 / `ed1762fa...` | #301 PASS | closed, superseded cumulative predecessor |
| Package 3 original stress | #97 / `87cc91a3...` | #302 PASS | historical candidate lineage |
| Gemini-retirement candidate | #97 / `365e2509...` | #304 PASS | superseded by fresh-main reconciliation |
| Final reconciled candidate | #97 / `4c503cca...` | #305 PASS | merged |
| Integration | `88c1b511...` | candidate #305 PASS | integrated timing authority |
| Candidate handoff | #98 / `64ff96f...` | #303 PASS | closed, superseded |
| Integrated handoff | #99 / `fd5c5dc1...` | #306 PASS | merged as `56fbee27...` |

Use [`docs/CURRENT.md`](docs/CURRENT.md) to distinguish historical evidence from current authority before relying on older technical files.

## Product evidence boundary

Repository and hermetic validation may establish deterministic behavior, composition, rejection paths, persistence behavior, and bounded synthetic risk evidence.

They do not by themselves establish:

- fresh-player comprehension;
- perceived responsiveness;
- pacing/fairness;
- enjoyment;
- retention;
- final balance;
- generalized campaign scalability;
- Product Direction;
- M26 authorization.

Do not weaken these claims merely because human validation is temporarily unavailable.

## Do-not-cross boundaries

- Do not bypass `docs/CURRENT.md` when interpreting old documentation.
- Do not reintroduce the retired Gemini workflow as an implicit merge gate.
- Do not use the legacy `ArchitectureOverview.md` manual-only testing statement as current CI authority.
- Do not widen M21 offline authority without an explicit product/design decision.
- Do not make timed Quests advance during offline settlement implicitly.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not introduce drop/skip/coalescing as incidental backpressure optimization.
- Do not add a max-frame catch-up budget or Page Visibility handoff policy under test-cleanup scope.
- Do not change default cadence/game speed as part of timing qualification.
- Do not rewrite stored Quest timer values to solve floating-point comparison noise.
- Do not infer pacing, fairness, comprehension, enjoyment, retention, Product Direction, or M26 authority from deterministic execution.
