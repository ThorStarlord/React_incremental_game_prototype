# Relationship Progression Redesign

**Status:** Target design approved for implementation planning  
**Runtime status:** Not yet implemented  
**Purpose:** Provide one authority/index for the relationship, Essence, Memory, and Trait Resonance redesign while migration is in progress.

## Why this document exists

The repository currently contains two kinds of truth that must not be confused:

1. **Implemented behavior** — documented in `Features/NPCSystem.md`, `Features/EssenceSystem.md`, `Features/TraitSystem.md`, and the current TypeScript runtime.
2. **Approved target design** — documented by the relationship redesign package below.

Until the migration is complete, implementation-status documents remain accurate descriptions of what the game does today. The redesign documents define what the relationship progression loop is intended to become.

## Approved target-design package

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — canonical ontology, Relationship Experience schema, Bond Profile, Connection qualification, and invariants.
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark Memory model and player-facing Memory Cards.
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — relationship-derived passive Essence generation and Trait assimilation/Resonance.
- [`Narrative/ElderWillowVerticalSlice.md`](Narrative/ElderWillowVerticalSlice.md) — first authored proof of the complete loop.
- [`Technical/RelationshipSystemMigrationPlan.md`](Technical/RelationshipSystemMigrationPlan.md) — staged runtime migration from the existing model.

## Authority during migration

When the documents conflict:

- for **current runtime behavior**, the current implementation and implementation-status feature specs win;
- for **new relationship-system implementation work**, the target-design package above wins;
- temporary compatibility behavior must be marked as transitional and should not silently redefine the target ontology.

## Core target loop

```text
Narrative interaction
-> Relationship Experience
-> relationship dimensions
-> qualified Connection
-> optional landmark Memory
-> Bond Profile
-> passive Essence-rate change
-> Trait assimilation
-> permanent Resonance
```

## Key changes from the current prototype

### Current

```text
Affinity
-> reaches 100
-> connectionDepth +1
-> more Essence/sec
-> minimum connectionDepth + enough Essence
-> permanent Trait
```

### Target

```text
Meaningful Experiences
-> multidimensional relationship change
-> Connection qualification with evidence
-> landmark Memories
-> relationship-derived Essence rate
-> sustained Trait assimilation
-> Memory/Connection evidence + Essence
-> permanent Trait Resonance
```

## Non-negotiable invariants

1. Affinity is short-term disposition, not Connection XP.
2. Connection is meaningful relational significance, not affection.
3. Negative/adversarial Experiences can deepen Connection.
4. Experiences do not normally mint relationship Essence as lump-sum rewards.
5. Every Memory references an actual Experience.
6. Not every Experience becomes a Memory.
7. Repetition cannot grind deep Connection without new relational meaning.
8. Trait Resonance requires relationship evidence and assimilation, not only currency and a scalar relationship level.
9. Manipulative/instrumental relationships remain mechanically viable.
10. Reciprocal/authentic relationships may later unlock qualitatively different outcomes rather than receiving a simplistic universal bonus.

## Validation order

### 1. Elder Willow

Friendly/mentor proof:

```text
Encounter
-> First Lesson
-> Ancient Seed choice
-> The Seed Preserved Memory
-> contradiction/disagreement
-> sustained teaching/tether
-> The Lesson Made Yours Memory
-> Willow's Wisdom Resonance
```

### 2. Lyra

Adversarial proof:

```text
low or volatile Affinity
+ high Understanding
+ ideological conflict
+ rival recognition
+ shared survival
-> high Connection
-> strong Resonance
```

If Lyra requires hard-coded exceptions in generic relationship mechanics, the model is not yet universal.

## Explicitly deferred

- broad campaign rewrite;
- Copy-system redesign;
- procedural or LLM-generated Memories;
- autonomous NPC social simulation;
- automatic universal Memory scoring;
- multiple Essence currencies;
- large-scale authenticity/endgame mechanics;
- migration of every NPC before Willow is proven.

## Next engineering milestone

Implement **M3 — Runtime Foundation** from `Technical/RelationshipSystemMigrationPlan.md`:

1. add `Relationships` domain types/slice/selectors;
2. register the reducer;
3. record Willow Experiences in shadow mode;
4. add idempotency;
5. add explicit authored Memory formation;
6. add debug visibility;
7. keep current Affinity/Connection behavior intact until shadow-state validation passes.

Do not cut over Essence or Trait Resonance until the shadow relationship state can reproduce the intended Willow causal history reliably.
