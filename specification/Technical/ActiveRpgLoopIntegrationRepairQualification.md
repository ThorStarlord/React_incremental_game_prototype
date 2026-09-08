# Active RPG Loop Integration Repair Qualification

**Status:** Preregistered before behavioral implementation  
**Baseline commit:** `3977921f24c9dab8ef057c2752d528c965f07d5f`  
**Baseline tree:** `9c55147dde67a04dd06bb0168dc4cfc95f13eaba`  
**Authority:** `CheckpointBActiveRpgLoopResult.md` (`CHECKPOINT_B_WEAK`)

## Scientific question

Can the existing bounded RPG slices be made spatially coherent by making canonical world presence authoritative for one production Combat encounter and anchored-NPC in-person interaction, while giving the player immediate bounded feedback about travel-induced Relationship/Tether consequences, without adding a generalized world-state, encounter-condition, NPC-schedule, pathfinding, or proximity engine?

## Problem being repaired

Checkpoint B found that the underlying Relationship, Trait, Quest, Combat, Exploration, Tether, and Essence authorities compose technically, but objective world space remains bypassable at two important active-play boundaries:

1. the M17 Telluric Echo encounter can be surfaced from the global Dashboard away from its fictional/world location;
2. anchored NPCs can be actively interacted with regardless of the player's canonical location, while the legacy `same_location` filter compares incompatible descriptive/canonical location representations;
3. travel changes effective Tether/Essence, but the travel surface does not immediately explain that opportunity cost.

M20 remains unauthorized until this repair is qualified and Checkpoint B is re-run.

## Target causal contracts

```text
canonical Player location
+ authored encounter location
-> encounter availability

canonical Player location
+ qualified NPC world anchor
-> in-person interaction availability

legal travel
-> changed canonical Player location
-> changed spatial Tether / Relationship-derived Essence where applicable
-> bounded immediate player-facing feedback
```

## Product invariants

- Objective location must matter for actions that are explicitly local.
- Remote knowledge of a discovered NPC is not the same as physical presence with that NPC.
- Relationship history, Connection, Memories, dimensions, Stability, and Resonance Quality must not change merely because the player moves.
- Permanent Trait ownership remains capability authority.
- Quest remains objective/lifecycle authority.
- Exploration remains authored topology/travel authority.
- NPC-domain world anchors remain the bounded authority for qualified NPC physical location.
- Relationship remains historical/relational authority; spatial Tether remains a derived current-world projection.
- `capability != decision` and `presence != relationship progression` remain true.

## Required acceptance criteria

### A. Production Combat location authority

1. The existing M17 Telluric Echo encounter has one authored canonical location requirement.
2. With its Quest active but the player outside that location, the player cannot begin or perform the encounter through the production UI.
3. Direct/runtime bypass of the location requirement is rejected before Combat/Quest mutation if the chosen implementation has a callable runtime boundary below UI.
4. After legal travel to the required location, the same encounter becomes available and remains otherwise behaviorally identical to the qualified M17 encounter.
5. No M17/Willow-specific branch is added to generic active-combat UI/runtime logic.

### B. Anchored NPC in-person authority

6. A discovered anchored NPC remains remotely inspectable enough to preserve relationship-history legibility.
7. In-person actions for an anchored NPC are unavailable when the player is not at that NPC's canonical world anchor.
8. After legal travel to the anchor, the same in-person actions become available.
9. At least Willow and Gronk exercise the same generic presence rule (Rule-of-Two).
10. The legacy `same_location` NPC filter no longer compares descriptive `NPC.location` strings directly against canonical `Player.location` for qualified anchored NPCs.
11. Unanchored NPC behavior remains backward-compatible unless recon proves a smaller safe rule.

### C. Spatial consequence feedback

12. A legal travel action that changes at least one qualified NPC's spatial Tether produces bounded immediate player-facing feedback on the travel surface or directly adjacent active-play surface.
13. The feedback identifies enough causal information for the player to understand that presence/Tether or Relationship-derived Essence changed because of movement.
14. The feedback does not claim that Connection/Trust/Affinity/history changed.
15. Willow and Gronk can demonstrate simultaneous opportunity cost from one movement where the existing M19 topology supports it.

### D. Regression / architecture controls

16. Existing M4-M19 qualification remains green.
17. Dedicated repair qualification covers the three causal contracts above.
18. Save schema does not change unless prerequisite recon demonstrates that current canonical persisted facts are insufficient.
19. No new Relationship dimension, shadow proximity boolean, duplicate player location, or duplicate NPC location authority is introduced.
20. Production build passes on the exact final candidate.

## Rule-of-Two policy

Generic infrastructure must be justified by repeated semantics, not a single content case.

Expected repeated probes:

- anchored NPC presence: Elder Willow + Gronk;
- travel feedback: one movement that changes both Willow and Gronk when possible;
- encounter presence may have only one current production encounter, so the repair should prefer the smallest optional/required canonical-location field on the existing encounter definition rather than a generalized condition language.

## Recon questions to answer before behavioral implementation

1. Where is the smallest Combat-owned boundary that can represent a canonical encounter location without creating a condition DSL?
2. Which component owns NPC tabs/actions, and can it distinguish remote inspection from in-person interaction without hiding Relationship history?
3. Can the M19 NPC world-anchor lookup be reused directly for presence checks and the legacy `same_location` filter?
4. What existing post-travel state is available to produce truthful before/after Tether/Essence feedback without adding persistence?
5. Which exact NPC actions should count as in-person in the current UI, and which should remain remotely inspectable?
6. Can all three repairs be made without touching Relationship reducer semantics, save schema, or Quest content beyond an encounter's own authored location metadata?

## Falsification / stop conditions

Stop and isolate a prerequisite instead of forcing this repair if recon shows any of the following:

- encounter location requires a general-purpose boolean/condition AST;
- anchored-NPC interaction cannot be bounded without a broad NPC availability/schedule rewrite;
- M19 anchors cannot be reused without introducing a second NPC-location authority;
- truthful travel feedback requires persisted proximity history or Relationship mutation;
- the repair requires coordinates, continuous distance, pathfinding, travel time, autonomous NPC movement, NPC schedules, remote-contact simulation, or a generalized world-state engine;
- old saves require an unexpectedly broad migration unrelated to the three checkpoint findings.

## Explicit non-goals

This repair does not qualify or implement:

- open-world navigation;
- coordinates or continuous distance;
- generalized graph-distance semantics beyond existing M18 adjacency;
- NPC schedules or autonomous movement;
- travel duration/random encounters;
- remote communication simulation;
- spatial `Absent` or activity-derived `Engaged`/`Deeply Engaged` beyond existing M19 scope;
- general encounter-condition or ability DSLs;
- generalized world-state architecture;
- Copy automation;
- offline progress;
- M20 or later milestones.

## Evidence ceiling if PASS

A PASS may establish only that the existing bounded active-RPG slices no longer bypass canonical world presence at the qualified Combat and anchored-NPC interaction boundaries, and that legal travel can immediately explain bounded spatial Relationship/Tether consequences. It does not establish general world simulation, broad combat/exploration completeness, human fun/pacing, or campaign-scale spatial balance.

## Stop boundary

If this repair passes, document the empirical result, exact evidence ceiling, and architecture; merge the exact qualified head; then **stop and re-run Checkpoint B**. Do not begin M20 in the same milestone.