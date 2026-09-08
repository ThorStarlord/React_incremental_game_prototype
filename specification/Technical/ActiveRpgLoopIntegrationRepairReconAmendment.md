# Active RPG Loop Integration Repair — Recon Amendment

**Status:** Frozen after recon, before behavioral implementation  
**Preregistration:** `ActiveRpgLoopIntegrationRepairQualification.md`  
**Baseline:** `3977921f24c9dab8ef057c2752d528c965f07d5f`

## Recon verdict

**Prerequisite gate: PASS.** The three `CHECKPOINT_B_WEAK` findings can be repaired through existing domain authorities without introducing a generalized world/presence system.

## 1. Combat location authority

Current `CombatEncounterDefinition` has no world-location field. `ActiveQuestCombatPanel` globally discovers the first active `KILL` objective whose target maps to a Combat definition, so the M17 Echo is playable from any Player location.

### Frozen repair

Add exactly one bounded optional field:

```ts
requiredLocationId?: string;
```

The M17 Telluric Echo definition will author:

```text
requiredLocationId = location_whispering_woods
```

A small pure Combat-owned availability helper will compare the canonicalized current Player location to that field. `ActiveQuestCombatPanel` will use that helper before rendering `CombatEncounterPanel`.

When the quest is active away from the required location, the Dashboard may still show the objective, but it must show a travel/location requirement instead of encounter actions. Once the player reaches the required location, the unchanged M17 encounter becomes playable.

This is intentionally **not** a general condition DSL, predicate registry, quest condition, or world-state engine.

### Runtime boundary note

The bounded M17 encounter engine is a pure transient state machine and has no Redux/world mutation entrypoint by itself. The production mutation bridge to Quest (`targetKilled`) is emitted only by `ActiveQuestCombatPanel` through `CombatEncounterPanel`. Therefore the authoritative world-presence gate belongs at the active encounter integration boundary, not inside the pure arithmetic engine.

Existing M17 UI tests that intentionally exercise the encounter will be updated to place the Player at the authored encounter location; the deterministic combat-engine control tests remain unchanged.

## 2. Anchored NPC presence authority

M19 already provides the NPC-domain authority:

```text
src/features/NPCs/state/NPCWorldLocationDefinitions.ts

npc_elder_willow     -> location_whispering_woods
npc_blacksmith_gronk -> location_city_center
```

`NPCListView` currently compares descriptive `NPC.location` text directly to `Player.location` for its `same_location` filter, which is incompatible with canonical M18 Player location IDs for the anchored probes.

`NPCPanelContainer` currently renders all discovered NPC interaction tabs regardless of world presence.

### Frozen repair

Extend the NPC world-location definition module with a pure helper that returns whether a Player location is at a qualified NPC anchor, while returning `undefined` for unanchored NPCs.

For **anchored** NPCs:

Remote inspection remains available:

```text
Overview
Relationship
```

The following existing surfaces are classified as **in-person active interaction** and will not render their interactive child component while the player is away from the NPC anchor:

```text
Dialogue
Quests
Traits / Resonance
Trade
Create Copy
```

The tab may remain discoverable and show a location-required explanation; the action surface itself must not render remotely. This preserves discoverability without pretending remote physical interaction.

`NPCListView.same_location` will use the same canonical anchor helper for anchored NPCs. Unanchored NPCs retain the legacy descriptive-location comparison for backward compatibility.

No NPC schedule, movement, availability rewrite, remote-contact simulation, or second location field is introduced.

## 3. Travel consequence feedback

M19's spatial Tether interpretation currently lives inside `selectEffectiveRelationshipTether`, deriving:

```text
same location        -> present
direct neighbor      -> nearby
other known location -> remote
```

`TravelPanel` currently reports only destination/location and errors.

### Frozen repair

Factor the spatial part of M19 Tether derivation into a pure Relationship-owned function that can evaluate a qualified NPC against an arbitrary Player location value without mutating state.

`selectEffectiveRelationshipTether` will delegate to that same function, preserving M19 semantics exactly.

Before dispatching a legal travel request, `TravelPanel` can compare current vs destination spatial Tether for the bounded anchored NPC definitions. **Only after the existing travel thunk fulfills** will it display a local feedback block for changed Tether states.

Qualified feedback form:

```text
Elder Willow — Tether: remote -> nearby
Blacksmith Gronk — Tether: present -> nearby

Movement changed current presence/Tether, not Relationship history.
```

Exact Essence-rate deltas are not required for this repair because the current M19 UI already explains the rate formula and the Checkpoint-B acceptance explicitly allows presence/Tether feedback. This avoids duplicating Essence calculation into Exploration.

The feedback is transient UI state only; it is not saved and does not become Relationship history.

## 4. Rule-of-Two

Anchored NPC presence is independently exercised by Willow and Gronk using one generic helper.

Travel feedback will use movement(s) where one world-location change alters both Willow and Gronk spatial Tether in opposite/different directions, demonstrating real opportunity cost from the same canonical Player location fact.

Combat currently has only one production encounter. This does **not** justify a generalized condition mechanism; the optional single-location field is the smallest bounded semantic.

## 5. Dedicated qualification surface

Create one focused integration test for the repair covering:

1. M17 active quest away from Whispering Woods shows location requirement and no `Begin Encounter` action;
2. after canonical movement to Whispering Woods, the same active encounter becomes playable;
3. anchored Willow is remotely inspectable but Dialogue/in-person content is blocked away from her anchor and available at her anchor;
4. anchored Gronk exercises the same presence helper from the opposite end of the current probe;
5. `same_location` uses canonical anchor semantics for Willow/Gronk while unanchored fallback remains unchanged;
6. TravelPanel produces immediate Willow/Gronk Tether-change feedback only after successful travel;
7. failed/illegal travel produces no false spatial consequence feedback;
8. travel/presence does not mutate historical Bond state.

Add this test to the accumulated Build Validation gate after the first complete candidate exists.

## 6. Frozen non-interventions

This repair will not add or change:

- Relationship reducer semantics;
- Connection/Bond dimensions/Memories/Stability/Resonance Quality;
- Essence formula;
- save schema/version;
- Quest content semantics beyond consuming the existing active encounter definition;
- Player location authority;
- NPC moving/schedule state;
- coordinates/pathfinding/travel time;
- Copy task automation;
- generalized encounter/world/condition DSLs.

## 7. Stop condition after implementation

If the bounded implementation passes accumulated qualification and exact-head Build Validation, record the result, reconcile only directly stale canon, merge the qualified candidate, and stop for **Checkpoint B re-run**. M20 remains unauthorized until that re-run yields `CHECKPOINT_B_PASS`.