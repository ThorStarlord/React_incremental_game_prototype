# GameLoop Large-Frame / Background-Stall Preflight — Package 2

**Package:** Large-Frame / Background-Stall GameLoop Preflight  
**Zone:** `HERMETIC_VALIDATION`  
**Production behavior changes:** none  
**Offline authority changes:** none  
**Product authority:** unchanged; M26 remains unauthorized

## Purpose

This package characterizes how the current live fixed-step `useGameLoop` behaves when `requestAnimationFrame` delivery is delayed for materially longer than one fixed step, including the shape expected after a throttled or stalled foreground/background browser interval.

The package is intentionally a preflight. It does not choose a maximum live-frame delta, add a visibility policy, clamp or discard elapsed time, redirect excess time into M21 offline settlement, change tick rate/game speed, or make pacing/balance claims.

## Existing timing authorities preserved

The repository currently has two deliberately separate timing authorities:

```text
live mounted GameLoop
requestAnimationFrame timestamp delta
-> fixed-step accumulator
-> ordinary online GameLoop ticks / onTick consumers
```

and:

```text
canonical persisted save timestamp
-> M21 bounded offline settlement
-> explicit offline-safe allowlist only
```

M21 does not replay the live GameLoop for wall-clock absence, and this package does not widen M21.

## Current-main implementation fact

`useGameLoop` currently computes:

```text
deltaTime = current RAF timestamp - previous live-frame timestamp
adjustedDeltaTime = deltaTime * gameSpeed
accumulator += adjustedDeltaTime
while accumulator >= fixedTimeStep:
  emit one ordinary live tick
  accumulator -= fixedTimeStep
```

There is no maximum-frame clamp or visibility-derived background cutoff in this path.

Therefore, while the hook remains mounted, running, and unpaused, a large RAF timestamp jump is interpreted as accumulated **live** time and drained through ordinary fixed-step catch-up.

## Hermetic characterization suite

`src/features/GameLoop/GameLoopLargeFrameBackgroundStallPreflight.test.tsx` uses an in-memory RAF controller and controlled `performance.now()` values. No browser visibility API, network dependency, production credential, deployment, or external service is required.

The suite records the following current behavior at the default 10 Hz / 100 ms fixed step:

| Scenario | Current characterization expectation | Classification |
| --- | --- | --- |
| one unpaused 5,000 ms RAF gap | 50 ordinary live ticks; `totalGameTime = 5000 ms`; callback tick identities 1..50 | current live behavior |
| one 5,000 ms frame vs fifty 100 ms frames | same scheduler tick count, logical time, callback identities, and fixed-step deltas | deterministic catch-up invariant |
| 5,250 ms frame then +50 ms | 52 ticks first, 50 ms remainder retained, then tick 53 | accumulator invariant |
| explicit pause across a 5,000 ms gap | zero live ticks during the gap; one ordinary 100 ms tick after resume | rejection/safety invariant |
| unmount/remount across 10,000 ms absence | remount re-anchors `performance.now()`; absence is not replayed as one giant live frame | live/offline boundary invariant |
| async `onTick` blocked during a 5,000 ms catch-up burst | scheduler state reaches 50 ticks immediately; consumer queue remains serialized and later drains tick identities 1..50 | backlog/ordering characterization |

## Important boundary exposed by the preflight

The current distinction is based on **loop lifecycle/control state**, not on browser-tab visibility:

- mounted + running + unpaused + delayed RAF callback -> full delayed interval becomes ordinary live catch-up;
- explicitly paused -> delayed wall time is rejected from live progression;
- unmounted/remounted -> the live baseline is re-anchored and the absence is not replayed through the live accumulator;
- canonical save/load absence -> M21 decides bounded offline settlement using its separate allowlist.

This means a browser background/throttling interval that merely delays RAF while leaving the loop mounted and unpaused is not currently equivalent to M21 offline absence. It can produce a burst of ordinary live ticks on the next RAF callback.

The async callback queue protects handler overlap, but it does not cap the number of scheduler ticks emitted by a single large frame. Scheduler state can advance for the entire accumulated gap before a blocked asynchronous online consumer has finished draining its queued work.

## Preflight decision

```text
NO PRODUCTION REPAIR AUTHORIZED BY THIS PACKAGE
```

The evidence is sufficient to expose the policy seam, but not to choose among materially different runtime/product semantics such as:

- replaying every delayed live millisecond as today;
- capping the amount of live catch-up processed by one frame;
- discarding time beyond a live-frame threshold;
- automatically pausing/re-anchoring on visibility/lifecycle signals;
- handing some delayed interval to a separately designed settlement path.

Any of those would require an explicit contract for what counts as active live time versus absence, what happens to excess elapsed time, and whether online-only systems may advance during background throttling. No arbitrary threshold is introduced here.

## Negative / rejection boundaries

This package explicitly does **not**:

- add `visibilitychange`, focus, blur, page-lifecycle, or background-detection behavior;
- add a max-frame-delta constant or catch-up budget;
- drop, clamp, quantize, or rescale elapsed time;
- route large RAF gaps through `settleOfflineProgressThunk`;
- expand M21 beyond passive Essence + already-running M20 Copy production tasks;
- change default `tickRate`, `gameSpeed`, authored Quest durations, rewards, progression rates, or regeneration rates;
- change save schema, migration, persistence timestamps, or offline replay markers;
- use production credentials or live external services;
- claim that the current or any alternative policy is better for pacing, fairness, responsiveness, enjoyment, retention, or production scalability.

## Qualification

Focused repository qualification for this package is:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand GameLoopLargeFrameBackgroundStallPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
npm run build
```

The candidate branch also wires the new preflight into `.github/workflows/build-validation.yml`, so the authoritative PR run executes the repository rejection/action-binding checks, UI smoke, TypeScript, this new preflight, existing GameLoop/Quest/live-offline qualifications, M20-M25, historical regressions, and production build.

## Evidence ceiling

A green preflight proves only deterministic repository behavior for the synthetic large-frame scenarios above. It does not prove:

- how frequently real browsers produce these gaps;
- acceptable UI responsiveness during a catch-up burst;
- a final background-tab progression policy;
- a safe universal catch-up threshold;
- final economy/pacing consequences;
- production device performance;
- trusted wall-clock/anti-cheat behavior;
- human product quality.

Those remain separate decisions/evidence classes.
