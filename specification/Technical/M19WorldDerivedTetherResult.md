# M19 — World-Derived Relationship Tether Result

**Verdict:** QUALIFIED — PASS  
**Baseline:** `5042082bb3de32bd69c469ecc6693eb07e60a0a1`  
**Baseline tree:** `15bc127db5ba3868a5ac6c68cc7800138569e109`

## Scientific question

> Can objective world presence alter the current intensity of Relationship-derived Essence generation without rewriting Relationship history, Connection, Memories, or Bond dimensions?

## Result

Yes, within the bounded M19 evidence ceiling.

M19 qualifies this causal path:

```text
Player.location
+
NPC canonical world anchor
+
M18 direct adjacency
-> effective spatial Tether
-> existing Relationship Essence formula
-> cached passive Essence generation rate
```

Travel changes current spatial presence and therefore current Essence intensity without dispatching a Relationship-history mutation.

## Production Rule-of-Two probes

NPC-domain authored anchors:

```text
npc_elder_willow     -> location_whispering_woods
npc_blacksmith_gronk -> location_city_center
```

Generic Relationship selectors do not contain Willow/Gronk IDs.

### Spatial projection

For a resolvable M18 player location and an anchored NPC:

```text
same canonical location          -> present
directly adjacent location       -> nearby
other distinct canonical location -> remote
```

If an NPC has no M19 canonical anchor, the existing persisted `BondProfile.tetherState` remains the authored/static fallback.

M19 does not derive `absent`, `engaged`, or `deeplyEngaged` from space.

## Willow control

With Willow Relationship history frozen at Connection 2 and a stable Strong-quality profile:

```text
Player: City Center
Willow: Whispering Woods
-> remote 0.40x
-> Relationship contribution 0.05000/sec

Player: City Gate
-> nearby 0.75x
-> Relationship contribution 0.09375/sec

Player: Whispering Woods
-> present 1.00x
-> Relationship contribution 0.12500/sec
```

Returning through City Gate to City Center restores the earlier remote contribution.

Across these movements, the qualified test verifies that Willow's stored Bond Profile remains byte-equivalent: no Connection, Connection Progress, Bond dimension, Memory-derived profile field, Stability, Resonance Quality, or stored authored Tether is rewritten by travel.

## Gronk corroboration / opportunity cost

Gronk independently exercises the same generic projection from a different graph position.

At City Center:

```text
Willow -> remote
Gronk  -> present
```

At City Gate:

```text
Willow -> nearby
Gronk  -> nearby
```

At Whispering Woods:

```text
Willow -> present
Gronk  -> remote
```

This is the first bounded proof that one objective player-location fact can make one Relationship more immediately resonant while making another less immediate, without changing either historical Relationship.

## Actual passive-rate integration

Relationship contribution selectors already calculated the pure rate. M19 additionally qualifies the cached `essence.generationRate` following movement.

The existing `setLocation` listener now recalculates the existing pure Essence rate after location-sensitive Quest/escort processing.

It does not dispatch `setRelationshipTetherState` or otherwise mutate Relationship history.

Therefore:

```text
world fact changes
-> effective spatial Tether changes
-> passive Essence cache refreshes
```

rather than:

```text
travel
-> rewrite Bond history
```

## Authored/static fallback

An unanchored Relationship-authority probe using Elara remains on its authored `engaged` Tether across player movement.

This qualifies backward-compatible coexistence:

```text
anchored M19 NPC -> spatial effective Tether
unanchored NPC    -> stored authored/static Tether
```

M19 therefore does not globally reinterpret every existing Tether state as spatial proximity.

## Persistence

The qualification saves at City Gate with Willow and Gronk both spatially `nearby`, reloads through the existing save/migration path, and reconstructs the same effective Tether/contributions from persisted `Player.location` plus static NPC anchor definitions.

No proximity flag and no new save-schema field/version is required.

## Architecture finding

The existing architecture was sufficient with two bounded additions:

1. NPC-domain static canonical world anchors for the two qualified probes;
2. effective spatial Tether derivation in Relationship selectors, plus passive-rate refresh on the existing `setLocation` event.

No new World reducer, Relationship dimension, location duplicate, Tether DSL, pathfinding engine, or save schema was warranted.

The significant authority separation is:

```text
Exploration -> topology / adjacency
Player      -> current player location
NPC         -> bounded canonical NPC world anchor definitions
Relationship-> historical Bond + authored static Tether fallback
Selector    -> current effective spatial Tether projection
Essence     -> consumes effective Tether in existing formula
```

## First complete behavioral candidate

- SHA: `89333549eae81b996a348a07d457e40becca17a8`
- tree: `e79efa802dcbeb1c0f2efd968dcc694ee6d5f612`

Build Validation #180:

- run: `34174688436`
- job: `101901660861`
- dependency installation: PASS
- TypeScript: PASS
- accumulated M4-M19 behavioral qualification: PASS
- production build: PASS

No repair cycle was required after the first complete behavioral candidate entered CI.

## Qualified claim

> In a bounded four-location production graph, objective player location relative to two independently anchored Relationship-authority NPCs can derive current `remote`, `nearby`, or `present` Tether, materially changing their Relationship-derived passive Essence contributions and the cached generation rate while leaving historical Bond state unchanged. Unanchored Relationships retain authored/static Tether, and save/load reconstructs spatial Tether without duplicate proximity persistence.

## Evidence ceiling

M19 does **not** qualify:

- coordinates or continuous distance;
- generalized shortest-path/distance calculation;
- `absent` as a spatially derived state;
- `engaged` / `deeplyEngaged` activity semantics;
- NPC schedules, NPC movement, or dynamic NPC positions;
- Copy travel/presence;
- travel duration or offline travel;
- Relationship decay from distance;
- automatic Relationship improvement from proximity;
- campaign-scale spatial economy or balance;
- human comprehension, pacing, or enjoyment.

## Next boundary

M19 completes the planned active-RPG mechanics sequence through spatial presence. The next step is **Checkpoint B — Active RPG Loop**, not M20 implementation.

Checkpoint B should evaluate whether Relationship, Trait, Quest, Combat, Travel, Presence/Tether, and Essence now operate as one coherent active-play loop, and whether automation would enhance rather than mask that loop.