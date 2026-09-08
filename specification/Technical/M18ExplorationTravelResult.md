# M18 — Narrow Exploration / Travel Vertical Slice Result

**Verdict:** QUALIFIED — PASS  
**Baseline:** `4a82438214aebf165da0bcc519dfe127ef7871c9`  
**Baseline tree:** `51fac9c34006a966d2347bdedecf9e93b8a5139f`  
**Preregistration commit:** `84668f1767f05ad03743303fc1a06b0c79692fae`  
**Recon amendment commit:** `be0709123e658bf261f072e8bef5ec824b79cb4d`

## 1. Question

> Can the player intentionally traverse a small authored world graph through a player-facing travel interface, with canonical player location producing ordinary gameplay consequences, without duplicate location flags or a generalized world simulation?

## 2. First complete behavioral candidate

- SHA: `fce2b206568f5748ebb732b4689e7f5de763e40f`
- tree: `cb7218f8eaaa4b455a846de90c58286682194c22`

Build Validation #175:

- run: `34171715824`
- job: `101893132432`
- exact head: `fce2b206568f5748ebb732b4689e7f5de763e40f`
- dependency installation: PASS
- TypeScript: PASS
- accumulated M4-M18 behavioral qualification: PASS
- production build: PASS

No repair cycle was required after the first complete behavioral candidate entered CI.

## 3. Qualified production slice

M18 adds one bounded authored location graph:

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

The absence of a direct City Center <-> Whispering Woods edge supplies the negative-route control.

## 4. Player-facing travel authority

`Player.location` remains the sole live current-location authority.

The new `travelToLocationThunk`:

1. resolves the current Player location;
2. resolves the requested destination;
3. verifies a direct authored connection;
4. rejects before mutation if no legal direct route exists;
5. dispatches the existing `setLocation(canonicalDestinationId)` action after validation.

`TravelPanel` exposes only directly connected destinations, but UI omission is not the security/authority boundary: the qualification suite directly invokes the thunk for an illegal City Center -> Whispering Woods jump and verifies rejection before Player or Quest mutation.

There is no Exploration reducer and no second current-location field.

## 5. Rule-of-Two result

Two independent legal routes use the same authored adjacency/runtime contract:

```text
City Center -> Merchant District
City Center -> City Gate
```

A third edge, City Gate -> Whispering Woods, is exercised in the production Quest path.

This warrants the bounded generic concept **authored direct adjacency**.

It does not warrant:

- generalized pathfinding;
- route-expression DSLs;
- coordinates;
- travel-time simulation;
- procedural navigation.

## 6. Production Quest consequence

M18 reuses existing `quest_elara_chain_1` rather than authoring an M18-specific Quest.

The qualified causal path is:

```text
start quest_elara_chain_1
-> City Center
-> legal travel to City Gate
-> legal travel to Whispering Woods
-> existing setLocation(location_whispering_woods)
-> existing GameEventListeners location listener
-> existing REACH_LOCATION objective advances
-> quest becomes READY_TO_COMPLETE
```

No Travel-to-Quest bridge was introduced.

## 7. Persistence qualification

The production path also qualifies:

```text
City Center
-> City Gate
-> save
-> load
-> Player.location remains location_city_gate
-> legal travel to Whispering Woods
-> existing REACH_LOCATION consequence still occurs
```

Exploration adds no persistent reducer and no save-schema version bump. Current save envelopes already preserve `Player.location` as part of RootState.

## 8. Legacy location compatibility

Recon found a pre-M18 representation mismatch:

- fresh Player state historically used human-readable `"City Center"`;
- Quest objectives already used ID-shaped locations such as `location_merchant_district` and `location_whispering_woods`;
- Copy/NPC content also contains older human-readable location strings.

M18 deliberately normalizes only fresh **Player** state to `location_city_center` and provides a narrow compatibility alias:

```text
legacy saved "City Center"
-> resolve as location_city_center for routing
-> next legal travel
-> canonical destination ID written to Player.location
```

Copy/NPC location semantics are unchanged and remain outside M18.

## 9. Architecture finding

The existing repository architecture was sufficient for the complete M18 causal path:

```text
Exploration topology
-> travelToLocationThunk validates one direct edge
-> existing Player.setLocation
-> existing GameEventListeners
-> existing REACH_LOCATION Quest consequence
```

The only new bounded semantic required was **authored direct travel adjacency plus a player-facing authority that validates that adjacency**.

M18 did not require:

- a World reducer;
- an Exploration reducer;
- a second player-location state;
- Quest changes;
- listener changes;
- save-schema changes;
- Copy/NPC migration;
- Relationship changes;
- a condition/pathfinding DSL.

This is a positive abstraction result at a deliberately small scope.

## 10. Acceptance result

Qualified on the first complete behavioral candidate:

- preregistration preceded behavior: PASS;
- bounded authored graph: PASS;
- player-facing legal-destination UI: PASS;
- canonical Player location changes on legal travel: PASS;
- illegal direct travel rejected below UI before mutation: PASS;
- ordinary production `REACH_LOCATION` Quest progresses through existing listener: PASS;
- no new Travel-to-Quest bridge: PASS;
- save/load preserves intermediate canonical location and continued travel: PASS;
- no duplicate player-location authority: PASS;
- no generalized world/pathfinding DSL: PASS;
- accumulated M4-M18 behavioral suite: PASS;
- TypeScript: PASS;
- production build: PASS.

The documentation-complete head is intentionally qualified separately after this result/canon update. Final exact-head Build Validation and merge evidence live in PR #43 so this result record does not require a recursive post-qualification documentation mutation.

## 11. Qualified claim

> One bounded authored world graph supports legal player-facing movement, authoritative direct-route validation, persistence, and ordinary location-sensitive Quest consequence through existing `setLocation` event/listener contracts, without a duplicate current-location store or generalized pathfinding/world simulation.

## 12. Evidence ceiling

M18 does **not** qualify:

- open-world exploration;
- coordinate movement;
- pathfinding beyond one authored direct edge;
- travel duration or travel-time economy;
- mid-travel state;
- random travel encounters;
- location-resource simulation;
- procedural maps;
- NPC schedules;
- Copy travel;
- offline travel;
- world-derived Relationship Tether;
- campaign-scale navigation;
- human travel pacing, comprehension, or enjoyment.

## 13. Next planned boundary

M19 may now use the objective spatial facts established by M18 to ask whether current world presence can derive Relationship Tether while leaving historical Relationship state unchanged.

M18 itself does not derive Tether, change Relationship history, or begin M19.
