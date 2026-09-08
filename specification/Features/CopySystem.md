# Copy System Specification

**Implementation Status:** ✅ **CORE COPY RUNTIME + TRAIT SHARING + BOUNDED M20 AUTOMATION + M21 OFFLINE CONTINUATION + CHECKPOINT-C FAMILIARITY REPAIR QUALIFIED**

> Current qualified build summary:
> - Copy state/thunks cover creation, growth, loyalty decay/bolster, accelerated growth, role assignment, Trait inheritance/sharing, and one active task per Copy.
> - M20 qualifies exactly two authored routine production tasks: **Forge Assistance** and **Resonance Calibration**.
> - The Checkpoint-C Incremental Integration Repair adds player-owned routine familiarity as a prerequisite to delegating those tasks.
> - Forge familiarity is earned by a one-time active City Center Forge Assistance practice; Resonance Calibration familiarity is earned only by a successful active Trait Resonance.
> - Familiarity is enforced below the UI by `startCopyProductionTaskThunk`; Copy maturity/loyalty/role/location requirements remain independent.
> - M21 may advance or complete an already-running authored Copy task during bounded offline settlement, but never selects or chains a new task.
> - Meaningful/irreversible narrative decisions remain player-owned.

**Implementation location:** `src/features/Copy/` (singular), stored under Redux key `copy`.

For current empirical authority, read:

- `../Technical/M20ProductionCopyTaskAutomation.md`
- `../Technical/M20ProductionCopyTaskAutomationReconAmendment.md`
- `../Technical/M20ProductionCopyTaskAutomationResult.md`
- `../Technical/M21BoundedOfflineProgressResult.md`
- `../Technical/CheckpointCIncrementalIntegrationResult.md` — historical first `CHECKPOINT_C_WEAK`;
- `../Technical/IncrementalIntegrationRepair.md`
- `../Technical/IncrementalIntegrationRepairReconAmendment.md`
- `../Technical/IncrementalIntegrationRepairResult.md` — qualified repair.

A repair PASS does not itself make Checkpoint C PASS. A fresh checkpoint rerun remains required before M22.

---

## 1. Product role

Copies are extensions of the player's will and Essence, created from NPC-derived source material and later managed as distinct entities with maturity, loyalty, role, Traits, descriptive/canonicalizable location data, and at most one active task.

The repaired product doctrine is:

```text
player actively experiences / understands an activity
-> activity becomes a familiar routine
-> player may deliberately delegate that routine
-> a qualified Copy executes it
-> ordinary consequence returns to the existing RPG economy
```

while:

```text
meaningful / irreversible narrative or world decision
-> remains player authority
```

The Copy system is therefore a compression layer for already-understood routine execution, not an autonomous story-playing agent.

---

## 2. Creation

The current creation path uses `createCopyThunk`.

- target NPC must exist;
- creation spends the current Essence cost derived from connection depth plus accelerated-growth surcharge where selected;
- the existing Charisma-based success roll determines success;
- a successful Copy receives independent stats, maturity, loyalty, inherited Traits, role/task state, and the target NPC's current descriptive location value;
- Trait-slot structure is initialized/reconciled through the existing Copy machinery.

The Checkpoint-C repair does not redesign Copy creation.

### 2.1 Location note

Copy creation still inherits `npc.location`, so older/demo state can contain human-readable values.

Where an authored production task needs location, M20 reuses M18 `resolveCanonicalLocationId(...)`. Forge Assistance therefore accepts legacy `"City Center"` because it resolves to `location_city_center`.

The system still does **not** qualify Copy travel/pathfinding or a generalized Copy-presence simulation.

---

## 3. Traits on Copies

### 3.1 Inherited Traits

At creation, a Copy snapshots a bounded inherited set informed by its parent NPC.

### 3.2 Shared Traits

The player may share currently equipped, non-permanent Traits into unlocked Copy Trait slots.

Rules include:

