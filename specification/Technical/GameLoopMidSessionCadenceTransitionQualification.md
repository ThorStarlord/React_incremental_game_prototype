# GameLoop Mid-Session Cadence Transition Qualification — Package 3

**Package:** Mid-Session Cadence Transition Qualification  
**Zone:** `HERMETIC_VALIDATION`  
**Production behavior changes:** none  
**Tick-rate policy changes:** none  
**Product authority:** unchanged; M26 remains unauthorized

## Purpose

This package qualifies the current live `useGameLoop` contract when `setTickRate(...)` changes the scheduler cadence while a session is already running.

It is intentionally a qualification package rather than a cadence-policy redesign. It does not change `useGameLoop`, `GameLoopSlice`, persistence, authored content, game speed, offline settlement, or progression rates.

## Current implementation contract

The live loop keeps an elapsed-time accumulator in milliseconds and reads the current Redux scheduling state on each RAF callback:

```text
RAF timestamp delta
-> multiply by current gameSpeed
-> add to accumulator
-> fixedTimeStep = 1000 / current tickRate
-> emit ordinary live ticks while accumulator >= fixedTimeStep
-> subtract current fixedTimeStep for every emitted tick
```

`setTickRate` itself clamps finite values to the existing 1..60 Hz reducer range. A tick-rate change does not reset the accumulator and does not re-anchor the live wall-clock baseline.

Therefore, a mid-session cadence transition has two important properties:

1. elapsed logical milliseconds already present in the accumulator are retained rather than discarded; and
2. on the next RAF callback, the retained accumulator is evaluated against the **new** fixed-step width.

For example, if 75 ms has accumulated at 10 Hz and the rate changes to 20 Hz, then another 25 ms makes the accumulator 100 ms; the new 50 ms step drains that as two ordinary live ticks. This is current behavior, not a new policy introduced by this package.

## Hermetic qualification suite

`src/features/GameLoop/GameLoopMidSessionCadenceTransitionQualification.test.tsx` replaces browser timing with an in-memory RAF controller and controlled `performance.now()` values. It uses no network, deployment, credential, production service, or destructive operation.

The suite qualifies six bounded scenarios.

### 1. Integrated 10 -> 20 -> 10 Hz transition

One live second is divided into:

```text
0-400 ms:    10 Hz -> 4 x 100 ms ticks
400-800 ms:  20 Hz -> 8 x 50 ms ticks
800-1000 ms: 10 Hz -> 2 x 100 ms ticks
```

Expected scheduler result:

```text
14 logical ticks
1000 ms totalGameTime
monotonic tick identities 1..14
per-tick delta sequence:
100,100,100,100,
50,50,50,50,50,50,50,50,
100,100
```

The package also runs the real online progression consumers used by the existing cross-progression qualification:

- passive Essence generation;
- Copy growth;
- Copy loyalty decay;
- running Copy production task progression;
- resonance recalculation;
- Player status processing;
- elapsed-time Player vitality regeneration;
- stat recalculation;
- timed Quest progression.

The 10 -> 20 -> 10 Hz result must equal a static 10 Hz one-second baseline for elapsed-time-driven progression, while `currentTick` is allowed to differ because cadence changes the number of logical scheduler ticks.

### 2. Upshift with an existing remainder

At 10 Hz, a 75 ms frame does not yet emit a 100 ms tick. After changing to 20 Hz, another 25 ms produces 100 ms in the retained accumulator, which is drained as two 50 ms ticks.

This proves that a cadence upshift does not reset the accumulator or discard pre-transition elapsed live time.

### 3. Downshift with an existing remainder

At 20 Hz, 75 ms emits one 50 ms tick and leaves a 25 ms remainder. After changing to 10 Hz, the remainder is retained until enough new live time accumulates to reach the new 100 ms fixed step.

This proves that a cadence downshift does not fabricate a premature tick and does not discard the retained remainder.

### 4. Cadence change while paused

A completed 10 Hz tick is followed by pause, a change to 20 Hz, and a synthetic 5-second paused wall-clock gap.

Expected result:

- the paused gap adds zero live logical time;
- the first resumed 50 ms live interval emits one 20 Hz tick;
- no paused wall time is replayed;
- the new cadence applies after resume.

This preserves the existing pause/resume rejection boundary.

### 5. Existing finite clamp boundaries

The suite changes cadence mid-session using finite out-of-range requests:

```text
setTickRate(0)   -> 1 Hz
setTickRate(100) -> 60 Hz
```

It verifies that the live loop consumes those clamped rates and emits the corresponding 1000 ms and ~16.6667 ms fixed steps.

This package does not define new behavior for malformed non-finite cadence requests.

### 6. Async consumer backlog across a cadence transition

The first 10 Hz `onTick` handler is held behind a hermetic Promise gate. While it is still pending, the scheduler transitions to 20 Hz and emits two more logical ticks.

Expected result:

- scheduler state advances immediately to tick 3 / 200 ms;
- only the first handler is active while blocked;
- after release, queued payloads drain in order with deltas `100, 50, 50`;
- tick identities remain `1, 2, 3`;
- peak handler concurrency remains 1.

This proves that a cadence transition does not mutate already-enqueued tick payloads or break the serialized consumer queue.

## Qualification decision

```text
MID-SESSION CADENCE TRANSITION = QUALIFIED FOR CURRENT REPOSITORY CONTRACT
NO NEW CADENCE POLICY AUTHORIZED
```

The package establishes deterministic repository behavior for supported finite tick-rate transitions. It does not claim that runtime cadence changes are desirable product behavior or that every tick-driven subsystem is safe under arbitrary cadence changes.

## Negative / rejection boundaries

This package explicitly does **not**:

- change the default 10 Hz cadence;
- change the existing 1..60 Hz finite clamp contract;
- add a new non-finite-input policy;
- reset or repartition the accumulator on `setTickRate`;
- re-anchor wall-clock time on cadence changes;
- alter pause/resume behavior;
- change `gameSpeed` semantics;
- change authored Quest durations, rewards, regeneration rates, production rates, or progression balance;
- change save schema, migrations, persistence timestamps, or offline settlement;
- route cadence-transition time through M21 offline settlement;
- use production credentials, external services, or deployment infrastructure;
- make claims about pacing, fairness, responsiveness, enjoyment, retention, device performance, or production scalability;
- authorize M26.

## Important seam preserved for future design work

The retained accumulator is elapsed live logical time, not a history of which cadence originally accrued each millisecond. A transition therefore evaluates the entire current remainder against the newly selected fixed-step width.

That behavior is deterministic and now qualified, but this package does not assert that it is the only valid product contract. Any future design that wants cadence changes to apply only prospectively, reset fractional remainder, quantize transitions to tick boundaries, or reject runtime rate changes would be a production-policy change and should be handled in a separate bounded package.

## Repository qualification

Focused commands:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand GameLoopMidSessionCadenceTransitionQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
npm run build
```

The PR also adds the new qualification as a permanent step in `.github/workflows/build-validation.yml`, so the exact candidate head is checked against the repository rejection/action-binding checks, localhost UI smoke, TypeScript, scheduler and progression timing suites, M20-M25 qualifications, historical regressions, and production build.

## Evidence ceiling

A green candidate proves only the deterministic repository contract above. It does not prove:

- player-facing value of runtime cadence controls;
- perceptual smoothness or responsiveness at every cadence;
- final economy or pacing equivalence for every subsystem;
- safe non-finite action handling;
- trusted wall-clock or anti-cheat behavior;
- browser/device performance at 60 Hz under production load;
- human product quality;
- Product Direction or M26 readiness.
