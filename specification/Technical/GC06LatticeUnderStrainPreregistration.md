# GC-06 Chapter 4 Preregistration — Lattice Under Strain

**Status:** IMPLEMENTATION PREREGISTRATION  
**Program:** Campaign One / 1.0 Game Completion  
**Prepared:** 2026-09-20

## Dramatic problem

The Telluric Echo stops being a distant phenomenon and begins stressing the local network the player has already built. Archive evidence identifies a repeating lattice failure, but institutions and relationship anchors do not automatically share the same awareness or preferred response.

## Entry requirements

- GC-03 opening spine complete;
- Elara independent verification exists;
- Lyra `Enemies in Phase` evidence exists;
- one Chapter 1 Merchant District relationship path exists.

## Primary anchors

- Elara — diagnosis and archive interpretation;
- Valerius — institutional response;
- Gronk — constraint/load-path interpretation;
- Lyra — adversarial/counterphase interpretation and Chapter 5 exit;
- Willow remains available through build profile capability rather than mandatory dialogue dominance.

## Player-owned consequential choices

The Chapter 4 stabilization quest has three legal resolution strategies:

1. **Contain Surface Failures** — baseline route, no optional Trait required;
2. **Reroute the Lattice Load** — requires permanent `WillowsWisdom` + `ConstraintSense`;
3. **Phase Against the Echo** — requires permanent `ScholarlyInsight` + `AdversarialCalibration`.

The two capability routes are the first explicit campaign consumers of differentiated two-Trait build profiles. Baseline viability remains mandatory.

## Post-implementation doctrine reconciliation

The original GC06 preregistration above correctly established the two learned Trait pairs. After the bounded Relationship Capability Constellation gained a qualified player-facing selection surface, GC06 became the first production decision to distinguish permanent knowledge from current specialization:

```text
Reroute the Lattice Load
-> requiredActiveDoctrineIds: structural_steward

Phase Against the Echo
-> requiredActiveDoctrineIds: countermodeler
```

The matching permanent Traits are still required indirectly because doctrine derivation fails closed unless every required Trait is permanently learned and currently foregrounded. The baseline **Contain Surface Failures** route remains legal with no optional doctrine.

This is a bounded reconciliation of the implemented route gate, not a retroactive claim that the original preregistration already specified doctrine focus.

## Canonical authorities consumed

- Relationship Experience / Memory — Chapter 1, Elara, Lyra, capability provenance;
- Traits / permanent capability authority + Player doctrine focus — the two optional build-profile resolutions consume active doctrine while the baseline remains ungated;
- Knowledge — NPC-specific awareness of the lattice diagnosis;
- Faction Reputation — City Watch response remains institutional rather than Relationship state;
- World State — objective regional lattice condition;
- Quest — player-owned stabilization strategy.

## Canonical authorities changed

- new Chapter 4 Relationship Experiences;
- NPC-specific knowledge of `fact_gc06_lattice_echo_pattern`;
- bounded City Watch institutional response;
- Merchant District `latticeIntegrity` changes from `strained` to `stabilized`;
- one Chapter 4 route consequence;
- Lyra exit evidence establishing a legal Chrono-Crypt reason.

## Capability/build relevance

Two build profiles become materially different legal options without creating a build-profile reducer or skill tree:

```text
Structural Steward
WillowsWisdom + ConstraintSense
-> reroute lattice load around the failing stress pattern

Countermodeler
ScholarlyInsight + AdversarialCalibration
-> model the Echo as an opponent and phase the response against its contradiction
```

## Routine/delegation relevance

None required in Chapter 4. GC-05 breadth is reserved for later preparation pressure; Chapter 4 remains focused on network diagnosis and strategic response.

## Long-horizon callbacks

- Chapter 1 relationship history gates the diagnosis context;
- Archive Inquiry produces the epistemic basis;
- Enemies in Phase provides the adversarial model;
- selected Chapter 4 route is preserved as Relationship evidence for Chapters 5–Finale.

## Exit conditions

- the lattice is objectively stabilized;
- one legal response strategy is recorded;
- Lyra records that ordinary local stabilization is insufficient;
- a legal reason to enter the Chrono-Crypt exists.

## Negative/rejection paths

- later evidence cannot skip GC-03;
- missing permanent Traits or an inactive matching doctrine hide/reject only the corresponding optional resolution;
- baseline resolution remains legal without optional Traits;
- Valerius institutional response cannot occur before he knows the diagnosis;
- lattice stabilization cannot be claimed before a route decision;
- Chrono-Crypt exit evidence cannot exist while lattice integrity remains strained;
- no generic Echo meter, ChapterEngine, narrative DSL, or chapter save root.

## Save/load expectations

All Chapter 4 state is derived from existing persisted authorities: Relationship, Quest, Knowledge, Faction, World State, permanent Traits and Player-owned `doctrineFocus`. No chapter-owned save-schema root is permitted.
