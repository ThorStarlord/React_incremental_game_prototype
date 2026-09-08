# M19 — World-Derived Tether Recon Amendment

**Status:** Frozen before M19 behavior changes  
**Preregistration commit:** `97a88f596fc898ccfd5e7114173e9349bbe4eef9`

## Recon result

The M19 prerequisite gate **passes**. No broad prerequisite repair is required.

## Existing facts confirmed

1. `Player.location` is the M18 canonical live player-location authority.
2. M18 Exploration exposes canonical location definitions and direct adjacency without a World/Exploration reducer.
3. NPC data already owns a persistent descriptive `location` string, but those strings are finer-grained human labels such as `Whispering Woods - Elder Tree` and `City Center - Gronk's Forge`; they are not the same ontology as M18 canonical IDs.
4. `BondProfile.tetherState` is persisted Relationship state and currently acts as the authored/static Tether input.
5. Relationship Essence already multiplies its base/quality/stability terms by the Tether multiplier.
6. NPC JSON is loaded directly into the NPC state shape, so an additive optional NPC field can persist through ordinary saves without a new save schema version.

## Frozen architecture decision

### NPC domain owns canonical world anchoring

Add an optional field:

```ts
worldLocationId?: string;
```

to `NPC`.

For the Rule-of-Two production probes only:

```text
npc_elder_willow     -> location_whispering_woods
npc_blacksmith_gronk -> location_city_center
```

The existing descriptive `location` field remains unchanged for presentation/legacy use.

This is not a migration of every NPC. Unanchored NPCs remain valid.

### Spatial Tether is derived, not written by travel

M19 will not dispatch `setRelationshipTetherState` when the player travels.

Instead, Relationship selectors will derive an **effective Tether** from objective world facts when both:

- the player location resolves to an M18 canonical location; and
- the NPC has a resolvable `worldLocationId`.

Otherwise the existing stored `BondProfile.tetherState` remains the authored/static fallback.

This preserves the distinction:

```text
BondProfile.tetherState = authored/static fallback/context
world-derived effective Tether = current spatial presence projection
```

M19 does not delete the setter or static field because other existing/future authored contexts may still use them.

## Frozen spatial derivation

For the currently qualified bounded M18 graph:

```text
same canonical location    -> present
directly adjacent location -> nearby
other distinct canonical location -> remote
unresolvable player/NPC anchor -> authored/static fallback
```

M19 deliberately does **not** compute arbitrary shortest paths. The currently qualified graph is bounded and connected; `remote` means a known canonical location that is neither the same nor a direct neighbor.

`absent`, `engaged`, and `deeplyEngaged` are not spatially derived by M19.

## Explainability decision

`RelationshipEssenceContribution` should expose the effective Tether state and whether its source is:

```text
spatial
or
authored
```

The existing explanation lines should report the effective state so the UI does not calculate one Tether while displaying another.

## Rule of Two

### Willow

Anchor: `location_whispering_woods`

Expected examples:

```text
player Whispering Woods -> present
player City Gate         -> nearby
player City Center       -> remote
```

### Gronk

Anchor: `location_city_center`

Expected examples:

```text
player City Center        -> present
player City Gate          -> nearby
player Whispering Woods   -> remote
```

At City Gate both can independently derive `nearby` from the same player world fact.

## Persistence boundary

No new save field is required for spatial Tether itself.

A current save already persists:

- `Player.location`;
- NPC state, including additive `worldLocationId` for loaded M19 NPC definitions;
- Relationship history/static fallback state.

Therefore save/load should reconstruct the same effective Tether by rerunning the selector after load.

Old/unanchored NPC save entries may lack `worldLocationId`; they continue using authored/static Tether rather than being guessed into a spatial location.

## Runtime boundaries

M19 may change only the smallest surfaces necessary to support:

- optional NPC canonical world anchors;
- pure spatial Tether derivation;
- Essence contribution consumption/explainability;
- dedicated qualification coverage;
- accumulated Build Validation;
- truthful specifications/results.

M19 must not introduce:

- travel-triggered Relationship mutations;
- shadow proximity flags;
- a new world-position reducer;
- generalized graph/pathfinding algorithms;
- NPC schedules;
- NPC movement;
- Copy travel;
- activity/conversation-derived engaged states;
- save-schema version changes.

## Expected architecture

```text
Player.location ---------------------+
                                      |
NPC.worldLocationId -----------------+-> spatial Tether projection
                                      |         |
M18 direct adjacency ----------------+         v
                                        effective Tether
                                              |
Bond historical state ------------------------+-> existing Essence formula
```

Relationship history remains unchanged when only the player's world location changes.