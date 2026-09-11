# GameLoop Lifecycle Remainder Policy Preflight — Package 3

**Package:** Lifecycle Remainder Policy Preflight  
**Zone:** `HERMETIC_VALIDATION`  
**Decision:** `FRESH_LOOP_RESET_ACCEPTED / FRESH_LOOP_RESET_V1`  
**Production mechanics changed:** No  
**Save schema or migration changed:** No  
**External authority required:** No

## Purpose

PR #90 (`work/sub-step-restart-save-resume-preflight`, head `98fc6e82d2cee4108d52693385690de35d52910b`) already characterized the repository's current sub-step lifecycle behavior without changing production code. It proved that the live fixed-step accumulator is hook-local, pause/resume preserves its remainder, and stop/start, unmount/remount, and canonical save/load construct a fresh accumulator. It also proved that repeated fresh-loop boundaries can accumulate more than one fixed step of discarded remainder.

Package 3 converts that characterization into an explicit technical contract. It does not persist new state, modify `useGameLoop`, change save schema versioning, reinterpret M21 offline authority, or make any product-facing timing claim.

## Selected contract: `FRESH_LOOP_RESET_V1`

A **scheduling epoch** is one mounted/running live GameLoop lifetime whose transient fixed-step accumulator remains in memory.

Within one scheduling epoch:

- ordinary RAF progression preserves fractional fixed-step remainder;
- pause/resume remains the same epoch;
- the pre-pause remainder is preserved;
- paused wall-clock time is rejected rather than replayed.

A **new scheduling epoch** begins after:

- `stopGame` followed by `startGame`;
- unmount followed by remount; or
- canonical save/load followed by a fresh GameLoop mount.

At a new scheduling epoch boundary, any sub-step accumulator remainder from the prior epoch is intentionally discarded.

This means the normative lifecycle table is:

| Boundary | Remainder disposition | Wall-time replay |
| --- | --- | --- |
| continuous live loop | preserve | live time only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

## Why fresh-loop reset is selected

The repository currently stores accumulator remainder only in `useGameLoop` runtime memory. Canonical save persistence serializes Redux `RootState`; the persisted GameLoop state contains no accumulator or accumulator-millisecond field. Therefore exact cross-epoch remainder preservation would require introducing new durable scheduler state plus compatibility rules for existing saves.

That alternative is not a harmless implementation detail. It would require explicit decisions about:

- a new persisted field or scheduler-runtime record;
- save-schema compatibility and migration for existing saves with no remainder field;
- whether stop/start should preserve a pre-stop fraction;
- whether remounts caused by application lifecycle should preserve it;
- how a restored remainder interacts with elapsed wall time between save and load;
- how to prove no duplicate progression and no unauthorized offline replay.

Package 3 is intentionally restricted to `HERMETIC_VALIDATION`, so it does not invent those persistence semantics. The current fresh-epoch model is deterministic, observable, compatible with existing saves, and does not widen offline authority. It is therefore accepted as the technical lifecycle contract for the current schema.

## Quantified semantics

For one fresh-loop reset, discarded remainder is always strictly smaller than the active fixed step.

- default 10 Hz: fixed step = 100 ms, so one reset discards `0 <= remainder < 100 ms`;
- 20 Hz: fixed step = 50 ms, so one reset discards `0 <= remainder < 50 ms`.

The bound is **per boundary**, not global across an arbitrary number of lifecycle transitions.

Representative 10 Hz comparison:

```text
segments: 75 ms | reset | 75 ms | reset | 75 ms | reset | 75 ms | reset
FRESH_LOOP_RESET_V1:
  logical ticks = 0
  discarded remainder total = 300 ms

cross-epoch preservation model:
  logical ticks = 3
  remaining remainder = 0 ms
```

Representative 20 Hz comparison:

```text
segments: 25 ms | reset | 25 ms | reset | 25 ms | reset | 25 ms | reset
FRESH_LOOP_RESET_V1:
  logical ticks = 0
  discarded remainder total = 100 ms

cross-epoch preservation model:
  logical ticks = 2
  remaining remainder = 0 ms
```

The repeated-reset effect is therefore deterministic lifecycle semantics, not stochastic drift. Package 3 explicitly rejects the stronger claim that cumulative loss is globally bounded to one fixed step.

## Representative progression qualification

The characterization harness from PR #90 is promoted into this package as executable evidence:

