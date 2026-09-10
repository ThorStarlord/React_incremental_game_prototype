# GameLoop Async Catch-Up Backlog Safety Preflight

**Package:** Async Catch-Up Backlog Safety Preflight  
**Zone:** `HERMETIC_VALIDATION`  
**Production mechanics changed:** No  
**External authority required:** No

## Purpose

This preflight isolates one scheduler-safety question that is distinct from player-facing pacing and from wall-clock/offline policy:

> What happens when `useGameLoop` keeps producing fixed logical ticks while a Promise-returning `onTick` handler is still unresolved?

The current live loop intentionally separates two responsibilities:

```text
requestAnimationFrame / accumulator
-> dispatch GameLoop tick immediately
-> enqueue TickData for onTick
-> serialize Promise-returning onTick work through an internal FIFO queue
```

That serialization prevents overlapping `onTick` execution, but it also means scheduler production and callback consumption can progress at different rates.

This package characterizes that boundary only. It does not choose or implement a production backlog policy.

## Evidence harness

Permanent executable evidence lives in:

- `src/features/GameLoop/GameLoopAsyncCatchUpBacklogSafetyPreflight.test.tsx`
- `.github/workflows/build-validation.yml`

Run directly with:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncCatchUpBacklogSafetyPreflight.test.tsx
```

The harness uses an in-memory `requestAnimationFrame` controller plus controlled `performance.now()` values. It does not use network access, credentials, external services, deployment, destructive migration, or production environment state.

## Characterized behavior

### 1. Scheduler state can advance ahead of unresolved async callback work

At the default 10 Hz cadence, ten regular 100 ms RAF frames generate ten logical fixed ticks even when tick 1's `onTick` Promise never resolves during that interval.

Observable result while the first callback is blocked:

```text
GameLoop currentTick = 10
completed/entered onTick callbacks = 1
queued-work gap = 9
```

Therefore backlog growth is not limited to a single giant RAF stall. Any sustained condition where callback completion is slower than scheduler production can increase the amount of pending callback work.

### 2. Catch-up bursts amplify the same gap

Two unpaused 5-second RAF gaps at 10 Hz produce 100 scheduler ticks while only the first async callback is entered if it remains unresolved.

Observable result before release:

```text
GameLoop currentTick = 100
entered onTick callbacks = 1
queued-work gap = 99
```

The current implementation contains no explicit queue-length cap, producer backpressure gate, coalescing rule, or tick-dropping rule.

This is a repository-level risk characterization, not a claim about how often such latency occurs on real devices.

### 3. Existing queue semantics are FIFO and serialized

After the blocking Promise resolves, already-produced ticks drain in monotonic FIFO order. The harness also verifies that the catch-up case never overlaps handler execution.

Current evidence therefore supports:

- one active Promise-returning `onTick` handler at a time;
- monotonic delivery of queued tick identities;
- no implicit coalescing of already-produced logical ticks;
- no implicit dropping of queued logical ticks while the hook remains mounted.

### 4. Rejection recovery remains live under backlog

If a queued async callback rejects, the loop logs:

```text
GameLoop onTick handler rejected
```

and continues draining subsequent queued logical ticks. One rejected callback does not deadlock the serialized queue.

This is a negative/rejection guarantee for queue liveness only. It does not assert that every consumer's side effects are transactionally recoverable after rejection.

### 5. Pause stops new scheduler intake but does not erase work already produced

When the loop is paused after five scheduler ticks have already been produced behind a blocked callback:

- a later paused RAF frame adds no new GameLoop ticks;
- the five already-produced callback items remain eligible to drain once the blocking Promise resolves.

This preserves the distinction between rejecting new paused wall-clock progress and discarding logical work that was produced before the pause.

### 6. Unmount clears queued backlog

If the hook unmounts while one async callback is active and additional logical ticks are queued, the queued callbacks are cleared. Resolving the already-active Promise afterward does not invoke stale queued handlers.

The active Promise itself is not canceled by `useGameLoop`; only queued local callback work is discarded during cleanup.

## Preflight conclusion

**Decision: `BACKLOG_RISK_CONFIRMED / NO_PRODUCTION_REPAIR_AUTHORIZED`**

The current queue protects against concurrent `onTick` execution and recovers from rejected Promises, but there is no explicit bound on the amount of callback work that can accumulate while the scheduler continues advancing.

The key architectural consequence is a potentially growing divergence between:

```text
scheduler logical tick position
and
onTick consumer completion position
```

This package intentionally does not decide whether that divergence is acceptable for production.

## What a future repair must decide explicitly

Any production repair should first select semantics rather than silently changing queue behavior. Candidate policy families include:

- scheduler backpressure while async callback work is outstanding;
- a bounded queue with an explicit overflow rule;
- consumer-specific coalescing only where semantic equivalence is proven;
- restructuring slow or external work so per-tick deterministic state updates are not blocked by asynchronous side effects.

These are design alternatives, not authorizations from this preflight.

A future repair must separately demonstrate how it preserves or deliberately changes:

- logical-time determinism;
- per-tick ordering;
- exact-once or at-least-once consumer semantics where relevant;
- same-frame catch-up behavior;
- pause/resume behavior;
- save/load and M21 offline boundaries;
- failure/rejection behavior;
- unmount/remount cleanup.

## Explicit non-authorizations

This package does **not** authorize:

- changing the default 10 Hz tick rate;
- changing `gameSpeed` semantics;
- adding a maximum RAF/catch-up frame clamp;
- dropping, skipping, or coalescing logical ticks;
- allowing concurrent `onTick` execution;
- canceling in-flight consumer Promises;
- replaying offline wall-clock absence through the live GameLoop;
- widening M21 offline progression authority;
- changing timed-Quest, Player, Copy, Essence, or relationship progression semantics;
- changing save schemas or performing migrations;
- adding production credentials or live external calls;
- making pacing, fairness, responsiveness, performance, enjoyment, retention, Product Direction, or M26 claims.

## Merge qualification

The package is repository-qualified only when the exact candidate head passes the repository's Build Validation workflow, including:

- synthetic-review rejection/action-binding validation;
- localhost UI smoke;
- TypeScript type checking;
- this dedicated backlog preflight;
- existing GameLoop/progression/Quest/live-offline qualification;
- M20-M25 and historical regression suites;
- production build.

A separate externally credentialed review workflow, if present, remains outside this package's authority. Under an all-CI merge rule, a failure in that workflow still blocks automatic merge even if this hermetic package passes repository validation.
