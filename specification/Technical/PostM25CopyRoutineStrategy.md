# Post-M25 Copy Routine Strategy

**Status:** REPOSITORY-ONLY / HERMETIC QUALIFICATION  
**Human product-value evidence:** UNPROVEN  
**Autonomous irreversible planning:** Not introduced

## Purpose

Deepen the incremental layer around the existing product thesis: Copies execute understood repetition while the player retains authority over novelty and irreversible decisions.

Each Copy may now store an optional ordered `routinePriority` containing only existing `CopyProductionTaskId` values.

```text
player authors ordered routine allowlist
-> invalid/duplicate ids fail closed
-> Start Preferred evaluates current M20 eligibility
-> first eligible approved routine is delegated
-> existing startCopyProductionTaskThunk owns execution
```

## Authority boundaries

The new strategy layer does not create a second task executor. It delegates to the existing M20 production-task thunk, preserving:

- player routine familiarity requirements;
- Copy maturity and loyalty gates;
- Copy role requirements;
- location requirements;
- role duration modifiers;
- the one-active-task invariant;
- existing allowlisted rewards.

The feature does not chain tasks automatically when one completes. Starting the preferred routine remains an explicit player action.

Unknown ids are removed from the stored priority and cannot become arbitrary timed-task execution.

## Persistence compatibility

`routinePriority` is optional on `Copy`, so historical save/state shapes remain valid. No new save root or schema authority is introduced.

## UI

The existing Copy detail panel now allows the player to:

- move an authored routine to top priority;
- remove a routine from the priority list;
- see the resulting ordered portfolio;
- explicitly start the first currently eligible preferred routine.

Direct manual `Assign` remains available.

## Evidence ceiling

Repository qualification can establish bounded selection, eligibility preservation, and one-active-task behavior. It cannot establish that players prefer priority management, understand it without coaching, or find the added delegation strategically satisfying.
