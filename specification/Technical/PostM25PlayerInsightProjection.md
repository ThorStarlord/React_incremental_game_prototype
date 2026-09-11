# Post-M25 Player Insight Projection

**Status:** `REPOSITORY_ONLY / HERMETIC_VALIDATION`  
**Human product-quality evidence:** `UNPROVEN`  
**New canonical state authority:** No

## Purpose

Expose already-earned causal, opportunity, and relationship-derived capability information without creating another gameplay state machine.

The package adds one dashboard surface with three read-only projections:

1. **Causal Journal** — player-visible Relationship Memories linked back to recorded Experiences;
2. **Opportunity Map** — chapter-scale progress derived from the existing chapter presentation definitions and canonical Relationship/dialogue evidence;
3. **Relationship-Derived Build** — discovered or permanent NPC-sourced Traits shown together with existing Connection, assimilation, compatibility, and Memory evidence.

## Authority boundaries

```text
canonical gameplay state
        |
        v
pure selectors
        |
        v
Player Insight UI
```

The projection must not:

- add a reducer or save root;
- write chapter completion;
- discover a Trait;
- acquire a Trait;
- change Relationship, Knowledge, Faction, World State, Copy, Quest, NPC, or Player authority;
- infer hidden authored facts as player-known information;
- choose a route or task for the player.

## Causal Journal contract

The journal reads only `relationships.memoriesById` entries whose `playerVisible` flag is true. A Memory may use its already-recorded origin Experience title as a cause label. Unrecorded authoring definitions are not consulted for hidden causal disclosure.

## Opportunity Map contract

Chapter progress remains a projection from `ChapterDefinitions` / `ChapterSelectors`.

A chapter may become visibly `in_progress` from shared opening evidence before a route label becomes visible. Route labels are shown only after route-specific canonical evidence exists or the route is complete. This prevents a shared opening from leaking future branch names.

The map reports evidence counts rather than fabricating hints about exact unseen prerequisites.

## Relationship-Derived Build contract

NPC-sourced Traits are included only after they are already discovered or permanent under Trait authority.

The projection may derive:

- source NPC;
- current/required Connection;
- current/required assimilation;
- compatibility;
- missing required player-visible Memory tags;
- `developing`, `resonance_ready`, or `permanent` presentation status.

`resonance_ready` is descriptive only. Permanent acquisition remains owned by `acquireTraitWithEssenceThunk` and its existing gates.

## Qualification

`src/features/Story/PostM25PlayerInsightsQualification.test.ts` verifies:

1. hidden Memories do not appear in the causal journal;
2. journal ordering and recorded-origin labeling are deterministic;
3. shared chapter evidence does not leak future branch labels;
4. route-specific evidence reveals only the route actually evidenced;
5. undiscovered authored Traits stay hidden;
6. capability presentation derives developing / resonance-ready / permanent states from canonical state;
7. the panel has no dispatch path and no new slice;
8. the Dashboard surfaces the projection.

## Evidence ceiling

Repository qualification can establish deterministic projection, spoiler-boundary behavior, and absence of duplicate state authority. It cannot establish that humans understand the labels, notice the causal relationships, prefer this dashboard placement, experience reduced confusion, or find the interface enjoyable. Those remain human/product evidence questions.