- source Trait must be equipped by the player;
- permanent player Traits are not shareable;
- inherited/shared duplicates are rejected;
- an unlocked empty slot is required;
- player preferences may be stored and applied to available slots.

### 3.3 Auto-unshare

Listener middleware removes a shared Trait when the player unequips/replaces it or makes it permanent through Resonance.

This keeps Copy sharing subordinate to Player Trait authority.

---

## 4. Growth and loyalty

| Mode/mechanic | Current behavior |
|---|---|
| Normal maturity growth | live GameLoop delta-time |
| Accelerated maturity growth | normal growth × current accelerated multiplier |
| Loyalty decay | live GameLoop delta-time |
| Loyalty bolster | player spends Essence |
| Accelerated promotion | player spends Essence |

The repair does not alter the historical growth or loyalty-decay formulas.

M21 does not process general Copy growth or loyalty decay offline; only an already-running M20 production task is on the offline allowlist.

---

## 5. Passive Essence contribution

Mature/loyal Copies may contribute to passive Essence through the pre-existing Copy/Essence qualification model.

This is distinct from the **one-shot M20 Resonance Calibration reward**. Completing that task grants its authored +8 Essence reward; it does not redefine the passive contribution formula.

---

## 6. Roles

Current roles:

```text
none
infiltrator
researcher
guardian
agent
```

Role assignment is player-controlled.

### 6.1 Duration modifiers

M20 reuses existing role duration modifiers:

- infiltrator: `0.90x`;
- researcher: `0.95x`;
- guardian: `1.05x`;
- agent: `1.00x`;
- none: `1.00x`.

Qualified examples:

```text
Forge Assistance + guardian
60s * 1.05 -> 63s

Resonance Calibration + researcher
90s * 0.95 -> 86s rounded
```

### 6.2 Completion bonuses

Existing role completion flavor remains separate from authored production rewards:

- infiltrator: +2 loyalty;
- researcher: +1 maturity;
- guardian: +1 loyalty;
- agent: +1 loyalty and +0.5 maturity;
- none: no role bonus.

---

## 7. Player-owned routine familiarity

The Checkpoint-C repair introduces an optional player-owned familiarity map for exactly the two current production routines:

```text
PlayerState.routineFamiliarity
  forge_assistance?
  resonance_calibration?
```

Each record stores:

```text
source
learnedAt
```

The current bounded sources are:

```text
forge_assistance
-> city_center_forge_assistance

resonance_calibration
-> trait_resonance
```

This state answers:

```text
Has the player personally established enough understanding to delegate this routine?
```

It does **not** answer:

```text
Can this particular Copy perform it?
```

Those authorities compose rather than replace one another.

### 7.1 Forge familiarity

Forge Assistance familiarity is earned by the player through one explicit active City Center interaction exposed on the Exploration `TravelPanel`:

```text
player at location_city_center
-> Practice Forge Assistance
-> +5 Gold once
-> forge_assistance familiarity
```

The thunk rejects outside City Center and rejects after familiarity already exists. Travel to City Center alone is insufficient evidence.

The +5 Gold amount is a bounded proof value; no final economy-balance claim is made.

### 7.2 Resonance Calibration familiarity

Calibration familiarity is recorded only after a successful active `acquireTraitWithEssenceThunk` has passed the existing Trait Resonance gates and committed permanent acquisition:

```text
successful Trait Resonance
-> resonance_calibration familiarity
```

Failed or merely attempted Resonance does not teach the routine.

### 7.3 Persistence

The familiarity map lives in Player state and therefore persists through the existing full-RootState save envelope.

The field is optional for backward compatibility. If an older/current-schema save lacks it:

```text
absence -> unfamiliar
```

Offline time itself does not create familiarity.

---

## 8. M20 production task catalog

The catalog lives in `CopyTaskDefinitions.ts` and remains a positive allowlist, not a generalized effect/task scripting engine.