`src/features/GameLoop/GameLoopSubStepRestartSaveResumePreflight.test.tsx`

It exercises the same representative online progression order used by the existing cross-progression qualification:

```text
GameLoop fixed tick
-> passive Essence
-> Copy growth / loyalty / production task
-> Player status / vitality
-> timed Quest timer
```

The harness verifies:

1. 10 Hz uninterrupted `75 ms + 25 ms` produces one 100 ms logical tick and advances representative Essence, Copy, Player, Quest, and GameLoop state once.
2. 20 Hz stop/start after a 25 ms remainder creates a fresh 50 ms epoch and does not invent a tick from the discarded remainder.
3. pause/resume preserves the 10 Hz pre-pause 75 ms remainder while rejecting paused wall time.
4. unmount/remount discards the previous hook-local remainder and requires a fresh full fixed step before equivalent representative progression occurs.
5. canonical `createSave -> loadSavedGameWithMigration -> replaceState -> fresh useGameLoop` preserves Redux state exactly but persists no accumulator field.
6. after save/load, a fresh full fixed step converges to the same representative one-tick progression as uninterrupted execution.
7. repeated 75 ms remount boundaries at 10 Hz produce zero logical ticks while uninterrupted 300 ms produces three, exposing the cumulative consequence explicitly.

## Alternative model considered and rejected for this package

`DURABLE_REMAINDER_PRESERVATION_V1` would preserve sub-step remainder across stop/start, remount, and canonical save/load.

It is **not authorized** here because it necessarily requires persistence/schema authority that Package 3 does not possess. The executable policy test rejects selecting a candidate that requires a new persisted accumulator field or save-schema change.

This rejection does not claim durable preservation is universally wrong. It means it cannot be introduced as an incidental timing repair under the current package boundaries.

## Negative / rejection boundaries

The policy qualification explicitly rejects:

- persisting a new accumulator field without schema/migration authority;
- replaying paused wall-clock time;
- replaying offline wall-clock time through the live scheduler;
- claiming repeated lifecycle loss is globally bounded to one fixed step;
- accepting non-finite or negative synthetic elapsed inputs as valid logical time;
- changing tick rate or game speed as part of the policy decision;
- compensating discarded remainder through Essence, Copy, Player, Quest, or reward formulas;
- widening M21 offline progression authority;
- coupling this decision to backlog/catch-up policy, timeout precision, Product Direction, or M26.

## Persistence consequence

`FRESH_LOOP_RESET_V1` requires **no persistence change**. Existing saves remain valid as-is because the contract makes cross-epoch remainder non-durable by definition.

If a future milestone explicitly revises this contract to preserve remainder across save/load, that revision must be treated as a persistence feature rather than a local hook tweak. It must define at minimum:

- persisted representation and units;
- schema version / migration or backward-compatible default;
- source-of-truth ownership;
- interaction with save timestamps and M21 offline settlement;
- duplicate-progression rejection cases;
- restart/remount semantics;
- rollback/compatibility behavior for saves created before the field existed.

None of those changes are made here.

## Qualification commands

Focused hermetic qualification:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
```

Repository-native qualification remains the Build Validation workflow, which also runs synthetic rejection/action-binding checks, localhost UI smoke, TypeScript, GameLoop timing characterization, cross-progression determinism, Quest timing, live/offline authority, M20-M25, historical regressions, and the production build.

## Explicit non-goals

Package 3 does not:

- change `useGameLoop` production code;
- change Redux GameLoop state;
- change the canonical save envelope;
- add a save migration;
- change default tick rate or game speed;
- modify progression, reward, regeneration, Quest duration, or balance values;
- change M21 offline behavior;
- resolve large-frame/background-stall policy;
- modify async backlog/backpressure production behavior;
- use production credentials or live external services;
- deploy infrastructure or perform destructive migration;
- claim anything about player pacing, fairness, responsiveness, enjoyment, retention, or real-device performance;
- authorize Product Direction or M26.

## Package conclusion

**`FRESH_LOOP_RESET_ACCEPTED / FRESH_LOOP_RESET_V1`**

Sub-step remainder is transient scheduling-epoch state. Pause/resume preserves it because the live epoch continues; stop/start, unmount/remount, and canonical save/load start a new epoch and discard it. The effect is deterministic, bounded per lifecycle boundary, potentially cumulative across repeated boundaries, and intentionally not persisted under the current save contract.
