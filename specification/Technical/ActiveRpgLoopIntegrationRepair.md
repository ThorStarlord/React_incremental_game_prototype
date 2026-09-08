# Active RPG Loop Integration Repair

**Status:** preregistered implementation contract  
**Trigger:** `CHECKPOINT_B_WEAK`  
**M20:** not authorized  

## Frozen baseline

```text
main
3977921f24c9dab8ef057c2752d528c965f07d5f

tree
9c55147dde67a04dd06bb0168dc4cfc95f13eaba
```

This repair begins from the exact merged Checkpoint-B tree. It is a bounded prerequisite repair, not a new roadmap milestone or a redesign of Exploration, Relationships, Combat, Quest, NPCs, or world state.

## Repair question

Can the existing active RPG authorities be connected at their observed player-facing boundaries so that:

```text
canonical world presence -> encounter availability
canonical world presence -> anchored NPC active interaction availability
travel / presence change -> bounded spatial consequence feedback
```

without introducing a generalized world simulation or weakening accumulated M4-M19 qualification?

## Observed defects from Checkpoint B

1. `ActiveQuestCombatPanel` can surface the M17 Telluric Echo encounter while the player is outside its authored Whispering Woods location.
2. Discovered NPCs are globally browsable and the legacy `same_location` filter compares descriptive `NPC.location` strings with canonical Player location IDs. The routed NPC detail surface therefore permits anchored NPC active interaction while the NPC is objectively remote.
3. Travel changes M19 spatial Tether and Relationship-derived Essence, but `TravelPanel` does not immediately explain the relationship opportunity cost caused by that movement.

## Existing authorities to reuse

- `Player.location` remains the sole current-player-location authority.
- `LocationDefinitions` remains the M18 canonical topology and compatibility authority.
- `NPCWorldLocationDefinitions` remains the M19 bounded canonical NPC-anchor authority.
- `selectEffectiveRelationshipTether` remains the M19 current spatial-Tether projection.
- `selectRelationshipEssenceContributionByNpcId` remains the Relationship-derived Essence explanation/rate authority.
- ordinary Quest, Combat, Relationship, and listener/event bridges remain unchanged unless a narrowly required integration hook is demonstrated.

No second current-location state, proximity state, or persisted presence flag may be introduced.

## Contract A — spatially situated encounters

Add the smallest encounter-definition contract needed to express a single authored required canonical location.

Expected shape:

```text
CombatEncounterDefinition.requiredLocationId?: string
```

The Telluric Echo encounter is authored at:

```text
location_whispering_woods
```

`ActiveQuestCombatPanel` must consume canonical `Player.location` and must not expose playable encounter actions when an encounter's required location does not match the current canonical player location.

A blocked encounter may remain player-visible as explanatory feedback directing the player to the authored location; it must not be actively playable.

The generic launcher must not contain M17 quest IDs, target IDs, Willow IDs, or a generalized encounter-condition DSL.

## Contract B — information browsing versus anchored in-person interaction

Known NPC information may remain remotely browsable.

For an NPC with a canonical M19 anchor:

```text
remote browsing allowed:
- Overview / profile
- Relationship summary, Memories, and historical evidence

physical presence required:
- Dialogue
- Quest interaction
- Trait teaching / acquisition interaction
- Trade
- Create Copy
- other active actions exposed from the current routed NPC detail surface
```

The NPC domain should expose a small pure helper that answers whether an anchored NPC is at the player's canonical location. Unanchored NPCs preserve current behavior; this repair must not invent locations for them.

`NPCListView`'s `same_location` filter must consume canonical anchor authority for anchored NPCs instead of comparing descriptive `NPC.location` directly with canonical Player IDs. Remote anchored NPCs must remain selectable for information browsing.

If travel makes an already-open anchored NPC remote, the UI must not leave an active in-person tab/action usable.

## Contract C — bounded arrival consequence feedback

`travelToLocationThunk` remains the movement authority and must stay ignorant of Relationship/Tether mechanics.

After a successful player-facing travel, `TravelPanel` may derive a before/after snapshot from existing selectors and show only changed, discovered, canonically anchored NPC consequences.

The bounded feedback should communicate:

```text
Arrived: <location>
<NPC>
Tether: <before> -> <after>
Relationship Essence: <before rate> -> <after rate>   (when enabled/relevant)
```

Exact wording and numeric precision are presentation details. The required semantic is that the player can identify which anchored relationships became more or less spatially immediate and whether their current Relationship-derived Essence contribution changed.

No predictive routing, hypothetical destination preview, autonomous NPC movement, or persisted feedback ledger is required.

## Qualification requirements

The repair is not qualified by TypeScript/build alone. Focused behavior evidence must prove at least:

1. Echo combat is blocked away from Whispering Woods and playable at Whispering Woods.
2. The location gate is definition-driven/generic rather than M17 hard-coded.
3. Willow/Gronk anchored presence uses canonical IDs and the `same_location` filter no longer relies on descriptive string equality for them.
4. A remote anchored NPC remains browsable for profile/Relationship information while active in-person surfaces are disabled.
5. Returning to the NPC's canonical location restores active interaction.
6. Unanchored NPC behavior is not newly guessed or globally blocked.
7. A legal travel that changes Willow/Gronk spatial Tether produces bounded arrival feedback with the correct direction of Tether/Essence change.
8. Illegal travel remains rejected below UI and produces no false arrival feedback.
9. Existing Quest/Combat/Relationship/Tether/Essence semantics and save authority remain intact.
10. The accumulated M4-M19 qualification suite and production build remain green on the exact candidate head.

If implementation reveals that these outcomes cannot be achieved without a broader semantic, stop and record that evidence rather than expanding scope silently.

## Explicit non-goals

```text
coordinates
continuous distance
NPC schedules
autonomous NPC movement
travel time
pathfinding
remote-contact simulation
general encounter-condition DSL
world-state engine
new Relationship dimensions
Copy task automation
offline progression
predictive route optimization
new save-schema presence fields
```

## Exit boundary

This repair may end only as one of:

```text
REPAIR_PASS
ready to re-run Checkpoint B
M20 still not authorized until Checkpoint B PASS
```

or:

```text
REPAIR_WEAK / REPAIR_FAIL
record remaining bounded defect or architecture contradiction
M20 not authorized
```

A successful repair does **not** itself authorize M20. It authorizes the separate Checkpoint-B re-run.