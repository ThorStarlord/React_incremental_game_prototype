# Copy System Specification

**Implementation Status:** ✅ **CORE STATE/UI + TRAIT SHARING AUTO-SYNC + BOUNDED M20 PRODUCTION AUTOMATION IMPLEMENTED**

> Current qualified build summary:
> - Slice + thunks for growth, decay, creation, loyalty bolster, accelerated growth, role assignment, and task progress are implemented.
> - Copy Trait slots, sharing preferences, and automatic unshare on player unequip/replace/permanence are implemented.
> - Mature/loyal Copies contribute to passive Essence through the existing Copy/Essence selectors.
> - M20 qualifies two authored repeatable production tasks through the existing `activeTask` lifecycle: **Forge Assistance** and **Resonance Calibration**.
> - Production task assignment validates authored requirements below the UI, progresses through the live GameLoop, survives ordinary save/load, and applies bounded rewards once.
> - Meaningful irreversible narrative decisions remain player-owned; M20 does not qualify autonomous-agent gameplay or offline progress.

**Implementation location:** `src/features/Copy/` (singular), stored under the Redux `copy` key.

For empirical authority, read:

- `../Technical/M20ProductionCopyTaskAutomation.md` — preregistered M20 contract;
- `../Technical/M20ProductionCopyTaskAutomationReconAmendment.md` — frozen recon/probe decisions;
- `../Technical/M20ProductionCopyTaskAutomationResult.md` — qualified M20 result and evidence ceiling.

---

## 1. Overview

**Concept:** Copies are extensions of the player's will and Essence, created through the Copy-creation interaction and later managed as distinct entities with maturity, loyalty, role, Traits, location data, and one active task at a time.

The current broad lifecycle is:

```text
Target
-> Copy creation
-> growth / loyalty management
-> role + Trait configuration
-> player chooses a routine authored task
-> Copy performs live deterministic progress
-> bounded ordinary reward
-> Copy becomes available again
```

M20 adds an important product boundary:

```text
routine execution -> may be delegated to a Copy
irreversible / meaningful narrative decision -> remains player authority
```

The Copy system is therefore intended to remove routine execution burden, not to make the game choose story meaning for the player.

---

## 2. Creation

The current creation path is implemented through `createCopyThunk`.

- The target NPC must exist.
- Creation spends the current Essence cost derived from connection depth, plus the accelerated-growth surcharge when selected.
- The existing Charisma-based success roll determines success.
- A successful Copy receives independent stats, maturity, loyalty, inherited Traits, role/task state, and the target NPC's current descriptive location value.
- Trait slots are initialized/reconciled through the existing Copy slot machinery.

M20 does not redesign Copy creation.

### Location note

Copy creation still inherits `npc.location`, and older/demo Copy state can therefore contain human-readable location strings.

M20 does **not** create Copy movement or a second world model. Where an authored task needs location, it reuses M18 `resolveCanonicalLocationId(...)` against the existing Exploration location authority. The qualified Forge probe accepts legacy `"City Center"` because M18 explicitly resolves it to `location_city_center`.

A value that cannot be resolved into the authored M18 graph is simply ineligible for a canonical-location-gated task; M20 does not silently invent a location for that Copy.

---

## 3. Traits on Copies

Copies gain Traits from two current sources.

### 3.1 Inherited Traits

At creation, the Copy snapshots a bounded set of Traits informed by its parent NPC. These are read-only on the Copy.

### 3.2 Shared Traits

The player may share currently equipped, non-permanent Traits into unlocked Copy Trait slots.

Rules:

- the Trait must be equipped on the player;
- permanent player Traits are not shareable;
- inherited/shared duplicates are rejected;
- an unlocked empty slot is required;
- preferences may be stored and applied to available slots.

### 3.3 Slot unlocks

Configuration lives in `COPY_SYSTEM.TRAIT_SLOT_UNLOCKS`.

- `MAX_TRAIT_SLOTS = 4`;
- initial/unlock behavior remains one-way in this prototype;
- maturity/loyalty changes trigger unlock reconciliation where applicable.

### 3.4 Auto-unshare invariants

Listener middleware automatically removes a shared Trait from Copies when the player:

- unequips it;
- replaces it in the relevant player slot;
- makes it permanent through Resonance.

This keeps Copy sharing subordinate to current Player Trait authority.

### 3.5 Save/load

Older saves may lack current Copy Trait-slot fields. Existing post-load/listener reconciliation initializes missing slot structure without requiring M20-specific persistence.

---

## 4. Growth

