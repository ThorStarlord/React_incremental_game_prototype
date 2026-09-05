# Relationship Progression Redesign

**Status:** Target design approved; staged runtime migration in progress  
**Runtime status:** M4 Willow authority cutover implemented; other NPCs remain legacy-authoritative  
**Purpose:** Provide one authority/index for the relationship, Essence, Memory, and Trait Resonance redesign while migration is in progress.

## Why this document exists

The repository contains three kinds of truth that must not be confused:

1. **Current runtime behavior** — the TypeScript/Redux implementation that determines what the game actually does.
2. **Older implementation-status documentation** — generally useful, but known to contain some drift from current code.
3. **Approved target design** — documented by the relationship redesign package below.

When an older feature spec conflicts with current code, the runtime wins as the description of implemented behavior. The redesign package defines the intended destination for new relationship-system work.

## Approved target-design package

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — canonical ontology, Relationship Experience schema, Bond Profile, Connection qualification, and invariants.
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark Memory model and player-facing Memory Cards.
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — relationship-derived passive Essence generation and Trait assimilation/Resonance.
- [`Narrative/ElderWillowVerticalSlice.md`](Narrative/ElderWillowVerticalSlice.md) — first authored proof of the complete loop.
- [`Technical/RelationshipSystemMigrationPlan.md`](Technical/RelationshipSystemMigrationPlan.md) — staged runtime migration from the existing model.

## Authority during migration

Authority is now **per NPC** rather than globally legacy or globally new.

- `RelationshipProgressionDefinition.connectionAuthority` declares whether an NPC uses legacy Connection progression or the Relationships domain.
- **Elder Willow:** `BondProfile.connectionLevel` is authoritative.
- **Other NPCs:** existing Affinity/`connectionDepth` behavior remains authoritative until separately migrated.
- Willow's legacy `NPC.connectionDepth` remains only as a compatibility projection for consumers that have not migrated yet.
- Willow's authored Affinity is projected to the NPC field because existing dialogue/service UI still reads it, but Affinity can no longer level Willow Connection.
- `shadowMode` is retained as a broad migration marker meaning some NPCs are still legacy-authoritative; it no longer means every relationship record is side-effect-free.

Temporary compatibility projections must remain clearly marked and removable.

## Current implemented loop for Willow

```text
Authored narrative choice
-> Relationship Experience
-> relationship dimensions + Connection Progress
-> optional landmark Memory
-> evidence-qualified Connection
-> Bond-derived passive Essence contribution
-> Trait compatibility / assimilation
-> Memory + Connection + assimilation + Essence Resonance gate
-> permanent Willow's Wisdom
```

For unmigrated NPCs, the legacy relationship and Trait gates remain in place.

## Non-negotiable invariants

1. Affinity is short-term disposition, not Connection XP.
2. Connection is meaningful relational significance, not affection.
3. Negative/adversarial Experiences can deepen Connection.
4. Experiences do not normally mint relationship Essence as lump-sum rewards.
5. Every Memory references an actual Experience.
6. Not every Experience becomes a Memory.
7. Repetition cannot grind deep Connection without new relational meaning.
8. Trait Resonance requires relationship evidence and assimilation for migrated relationship-mediated Traits.
9. Manipulative/instrumental relationships remain mechanically viable.
10. Reciprocal/authentic relationships may later unlock qualitatively different outcomes rather than receiving a simplistic universal bonus.
11. A migrated NPC must not be double-counted through both legacy and Bond-derived Essence contribution paths.
12. Irreversible resource/permanence changes must not occur before required authored relationship evidence validates successfully.

# M3 — Shadow Runtime — Complete

M3 established the additive evidence layer:

- serializable Relationship Experience, Memory, and Bond Profile state;
- stable unique-key idempotency;
- seven universal relationship dimensions plus custom dimensions;
- Connection Progress;
- explicit authored Memories;
- Elder Willow WE-01 through WE-08 definitions;
- deterministic dialogue response choice;
- debug comparison of legacy and shadow state;
- type/build qualification.

M3 intentionally left all gameplay authority on the legacy model.

# M4 — Willow Authority Cutover — Implemented

M4 is the first intentional gameplay behavior change.

## Connection authority

Willow now uses authored qualification rules from `public/data/relationships/elder-willow.json`.

### Connection I

Requires, at minimum:

- sufficient Connection Progress;
- two meaningful Experiences;
- `The First Lesson`;
- one valid WE-01 opening response;
- minimum Understanding.

### Connection II

Requires, at minimum:

- sufficient Connection Progress;
- six meaningful Experiences;
- `Three Nights of Teaching`;
- `The Lesson Made Yours` independent-application Experience;
- landmark Memory evidence tagged `Application`;
- minimum Understanding and Shared Meaning.

The runtime records the concrete Experience/Memory ids that qualified each level. Repeated positive Affinity cannot qualify Willow Connection.

## Adversarial progression proof

`Willow Disagrees` remains intentionally capable of:

```text
Affinity ↓
Trust slightly ↓
Understanding ↑
Shared Meaning ↑
Connection Progress ↑
```

This is the first runtime proof that Connection is not a renamed affection meter.

## Bond-derived Essence

Willow is now the first NPC using:

```text
Connection Base Rate
× Resonance Quality
× Tether Modifier
× Stability Modifier
```

The global base Essence rate and qualifying Copy contribution remain intact.

Only relationship configs explicitly marked `essence.enabled` participate in the new NPC source, preventing Willow from being double-counted with unmigrated NPC behavior.

The debug panel exposes the exact Willow contribution and the factors that produced it.

