# GameLoop Timing Characterization — Package 1

**Package:** GameLoop Timing Characterization & Determinism Gate  
**Scope:** `HERMETIC_VALIDATION` / repository-only tests and documentation  
**Product authority:** unchanged; M26 remains unauthorized  
**Production behavior changes:** none

## Purpose

This package establishes a deterministic, fake-`requestAnimationFrame` characterization harness around the existing `useGameLoop` implementation before any scheduler repair is attempted.

The harness is deliberately diagnostic. It separates:

1. current live-loop invariants that already behave as intended; and
2. current-main behaviors that reproduce scheduler risks and should become repair targets in the next bounded package.

No reward curve, progression threshold, default tick rate, game-speed range, offline-settlement rule, or player-facing pacing decision is changed here.

## Existing authority preserved

The package preserves the M21/M25 boundary that live fixed-timestep execution is not the authority for replaying wall-clock absence. Bounded offline settlement remains separate from the live GameLoop.

Therefore the characterization suite does not simulate hours of absence by feeding a giant delta through the application tick pipeline.

## Hermetic timing harness

`src/features/GameLoop/hooks/useGameLoop.timing-characterization.test.tsx` replaces browser timing with an in-memory RAF controller and controlled `performance.now()` values.

The suite exercises:

- default 10 Hz / 100 ms fixed-step behavior;
- approximately 60 Hz RAF frame chunking;
- irregular sub-step frame accumulation;
- a frame larger than one fixed step with a fractional remainder;
- multi-step catch-up in one RAF callback;
- deliberately slow asynchronous `onTick` work;
- pause/resume behavior;
- game-speed changes; and
- tick-rate changes.

No external service, credential, network dependency, production environment, or subjective review is required.

## Characterization matrix

The candidate-head test suite encodes the following current-main expectations.

| Scenario | Characterization expectation | Classification |
| --- | --- | --- |
| 100 ms at default 10 Hz | one 100 ms logical tick | existing invariant |
| ~60 Hz sub-step frames | frames accumulate until one fixed step is reached | existing invariant |
| irregular 40 ms + 60 ms frames | sub-step time accumulates deterministically before a tick | existing invariant |
| pause then resume | paused wall-clock time is not replayed as live progress | rejection/safety invariant |
| `gameSpeed = 2` | 50 ms wall-clock input can produce one 100 ms logical step | existing invariant |
| `tickRate = 20` | fixed timestep becomes 50 ms | existing invariant |
| 150 ms frame then 50 ms frame | current implementation loses the 50 ms fractional remainder after the first tick-driven rerender | **known defect reproduced** |
| 250 ms frame at 10 Hz | Redux reaches tick 2 while callback tick identities are currently `[1, 1]` | **known defect reproduced** |
| slow async `onTick` + 250 ms frame | two async handlers can be in flight concurrently | **known ordering risk reproduced** |

The three known-risk cases are paired with `test.todo` desired invariants. This keeps Package 1 mergeable as a characterization artifact while making Package 2's repair target explicit and reviewable.

## Interpretation boundary

Passing this suite does **not** mean the current scheduler is correct. For the known-defect cases, passing means the repository has successfully and deterministically reproduced the current behavior.

The intended next-package repair targets are:

- preserve accumulator remainder across tick-driven React/Redux rerenders;
- deliver monotonic callback tick identity during multi-step catch-up; and
- establish an explicit non-overlap ordering contract for asynchronous tick processing.

Those repairs are not part of this package.

## Qualification

Candidate-head qualification must include:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand M25CompleteChapterVerticalSlice.test.tsx
npm run build
```

The authoritative PR workflow continues to run the broader historical qualification stack and live synthetic-review smoke. The GameLoop characterization test is added as an explicit PR gate so future scheduler changes cannot silently erase this evidence boundary.

## External authority deferred

This package does not decide:

- whether 10 ticks/second is the best player-facing cadence;
- whether progression should be faster or slower;
- reward, economy, unlock, or balance changes;
- human pacing, comprehension, fun, retention, or UX quality;
- M26 product direction.

Those remain outside repository-only scheduler characterization.
