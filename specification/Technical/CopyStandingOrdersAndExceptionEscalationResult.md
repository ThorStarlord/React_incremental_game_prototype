# Copy Standing Orders and Exception Escalation

**Status:** CURRENT AUTHORITY — REPOSITORY-IMPLEMENTED / HUMAN-UNVALIDATED  
**Evidence class:** DETERMINISTIC_FINDING + bounded product-direction implementation  
**Scope:** Campaign One earned delegation / mastery compression  
**Supersedes only:** the blanket prohibition on all automatic Copy task chaining. Generic queues, autonomous planning, offline chaining, and irreversible decision delegation remain outside 1.0.

## Purpose

Extend the existing earned-delegation loop from one-shot task assignment into one bounded standing-responsibility vertical slice without creating a generic automation framework.

The product loop is now:

```text
player personally learns a routine
-> player authorizes a standing responsibility
-> a qualified Copy may start one bounded unit of known work on a later live tick
-> normal known work completes without interrupting the player
-> an out-of-policy anomaly becomes a durable Copy Exception
-> notification + Player Insight return that anomaly to player attention
-> only a player-owned authored resolution may close the exception
-> the standing responsibility may resume
```

This is the first concrete implementation of mastery compression as attention compression rather than merely passive resource generation.

## Authority model

The implementation deliberately keeps four different authorities separate:

```text
PlayerState.routineFamiliarity
  -> personal mastery / right to delegate

Copy.routinePriority + Copy.standingOrders
  -> player-authored policy and arbitration

Copy.activeTask
  -> one concrete execution instance

copy.exceptionsById
  -> durable evidence that routine authority ran out
```

No layer silently substitutes for another.

### Personal mastery

`PlayerState.routineFamiliarity` remains unchanged. A standing order cannot exist until the player has personally earned Archive Verification familiarity.

### Priority

`Copy.routinePriority` remains the single ordered routine-priority authority. Standing Orders do not add a second priority number.

### Execution

`CopyTask` remains the one-active-task execution object. It gains typed provenance through `CopyTask.origin`, including `standing_order` plus an authored work-item subject.

### Exceptions

A Copy Exception is persistent gameplay state, not a notification. Dismissing or acknowledging the alert cannot resolve the underlying anomaly.

## Bounded v1 standing-order contract

Campaign One v1 qualifies exactly one standing condition:

```ts
{
  type: 'archive_verification_backlog',
  targetPending: 0
}
```

Only `archive_verification` may currently receive a standing order.

The implementation deliberately does **not** introduce:

- an arbitrary condition/effect DSL;
- script callbacks in task definitions;
- behavior trees;
- a general Copy planner;
- player-authored arbitrary Redux actions;
- Copy travel/pathfinding;
- autonomous narrative, faction, relationship, world-state, or quest decisions;
- offline standing-order selection.

## Archive procedural work

The first slice adds a bounded Copy-owned procedural work queue:

```text
ArchiveVerificationCase
  status: pending | in_progress | verified | escalated
  classification: routine | source_contradiction
```

This queue means "procedural verification work remains to be performed." It does **not** become authority for objective truth. Knowledge, Relationship, Faction, World State, and authored story consequences retain their existing ownership.

Campaign One feeds two authored Chapter 6 events into the queue:

1. `elara_gc08_exp_network_diagnosis`
   -> routine Archive verification case.
2. `elara_gc08_exp_diagnostic_preparation`
   -> source-contradiction Archive case.

The later player-owned `lyra_gc08_exp_commit_diagnostic` commitment resolves the bounded contradiction exception. Merely acknowledging the exception does not.

## Live deterministic execution

Production order in `App.tsx` is:

```text
processPassiveGenerationThunk(deltaTime)
-> processCopyGrowthThunk(deltaTime)
-> processCopyLoyaltyDecayThunk(deltaTime)
-> processCopyTasksThunk(deltaTime)
-> processCopyStandingOrdersThunk()
-> processResonanceLevelThunk()
-> ...
```

Standing-order evaluation occurs **after** active-task completion.

This establishes the no-leftover-delta rule:

```text
task A completes during tick N
-> standing order may start task B later in tick N
-> task B starts at progress 0
-> task B receives no time from task A's completion delta
-> task B first progresses on tick N+1
```

The evaluator:

- processes Copy ids in stable lexical order;
- processes each Copy's normalized `routinePriority`;
- starts at most one new task per Copy per admitted fixed tick;
- orders pending work by `createdAtTick`, then stable id;
- calls the existing `startCopyProductionTaskThunk` for final eligibility enforcement;
- never dispatches arbitrary authored effects itself.

Existing maturity, loyalty, role, location, mastery, and one-active-task requirements therefore remain authoritative.

## Exception model

The first exception context is:

```ts
{
  code: 'archive_source_contradiction',
  archiveCaseId: string,
  conflictingSourceIds: string[]
}
```

A source contradiction follows this path:

```text
standing Archive task finishes
-> authored case is classified as source_contradiction
-> no normal task reward or role completion bonus is granted
-> case becomes escalated
-> durable CopyException is recorded exactly once
-> active task clears
-> the Archive standing responsibility is blocked
-> other safe Copy responsibilities remain conceptually independent
```

The exception stores:

- Copy id;
- routine id;
- severity;
- open / acknowledged / resolved status;
- logical detection tick;
- game-time detection value;
- typed context;
- acknowledgement provenance;
- explicit resolution provenance.

The exception does not store an arbitrary callback or choose a story outcome.

## UX escalation

### Notification

`recordCopyException` produces one transient warning through the existing shared notification host.

The notification is not persistence authority.

### Player Insight

`selectOpenCopyExceptions` projects durable exceptions into a **Needs your judgment** section.

The player may acknowledge an open exception. The UI explicitly states that acknowledgement does not resolve it.

### Copy Detail

Archive Verification now exposes:

- Standing Order switch;
- pending authored verification count;
- current standing-order status;
- a visible pause explanation when an unresolved exception blocks that responsibility.

`Start Preferred` remains a separate one-shot action.

## Notification pressure

Normal standing-order starts and completions do not emit routine start/completion notifications.

This preserves player attention for:

- standing-order configuration;
- meaningful blockers;
- exceptions;
- player-owned decisions.

Manual and Start Preferred task notifications retain their existing behavior.

## Persistence

The new state is additive inside the existing persisted `copy` domain:

```text
Copy.standingOrders?
CopiesState.archiveVerificationCasesById?
CopiesState.exceptionsById?
```

All fields are optional for historical saves.

On `meta/replaceState`, Copy listener normalization supplies deterministic empty maps / standing-order maps when absent.

No new Redux root is introduced.

Notifications remain excluded from saves, while unresolved exceptions persist and regenerate their durable Player Insight presentation after load.

## Offline boundary

M21 behavior is unchanged:

```text
already-running authored task
-> may advance/complete during bounded offline settlement

idle Copy + standing order
-> does NOT select new work offline
```

Offline elapsed time cannot:

- start another standing task;
- iterate multiple work items;
- create new player mastery;
- make narrative/social/world decisions.

The first normal live tick after return may evaluate the standing policy.

## Scope revision

The prior Feature Scope Matrix prohibited "Automatic Copy task chaining" without distinction.

This implementation narrows that rule:

### CORE / authorized

```text
player-mastered authored routine
+ explicit standing authorization
+ typed condition-maintenance envelope
+ live fixed-tick evaluation
+ existing Copy eligibility
+ one task per Copy
+ exception escalation
```

### Still CUT / unauthorized

```text
generic task queues
arbitrary repeat loops
unbounded task chaining
autonomous strategic planning
Copy-authored priorities
irreversible decision delegation
offline standing selection/chaining
generic job/economy simulation
```

This revision follows explicit owner direction to deepen Mastery Compression while preserving the existing Campaign One product promise.

## Deterministic qualification

Dedicated command:

```bash
npm run copy-standing-orders:validate
```

The qualification covers:

- personal-mastery gate;
- reuse of existing routine priority;
- live automatic start;
- normal silent completion;
- normal authored reward behavior;
- no same-delta chaining;
- source-contradiction escalation;
- no reward on exception;
- exactly-once durable exception;
- acknowledge != resolve;
- standing responsibility blocked while exception remains unresolved;
- authored Campaign One work feed;
- player-owned authored resolution;
- save/load persistence of unresolved exception;
- transient notifications excluded from persistence.

Build Validation includes the dedicated command plus the existing GameLoop determinism/backpressure suites with the new live consumer stage.

## Evidence ceiling

Repository evidence can establish the state/runtime invariants above.

It does **not** establish that fresh players:

- understand Standing Orders without coaching;
- prefer them over manual assignment;
- find the exception frequency satisfying;
- perceive the automation as empowering rather than opaque;
- prefer the current notification hierarchy;
- find the Chapter 6 timing/pacing balanced.

Those remain human Beta questions.

## Extension rule

Do not generalize this implementation merely because the first slice exists.

A second standing responsibility such as Lattice Maintenance should reuse this architecture only when concrete Campaign One or later authorized content supplies:

1. a personally mastered procedure;
2. an objective bounded maintenance condition;
3. a clearly defined safe operating envelope;
4. at least one meaningful out-of-envelope exception;
5. a player-owned resolution path.

The governing rule remains:

> A Standing Order authorizes a Copy to repeatedly apply an already-understood method inside a bounded envelope. When reality exits that envelope, automation returns the problem to player attention.