The bounded definition includes:

```ts
CopyProductionTaskDefinition {
  id
  name
  description
  familiarityHint
  baseDurationSeconds
  minimumMaturity?
  minimumLoyalty?
  allowedRoles?
  requiredLocationId?
  reward: {
    gold?
    essence?
  }
}
```

No arbitrary Redux-action array, callback, behavior tree, planner, narrative-decision payload, or general task DSL is qualified.

### 8.1 Forge Assistance

```text
id: forge_assistance
base duration: 60s
player familiarity: required
minimum maturity: 50
allowed roles: guardian | agent
required Copy location: location_city_center
reward: +15 Gold
```

### 8.2 Resonance Calibration

```text
id: resonance_calibration
base duration: 90s
player familiarity: required
minimum maturity: 75
minimum loyalty: 55
allowed roles: researcher | agent
reward: +8 Essence
```

No Copy location requirement is authored for Calibration because generalized Copy movement/presence remains unqualified.

---

## 9. Assignment authority

`startCopyProductionTaskThunk({ copyId, taskId })` remains the production assignment authority.

It rejects before task mutation when:

- task ID is unknown;
- Copy is missing;
- Copy already has a running task;
- player familiarity for the authored routine is absent;
- maturity/loyalty requirement is unmet;
- role requirement is unmet;
- authored canonical Copy-location requirement is unmet.

The Copy UI consumes the same familiarity state and the same task-eligibility helper.

The UI keeps unfamiliar tasks visible and explains how the player must learn them, rather than silently hiding them.

The legacy arbitrary-duration `startCopyTimedTaskThunk(...)` is not a production assignment path and rejects with guidance to choose an authored task.

---

## 10. Active task lifecycle

One Copy may have one active task.

Persisted task identity includes:

```text
id
type
productionTaskId
durationSeconds
progressSeconds
status
startedAt
```

Live GameLoop processing calls:

```text
processCopyTasksThunk(deltaTime)
```

For a valid authored production task:

```text
progress reaches duration
-> resolve productionTaskId
-> apply existing role completion bonus
-> apply authored Gold/Essence reward
-> shared notification
-> clear activeTask
```

Unknown/legacy task state may finish its timer but receives no M20 production reward.

Clearing `activeTask` after completion supplies the existing exact-once replay control.

---

## 11. Save/load and M21 offline continuation

The canonical save system serializes the complete RootState, including:

- `player.routineFamiliarity` when present;
- `copy.activeTask` and `productionTaskId`.

M20 qualifies live mid-task save/load continuation.

M21 later qualifies bounded offline settlement for an **already-running** M20 task:

```text
saved running task
+
bounded elapsed time
-> task progress or one completion
```

M21 never:

- assigns a task;
- chooses between tasks;
- queues another task;
- repeats excess elapsed time into a second task;
- learns unfamiliar routines;
- processes general Copy growth/loyalty decay offline.

The repaired combined qualification proves:

```text
active Forge learning
-> deliberate Forge assignment
-> save with running task
-> load
-> 60s M21 settlement
-> Forge completes
-> +15 Gold once
-> task clears
-> visible While you were away summary
```

Relationship, Quest and canonical player-location state remain unchanged across that offline settlement probe.

---

## 12. Player-facing management

The Copy detail UI includes:

- maturity/loyalty progress;
- role assignment;
- current Copy location label;
- authored Production Delegation cards;
- routine familiarity status;
- active-learning instruction when unfamiliar;
- Copy-specific eligibility reasons;
- base duration/reward;
- disabled assignment while busy/ineligible;
- active task/progress;
- Trait sharing preferences;
- effective Traits.

Current delegation copy states the boundary directly: the player must experience a routine before delegating repeatable execution, while narrative/irreversible decisions remain player authority.

---

## 13. Narrative authority boundary

The production catalog has no representation for choosing:

