# Repository Runbook — GameLoop Safety & Lifecycle Hardening

**Handoff milestone:** Async backlog policy, bounded backlog repair, lifecycle remainder policy  
**Canonical base at handoff:** `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Important:** Packages 1–3 are repository-qualified but are not yet integrated into `main`.

This runbook is the fast re-entry point for future engineers and future chat sessions. Read `STATUS.md` first for authority and integration state.

## Environment

Repository CI uses Node.js 20.

```bash
npm ci
npx tsc --noEmit
npm run build
```

The authoritative pull-request gate is `.github/workflows/build-validation.yml` on the exact candidate head under qualification.

## Current-main baseline qualification

These commands exist on the current `main` base and remain useful before replaying package work:

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

Repository rejection/synthetic-review checks:

```bash
npm run simulated-review:validate
npm run simulated-review:action-contract
```

## Package 1 — Async Tick Backlog Policy Contract

**PR:** #91  
**Branch:** `work/async-tick-backlog-policy-contract`  
**Candidate:** `842c54acd1b2d0ba52b2e9c16fa2480e289c33fb`  
**Decision:** `BACKLOG_POLICY_AUTHORIZED / SERIAL_BACKPRESSURE_V1`  
**Build Validation:** #296 PASS  
**Gemini review:** #326 FAIL before review / `API_KEY_INVALID`

Focused qualification:

```bash
git fetch origin
git switch work/async-tick-backlog-policy-contract
npm ci
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
npm run build
```

Selected policy:

```text
defer logical milliseconds, not TickData objects
-> admit at most one unresolved async tick
-> producer lead <= 1
-> zero queued TickData backlog objects
-> no drop, skip, coalescing, or concurrent consumers
-> fulfillment or rejection releases the admission slot
```

Package 1 intentionally contains no production scheduler repair.

## Package 2 — Bounded Backlog Control Repair & Integration Qualification

**PR:** #92  
**Branch:** `work/bounded-backlog-control-repair`  
**Candidate:** `f11b421724e25ff5a90d0539036b65dd9cadaef1`  
**Decision:** `BACKLOG_CONTROL_REPAIR_QUALIFIED`  
**Build Validation:** #297 PASS  
**Gemini review:** #327 FAIL before review / `API_KEY_INVALID`

Focused qualification:

```bash
git fetch origin
git switch work/bounded-backlog-control-repair
npm ci
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand GameLoopBoundedBacklogControlRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
npm run build
```

Production behavior on this candidate:

```text
RAF elapsed logical time
-> accumulator
-> admit one fixed step if no async consumer is unresolved
-> advance scheduler state only for admitted work
-> retain excess logical milliseconds in accumulator
-> settle consumer
-> admit at most one next step
```

Negative/rejection coverage includes large-frame bounded lead, no drop/coalescing, peak async concurrency one, rejection liveness, pause admission blocking, stale-unmount rejection, and cadence-change handling of deferred logical milliseconds.

Package 2 does not change save schema, M21 authority, default tick rate, game speed, background-stall policy, Quest durations, rewards, or balance.

## Package 3 — Lifecycle Remainder Policy Preflight

**PR:** #93  
**Branch:** `work/lifecycle-remainder-policy-preflight`  
**Candidate:** `391b9fd82fd4ea11852907b85ef2d5749762702c`  
**Decision:** `FRESH_LOOP_RESET_ACCEPTED / FRESH_LOOP_RESET_V1`  
**Build Validation:** #298 PASS  
**Gemini review:** #328 FAIL before review / `API_KEY_INVALID`

Focused qualification:

```bash
git fetch origin
git switch work/lifecycle-remainder-policy-preflight
npm ci
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
npm run build
```

Selected lifecycle contract:

| Boundary | Remainder | Wall-time replay |
| --- | --- | --- |
| continuous live execution | preserve | live time only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

A single reset discards less than one active fixed step, but repeated reset boundaries can accumulate more than one fixed step of discarded logical time. This is accepted deterministic lifecycle behavior under the current schema.

`DURABLE_REMAINDER_PRESERVATION_V1` is not authorized because it would require new persisted scheduler state plus save-schema/migration policy.

## Required integration sequence

All three final candidates were qualified from the same base `96a87c78...`; they are **not a pre-composed stack**. Their individual green Build Validation runs do not prove a final combined tree.

After the external merge blocker is resolved, use this sequence:

```text
1. Integrate PR #91.
2. Sync latest main.
3. Replay/rebase Package 2 onto that main.
4. Resolve only mechanical overlaps; preserve SERIAL_BACKPRESSURE_V1 semantics.
5. Run the full exact-head Build Validation and all configured CI.
6. Integrate Package 2 only if all checks pass.
7. Sync latest main.
8. Replay/rebase Package 3 onto the composed main.
9. Re-run lifecycle tests against the bounded-backpressure production scheduler.
10. Run the full exact-head Build Validation and all configured CI.
11. Integrate Package 3 only if all checks pass.
12. Refresh STATUS.md to record the actual integrated main SHAs.
```

Do not merge the three stale-base candidates in arbitrary order and infer composition from their independent CI results.

## Combined post-integration qualification

Once Packages 1–3 are composed on a single candidate, run at minimum:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopBoundedBacklogControlRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
npm run build
```

Then use the exact candidate `.github/workflows/build-validation.yml` as the final repository-native authority rather than treating the abbreviated list above as a substitute for CI.

## External authority and human gates

The Gemini AI Code Review workflow currently fails before producing review output because the configured key is invalid (`API_KEY_INVALID`). Correcting or replacing that credential, or changing the standing all-CI merge rule, is external/human authority. Do not place production credentials into repository timing work.

Technical qualification also does not prove:

- fresh-player comprehension;
- perceived responsiveness or pacing;
- fairness or balance;
- enjoyment or retention;
- real-device/background behavior beyond existing hermetic characterization;
- Product Direction;
- authorization for M26.

## Do-not-cross boundaries

- Do not widen M21 offline authority implicitly.
- Do not persist GameLoop accumulator remainder without a new persistence contract.
- Do not introduce tick dropping/coalescing as an incidental backlog optimization.
- Do not reinterpret background suspension as offline progression without explicit policy.
- Do not infer product quality from deterministic technical execution.
- Do not mark Packages 1–3 as integrated until a composed current-main lineage and exact-head all-CI evidence exist.
