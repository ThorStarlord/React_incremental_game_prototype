# Relationship Progression Redesign

**Status:** Target design approved; staged runtime migration in progress  
**Runtime status:** M3 shadow runtime implemented; legacy Affinity/Connection authority intentionally retained  
**Purpose:** Provide one authority/index for the relationship, Essence, Memory, and Trait Resonance redesign while migration is in progress.

## Why this document exists

The repository contains three kinds of truth that must not be confused:

1. **Current runtime behavior** — the TypeScript/Redux implementation that determines what the game actually does.
2. **Older implementation-status documentation** — generally useful, but known to contain some drift from current code.
3. **Approved target design** — documented by the relationship redesign package below and partially represented by the additive Relationships shadow runtime.

When an older feature spec conflicts with current code, the runtime wins as the description of implemented behavior. The redesign package defines the intended destination for new relationship-system work.

## Approved target-design package

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — canonical ontology, Relationship Experience schema, Bond Profile, Connection qualification, and invariants.
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark Memory model and player-facing Memory Cards.
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — relationship-derived passive Essence generation and Trait assimilation/Resonance.
- [`Narrative/ElderWillowVerticalSlice.md`](Narrative/ElderWillowVerticalSlice.md) — first authored proof of the complete loop.
- [`Technical/RelationshipSystemMigrationPlan.md`](Technical/RelationshipSystemMigrationPlan.md) — staged runtime migration from the existing model.

## Authority during migration

When documents or runtime layers conflict:

- for **current gameplay authority**, current runtime behavior wins;
- for **new relationship-system implementation work**, the target-design package above wins;
- the `relationships` Redux slice is currently **shadow evidence**, not authoritative gameplay state;
- temporary compatibility behavior must be marked as transitional and should not silently redefine the target ontology.

## Current Essence implementation drift

The older `Features/EssenceSystem.md` describes NPC `connectionDepth` as contributing directly to passive Essence generation through:

```text
BASE_RATE + Σ(connectionDepth × NPC_CONTRIBUTION_MULTIPLIER) + Copy contribution
```

That is **not what the current runtime does**.

As of this migration branch, `src/features/Essence/state/EssenceThunks.ts#updateEssenceGenerationRateThunk` computes:

```text
current Essence rate
= BASE_RATE_PER_SECOND
+ qualifying Copy contribution
```

`ESSENCE_GENERATION.NPC_CONTRIBUTION_MULTIPLIER` still exists in constants, and NPC relationship updates still request an Essence-rate recalculation, but the recalculation thunk does not currently read NPCs or `connectionDepth`.

Therefore:

- Affinity/`connectionDepth` progression is still live legacy relationship behavior;
- NPC relationship depth is **not currently a live Essence source**;
- M4 should introduce the new Bond-derived NPC Essence contribution rather than pretending to switch an already-active legacy contribution;
- the old Essence feature spec needs reconciliation separately from the relationship redesign.

This drift is important because it makes the new relationship runtime even more central: there is currently no functioning narrative-relationship → Essence-generation bridge in code.

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

Relationship progression:

```text
Affinity
-> reaches 100
-> connectionDepth +1
```

Essence generation:

```text
BASE_RATE_PER_SECOND
+ qualifying Copy contribution
```

Trait Resonance:

```text
minimum source-NPC connectionDepth
+ enough Essence
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
11. While `shadowMode` is true, recording relationship evidence must not mutate authoritative NPC, Essence, Trait, Quest, or Inventory state.

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
- shadow Experience recording is side-effect free with respect to authoritative Essence and other gameplay domains;
- production type/build CI gate via `.github/workflows/build-validation.yml`;
- Gemini review workflow configured for trusted non-interactive CI execution.

### Intentionally still legacy-authoritative or otherwise unchanged

- automatic `Affinity >= 100 -> connectionDepth +1`;
- current base + Copy Essence generation implementation;
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

1. TypeScript type-check and production bundle must pass on the exact PR head;
2. Willow shadow Experiences must remain idempotent under repeated dialogue/debug attempts;
3. Memories must always reference recorded Experiences and survive later negative deltas;
4. debug comparison must make legacy-vs-shadow divergence explainable;
5. no relationship-shadow event may alter authoritative `connectionDepth`, Essence, Traits, Quests, or Inventory merely by being recorded.

Build-validation history exposed two baseline issues unrelated to the relationship runtime:

- `StatDisplay.tsx` used `useState`/`useEffect` without importing them; this branch fixes that compile defect.
- the repository has substantial pre-existing ESLint warning debt. CRA treats those warnings as fatal under `CI=true`, so the build gate is scoped explicitly to `tsc --noEmit` plus a successful production bundle with warnings non-fatal rather than conflating baseline lint debt with M3 correctness.

## Next engineering milestone after M3 qualification

Proceed to the **first authority cutover and M4 integration** in staged order rather than all at once:

1. implement qualified Connection evaluation from Experience/Memory evidence;
2. stop Affinity from automatically leveling Connection only after Willow shadow behavior is validated;
3. introduce Willow's Bond-derived NPC Essence contribution into the currently base+Copy-only Essence formula;
4. introduce Trait compatibility/assimilation state for `WillowsWisdom`;
5. wire the Ancient Seed and independent-application beats into playable delivery;
6. replace immediate Willow Trait purchase semantics with Memory/assimilation/Connection evidence + final Essence expenditure;
7. only then use Lyra as the adversarial generalization test.

Do not cut over all NPCs, Essence generation, and Trait Resonance simultaneously. The migration remains Willow-first and evidence-driven.
