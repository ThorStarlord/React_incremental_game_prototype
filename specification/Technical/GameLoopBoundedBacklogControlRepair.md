# GameLoop Bounded Backlog Control Repair

**Package:** Bounded Backlog Control Repair & Integration Qualification  
**Zone:** `REPOSITORY_ONLY` + `HERMETIC_VALIDATION`  
**Target checkpoint:** `BACKLOG_CONTROL_REPAIR_QUALIFIED`  
**Policy authority:** `SERIAL_BACKPRESSURE_V1` from Package 1 / PR #91  
**Production credentials or external services:** none

## Purpose

The prior backlog-safety preflight demonstrated that the live scheduler could mint logical ticks faster than a Promise-returning `onTick` consumer could settle them, creating an unbounded FIFO of already-produced `TickData` objects. Package 1 then selected `SERIAL_BACKPRESSURE_V1`: defer logical milliseconds in the accumulator and permit at most one admitted/in-flight logical tick.

This package implements that bounded policy in production `useGameLoop` without changing gameplay formulas, tick-rate defaults, game speed, save schema, offline authority, Quest durations, rewards, or balance.

## Production change

The prior coordination model was:

```text
RAF elapsed time
-> accumulator
-> emit every available fixed step immediately
-> enqueue one TickData object per emitted step
-> serialize async callbacks later
```

The repaired model is:

```text
RAF elapsed time
-> accumulator
-> if no consumer is active, admit one fixed step
-> invoke onTick
-> if synchronous, the slot settles immediately and another complete step may be admitted
-> if Promise-returning, stop admission until fulfillment or rejection
-> keep all additional logical milliseconds in the accumulator
```

The production FIFO queue and `QueuedTick` allocation are removed.

## Required invariants

### One-tick producer lead

While an async consumer is unresolved, scheduler-authoritative state may contain only the single admitted logical tick. Additional complete fixed steps remain unadmitted accumulator time.

A 5,000 ms frame at 10 Hz with tick 1 blocked therefore reaches:

```text
currentTick = 1
totalGameTime = 100 ms
onTick calls = 1
logical time still deferred = 4,900 ms
```

A second 5,000 ms frame while the same consumer remains unresolved still leaves `currentTick = 1`; no second `TickData` object is allocated.

### No drop or coalescing

Backpressure changes *when* a fixed step becomes scheduler-authoritative, not *whether* it exists. Deferred logical time remains in milliseconds and later drains through ordinary fixed steps. Synchronous consumers therefore retain ordinary multi-step catch-up behavior, including 50 exact 100 ms ticks for a 5,000 ms frame at 10 Hz.

### Rejection liveness

A rejected async handler is logged through the existing error authority, releases the admission slot, and allows the next complete deferred fixed step to proceed. The rejected scheduler tick is not rewound or duplicated.

### Pause/resume

Pause continues to reject paused wall-clock time. If an already-admitted consumer settles while paused, no deferred tick is admitted. Pre-pause accumulator time remains available and resume may admit it immediately without waiting for another RAF callback.

### Unmount

Unmount prevents an eventual settlement of an already-active Promise from starting stale deferred callbacks. The in-flight Promise itself is not forcibly cancelled.

### Cadence transitions

Deferred time remains logical milliseconds. If the tick rate changes while an async consumer is active, the next admission uses the currently-authoritative fixed-step width, preserving the existing accumulator-threshold model rather than creating a second queue or persistence representation.

## Qualification evidence

Focused production-seam evidence lives in:

- `src/features/GameLoop/GameLoopBoundedBacklogControlRepair.test.tsx`
- `src/features/GameLoop/hooks/useGameLoop.timing-characterization.test.tsx`
- `.github/workflows/build-validation.yml`

The focused suite verifies:

- repeated large frames cannot advance beyond one unresolved admitted tick;
- async deferred work drains one admission at a time with peak concurrency one;
- rejection releases the slot;
- pause blocks deferred admission and excludes paused wall time;
- resume drains qualified pre-pause remainder;
- unmount starts no stale deferred work;
- synchronous catch-up preserves exact fixed-step count and monotonic identities;
- deferred accumulator time follows the current tick-rate threshold after a cadence change.

The existing Build Validation stack additionally checks cross-progression determinism, timed Quest behavior, live/offline authority, M20-M25 qualification, historical regressions, TypeScript, synthetic rejection/action binding, localhost UI smoke, and production bundling.

## Explicit non-authorizations

This repair does **not** authorize or implement:

- a maximum frame delta or browser-background cutoff;
- tick dropping, skipping, or coalescing;
- concurrent `onTick` execution;
- accumulator persistence or save-schema migration;
- a lifecycle-remainder decision across stop/start, remount, or save/resume;
- widening M21 offline progression;
- offline timed-Quest progression;
- tick-rate, game-speed, reward, regeneration, Quest-duration, or progression-curve changes;
- production credentials, live external calls, deployment, or destructive migration;
- claims about real-device performance, responsiveness, pacing, fairness, enjoyment, retention, Product Direction, or M26.

## Relationship to prior scheduler documentation

`GameLoopDeterministicLiveSchedulerRepair.md` remains authoritative for the stable RAF lifecycle, fractional accumulator preservation across ordinary rerenders, monotonic tick identity, and pause wall-time rejection. Its older description of an emitted-tick FIFO is superseded by this bounded-backpressure repair once this candidate is integrated.

## Merge qualification

The exact candidate head is merge-ready only if **every** configured pull-request workflow succeeds. Repository Build Validation can qualify the code and hermetic evidence, but an unrelated externally credentialed workflow failure remains an external-authority blocker under the standing all-CI merge rule.
