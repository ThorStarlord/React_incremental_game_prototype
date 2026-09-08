# Exploration / Travel System

**Status:** Bounded production vertical slice qualified in M18  
**Current authority:** `Technical/M18ExplorationTravelQualification.md` + `Technical/M18ExplorationTravelReconAmendment.md` + `Technical/M18ExplorationTravelResult.md`

## 1. Purpose

Exploration owns **authored spatial topology and legal player travel between directly connected locations**.

It does not own the player's live current location. `Player.location` remains the canonical current-location authority.

The M18 boundary is:

```text
Exploration definitions
-> what locations exist in the bounded graph
-> which locations are directly connected

Player
-> where the player currently is

Quest / Story
-> reacts to location changes
```

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

The contract is intentionally small. M18 does not add travel time, coordinates, resources, encounters, NPC schedules, region simulation, or world-state predicates.

### Current-location authority

Fresh Player state now starts at:

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

## 6. Persistence

Exploration adds no persistent reducer state and no save-schema version.

Because `Player.location` is already part of RootState, ordinary save/load preserves the current location. M18 qualifies saving at `location_city_gate`, restoring that location, and then continuing legal travel to `location_whispering_woods`.

The legacy `"City Center"` compatibility alias is handled at route-resolution time rather than by a new save migration.

## 7. Authority boundaries

M18 preserves these rules:

- **Exploration:** authored topology / direct adjacency;
- **Player:** current player location;
- **NPC:** NPC location where applicable; not migrated in M18;
- **Copy:** Copy location where applicable; not migrated in M18;
- **Quest / Story:** consequences of location facts;
- **Relationship:** relational meaning, not objective spatial truth.

Do not introduce shadow booleans such as `playerAtGrove`, `willowNearby`, or `silasInMarket` as substitute location authority.

## 8. Explicitly unqualified

M18 does not qualify:

- open-world exploration;
- coordinate movement;
- route search/pathfinding beyond direct adjacency;
- travel duration;
- mid-travel state;
- random encounters in transit;
- resource gathering by location;
- procedural maps;
- NPC schedules;
- Copy travel;
- offline travel;
- world-derived Relationship Tether;
- campaign-scale navigation;
- human travel pacing or enjoyment.

## 9. Next boundary — M19

The next planned milestone may use the objective spatial facts M18 established to ask whether world presence can derive Relationship Tether without changing historical Relationship state.

M18 itself does not derive Tether.