## Ancient Seed decision

`quest_willow_ancient_seed` is now a real resolution choice rather than an automatic relationship reward.

### Preserve / awaken the Seed

- consumes the tutorial Sunstone;
- records the preserve Experience;
- forms `The Seed Preserved` Memory;
- gives **no immediate relationship Essence payout**;
- its progression value comes from relationship evidence and the resulting future passive rate.

### Consume the Sunstone

- consumes the Sunstone;
- records the alternative authored Experience;
- grants a small immediate Essence payout from **Sunstone extraction**, an independent resource source rather than relationship loot.

Quest resolution is locked once chosen. The relationship Experience is validated before item consumption or reward application so broken authoring data cannot partially commit the choice.

Because the prototype does not yet have robust exploration/item acquisition, Willow supplies the tutorial Sunstone when the player accepts the authored Seed challenge. This is a vertical-slice compression, not the intended final world-acquisition model.

## Playable Willow sequence

The existing dialogue/quest surfaces now support:

```text
WE-01  She Saw Through the Question
-> WE-02  The First Lesson
-> WE-03  A Seed of Potential
-> WE-04  Sunstone decision
-> Memory: The Seed Preserved (preserve path)
-> WE-05  Willow Disagrees
-> WE-06  Three Nights of Teaching
-> WE-07  The Lesson Made Yours
-> Memory: The Lesson Made Yours
-> WE-08  Resonance: Willow's Wisdom
```

Later topics are hidden in the UI and rejected by the runtime until prerequisite Experience evidence exists. Response-scoped effects fire only for the response actually selected.

## Trait assimilation and Resonance

`WillowsWisdom` now declares relationship-mediated metadata:

- source NPC: Willow;
- minimum qualified Connection: 2;
- assimilation threshold: 100%;
- minimum compatibility;
- required Memory evidence tagged `Application`;
- final Essence cost: 40;
- WE-08 as the authored final Resonance beat.

The authored Willow path advances assimilation through bounded teaching/application events rather than raw real-time proximity:

- first lesson: initial exposure;
- Three Nights of Teaching: primary practice segment;
- independent application: final assimilation proof.

The permanent-acquisition thunk validates in this order:

1. Trait discovered;
2. source NPC resolved;
3. qualified Connection met;
4. assimilation complete;
5. compatibility met;
6. required Memory evidence met;
7. Trait prerequisites met;
8. enough Essence exists;
9. authored Resonance Experience validates;
10. Essence is spent;
11. Trait becomes permanent.

This means sufficient Essence alone can no longer purchase `WillowsWisdom`.

### Current discovery limitation

The prototype's existing Trait initialization broadly marks Traits discovered, so M4 enforces the discovery predicate but does **not** yet prove a narratively earned Trait-discovery flow. That remains a separate cleanup rather than being silently redefined here.

## Player/debug visibility

The NPC Trait panel now explains the Willow gate with:

- Connection current/required;
- assimilation current/required;
- compatibility;
- Memory tag requirements;
- Essence cost.

The relationship debug panel exposes:

- authoritative Bond Profile;
- legacy compatibility projection;
- Connection qualification evidence;
- Resonance Quality / Stability / Tether;
- exact Willow Essence contribution;
- `WillowsWisdom` assimilation and relevant Memories;
- idempotent authored-event injection for qualification.

# Save compatibility

M3 saves may contain a Relationships slice but lack M4 fields such as:

- progression definitions;
- Trait assimilation state;
- Connection qualification evidence;
- tether state.

Reducers and selectors lazily normalize those additive fields. Existing Experience and Memory history is preserved; missing Memories are not fabricated.

Full pre-Relationships legacy save migration — including conservative mapping from historical `connectionDepth` with explicit legacy-derived provenance — remains Phase I work.

# Automated qualification

The Build Validation workflow now includes:

```text
npm ci
npx tsc --noEmit
relationship-focused Jest tests
npm run build
```

The relationship test suite covers:

- unique Experience idempotency and explicit repeatable occurrences;
- dimension clamping;
- Memory referential integrity and persistence after relationship loss;
- Affinity alone not leveling Willow Connection;
- evidence-qualified Connection;
- adversarial Affinity decrease with Connection Progress increase;
- relationship events not minting current Essence;
- Bond changes altering passive rate without double-counting;
- insufficient assimilation blocking Resonance;
- missing Memory evidence blocking Resonance;
- full evidence permitting one permanent Resonance and one Essence deduction;
- M3-style save-state lazy upgrade without fabricated Memories.

Exact-head qualification status should be taken from the latest PR workflow run; older M3 green runs do not qualify M4 code.

# Still legacy / deferred

M4 does **not** migrate the whole game.

Still deferred:

- all non-Willow NPC Connection authority;
- Lyra adversarial universality proof;
- broad campaign content migration;
- full Trait discovery redesign;
- full pre-Relationships save migration;
- procedural/LLM Memories;
- autonomous NPC social simulation;
- Copy-system redesign;
- multiple Essence currencies;
- advanced distance/tether simulation;
- authenticity/endgame mechanics.

## Next engineering milestone

After exact-head M4 qualification, the highest-value next step is **Lyra as the adversarial universality test** before broad NPC migration.

The question is no longer whether the Willow happy-path can work. The next falsification target is whether the same generic Experience/Memory/Connection/Essence machinery can represent:

```text
low or volatile Affinity
+ ideological conflict
+ strong mutual understanding
+ consequential shared events
-> high Connection
```

without `if (npcId === 'lyra')` exceptions in generic relationship mechanics.