| Mode | Mechanic | Current tuning |
|---|---|---|
| Normal | Base maturity growth per live GameLoop delta | `GROWTH_RATE_PER_SECOND = 0.1` |
| Accelerated | Normal growth multiplied | `ACCELERATED_GROWTH_MULTIPLIER = 2` |

Accelerated growth can be selected/activated through the current Essence-spending paths. M20 does not change growth authority.

Copies also experience current passive loyalty decay through `processCopyLoyaltyDecayThunk(deltaTime)`.

---

## 5. Essence contribution

A Copy may contribute to passive Essence through the existing Copy qualification model.

Current broad qualification remains based on maturity and loyalty thresholds, with `COPY_SYSTEM.ESSENCE_GENERATION_BONUS` and related selectors/thunks supplying the existing passive contribution behavior.

This passive contribution is distinct from the **one-shot M20 Resonance Calibration reward**. A completed Resonance Calibration explicitly grants its authored task reward through the Essence reducer; it does not alter the passive-generation formula.

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

Role assignment is player-controlled through `assignCopyRoleThunk` and the Copy detail UI.

### 6.1 Duration modifiers

Existing role modifiers are reused by M20 production tasks:

- infiltrator: `0.90x` duration;
- researcher: `0.95x` duration;
- guardian: `1.05x` duration;
- agent: `1.00x` duration;
- none: `1.00x` duration.

M20 qualifies the modifier through two concrete cases:

```text
Forge Assistance + guardian
60s base * 1.05 -> 63s

Resonance Calibration + researcher
90s base * 0.95 -> 86s rounded
```

### 6.2 Existing completion bonuses

Role completion flavor remains Copy-owned progression:

- infiltrator: +2 loyalty;
- researcher: +1 maturity;
- guardian: +1 loyalty;
- agent: +1 loyalty and +0.5 maturity;
- none: no role bonus.

These bonuses are separate from the authored production task's ordinary Gold/Essence reward.

---

## 7. M20 Production Task Automation

### 7.1 Task authority

The production catalog lives in `CopyTaskDefinitions.ts`.

M20 intentionally uses a **positive allowlist** rather than a generalized task/effect scripting engine.

The bounded definition shape is:

