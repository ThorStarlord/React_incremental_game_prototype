# Exploration / Travel System

**Status:** Bounded production travel vertical slice qualified in M18; M19 consumes its world facts for spatial Tether; active-loop repair now makes those facts authoritative at bounded encounter/NPC interaction surfaces and reports immediate Tether consequences  
**Current authority:** `Technical/M18ExplorationTravelQualification.md` + `Technical/M18ExplorationTravelReconAmendment.md` + `Technical/M18ExplorationTravelResult.md` + `Technical/M19WorldDerivedTetherResult.md` + `Technical/ActiveRpgLoopIntegrationRepairResult.md`

## 1. Purpose

Exploration owns **authored spatial topology and legal player travel between directly connected locations**.

It does not own the player's live current location. `Player.location` remains the canonical current-location authority.

The qualified boundary is:

```text
Exploration definitions
-> what locations exist in the bounded graph
-> which locations are directly connected

Player
-> where the player currently is

Quest / Story
-> reacts to location changes

Relationship / Essence (M19)
-> may consume objective location/adjacency facts to derive current spatial Tether

Combat / anchored NPC interaction (active-loop repair)
-> may consume canonical world presence to decide whether a bounded in-person action is available
```

Exploration does not itself own Relationship meaning, Essence calculation, Combat resolution, or NPC interaction semantics.

## 2. Qualified M18 graph

M18 authors one deliberately small graph:

```text
Merchant District
      |
  City Center
      |
   City Gate
      |
Whispering Woods
```

Canonical IDs:

- `location_city_center`;
- `location_merchant_district`;
- `location_city_gate`;
- `location_whispering_woods`.

Direct edges are bidirectional:

- City Center <-> Merchant District;
- City Center <-> City Gate;
- City Gate <-> Whispering Woods.

There is no direct City Center <-> Whispering Woods route.

## 3. Runtime contracts

### Location definitions

`LocationDefinition` currently contains:

```ts
{
  id: string;
  name: string;
  description: string;
  connections: readonly string[];
  legacyAliases?: readonly string[];
}
```

The contract is intentionally small. M18/M19 and the active-loop repair do not add travel time, coordinates, resources, NPC schedules, region simulation, pathfinding, or generalized world-state predicates.

### Current-location authority

Fresh Player state starts at:

```text
location_city_center
```

Older saves that contain the historical label:

```text
City Center
```

are resolved through a narrow Exploration compatibility alias. The next legal travel writes a canonical location ID through the existing `Player.setLocation` action.

No Exploration reducer or second `currentLocation` field exists.

### Travel authority

Player-facing route legality is owned by `travelToLocationThunk`.

The thunk:

1. resolves the current Player location;
2. resolves the requested destination;
3. verifies a direct authored connection;
4. rejects before mutation if the route is illegal;
5. dispatches the existing `setLocation(canonicalDestinationId)` action only after validation.

The low-level `setLocation` action remains the existing canonical location mutation/event used by other systems and historical tests. It is not the M18 player-facing travel API.

## 4. Player-facing UI

`TravelPanel` shows:

- the current authored location name/description;
- only directly connected destinations;
- a travel button for each legal destination;
- a warning if the current location cannot be resolved into the bounded graph.

The active-loop repair adds bounded **post-success spatial consequence feedback**. For qualified canonically anchored Relationship sources whose effective spatial Tether changes, the panel can report transitions such as:

```text
Elder Willow — Tether: Remote -> Nearby
Blacksmith Gronk — Tether: Present -> Nearby
```

and explicitly states that movement changed current presence/Tether rather than historical Relationship state.

The feedback is derived from the same Relationship-owned spatial projection used by M19; Travel does not mutate Relationship history or own the Tether formula. Failed/illegal travel does not publish successful-arrival feedback.

The panel is composed into `GameControlPanel` alongside the active-Quest Combat panel.

UI visibility is not the travel authority boundary. An illegal direct call to the travel thunk is independently rejected before Player or Quest mutation.

## 5. Quest integration

M18 adds **no Travel-to-Quest bridge**.

The causal path is:

```text
player chooses legal travel
-> travelToLocationThunk validates adjacency
-> existing setLocation(destinationId)
-> existing GameEventListeners location listener
-> matching REACH_LOCATION objective advances
```

The production proof reuses existing `quest_elara_chain_1`, whose objective targets `location_whispering_woods`.

The active-loop repair does not alter this bridge.

## 6. M19 spatial Tether consumption

M19 independently reuses the same objective world facts for a second domain without moving authority into Exploration.

Bounded NPC-domain anchors are:

```text
Willow -> location_whispering_woods
Gronk  -> location_city_center
```

Relationship selectors combine:

```text
Player.location
+
NPC canonical anchor
+
Exploration direct adjacency
-> effective spatial Tether
```

For the qualified bounded graph:

```text
same location        -> present
direct neighbor      -> nearby
other known location -> remote
```

This is a consumer of Exploration facts, not a new Exploration responsibility. Travel does not write Relationship state. Unanchored NPCs continue to use authored/static Relationship Tether.

The existing `setLocation` listener also refreshes the cached passive Essence rate after a location change so the live rate reflects the newly derived spatial Tether.

For the active-loop repair, the same pure spatial projection can be evaluated for the pre-travel and post-travel player locations to produce truthful immediate feedback without persisting another proximity state.

