# Incremental Integration Repair — Preregistration

**Status:** PREREGISTERED — behavior changes not yet authorized beyond this bounded repair  
**Frozen baseline:** `main` = `88e83dab50eaf7b2ca50696f2c037686dafbe2af`  
**Frozen baseline tree:** `b25b7312aae9c9f1b2a73615f3394d35cc5ecfaf`  
**Trigger:** `CheckpointCIncrementalIntegrationResult.md` = `CHECKPOINT_C_WEAK`  
**Next milestone after repair:** fresh Checkpoint C rerun; **M22 remains unauthorized** until that fresh rerun passes.

---

## 1. Scientific / product question

> Can the existing M20/M21 incremental layer become a coherent extension of active RPG play by requiring genuine player familiarity before routine delegation and by making offline results visibly return player attention to the active game, without weakening player authority or expanding into generalized idle simulation?

The repair exists to close exactly the two seams recorded by Checkpoint C:

```text
ACTIVE PLAY -> AUTOMATION
missing earned routine-familiarity bridge

OFFLINE AUTOMATION -> RETURN TO ACTIVE PLAY
missing proven player-visible shared-notification bridge
```

The repair is not permission to broaden M20/M21 or begin M22.

---

## 2. Frozen product doctrine

```text
player actively experiences / understands an activity
-> that routine becomes familiar
-> player may deliberately delegate the routine to a qualified Copy
-> existing M20 live task authority executes it
-> existing M21 may continue an already-running task offline
-> player visibly sees what happened on return
-> attention returns to meaningful active RPG decisions
```

Meaningful or irreversible narrative/world decisions remain player authority.

---

## 3. Repair target R1 — earned routine familiarity

The two existing M20 production tasks are the mandatory Rule-of-Two probes:

1. `forge_assistance`
2. `resonance_calibration`

Before a player has established familiarity with the relevant routine:

- the task may be displayed as locked/unfamiliar;
- assignment must be rejected below the UI;
- existing Copy maturity/loyalty/role/location rules must not substitute for player familiarity.

After the relevant active experience:

- player familiarity becomes persisted progression knowledge;
- the existing M20 Copy eligibility rules still apply independently;
- an otherwise qualified Copy may be deliberately assigned the task.

### R1 acceptance criteria

For each of the two task IDs, qualification must prove:

```text
eligible Copy + unfamiliar player
-> assignment rejected

relevant player-driven active experience
-> familiarity recorded

same task + familiar player + qualified Copy
-> assignment accepted
```

The familiarity authority must be shared player/progression knowledge rather than a per-Copy shortcut unless recon demonstrates a stronger existing canonical owner.

Familiarity must survive ordinary save/load. A legacy or absent familiarity surface must fail safely rather than silently unlocking all production tasks unless recon discovers legitimate existing evidence from which familiarity can be deterministically derived.

Offline elapsed time by itself must not teach a routine.

---

## 4. Repair target R2 — player-visible shared notifications

M21 already dispatches its `While you were away: ...` summary through the shared Redux notification queue.

The repair must connect that shared queue to a mounted production UI surface.

### R2 acceptance criteria

Qualification must prove:

```text
shared addNotification(...)
-> notifications.items
-> mounted production renderer
-> message visible to player
```

and specifically:

```text
qualifying M21 load settlement
-> While you were away summary queued
-> same summary visibly rendered
```

The renderer must support bounded dismissal/removal through the existing shared notification authority.

The repair must not create an M21-specific duplicate notification store if the shared Redux queue can serve the requirement.

---

## 5. Combined integration acceptance criterion

The repair must include at least one behavioral proof spanning the composition, not only isolated unit tests:

```text
active player experience
-> routine familiarity
-> deliberate Copy assignment
-> task starts
-> save while task is running
-> bounded offline interval
-> load / M21 settlement
-> task advances or completes through existing authority
-> authored Gold/Essence consequence applies exactly once
-> shared return summary is visibly rendered
-> player can resume active play
```

The combined proof must preserve Relationship, Quest, Combat, travel and other player-owned narrative/world decision authority unless the active familiarity action itself already has an explicitly qualified ordinary consequence.

---

## 6. Required recon before implementation semantics are frozen

Inspect actual current authorities for:

- `CopyTaskDefinitions.ts`, Copy types/slice/selectors/thunks/UI;
- Player / Meta / other persisted progression surfaces;
- save schema, migration and default-state behavior;
- Exploration / City Center active world surfaces for the smallest real Forge familiarity source;
- Trait / Essence Resonance success authority for the smallest real Resonance familiarity source;
- `NotificationSlice.ts`, root store, `App.tsx`, `GameLayout.tsx`, local menu notifications and any existing shared notification consumers;
- current Build Validation gates.

If recon changes the appropriate owner or exact active-event source, freeze those decisions in a separate recon amendment **before behavior implementation**.

---

## 7. Falsification conditions

The repair is **not qualified** if any of the following is true:

1. a production task can still be assigned below the UI before the relevant active familiarity exists;
2. familiarity is granted merely by opening the Copy UI, waiting, loading a save, or satisfying Copy maturity/role/loyalty/location;
3. only one of the two existing production tasks demonstrates the shared familiarity contract;
4. familiarity does not survive ordinary save/load under the qualified path;
5. the M21 summary is written to state but is not demonstrably rendered by the production component tree;
6. the repair requires generalized task scripting, autonomous task selection, M22 social knowledge, or full offline GameLoop replay;
7. the combined active->automation->offline->return proof fails exact-once task/reward safety;
8. Relationship/Quest/narrative/world decision authority is newly automated by the repair;
9. accumulated Build Validation or production build regresses.

Any such result must be recorded rather than redefining the repair after the fact.

---

## 8. Explicit non-goals / evidence ceiling

This repair does **not** attempt to qualify:

- M22 Social Knowledge Propagation;
- faction reputation or generalized world state;
- generalized crafting or a full forge system;
- generalized activity-learning/task-discovery frameworks;
- autonomous Copy planning, task choice, queues, priorities or chaining;
- Copy travel/pathfinding/schedules;
- new offline consumers;
- offline Combat, Quests, Relationships, dialogue or travel;
- final Gold/Essence balance, retention, pacing or enjoyment;
- anti-cheat/server-authoritative time;
- rich notification centers, channels, deep links or notification analytics.

The smallest sufficient repair is preferred.

---

## 9. Qualification workflow

```text
freeze baseline
-> preregister repair
-> recon current authorities
-> freeze recon amendment if needed
-> implement smallest Rule-of-Two familiarity proof
-> implement shared notification renderer
-> add focused repair qualification + combined composition proof
-> preserve prior M20/M21/active-loop/historical gates
-> freeze first complete behavioral SHA/tree
-> exact-head Build Validation
-> record repair result + evidence ceiling
-> reconcile current canon
-> exact-head documentation-complete Build Validation
-> expected-head merge
-> verify integrated tree/parents
-> do not claim merge-SHA CI unless a merge-commit workflow actually exists
-> stop before fresh Checkpoint C implementation work
```

A successful repair does **not** itself authorize M22. Only a subsequently merged fresh `CHECKPOINT_C_PASS` may do so.
