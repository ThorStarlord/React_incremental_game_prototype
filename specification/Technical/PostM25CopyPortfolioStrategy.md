# Post-M25 Copy Portfolio Strategy

**Status:** `REPOSITORY_ONLY / HERMETIC_VALIDATION`  
**Human product-quality evidence:** `UNPROVEN`  
**Autonomous narrative judgment delegated:** No

## Purpose

Extend earned delegation from one-Copy-at-a-time task assignment into a player-controlled portfolio decision surface without changing the M20 production-task authority.

The player may prepare several explicit assignments and start them together:

```text
player chooses Copy A -> authored routine X
player chooses Copy B -> authored routine Y
player chooses Copy C -> leave available
```

Copies do not choose tasks, narrative routes, targets, irreversible actions, or objectives.

## Existing authority preserved

Each assignment still uses the existing allowlisted `COPY_PRODUCTION_TASKS` catalog and the same eligibility dimensions:

- player Routine Familiarity;
- Copy maturity;
- Copy loyalty;
- Copy role;
- required Copy location;
- at most one running task per Copy.

`getCopyProductionTaskDurationSeconds` centralizes the existing role-adjusted duration semantics for the single-assignment and portfolio surfaces.

## Whole-plan preflight

`evaluateCopyPortfolioPlan` checks the complete submitted plan before any task assignment is dispatched.

The plan is rejected if it contains:

- zero assignments;
- a duplicate Copy;
- an unknown Copy;
- an unknown production task;
- a Copy that already has a running task;
- any failed existing production-task eligibility rule.

A rejected plan creates no new Copy assignments.

## Strategy surface

`CopyPortfolioPanel` shows:

- active / total Copy capacity;
- currently available Copies;
- current running task per Copy;
- authored production-task choices and existing eligibility reasons;
- an explicit `Leave available` option;
- one `Start selected portfolio` action.

The UI does not rank or recommend tasks. Allocation remains player-authored.

## State model

No new portfolio save root or persistent plan state is introduced. The local unsubmitted selection exists only in component state; committed work remains represented by the existing `Copy.activeTask` authority.

This avoids a second assignment state machine:

```text
local draft allocation
        |
whole-plan preflight
        |
existing Copy.activeTask state
```

## Qualification

`src/features/Copy/CopyPortfolioStrategyQualification.test.ts` verifies:

1. duplicate-Copy and unknown-task plans reject;
2. a failed whole-plan preflight causes no partial assignment;
3. one explicit player submission can start two different allowlisted tasks;
4. each Copy still has only one active task;
5. capacity / task-eligibility selectors remain descriptive rather than recommendatory;
6. the portfolio UI requires explicit player selections and is mounted on Copy Management.

The existing M20 production automation qualification remains authoritative for task completion rewards and tick integration.

## Evidence ceiling

This package establishes deterministic portfolio validation and assignment behavior. It does not establish that players enjoy the added allocation decision, understand the UI, prefer a particular Copy count, experience satisfying optimization, or perceive delegation as mastery rather than loss of agency.