- Quest endings;
- major dialogue responses;
- Relationship interpretation/redefinition;
- betrayal/exposure decisions;
- alliance/faction alignment;
- irreversible political/social decisions.

An arbitrary ID such as `choose_quest_ending` remains rejected because it is not an authored production task.

M20 tests preserve Relationship and Quest state across qualified task completion. M21 and the Checkpoint-C repair preserve narrative/world decision authority across offline settlement.

---

## 14. Current implementation summary

| Feature | Status | Notes |
|---|---|---|
| Copy CRUD/batch update | Implemented | existing Redux authority |
| Growth | Implemented | live delta-time |
| Loyalty decay | Implemented | live delta-time; historical formula preserved |
| Creation | Implemented | Essence cost + current Charisma roll |
| Bolster loyalty | Implemented | Essence spend + clamp |
| Accelerated growth | Implemented | creation/promotion paths |
| Roles | Implemented | duration + completion flavor |
| Trait inheritance/sharing | Implemented | slots/preferences/auto-unshare |
| Passive Essence contribution | Implemented/partial-balance | existing threshold model |
| Production catalog | **M20 PASS** | exactly two authored tasks |
| Routine familiarity prerequisite | **Repair PASS** | player-owned Rule-of-Two |
| Forge active learning | **Repair PASS** | City Center, +5 Gold once |
| Calibration active learning | **Repair PASS** | successful Trait Resonance |
| Below-UI familiarity enforcement | **Repair PASS** | assignment thunk authority |
| Live task progression/reward | **M20 PASS** | deterministic, exact-once |
| Mid-task save/load | **M20 PASS** | RootState persistence |
| Bounded offline task continuation | **M21 PASS** | already-running task only |
| Visible offline return summary | **Repair PASS** | shared notification host |
| Copy travel/autonomous movement | Not qualified | outside current boundary |
| Autonomous/strategic delegation | Not qualified | outside current boundary |
| Social knowledge | Future | M22 remains unauthorized pending fresh Checkpoint C PASS |

---

## 15. Current constants

`COPY_SYSTEM` remains the authority for current growth/loyalty/slot tuning, including:

| Constant | Current value |
|---|---:|
| `GROWTH_RATE_PER_SECOND` | 0.1 |
| `ACCELERATED_GROWTH_MULTIPLIER` | 2 |
| `DECAY_RATE_PER_SECOND` | 0.05 |
| `BOLSTER_LOYALTY_COST` | 25 |
| `BOLSTER_LOYALTY_GAIN` | 10 |
| `ESSENCE_GENERATION_BONUS` | 0.2 |
| `MATURITY_THRESHOLD` | 100 |
| `LOYALTY_THRESHOLD` | 50 |
| `PROMOTE_ACCELERATED_COST` | 150 |
| `MAX_TRAIT_SLOTS` | 4 |

The older global `COPY_SYSTEM.TASK_REWARDS` value remains legacy tuning; authored M20 production rewards live in `CopyTaskDefinitions.ts`.

---

## 16. Evidence ceiling / next boundary

The current Copy/automation evidence does **not** qualify:

- generalized routine-learning/activity discovery;
- additional production task IDs beyond the current two;
- generalized crafting/manual production systems;
- autonomous task choice/planning;
- task queues/priorities/chaining;
- task failure/risk simulation;
- team Copy tasks;
- Copy travel/pathfinding/schedules;
- generalized Copy presence;
- new offline consumers;
- offline narrative progression;
- social knowledge propagation;
- faction reputation;
- generalized world state;
- economy balance or human enjoyment at scale.

The required next sequence is:

```text
Checkpoint C first evaluation: WEAK
-> Incremental Integration Repair: PASS
-> merge repair
-> fresh Checkpoint C rerun
-> only CHECKPOINT_C_PASS may authorize M22
```

**Revision:** Reconciled through the qualified Checkpoint-C Incremental Integration Repair; M22 remains unauthorized pending a fresh checkpoint PASS.
