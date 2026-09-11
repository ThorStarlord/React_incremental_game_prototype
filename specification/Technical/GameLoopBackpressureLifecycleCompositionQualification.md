# GameLoop Backpressure + Lifecycle Composition Qualification

**Work package:** Compose Backpressure + Lifecycle Stack  
**Zone:** `REPOSITORY_ONLY + HERMETIC_VALIDATION`  
**Base:** current `main` at `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Source authorities:** PR #91 policy, PR #92 production repair, PR #93 lifecycle policy  
**Production scope:** bounded async GameLoop backlog repair from PR #92 only

## Purpose

This package removes the integration gap between three independently-qualified candidates that were all branched from the same pre-integration `main`.

The composed contract is:

```text
SERIAL_BACKPRESSURE_V1
+
FRESH_LOOP_RESET_V1
```

That means live logical milliseconds remain in the fixed-step accumulator until one async consumer admission slot is available, while accumulator remainder remains transient scheduling-epoch state across lifecycle boundaries.

## Composition rules

The candidate preserves the PR #92 production repair:

- at most one unresolved Promise-returning `onTick` consumer is admitted;
- excess logical milliseconds stay in the accumulator rather than an allocated TickData FIFO;
- scheduler state advances only for admitted fixed steps;
- synchronous catch-up retains exact fixed-step execution;
- fulfillment and rejection release the admission slot;
- pause blocks deferred admission and rejects paused wall time;
- unmount cannot start stale deferred callbacks.

The candidate also preserves the PR #93 lifecycle contract:

| Boundary | Remainder | Wall-time replay |
| --- | --- | --- |
| continuous live execution | preserve | live time only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

No accumulator persistence or save migration is introduced.

## Integration adjustment

`GameLoopAsyncTickBacklogPolicyContract.test.tsx` originated as a pre-repair policy checkpoint and intentionally asserted that old production exceeded the selected bound. In this composed candidate that single historical incompatibility assertion is promoted into a post-repair regression:

```text
1,000 ms at 10 Hz with tick 1 consumer unresolved
-> currentTick = 1
-> one entered callback
-> zero already-minted queued tick identities behind it
```

The reference-model and negative/rejection tests remain unchanged in meaning: producer lead above one, queued TickData objects, dropped ticks, coalesced ticks, and concurrent async consumers remain forbidden.

The original policy document remains as the historical decision record; references in it to the pre-repair production mismatch describe the Package 1 policy-selection state, not the composed candidate.

## Hermetic qualification

The candidate Build Validation workflow permanently includes all three package-specific authorities together:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopBoundedBacklogControlRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
```

It also retains repository rejection/action-binding checks, localhost synthetic UI smoke, TypeScript, GameLoop timing characterization, cross-progression determinism, timed-Quest unit and integration qualification, live/offline boundaries, M20-M25 qualification, historical regressions, accumulated baseline qualification, and production build.

The lifecycle preflight exercises the real repaired `useGameLoop` together with representative Essence, Copy, Player, Quest, persistence, pause/resume, restart, and remount seams. Therefore its result on this candidate is composition evidence rather than a replay of the isolated PR #93 tree.

## Negative / rejection boundaries

This package does not authorize:

- tick dropping, skipping, or coalescing;
- concurrent async tick consumers;
- persistence of accumulator remainder;
- save-schema changes or migrations;
- replay of paused or arbitrary offline wall time through the live scheduler;
- widening M21 offline authority;
- offline timed-Quest progression;
- max-frame/background policy changes;
- tick-rate or game-speed policy changes;
- progression, reward, regeneration, Quest-duration, or balance changes;
- production credentials, live external service calls, deployment, or destructive migration;
- human pacing, fairness, responsiveness, comprehension, enjoyment, retention, Product Direction, or M26 claims.

## Merge authority

Repository/hermetic correctness is established only by Build Validation on the exact composed candidate head. The separate Gemini AI Code Review credential remains external authority; this package does not repair, replace, expose, or bypass credentials and does not weaken the standing all-configured-CI merge rule.

## Checkpoint

```text
BACKPRESSURE_LIFECYCLE_COMPOSITION
= CANDIDATE_CREATED
= SERIAL_BACKPRESSURE_V1 PRESERVED
= FRESH_LOOP_RESET_V1 PRESERVED
= MERGE ONLY AFTER EXACT-HEAD ALL-CI SUCCESS
```