```ts
CopyProductionTaskDefinition {
  id
  name
  description
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

No arbitrary callback, Redux-action array, behavior tree, AI planner, or narrative decision payload is part of the task definition.

### 7.2 Qualified task: Forge Assistance

```text
id: forge_assistance
base duration: 60s
minimum maturity: 50
allowed roles: guardian | agent
required location: location_city_center
reward: +15 Gold
```

The location requirement uses M18 canonical location resolution. It does not use a Copy-specific coordinate/presence flag.

### 7.3 Qualified task: Resonance Calibration

```text
id: resonance_calibration
base duration: 90s
minimum maturity: 75
minimum loyalty: 55
allowed roles: researcher | agent
reward: +8 Essence
```

No location requirement is authored for this task because M20 does not have a qualified general Copy movement/presence system.

### 7.4 Assignment

`startCopyProductionTaskThunk({ copyId, taskId })` is the production assignment authority.

It rejects before mutation when:

- task ID is unknown;
- Copy is missing;
- Copy already has a running task;
- maturity/loyalty requirement is unmet;
- role requirement is unmet;
- authored canonical location requirement is unmet.

The UI calls the same production thunk and uses the same eligibility helper for player-facing disabled state/reasons.

The old arbitrary-duration `startCopyTimedTaskThunk(...)` is not a production assignment path and now rejects with guidance to select an authored production task.

### 7.5 Active task state

One Copy may have one current `activeTask`.

The existing task lifecycle stores:

```text
id
type
productionTaskId
durationSeconds
progressSeconds
status
startedAt
```

`productionTaskId` is the authored identity needed to resolve M20 requirements/reward semantics after persistence.

### 7.6 Live progression

The main GameLoop already dispatches:

```text
processCopyTasksThunk(deltaTime)
```

Running tasks progress deterministically from live `deltaTime`.

M20 does not settle elapsed wall-clock time while the application is closed. That belongs to M21.

### 7.7 Completion

For a valid authored production task:

```text
progress reaches duration
-> resolve productionTaskId
-> apply existing role completion bonus
-> apply authored Gold/Essence reward
-> notify player
-> clear activeTask
```

For unknown/legacy task state:

```text
timer completes
-> no production reward
-> warning
-> clear activeTask
```

This prevents a legacy/arbitrary task record from acquiring M20 economy authority merely by reaching a timer threshold.

### 7.8 Exact-once behavior

After reward application, `activeTask` is cleared. A later task tick therefore has no completed task to replay.

M20 directly qualifies:

- completion reward once;
- extra live tick does not duplicate it;
- save/load after completion followed by another tick does not duplicate it.

---

## 8. Persistence

The canonical save system serializes the complete `RootState`. `copy.activeTask` therefore persists through the existing save envelope rather than a Copy-specific save format.

M20 qualifies:

```text
active task at partial progress
-> createSave
-> loadSavedGameWithMigration
-> replaceState
-> identity + progress preserved
-> live progress continues
-> reward applies once
```

No M20 save-schema bump was required.

Offline elapsed-time settlement is deliberately not performed here; it is an M21 concern.

---

## 9. Player-facing management

The current Copy detail UI includes:

- maturity and loyalty progress;
- role assignment;
- current Copy location label;
- authored Production Delegation cards;
- base duration and reward;
- eligibility reasons;
- disabled assignment while busy/ineligible;
- active task name and progress;
- Trait share preferences;
- effective Traits.

The M20 UI explicitly states that delegation covers repeatable execution and that narrative/irreversible decisions remain player authority.

---

## 10. Narrative authority boundary

Delegable M20 activities are bounded routine execution.

Examples compatible with the doctrine include gather/repair/craft/patrol/routine research when they are explicitly authored into the production catalog.

The M20 catalog has no representation for:

- choosing a Quest ending;
- selecting a major dialogue response;
- defining/reinterpreting a Relationship;
- betraying or exposing someone;
- choosing an alliance/faction alignment;
- making an irreversible political/social decision.

An arbitrary ID such as `choose_quest_ending` is rejected because it is not an authored production task.

M20 tests additionally verify that completing a qualified routine task leaves current Relationship and Quest Redux state unchanged.

---

## 11. Current implementation summary

| Feature | Status | Notes |
|---|---|---|
| Copy state CRUD/batch update | Implemented | `updateMultipleCopies` available |
| Growth | Implemented | live delta-time progression |
| Loyalty decay | Implemented | live delta-time progression |
| Creation | Implemented | current Essence cost + Charisma roll |
| Bolster loyalty | Implemented | Essence spend + clamp |
| Accelerated growth | Implemented | promotion/creation paths |
| Roles | Implemented | assignment, duration modifiers, completion flavor bonuses |
| Trait inheritance/sharing | Implemented | slots, preferences, validation, auto-unshare |
| Passive Essence contribution | Implemented/partial-balance | existing maturity/loyalty qualification |
| Production task catalog | **M20 qualified** | Forge Assistance + Resonance Calibration |
| Production task eligibility | **M20 qualified** | role/maturity/loyalty/canonical-location requirements as authored |
| Live task progression | **M20 qualified** | existing GameLoop task processor |
| One-shot task reward | **M20 qualified** | Gold/Essence task-specific effects, replay controls |
| Mid-task save/load | **M20 qualified** | ordinary RootState persistence |
| Offline task progress | Not implemented | M21 boundary |
| Copy travel/autonomous movement | Not implemented | not required by M20 |
| Strategic/autonomous delegation | Not implemented | outside M20 evidence ceiling |
| Low-loyalty alerts | TODO | separate product/UI work |

---

## 12. Current constants

`COPY_SYSTEM` remains the authority for current Copy growth/loyalty/slot tuning, including:

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

The older global `COPY_SYSTEM.TASK_REWARDS` constant remains legacy tuning but is **not** M20 production reward authority. M20 production rewards live with their authored definitions in `CopyTaskDefinitions.ts`.

---

## 13. Notifications

The notification system currently reports Copy creation, promotion/bolster/share actions, task assignment failures, production task start, and production task completion.

Completion feedback names the authored task and summarizes its bounded ordinary reward plus any existing role completion bonus.

---

## 14. Evidence ceiling / future work

M20 qualifies **two bounded production activities**, not a general autonomous workforce.

Not qualified by M20:

- offline progression;
- self-selected/strategic tasks;
- AI planners or behavior trees;
- arbitrary task scripting/effect DSLs;
- task queues/priorities;
- task failure/risk simulation;
- team Copy tasks;
- Copy movement/pathfinding/schedules;
- generalized Copy world presence;
- social knowledge propagation;
- faction reputation;
- generalized world state;
- irreversible narrative decision automation;
- economy balance at scale.

The next planned milestone after an exact-head M20 merge is **M21 — Offline Progress**, using passive Essence plus the now-qualified Copy task progress path as bounded offline-safe consumers.

---

**Revision:** Reconciled to qualified M20 Production Copy Task Automation behavior and evidence ceiling.