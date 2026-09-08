# M19 — World-Derived Relationship Tether Qualification

**Status:** Preregistered before behavior changes  
**Baseline main:** `5042082bb3de32bd69c469ecc6693eb07e60a0a1`  
**Baseline tree:** `15bc127db5ba3868a5ac6c68cc7800138569e109`

## Scientific question

> Can objective world presence alter the current intensity of Relationship-derived Essence generation without rewriting Relationship history, Connection, Memories, or Bond dimensions?

## Target causal path

```text
Relationship history
-> Connection / Resonance Quality / Stability
+
objective player/NPC world presence
-> effective Tether
-> current Relationship-derived Essence contribution
```

## Core invariant

```text
historical significance != current presence

leaving an NPC != losing Connection
leaving an NPC -> different current Tether -> different current Essence contribution
```

Spatial presence must not implicitly change Affinity, Trust, Understanding, Shared Meaning, Reliance, Vulnerability, Reciprocity, Connection, Connection Progress, Memories, Stability, or Resonance Quality.

## Existing substrate to preserve

M19 begins from these already-implemented authorities:

- M18 `Player.location` is the canonical live player-location fact.
- M18 Exploration owns bounded authored direct adjacency and has no world-position reducer.
- Relationship `BondProfile` already carries the Tether ontology (`absent`, `remote`, `nearby`, `present`, `engaged`, `deeplyEngaged`).
- Relationship Essence already applies the Tether multiplier as one factor in `Connection Base x Resonance Quality x Tether x Stability`.
- Relationship bundles may currently declare static/starting Tether values. M19 must preserve backward compatibility for contexts not covered by world-derived spatial presence.

M19 is therefore a derivation/integration experiment, not a new Essence formula.

## Prerequisite recon gates

Before behavior changes, determine:

1. What authority currently represents an NPC's objective world location, and whether its representation can map cleanly onto M18 canonical location IDs.
2. Whether spatial Tether should be stored by mutating `BondProfile.tetherState` or derived at selection/calculation time from persisted world facts.
3. Whether a bounded mapping for Willow and Gronk can be introduced without migrating every NPC/location representation.
4. Whether old authored/static Tether semantics can remain available for relationships without world-location metadata.
5. Whether save/load can reconstruct the same spatial Tether purely from already-persisted facts, without a save-schema version bump.

If these gates expose a broad NPC-location migration, duplicate world-state authority, or required Relationship-history mutation merely to represent movement, stop M19 and isolate the prerequisite repair.

## Rule of Two

Use two independent existing Relationship-authority NPCs if recon confirms their world-location semantics can be bounded cleanly:

- `npc_elder_willow` — expected canonical world area: `location_whispering_woods`;
- `npc_blacksmith_gronk` — expected canonical world area: `location_city_center`.

The generic runtime must not branch on Willow/Gronk IDs.

## Candidate spatial derivation

The exact implementation is intentionally deferred until recon. The working semantic target is:

```text
same canonical location     -> present
directly adjacent location  -> nearby
reachable non-adjacent      -> remote
disconnected/unresolvable   -> absent or static fallback, as recon warrants
```

`engaged` and `deeplyEngaged` are not required for M19. They imply activity/context beyond spatial proximity and should remain authored/contextual unless independently warranted.

## Required controls

### A. Willow movement control

With Willow Relationship history held constant, move only the player across the M18 graph and verify:

- effective spatial Tether changes;
- Relationship-derived Essence/sec changes according to the existing multiplier table;
- historical Relationship state is unchanged;
- returning restores the appropriate spatial Tether/rate.

### B. Gronk independent corroboration

Exercise the same generic rule with Gronk at a structurally different graph position.

### C. Simultaneous opportunity-cost case

At one player location, Willow and Gronk should be able to derive different Tether bands from the same world fact. Moving toward one may move away from the other.

### D. Save/load reconstruction

Save at a location whose spatial Tether is not the default for at least one probe NPC, load with the existing migration path, and verify the same effective Tether and Essence contributions are reconstructed without storing a duplicate proximity flag.

### E. Static fallback compatibility

A Relationship-authority source without M19 world-location metadata must retain its existing authored/static Tether semantics rather than being silently forced into a spatial band.

## Acceptance criteria

M19 passes only if all are true:

1. Two existing Relationship-authority NPCs use one generic world-derived spatial Tether rule.
2. `Player.location` remains the player-location authority.
3. NPC spatial anchoring uses one bounded objective-world representation rather than story booleans.
4. Moving the player changes effective Tether and Relationship-derived Essence/sec.
5. Connection and Connection Progress do not change from travel alone.
6. Bond dimensions do not change from travel alone.
7. Memories do not change from travel alone.
8. Stability and Resonance Quality do not change from travel alone.
9. Returning to a prior location restores the corresponding Tether/rate.
10. Two NPCs can have different spatial Tether bands from the same player location.
11. Save/load reconstructs the same effective Tether from persisted world facts.
12. Existing static/authored Tether remains compatible where spatial derivation does not apply.
13. No `nearWillow`, `gronkPresent`, or equivalent shadow proximity booleans are introduced.
14. No duplicate player/world-location reducer is introduced.
15. No Willow/Gronk-specific branch appears in generic Relationship/Essence runtime.
16. Accumulated M4-M19 qualification passes.
17. Production build passes on the exact final head.

## Falsification / stop conditions

Stop M19 rather than accommodate it if:

- NPC objective location cannot be represented without a broad migration unrelated to the two probes;
- spatial presence requires duplicating `Player.location` or creating a second world-position authority;
- travel must mutate Relationship history merely to represent current presence;
- the existing Essence selector cannot consume derived Tether without destabilizing static/authored relationships;
- one spatial use case requires a generalized presence/condition DSL;
- save compatibility requires a broad schema migration not justified by this milestone;
- the M18 topology cannot distinguish meaningful spatial bands for two probes.

A clean stop is valid evidence.

## Explicit non-goals

M19 does not attempt to qualify:

- coordinates or continuous distance;
- generalized pathfinding beyond M18;
- NPC schedules or autonomous NPC travel;
- Copy travel;
- travel duration or offline travel;
- relationship decay from distance;
- Affinity/Trust gain from proximity;
- conversation/activity-derived `engaged` / `deeplyEngaged` semantics;
- arbitrary Tether scripting/condition DSLs;
- campaign-scale presence simulation;
- human fun, pacing, or economy balance.

## Evidence ceiling

A PASS may establish only:

> Objective bounded world presence can influence current Relationship-derived Essence intensity through a generic spatial Tether derivation while historical Relationship authority remains unchanged and existing static Tether semantics remain compatible outside the qualified spatial cases.

It does not establish a general presence simulation, relationship decay, NPC scheduling, activity-derived Tether, campaign-scale spatial economy, or human playability.

## Merge authority

Exact-head Build Validation is merge authority. Gemini or other review workflows are not merge authority. No post-merge CI claim may be made unless a workflow run actually exists for the merge commit.

## Next boundary

If M19 passes and is merged, STOP and run Checkpoint B — Active RPG Loop. Do not create M20 merely because M19 passed.