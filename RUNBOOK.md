# Repository Runbook — Post-M25 GameLoop Timing Hardening

**Milestone:** Backpressure + lifecycle + timing-hardening composition + cross-seam stress qualification  
**Current `main` at handoff:** `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Canonical cumulative candidate:** PR #97 / `work/backpressure-cadence-progression-stress` / `87cc91a3410c4dc3e066e5c4c3e58559a180e821`  
**Status:** repository-qualified, not yet integrated into `main`

Read `STATUS.md` first. It is the authority for package state, current-main integration state, external blockers, human/product gates, and next-session priorities.

## Environment

Repository CI uses Node.js 20.

```bash
npm ci
npx tsc --noEmit
npm run build
```

The authoritative pull-request gate is the candidate's `.github/workflows/build-validation.yml`. Local commands below are useful qualification entrypoints, but the final merge decision must use the exact configured workflow set on the exact candidate head.

## Current-main baseline

Before touching the cumulative candidate, verify that the repository base still matches the handoff:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

Expected handoff base:

```text
96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71
```

If `main` has moved, do not treat PR #97's old exact-head evidence as proof of compatibility with the new base. Replay/rebase the cumulative candidate onto fresh `main` and rerun the complete validation stack.

Useful current-main baseline checks:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
npm run build
```

## Canonical cumulative candidate — PR #97

PR #97 carries the full Package 1 + Package 2 tree and adds Package 3 stress qualification. Prefer it over independently merging overlapping predecessor candidates.

```bash
git fetch origin
git switch work/backpressure-cadence-progression-stress
git rev-parse HEAD
```

Expected exact head:

```text
87cc91a3410c4dc3e066e5c4c3e58559a180e821
```

If the head differs, re-read `STATUS.md` and inspect current PR/CI state before using the commands below as authoritative evidence.

## Focused Package 1 qualification

Package 1 composes `SERIAL_BACKPRESSURE_V1` and `FRESH_LOOP_RESET_V1`.

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopBoundedBacklogControlRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
```

Expected contract:

```text
logical milliseconds remain in the accumulator while async work is unresolved
-> at most one admitted unresolved tick
-> no queued TickData FIFO
-> no drop / skip / coalescing
-> no concurrent async consumers
-> fulfillment or rejection releases the admission slot
```

Lifecycle remainder contract:

| Boundary | Remainder | Wall-time replay |
| --- | --- | --- |
| continuous live execution | preserve | live only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

## Focused Package 2 qualification

Package 2 composes Package 1 with precision, large-frame, cadence-transition, and long-horizon timing hardening.

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLargeFrameBackgroundStallPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopMidSessionCadenceTransitionQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
```

Important expectations:

- async large-frame work remains serial under backpressure rather than minting all tick identities ahead of an unresolved consumer;
- deferred logical milliseconds are evaluated against the currently authoritative cadence threshold;
- synchronous catch-up semantics remain deterministic;
- timed-Quest precision handling is comparison-only;
- raw and persisted `elapsedSeconds` values are not rounded, clamped, quantized, or rewritten;
- no Page Visibility or production background/offline policy is introduced by characterization tests.

## Focused Package 3 stress qualification

