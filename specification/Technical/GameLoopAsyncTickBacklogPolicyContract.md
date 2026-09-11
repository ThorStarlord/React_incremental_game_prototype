# GameLoop Async Tick Backlog Policy Contract

**Package:** Async Tick Backlog Policy Contract  
**Zone:** `HERMETIC_VALIDATION`  
**Checkpoint:** `BACKLOG_POLICY_AUTHORIZED`  
**Selected policy:** `SERIAL_BACKPRESSURE_V1`  
**Production mechanics changed:** No  
**External authority required:** No

## Purpose

A prior hermetic preflight (PR #89) established that the current `useGameLoop` scheduler can continue minting fixed logical ticks while one Promise-returning `onTick` consumer is unresolved. That behavior preserves serialized callback execution, but the scheduler-vs-consumer gap can grow without an explicit bound.

This package answers the next question:

> What backlog semantics are authorized for a later production repair?

It selects and executable-qualifies one bounded contract without changing production `useGameLoop` behavior.

The selected policy is:

```text
SERIAL_BACKPRESSURE_V1

unpaused RAF elapsed time
-> logical-millisecond accumulator
-> admit at most one fixed logical tick
-> wait for that consumer to settle
-> admit at most one next fixed logical tick from deferred accumulator time
-> repeat until no full step remains
```

The central rule is:

> **Defer logical time, not TickData objects.**

A slow async consumer may cause deferred logical time to grow, but it must not cause an unbounded in-memory queue of already-minted logical ticks.

## Current production incompatibility

Current `useGameLoop` behaves approximately as:

```text
RAF elapsed time
-> accumulator
-> while accumulator >= fixed step:
     dispatch GameLoop tick immediately
     enqueue TickData
     subtract fixed step
-> serialized async FIFO callback drain
```

Under a one-second 10 Hz frame while tick 1's callback remains unresolved, current production can reach:

```text
GameLoop currentTick = 10
entered onTick callbacks = 1
producer lead = 9
```

That exceeds the selected policy's maximum producer lead of one admitted/in-flight tick.

This package deliberately leaves the production mismatch visible. Package 2, if started, owns the repair.

## Selected contract: `SERIAL_BACKPRESSURE_V1`

### B1. Admission bound

At most one logical tick may be admitted to the async consumer pipeline without having settled.

Define:

```text
producerLead = admittedTick - settledTick
```

Required invariant:

```text
0 <= producerLead <= 1
```

There is no second queued TickData item behind the active consumer.

### B2. No TickData backlog allocation

The selected policy does not represent deferred work as a FIFO array of one object per logical tick.

Required invariant:

```text
queuedTickObjects = 0
```

Deferred work is represented by logical milliseconds remaining in the existing fixed-step accumulator concept.

This is a bounded-memory policy with respect to tick count: deferred time may grow numerically, but the number of pending tick objects does not grow with elapsed time.

### B3. No drop, skip, or coalescing authorization

This policy does not buy bounded memory by weakening progression semantics.

Forbidden unless a future separately-authorized contract proves semantic equivalence:

- dropping logical ticks;
- skipping logical ticks;
- coalescing multiple fixed steps into one larger consumer callback;
- advancing `currentTick` for work that will never be admitted;
- running multiple async `onTick` consumers concurrently.

Required invariants:

```text
droppedTicks = 0
coalescedTicks = 0
peakConcurrentConsumers <= 1
```

### B4. Scheduler state advances only on admission

For a future repair under this policy, `currentTick` and fixed-step `totalGameTime` must not run arbitrarily ahead of the async consumer pipeline.

A logical tick becomes scheduler-authoritative when that fixed step is admitted for consumer execution, not merely because enough wall-clock-derived logical time exists in the accumulator.

Therefore a blocked consumer may leave substantial full-step logical time deferred in the accumulator while scheduler tick identity remains at most one step ahead of the last settled consumer.

This is the key difference from the current queue implementation.

### B5. Settlement opens exactly one admission slot

When the active consumer settles, either by fulfillment or rejection:

1. the active admission slot becomes available;
2. if the loop is mounted, running, unpaused, and at least one complete fixed step remains deferred, exactly one next logical tick may be admitted;
3. additional complete fixed steps stay deferred until that next consumer settles.

This produces FIFO ordering by construction because there is never more than one admitted unresolved logical tick.

### B6. Rejection is liveness, not rollback

A rejected async tick consumer must release the admission slot so later deferred logical work cannot deadlock forever.

The policy does **not** authorize rewinding the already-admitted scheduler tick or duplicating it.

Required outcome after a rejection:

```text
log/report rejection through existing error authority
-> settle admission slot
-> preserve monotonic tick identity
-> admit at most one next deferred fixed step
```

This package does not claim transactional rollback of arbitrary side effects performed before a consumer rejects.

### B7. Large-frame and catch-up semantics

This package does not authorize a max-frame clamp, Page Visibility cutoff, background pause, or M21 handoff.

Therefore large unpaused elapsed intervals still contribute logical milliseconds under the current live timing authority.

Example at 10 Hz:

```text
5,000 ms unpaused elapsed
-> admit tick 1 (100 ms)
-> retain 4,900 ms deferred
-> 49 complete fixed steps remain represented as accumulator time
-> allocate zero queued TickData backlog entries
```

If another 5,000 ms arrives while tick 1 remains unresolved:

```text
producerLead remains 1
deferred accumulator becomes 9,900 ms
99 whole fixed steps remain deferred
queuedTickObjects remains 0
```

Once the consumer becomes faster than incoming production, the deferred logical time may drain one admitted fixed step at a time.

If the consumer remains permanently slower than real-time production, deferred logical time may continue growing. `SERIAL_BACKPRESSURE_V1` bounds tick-object memory and scheduler/consumer divergence; it does not guarantee eventual real-time catch-up.

### B8. Pause / resume

Pause remains an explicit boundary against paused wall-clock progress.

Required behavior:

- entering pause does not erase already-earned pre-pause accumulator time;
- paused wall-clock intervals add zero new live logical time;
- if an already-admitted async consumer settles while paused, no next deferred tick is admitted until resume;
- resume may immediately admit one complete pre-pause deferred fixed step if one exists;
- the one-in-flight admission bound remains active after resume.

This does not widen M21 offline authority.

### B9. Unmount

Unmount must prevent new callback admission after cleanup.

An already-active Promise is not required to be forcibly canceled by this policy, but its eventual settlement must not start another stale callback after the hook has unmounted.

This package intentionally does **not** decide what should happen to unadmitted accumulator remainder or deferred logical time across a new mount/save-resume lifecycle. That question belongs to the separate lifecycle-remainder policy package.

### B10. Tick-rate and game-speed policy remain unchanged

This package does not change:

- default 10 Hz cadence;
- supported tick-rate range;
- `gameSpeed` meaning;
- mid-session cadence-transition authority.

Deferred time is conceptualized as logical milliseconds, consistent with the existing accumulator model. A later production implementation must preserve the repository's separately-qualified cadence-transition semantics unless another explicit policy supersedes them.

### B11. Persistence and M21 remain separate authorities

`SERIAL_BACKPRESSURE_V1` is a live scheduler/consumer policy only.

It does not authorize:

- persisting the live accumulator;
- adding a save-schema field;
- replaying queued live work after reload;
- routing backlog through offline settlement;
- adding timed Quests to M21;
- widening M21's two-consumer offline allowlist.

Canonical save/load and M21 remain unchanged until separately authorized.

## Why this policy was selected

Four broad policy families were considered from the prior backlog preflight:

1. producer backpressure;
2. bounded queue with overflow semantics;
3. coalescing;
4. separating deterministic state mutation from asynchronous side effects.

`SERIAL_BACKPRESSURE_V1` is selected because it is the narrowest policy that directly removes unbounded TickData queue growth without requiring semantic loss.

It preserves the strongest existing invariants:

- fixed-step logical time;
- monotonic tick identity;
- serialized consumer execution;
- no silent dropping;
- no implicit coalescing;
- no concurrency increase;
- current pause/offline authority boundaries.

A bounded queue larger than one still requires an arbitrary capacity and an overflow decision. Dropping or coalescing would require consumer-specific equivalence proof. Architectural separation of slow side effects may remain a valuable later optimization, but it is broader than the smallest scheduler-safety repair needed to close the confirmed queue-growth risk.

## Executable evidence

Permanent Package 1 evidence lives in:

- `src/features/GameLoop/GameLoopAsyncTickBacklogPolicyContract.test.tsx`
- `.github/workflows/build-validation.yml`

Focused command:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
```

The suite verifies:

1. current production exceeds the selected one-tick producer-lead bound under a blocked async consumer;
2. the reference policy admits one tick from a large frame and keeps remaining work as logical accumulator time;
3. two 5-second intervals at 10 Hz can represent 100 exact logical ticks while producer lead never exceeds one and no tick objects queue;
4. complete deferred work drains in exact monotonic tick order with no drop/coalescing;
5. rejection releases the slot and later work continues;
6. pause excludes paused wall time and blocks new deferred admission until resume;
7. unmount prevents post-cleanup callback admission;
8. malformed/non-positive reference-model elapsed input cannot manufacture backlog;
9. executable rejection checks fail candidate snapshots that permit producer lead greater than one, queued tick objects, tick dropping, coalescing, or concurrent consumers.

The reference model is intentionally test-only. Passing it does not mean production already satisfies the policy.

## Package 2 authorization boundary

This contract authorizes a later **bounded production repair** only within these limits:

```text
Goal:
replace unbounded already-minted TickData backlog
with one-in-flight admission + deferred logical accumulator time
```

Package 2 may change the live `useGameLoop` scheduler/consumer coordination only as required to satisfy `SERIAL_BACKPRESSURE_V1`.

Package 2 must prove against real production seams that:

- producer lead never exceeds one;
- there is no per-tick queued-object backlog;
- every admitted logical tick keeps monotonic identity;
- no logical ticks are silently dropped or coalesced;
- async consumers never overlap;
- fulfillment and rejection both release the slot;
- large-frame deferred time drains deterministically;
- pause/resume excludes paused wall time;
- unmount starts no stale deferred work;
- existing regular/irregular/catch-up progression remains deterministic;
- Essence, Copy tasks, Player vitality, and timed Quest progression preserve equivalent logical-time results;
- timed Quest exact-once timeout/failure behavior remains intact;
- save/load and M21 offline boundaries remain unchanged;
- TypeScript, historical qualification, synthetic-review rejection checks, UI smoke, and production build remain green.

## Explicit non-authorizations

This Package 1 contract does **not** authorize:

- changing production `useGameLoop` in this package;
- changing the default tick rate;
- changing game speed;
- max-frame clamping;
- Page Visibility or browser-background policy;
- tick dropping/skipping;
- tick coalescing;
- concurrent async consumers;
- cancellation of arbitrary in-flight consumer side effects;
- accumulator persistence;
- save-schema changes or migrations;
- offline live-loop replay;
- widening M21;
- offline timed-Quest progression;
- reward, regeneration, Quest-duration, progression-curve, or balance changes;
- production credentials or live external calls;
- deployments or destructive migrations;
- claims about real-device responsiveness/performance;
- human pacing, fairness, comprehension, enjoyment, retention, Product Direction, or M26.

## Decision

```text
ASYNC TICK BACKLOG POLICY
= SERIAL_BACKPRESSURE_V1
= BACKLOG_POLICY_AUTHORIZED

PRODUCTION REPAIR
= NOT IMPLEMENTED IN PACKAGE 1
= AUTHORIZED ONLY FOR PACKAGE 2 WITH FULL QUALIFICATION
```

This checkpoint closes the policy-selection question while preserving the distinction between an executable design contract and a production implementation.
