# GameLoop Sub-Step Restart & Save/Resume Remainder Preflight

**Package:** Sub-Step Restart & Save/Resume Remainder Preflight  
**Zone:** `HERMETIC_VALIDATION`  
**Production mechanics changed:** No  
**External authority required:** No

## Purpose

This preflight answers one lifecycle-timing question:

> What happens to fixed-step accumulator remainder when the live GameLoop is paused, stopped/restarted, unmounted/remounted, or persisted and restored through the canonical save path?

`useGameLoop` stores accumulator state in a hook-local `useRef`, not Redux. The canonical save system persists `RootState`; therefore sub-step remainder is not part of the current save envelope.

This package characterizes the consequences without adding a new persistence field, scheduler policy, migration, or product claim.

## Evidence harness

Executable evidence lives in:

- `src/features/GameLoop/GameLoopSubStepRestartSaveResumePreflight.test.tsx`
- `.github/workflows/build-validation.yml`

Run directly with:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx
```

The harness uses fake `requestAnimationFrame`, controlled `performance.now()`, in-memory Redux stores, and browser-local `localStorage`. It exercises representative production consumers through the same tick order already used by the cross-progression qualification:

```text
GameLoop fixed tick
-> passive Essence
-> Copy growth / loyalty / production task
-> Player status / vitality
-> timed Quest timer
```

No network, credentials, external service, deployment, destructive migration, or production environment is used.

## Characterized behavior

### 1. Uninterrupted sub-step accumulation is deterministic

At 10 Hz, 75 ms followed by 25 ms crosses exactly one 100 ms fixed step. The GameLoop and representative progression consumers advance once.

At 20 Hz, 25 ms followed by 25 ms crosses exactly one 50 ms fixed step.

### 2. Unmount/remount discards the hook-local remainder

At 10 Hz:

```text
75 ms live accumulation
-> unmount
-> remount
-> 25 ms live frame
```

produces zero logical ticks after the 25 ms frame. The remounted loop requires a fresh total of 100 ms after its new baseline before the next fixed tick is emitted.

The previously accumulated 75 ms is not represented in Redux and is therefore not recoverable by remount.

### 3. Stop/start has the same reset semantics

At 20 Hz, a 25 ms remainder is discarded when `stopGame` tears down the running effect and `startGame` constructs a fresh live loop. A subsequent 25 ms is insufficient to emit a 50 ms fixed tick; another 25 ms is required.

This is a deterministic lifecycle reset, not random drift.

### 4. Pause/resume is intentionally different

Pause/resume re-anchors wall-clock time but does **not** reset `accumulatorRef`.

A 75 ms remainder accumulated before a 10 Hz pause remains available after resume. A 25 ms live frame after resume completes the 100 ms fixed step, while the paused wall-clock gap itself contributes zero progression.

Therefore current semantics distinguish:

```text
pause/resume = preserve sub-step remainder, reject paused wall time
stop/start = discard sub-step remainder
unmount/remount = discard sub-step remainder
```

### 5. Canonical save/load preserves Redux state but not accumulator remainder

The save path is:

```text
createSave(RootState)
-> current-schema envelope
-> loadSavedGameWithMigration
-> replaceState
-> fresh useGameLoop mount
```

A save taken after 75 ms of a 10 Hz sub-step contains unchanged Redux progression state and no `accumulator` / `accumulatorMs` field in `gameLoop` state. After restore, a 25 ms live frame produces no tick; the restored loop needs a fresh total 100 ms after mount before advancing.

No persisted Essence, Copy, Player, Quest, or GameLoop state is corrupted or duplicated by this behavior. The missing quantity is specifically the transient sub-step remainder.

### 6. The loss is bounded per lifecycle reset but can accumulate across repeated resets

For one reset, discarded time is strictly less than one fixed step because a remainder is, by definition, smaller than the active fixed timestep.

However, repeated lifecycle resets can accumulate multiple discarded remainders. The hermetic harness demonstrates four 75 ms remount cycles at 10 Hz:

```text
4 x 75 ms with remount after each segment
-> 0 logical ticks
```

while uninterrupted 300 ms yields three logical ticks and corresponding representative progression.

Therefore the behavior is **not globally bounded to one fixed step across an arbitrary sequence of restarts**.

## Preflight conclusion

**Decision: `DETERMINISTIC_REMAINDER_DISCONTINUITY_CONFIRMED / POLICY_REQUIRED / NO_PRODUCTION_REPAIR_AUTHORIZED`**

The current implementation is internally consistent with its storage model:

- accumulator remainder is runtime-local;
- pause/resume preserves it;
- stop/start and remount reconstruct it from zero;
- save/load persists Redux state only and therefore cannot restore it.

But if the intended contract is exact logical-time continuity across restart/save boundaries, current behavior violates that stronger contract. Repeated restarts can accumulate lost sub-step time and corresponding delayed progression across Essence, Copy tasks, Player vitality, Quest timers, and GameLoop logical time.

The repository does not currently contain explicit authority stating that sub-step remainder must be persisted. This preflight therefore classifies the behavior as a deterministic discontinuity requiring policy, rather than silently declaring either a harmless optimization or an authorized defect repair.

## Repair families that require explicit authority

A future package may evaluate, but this package does not authorize:

- persisting accumulator remainder in canonical save state;
- introducing a versioned scheduler-runtime persistence record;
- folding remainder into another persisted time field;
- deliberately defining stop/start and save/load as fresh-step boundaries and documenting remainder discard as normative;
- compensating the next live frame after restore;
- changing pause semantics to match restart semantics.

Any repair must define compatibility with existing saves that have no remainder field and prove that it does not duplicate progression or replay offline absence.

## Explicit non-authorizations

This package does **not** authorize:

- changing `useGameLoop` production code;
- changing default tick rate or `gameSpeed`;
- persisting new GameLoop fields;
- changing the current save schema or adding a migration;
- replaying arbitrary wall-clock absence through live ticks;
- widening M21 offline authority;
- modifying Essence, Copy, Player, Quest, relationship, or reward formulas;
- changing timeout precision semantics;
- adding catch-up caps, queue backpressure, coalescing, or tick dropping;
- using production credentials or external services;
- deployment or destructive migration;
- claims about pacing, fairness, responsiveness, real-device performance, enjoyment, retention, Product Direction, or M26.

## Negative / rejection boundaries

The qualification explicitly proves:

- paused wall-clock time is still rejected;
- pause/resume does not accidentally discard a valid pre-pause remainder;
- save/load does not invent or duplicate a tick from a non-persisted remainder;
- one fresh full fixed step after restart produces exactly the same representative progression as one uninterrupted fixed step;
- repeated lifecycle resets expose cumulative timing loss rather than hidden state mutation.

## Merge qualification

Repository qualification requires the exact candidate head to pass Build Validation, including:

- synthetic-review rejection/action-binding checks;
- localhost UI smoke;
- TypeScript type checking;
- this dedicated sub-step restart/save-resume preflight;
- existing GameLoop/progression/Quest/live-offline qualification;
- M20-M25 and historical regression suites;
- production build.

A separately credentialed review workflow remains external authority. Under the standing all-CI merge rule, failure of that workflow blocks merge even when repository validation passes.