Package 3 is validation-only and changes no production mechanics.

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopBackpressureCadenceProgressionStressQualification.test.tsx
```

The suite must prove all three of these cases:

1. cadence changes repeatedly while the first real progression consumer remains blocked, with producer lead bounded to one and final elapsed-time progression matching the reference execution;
2. successive backlog windows re-evaluate deferred time under different fixed-step sizes without losing/coalescing time or creating non-contiguous tick identities;
3. an intentional async rejection releases the slot, does not retry the failed tick, logs once through the existing rejection path, drains retained work serially, and does not deadlock future live progression.

## Combined timing/progression qualification

Run this focused cumulative stack when changing or replaying the milestone candidate:

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

The exact Package 3 Build Validation #302 also ran and passed the remaining M20-M25, active-loop, modified-historical, accumulated M4-M19, localhost UI-smoke, and production-build gates. Use `.github/workflows/build-validation.yml` to reproduce the exact current workflow rather than assuming the focused list above is exhaustive.

## Optional full local Jest sweep

For a broad repository-local regression pass:

```bash
CI=true npm test -- --watchAll=false --runInBand
```

This is useful additional evidence but does not replace the explicit workflow gates.

## Synthetic-review / rejection checks

Protocol/configuration validation:

```bash
npm run simulated-review:validate
```

Negative/rejection action-binding qualification:

```bash
npm run simulated-review:action-contract
```

UI-only smoke requires Playwright Chromium and a local app server:

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

Do not use repository state, Redux inspection, local-storage inspection, debug injection, or source content as a player oracle when collecting synthetic review evidence.

## Exact package evidence

| Package | PR | Exact head | Build Validation | Gemini review | Merge state |
| --- | --- | --- | --- | --- | --- |
| Package 1 — Backpressure + lifecycle composition | #95 | `b11101273323b3ff242eaf4ccf5f24b4b104c642` | #300 PASS | #330 FAIL / `API_KEY_INVALID` | open / unmerged |
| Package 2 — Unified timing-hardening composition | #96 | `ed1762fabaa99a4bd266b303f9f188579dd7898f` | #301 PASS | #331 FAIL / `API_KEY_INVALID` | open / unmerged |
| Package 3 — Backpressure × cadence progression stress | #97 | `87cc91a3410c4dc3e066e5c4c3e58559a180e821` | #302 PASS | #332 FAIL / `API_KEY_INVALID` | open / unmerged |

## External merge blocker

The Gemini AI Code Review failure is not a GameLoop failure. The workflow reaches Gemini and receives an external API response indicating that the configured key is invalid.

Do not:

- place credentials into repository source;
- weaken the all-CI rule implicitly;
- label repository Build Validation success as full merge readiness while the configured Gemini workflow is failed.

A human/external authority must either repair/replace the credential or explicitly change the merge-policy rule.

## Preferred integration procedure

### If `main` is still the recorded base

```text
1. Resolve the Gemini credential/policy gate outside gameplay code.
2. Rerun every configured workflow on PR #97 exact head.
3. Require all configured workflows to succeed.
4. Merge PR #97.
5. Close PR #95 and PR #96 as superseded cumulative predecessors.
6. Pull fresh main and verify the merge commit.
7. Re-run the most important timing/progression smoke qualification if desired.
8. Refresh STATUS.md / RUNBOOK.md / README.md with integrated-main evidence.
```

### If `main` has moved

```text
1. Do not merge the stale cumulative candidate blindly.
2. Create a fresh branch from latest main.
3. Replay the PR #97 cumulative tree/semantics onto that branch.
4. Resolve only genuine mechanical conflicts; preserve selected contracts.
5. Run the complete exact-head Build Validation and every configured workflow.
6. Merge only after all configured workflows pass.
7. Record the new exact head and merge SHA in the handoff docs.
```

## Human/product evidence still required

Repository qualification does not establish:

- fresh-player comprehension or discoverability;
- perceived responsiveness;
- pacing quality;
- fairness/balance;
- enjoyment;
- retention;
- final Quest-duration/reward/economy tuning;
- production-device/background behavior beyond the hermetic qualification envelope;
- Product Direction;
- M26 authorization.

Do not weaken these claims merely because human evidence is temporarily unavailable.

## Do-not-cross boundaries

- Do not widen M21 offline authority without an explicit product/design decision.
- Do not make timed Quests advance during offline settlement implicitly.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not introduce drop/skip/coalescing as an incidental backpressure optimization.
- Do not add a max-frame catch-up budget or Page Visibility handoff policy under the guise of test cleanup.
- Do not change default cadence/game speed as part of timing qualification.
- Do not rewrite stored Quest timer values to solve floating-point comparison noise.
- Do not infer product quality from deterministic technical execution.
- Do not call the milestone integrated until a cumulative candidate is actually merged into current `main`.

## Fast re-entry

```text
Read STATUS.md.
Verify latest main.
Inspect PR #97 and exact-head CI.
Use PR #97 as the cumulative candidate only while its recorded base remains current.
Preserve SERIAL_BACKPRESSURE_V1.
Preserve FRESH_LOOP_RESET_V1.
Preserve comparison-only Quest precision semantics.
Preserve M21 as a separate bounded offline authority.
Resolve external CI authority separately from mechanics.
Reconcile before inventing a new milestone queue.
```
