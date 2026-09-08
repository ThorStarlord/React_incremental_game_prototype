# M19 — NPC World Anchor Recon Correction

**Status:** Frozen before runtime behavior changes

This note refines one implementation detail from `M19WorldDerivedTetherReconAmendment.md` while preserving its authority boundary.

## New finding

Current NPC location is static authored content loaded into NPC state, but saves may contain snapshots created before any additive `worldLocationId` field exists. Adding a new field only to `npcs.json` would therefore make canonical anchors depend on when the NPC snapshot was created/loaded and would weaken old-save behavior for no gameplay benefit.

## Corrected bounded representation

For M19, the NPC domain will own a small authored canonical-anchor definition table, exposed through a pure lookup:

```text
npc_elder_willow     -> location_whispering_woods
npc_blacksmith_gronk -> location_city_center
```

This table is **content/definition data**, not branching control flow. Generic Relationship/Essence code may ask the NPC domain for an anchor by NPC ID but must not contain Willow/Gronk IDs itself.

The existing descriptive `NPC.location` field remains unchanged.

## Why this is preferable for M19

- no save migration or schema bump;
- old and current saves use the same static NPC anchor definitions;
- no duplicate live NPC-position reducer is introduced;
- ownership remains outside Relationship state;
- future NPC movement/schedules can replace the static lookup with a live NPC world-position authority without changing the Relationship Essence contract.

## Unchanged decisions

All other recon decisions remain frozen:

- spatial Tether is derived at selector time, not written by travel;
- `BondProfile.tetherState` remains authored/static fallback;
- same location -> `present`;
- direct neighbor -> `nearby`;
- other distinct canonical location -> `remote`;
- unresolved/unanchored -> static fallback;
- M19 does not derive `absent`, `engaged`, or `deeplyEngaged`;
- no generalized pathfinding, schedules, movement, proximity booleans, or save changes.