## 7. Active-play world-presence consumers

Checkpoint B found that spatial facts were real but could still be bypassed by important active-play surfaces. The bounded repair closes that gap for the currently qualified cases without making Exploration the owner of those domains.

### Combat encounter availability

The M17 Telluric Echo encounter is authored at:

```text
location_whispering_woods
```

The Combat launch surface consumes canonical `Player.location` and does not expose the encounter away from that location. Combat still owns encounter resolution and Quest still owns the `KILL` objective consequence.

### Anchored NPC in-person interaction

The NPC domain reuses the same canonical anchors qualified by M19.

For anchored Willow and Gronk:

```text
player at NPC canonical location
-> in-person NPC surfaces available

player elsewhere
-> Overview / Relationship information may remain inspectable
-> in-person Dialogue / Quests / Traits / Trade / Copy creation require travel
```

Unanchored NPCs preserve legacy availability behavior.

This does not establish remote communication or generalized NPC-presence simulation.

## 8. Persistence

Exploration adds no persistent reducer state and no save-schema version.

Because `Player.location` is already part of RootState, ordinary save/load preserves the current location. M18 qualified saving at `location_city_gate`, restoring that location, and then continuing legal travel to `location_whispering_woods`.

M19 further qualifies that the same restored `Player.location` reconstructs Willow/Gronk's effective spatial Tether and Relationship-derived Essence contributions without persisting separate proximity flags.

The active-loop repair likewise needs no new persistence: encounter required locations and NPC canonical anchors are static authored definitions, while live player location already persists.

The legacy `"City Center"` compatibility alias remains handled at route/projection resolution time rather than by a new save migration.

## 9. Authority boundaries

The current rules are:

- **Exploration:** authored topology / direct adjacency and player-facing legal travel;
- **Player:** current player location;
- **NPC:** bounded canonical NPC world anchors where qualified; descriptive NPC location remains separate; anchored in-person interaction consumes co-presence;
- **Combat:** encounter authoring/resolution and bounded required-location availability where authored;
- **Copy:** Copy location where applicable; not migrated into a generalized world model by M18/M19/repair;
- **Quest / Story:** consequences of location facts;
- **Relationship:** historical relational meaning plus authored/static Tether fallback and pure spatial effective-Tether derivation;
- **Essence:** consumes the effective Tether projection in its existing formula.

Do not introduce shadow booleans such as `playerAtGrove`, `willowNearby`, or `silasInMarket` as substitute location/presence authority.

## 10. Qualification

M18 independently qualifies legal travel, below-UI direct-route enforcement, existing `REACH_LOCATION` Quest integration, persistence, and legacy City Center compatibility.

M19 independently qualifies Willow/Gronk world anchors and derived `Remote`/`Nearby`/`Present` Tether affecting current Relationship-derived Essence without rewriting Bond history.

The active-loop repair adds a cross-system qualification:

```text
src/features/Exploration/ActiveRpgLoopIntegrationRepair.test.tsx
```

It proves that:

- the existing M17 encounter consumes its canonical required location at the production launch boundary;
- Willow and Gronk use one generic anchored-NPC co-presence rule while remote Relationship inspection remains available;
- legal travel immediately surfaces Willow/Gronk Tether opportunity cost;
- those travel/presence changes do not mutate historical Bond profiles;
- no generalized condition/pathfinding/schedule/world-state engine is introduced.

First fully qualified repair behavior candidate:

```text
SHA  3dc8ce8f2ae70cbc15eba2e80277902c5e8b513a
tree f7cd974f73989d62557bb57eb7fbb6bba439fc01
```

Build Validation #194 (`34182041060`, job `101922918366`) passed the dedicated repair suite, modified historical qualification, otherwise unchanged accumulated M4-M19 qualification, TypeScript, dependencies, and production build.

See `../Technical/ActiveRpgLoopIntegrationRepairResult.md` for the full #189-#194 diagnostic history.

## 11. Explicitly unqualified

M18/M19/active-loop repair do not qualify:

- open-world exploration;
- coordinate movement;
- route search/pathfinding beyond direct adjacency;
- travel duration;
- mid-travel state;
- random encounters in transit;
- resource gathering by location;
- procedural maps;
- generalized encounter/world condition expressions;
- arbitrary encounter placement rules;
- NPC schedules or autonomous NPC movement;
- dynamic NPC positions;
- remote communication/contact simulation;
- Copy travel;
- offline travel;
- continuous-distance Tether;
- spatially derived `Absent`;
- activity-derived `Engaged` / `Deeply Engaged`;
- campaign-scale navigation/presence simulation;
- human travel pacing or enjoyment.

## 12. Next boundary — fresh Checkpoint B re-run

M18 established objective player-facing travel. M19 proved those world facts can modulate current Relationship-derived Essence through bounded spatial Tether. The active-loop repair now makes those same canonical world facts authoritative for the qualified encounter and anchored-NPC in-person surfaces and gives travel immediate spatial-consequence feedback.

That repair PASS does **not** itself convert the prior `CHECKPOINT_B_WEAK` verdict into PASS.

The next step is a **fresh Checkpoint B — Active RPG Loop re-run** against the merged repair.

Only:

```text
CHECKPOINT_B_PASS
M20 authorized
```

permits M20 Copy Task Automation.
