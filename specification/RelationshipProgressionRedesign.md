# Relationship Progression Redesign

**Status:** Target design approved; staged runtime migration in progress  
**Runtime status:** M3 shadow runtime implemented; legacy Affinity/Connection authority intentionally retained  
**Purpose:** Provide one authority/index for the relationship, Essence, Memory, and Trait Resonance redesign while migration is in progress.

## Why this document exists

The repository currently contains two kinds of truth that must not be confused:

1. **Implemented legacy behavior** — documented in `Features/NPCSystem.md`, `Features/EssenceSystem.md`, `Features/TraitSystem.md`, and the existing Affinity/`connectionDepth` runtime.
2. **Approved target design** — documented by the relationship redesign package below and now partially represented by the additive Relationships shadow runtime.

Until explicit cutover phases land, implementation-status documents remain accurate descriptions of authoritative gameplay behavior. The redesign documents define what relationship progression is intended to become.

## Approved target-design package

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — canonical ontology, Relationship Experience schema, Bond Profile, Connection qualification, and invariants.
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark Memory model and player-facing Memory Cards.
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — relationship-derived passive Essence generation and Trait assimilation/Resonance.
- [`Narrative/ElderWillowVerticalSlice.md`](Narrative/ElderWillowVerticalSlice.md) — first authored proof of the complete loop.
- [`Technical/RelationshipSystemMigrationPlan.md`](Technical/RelationshipSystemMigrationPlan.md) — staged runtime migration from the existing model.

## Authority during migration

When the documents or runtime layers conflict:

- for **current gameplay authority**, legacy NPC Affinity/`connectionDepth`, current Essence generation, and current Trait Resonance behavior win until their explicit cutover phase;
- for **new relationship-system implementation work**, the target-design package above wins;
- the `relationships` Redux slice is currently **shadow evidence**, not authoritative gameplay state;
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

### Current authoritative gameplay

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

## M3 implementation status — Shadow Runtime

M3 is implemented as an additive validation layer.

### Implemented

- `src/features/Relationships/` domain with serializable TypeScript types, normalized Redux state, selectors, and authored-event thunk;
- `relationships` reducer registered in the root store;
- durable Relationship Experience ledger with stable unique-key idempotency;
- seven universal relationship dimensions plus custom-dimension support;
- shadow Bond Profiles with Connection Progress, recent Experiences, Memories, archetypes, simple explainable Resonance Quality, and Stability projections;
- explicit authored Memory formation, including repair when an Experience exists but its Memory projection is missing;
- authored Elder Willow Experience/Memory bundle under `public/data/relationships/elder-willow.json`;
- `RELATIONSHIP_EXPERIENCE` dialogue effects supporting fixed and response-specific authored events;
- deterministic response buttons in the dialogue UI so the recorded Experience matches the player's actual choice;
- New Game shadow-state reset and Willow seed profile (`Trust: 5`, other new dimensions at baseline);
- debug comparison between legacy Willow Affinity/Depth and the shadow Bond Profile;
- debug injection for landmark Willow events to exercise idempotency and Memory formation;
- production-build CI gate via `.github/workflows/build-validation.yml`.

### Intentionally still legacy-authoritative

- automatic `Affinity >= 100 -> connectionDepth +1`;
- Essence generation from legacy `connectionDepth`;
- Trait Resonance gate based on minimum `connectionDepth` + Essence balance;
- current Ancient Seed quest reward, including its direct Essence payout;
- broad NPC relationship migration.

### Willow runtime reachability in M3

The first Willow dialogue can now create response-specific WE-01 shadow Experiences, and the visible teaching continuation can create WE-02 evidence. Later authored beats (Seed decision, disagreement, tether teaching, independent application) exist in the authoring bundle and can be exercised through the debug panel, but they are **not yet all wired into complete playable quest/story delivery**.

That distinction is deliberate: M3 proves the relationship evidence runtime before changing quest and progression authority.

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

## Current engineering gate

Before the first authority cutover:

1. production build must pass on the exact PR head;
2. Willow shadow Experiences must remain idempotent under repeated dialogue/debug attempts;
3. Memories must always reference recorded Experiences and survive later negative deltas;
4. debug comparison must make legacy-vs-shadow divergence explainable;
5. no relationship-shadow event may alter legacy `connectionDepth` merely by being recorded.

The first build-validation run exposed a baseline `StatDisplay.tsx` compile defect (`useState`/`useEffect` used without imports); that unrelated defect is fixed on this branch so subsequent build qualification can reach the new relationship code.

## Next engineering milestone after M3 qualification

Proceed to the **first authority cutover and M4 integration** in staged order rather than all at once:

1. implement qualified Connection evaluation from Experience/Memory evidence;
2. stop Affinity from automatically leveling Connection only after Willow shadow behavior is validated;
3. migrate Willow Essence contribution to Bond-derived rate inputs;
4. introduce Trait compatibility/assimilation state for `WillowsWisdom`;
5. wire the Ancient Seed and independent-application beats into playable delivery;
6. replace immediate Willow Trait purchase semantics with Memory/assimilation/Connection evidence + final Essence expenditure;
7. only then use Lyra as the adversarial generalization test.

Do not cut over all NPCs, Essence generation, and Trait Resonance simultaneously. The migration remains Willow-first and evidence-driven.
