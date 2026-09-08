# Exploration / Travel System

**Status:** Bounded production travel vertical slice qualified in M18; M19 now consumes its world facts for spatial Tether  
**Current authority:** `Technical/M18ExplorationTravelQualification.md` + `Technical/M18ExplorationTravelReconAmendment.md` + `Technical/M18ExplorationTravelResult.md` + `Technical/M19WorldDerivedTetherResult.md`

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
```

Exploration does not itself own Relationship meaning or Essence calculation.

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

The contract is intentionally small. M18/M19 do not add travel time, coordinates, resources, encounters, NPC schedules, region simulation, or world-state predicates.

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

The panel is composed into `GameControlPanel` alongside the existing active-Quest Combat panel.

UI visibility is not the authority boundary. An illegal direct call to the travel thunk is independently rejected before Player or Quest mutation.

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
same location       -> present
direct neighbor     -> nearby
other known location -> remote
```

This is a consumer of Exploration facts, not a new Exploration responsibility. Travel does not write Relationship state. Unanchored NPCs continue to use authored/static Relationship Tether.

The existing `setLocation` listener also refreshes the cached passive Essence rate after a location change so the live rate reflects the newly derived spatial Tether.

## 7. Persistence

Exploration adds no persistent reducer state and no save-schema version.

Because `Player.location` is already part of RootState, ordinary save/load preserves the current location. M18 qualified saving at `location_city_gate`, restoring that location, and then continuing legal travel to `location_whispering_woods`.

M19 further qualifies that the same restored `Player.location` reconstructs Willow/Gronk's effective spatial Tether and Relationship-derived Essence contributions without persisting separate proximity flags.

The legacy `"City Center"` compatibility alias remains handled at route/projection resolution time rather than by a new save migration.

## 8. Authority boundaries

The current rules are:

- **Exploration:** authored topology / direct adjacency;
- **Player:** current player location;
- **NPC:** bounded canonical NPC world anchors where qualified; descriptive NPC location remains separate;
- **Copy:** Copy location where applicable; not migrated by M18/M19;
- **Quest / Story:** consequences of location facts;
- **Relationship:** historical relational meaning plus authored/static Tether fallback;
- **Essence:** consumes the effective Tether projection in its existing formula.

Do not introduce shadow booleans such as `playerAtGrove`, `willowNearby`, or `silasInMarket` as substitute location/presence authority.

## 9. Explicitly unqualified

M18/M19 do not qualify:

- open-world exploration;
- coordinate movement;
- route search/pathfinding beyond direct adjacency;
- travel duration;
- mid-travel state;
- random encounters in transit;
- resource gathering by location;
- procedural maps;
- NPC schedules or autonomous NPC movement;
- dynamic NPC positions;
- Copy travel;
- offline travel;
- continuous-distance Tether;
- spatially derived `Absent`;
- activity-derived `Engaged` / `Deeply Engaged`;
- campaign-scale navigation/presence simulation;
- human travel pacing or enjoyment.

## 10. Next boundary — Checkpoint B

M18 established objective player-facing travel. M19 proved those world facts can modulate current Relationship-derived Essence through bounded spatial Tether without changing historical Bond state.

The next step is **Checkpoint B — Active RPG Loop**.

Checkpoint B should evaluate whether Relationship, Trait, Quest, Combat, Travel, Presence/Tether, and Essence now function as one coherent active-play loop and whether adding Copy automation would enhance that loop rather than mask weaknesses in it.

Do not start M20 solely because M19 passed.