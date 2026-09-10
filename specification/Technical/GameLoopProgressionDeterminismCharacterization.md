# GameLoop Cross-Progression Determinism Characterization

**Package:** 1 — Cross-Progression Tick Determinism Characterization  
**Scope:** REPOSITORY_ONLY / HERMETIC_VALIDATION  
**Production mechanics changed:** No  
**Balance or pacing authority:** None

## Purpose

The deterministic live scheduler repair established that the GameLoop can emit stable logical fixed steps across different `requestAnimationFrame` layouts. This package moves the evidence boundary one layer upward: it asks whether representative existing progression consumers produce equivalent state when they receive equivalent logical time.

This is a characterization package. It records current behavior and desired future invariants without repairing progression formulas, changing rewards, changing the default 10 Hz cadence, or broadening M21 offline authority.

## Runtime sequence under characterization

The hermetic test reproduces the ordinary online consumer order owned by `App.tsx`:

```text
processPassiveGenerationThunk(deltaTime)
-> processCopyGrowthThunk(deltaTime)
-> processCopyLoyaltyDecayThunk(deltaTime)
-> processCopyTasksThunk(deltaTime)
-> processResonanceLevelThunk()
-> processStatusEffectsThunk()
-> regenerateVitalsThunk()
-> recalculateStatsThunk()
-> processQuestTimersThunk(deltaTime)
```

The harness uses the production `useGameLoop` hook with an in-memory `requestAnimationFrame` controller and controlled `performance.now()` values. No browser network, external service, credentials, deployment, migration, or production data is required.

## Scenarios

The focused suite exercises representative seeded Essence, Copy, Player, and timed Quest state under:

1. regular 100 ms RAF delivery at the default 10 Hz fixed step;
2. irregular sub-step RAF chunking that represents the same one second of logical time;
3. same-frame catch-up where one RAF callback emits ten 100 ms logical steps;
4. a supported 20 Hz tick-rate variant representing the same one second of logical time; and
5. pause/resume with a large paused wall-clock interval that must not leak into ordinary live progression.

## Characterized invariants

### Frame-layout invariance at fixed tick rate

For one second of logical time at 10 Hz, regular frames, irregular frames, and same-frame catch-up are expected to converge on equivalent representative progression state:

- passive Essence amount and total collected;
- Copy maturity;
- Copy loyalty;
- active Copy production-task progress;
- Player health and mana under the current invocation-count semantics;
- timed Quest elapsed value/status;
- GameLoop logical elapsed time.

The number and placement of RAF callbacks must not independently duplicate or omit progression.

### Pause/rejection boundary

Paused wall time is not ordinary live progression. The suite verifies that while paused there is no:

- passive Essence gain;
- Copy task advancement;
- Player vital regeneration;
- timed Quest advancement; or
- logical GameLoop tick advancement.

After resume, the next ordinary fixed step must behave like a normal live step rather than replaying the paused interval.

## Current contract discrepancies exposed by the characterization

### 1. Vital regeneration is invocation-count dependent

`PlayerSystem.md` describes `healthRegen` and `manaRegen` as per-second recovery values. The current `regenerateVitalsThunk()` accepts no `deltaTime` and adds the entire regen amount once per invocation.

Consequently, one second of current live execution characterizes differently across supported tick rates:

```text
10 Hz: 10 regeneration invocations
20 Hz: 20 regeneration invocations
```

With the hermetic seed of `health=50`, `mana=10`, `healthRegen=1`, and `manaRegen=0.5`, the current expected outcomes are:

```text
10 Hz -> health 60, mana 15
20 Hz -> health 70, mana 20
```

The suite intentionally records this as current production behavior and leaves a desired-invariant `test.todo`. Repair belongs to the separately authorized vitality-normalization package, not this package.

### 2. Timed Quest `elapsedSeconds` consumes millisecond deltas

Quest state and types name the timing fields `timeLimitSeconds`, `elapsedSeconds`, and `deltaSeconds`. The live App sequence passes `TickData.deltaTime`, whose scheduler unit is milliseconds, directly to `processQuestTimersThunk`.

The current implementation then adds that value directly to `elapsedSeconds`. Therefore one second of logical live time currently characterizes as:

```text
elapsedSeconds = 1000
```

This behavior remains deterministic across equivalent RAF layouts and tick rates because the millisecond deltas still sum to the same logical duration, but the field/unit contract is inconsistent. The focused suite records the behavior and leaves a desired-invariant `test.todo`; it does not repair the Quest timer in Package 1.

## Evidence ceiling

This package does **not** establish that:

- progression pacing is enjoyable or balanced;
- current recovery rates are desirable;
- current Quest time limits are desirable;
- 20 Hz should become the product default;
- arbitrary progression systems are deterministic beyond the representative consumers exercised;
- background/tab-throttled behavior is product-qualified;
- M21 offline settlement should include additional live consumers;
- human comprehension, retention, or emotional impact is proven;
- M26 is authorized.

## Qualification command

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
```

This focused characterization is also intended to run in `.github/workflows/build-validation.yml` alongside the existing deterministic GameLoop timing suite, synthetic-review rejection contract, M20–M25 qualification stack, TypeScript, historical regressions, localhost smoke, and production build.

## Next bounded repair boundary

If this package qualifies, the next authorized package remains the narrow vitality repair already defined in the work queue:

```text
Delta-Time-Normalized Vital Regeneration Repair
```

That repair should convert the vitality `test.todo` into a positive cross-tick-rate invariant without changing the authored per-second regen values. The Quest timer unit discrepancy is evidence discovered by this characterization but is not implicitly authorized for repair by the vitality package.
