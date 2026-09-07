# M18 — Exploration / Travel Reconnaissance Amendment

**Status:** Frozen after preregistration and before behavioral implementation  
**Baseline:** `4a82438214aebf165da0bcc519dfe127ef7871c9`  
**Preregistration commit:** `84668f1767f05ad03743303fc1a06b0c79692fae`

## 1. Reconnaissance findings

### Player location is already the persisted current-location authority

`PlayerState.location` is a string and `PlayerSlice.setLocation` is the existing mutation/event surface. Current save envelopes clone the full `RootState`, so Player location already round-trips through ordinary save/load without a separate location persistence system.

### Production Quest location IDs already exist

Existing `REACH_LOCATION` objectives use canonical-looking IDs including:

- `location_merchant_district`;
- `location_whispering_woods`.

`GameEventListeners` already listens to `setLocation` and advances matching active `REACH_LOCATION` objectives. M18 therefore needs no Travel-to-Quest bridge.

### Fresh-player location is a legacy label

Fresh Player state currently initializes `location` as `"City Center"`, while Quest targets use ID-shaped values. Search found no independent runtime consumer requiring the Player's current location to remain the human-readable label.

Copy and NPC content also contain older human-readable location strings, but M18 does not need to migrate them in order to qualify player travel. Their location semantics remain explicitly outside M18.

### No dedicated World / Exploration runtime exists

There is no current reducer or feature owning spatial topology. Creating a second live current-location state would duplicate Player authority.

## 2. Bounded compatibility decision

M18 will:

1. normalize the fresh-player default to `location_city_center`;
2. keep `Player.location` as the sole live player-location authority;
3. author a small Exploration-owned location-definition table with display names, direct connections, and a narrow legacy alias for `"City Center"`;
4. resolve old saved `"City Center"` values through that alias for route availability without rewriting save schema;
5. write canonical destination IDs on the next legal travel;
6. leave Copy/NPC location strings untouched.

This is a compatibility normalization, not a new persistent authority and not a save-schema shape change.

## 3. Frozen production graph

```text
location_merchant_district
          |
location_city_center
          |
location_city_gate
          |
location_whispering_woods
```

Direct edges are bidirectional:

- City Center <-> Merchant District;
- City Center <-> City Gate;
- City Gate <-> Whispering Woods.

There is intentionally no direct City Center <-> Whispering Woods edge. That provides the preregistered illegal-jump control.

## 4. Production Quest proof

Use existing `quest_elara_chain_1`:

- ordinary production quest;
- no prerequisite;
- `REACH_LOCATION` target `location_whispering_woods`.

Qualification path:

```text
start quest_elara_chain_1
-> City Center
-> City Gate
-> save/load at City Gate
-> Whispering Woods
-> existing setLocation listener
-> objective progresses to complete/ready state
```

No M18-specific Quest content is required.

## 5. Implementation boundary

Add a small `src/features/Exploration/` capability containing:

- location types/definitions;
- legacy-alias resolution;
- direct-adjacency availability;
- authoritative player-travel thunk;
- player-facing `TravelPanel`.

`TravelPanel` will be composed into `GameControlPanel` alongside the existing active-Quest Combat panel.

The travel thunk is the player-travel authority. It must reject an illegal destination before dispatching `setLocation`. Raw `setLocation` remains the lower-level canonical location mutation/event used by existing systems and tests; it is not redefined as the player-facing travel API in M18.

## 6. Explicit exclusions confirmed by recon

M18 will not introduce:

- an Exploration reducer;
- a second `currentLocation` field;
- save-schema version bump solely for location labels;
- Copy/NPC location migration;
- pathfinding beyond one authored adjacency step;
- travel duration or clock integration;
- world-derived Tether;
- random travel encounters;
- a generalized world-state system.

## 7. Architecture finding to test

The current repository appears sufficient for the whole M18 causal path with only one new bounded semantic: **authored direct travel adjacency**.

If two or more independent edges work through the same definition/availability contract, that contract is warranted as the small Exploration abstraction. No broader map/pathfinding DSL is warranted by this milestone.
