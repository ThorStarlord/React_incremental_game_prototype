# Relationship Progression Redesign

**Status:** Target design approved; staged runtime migration in progress  
**Runtime status:** M4 Willow authority cutover implemented; M6 Lyra adversarial universality proof implemented; other production NPCs remain legacy-authoritative  
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
- **Elder Willow:** `BondProfile.connectionLevel` is authoritative in playable runtime.
- **Lyra:** the Relationships domain is authoritative inside the M6 adversarial runtime proof, but Lyra is not yet integrated as a complete player-facing NPC/content slice.
- **Other production NPCs:** existing Affinity/`connectionDepth` behavior remains authoritative until separately migrated.
- Willow's legacy `NPC.connectionDepth` remains only as a compatibility projection for consumers that have not migrated yet.
- Willow's authored Affinity is projected to the NPC field because existing dialogue/service UI still reads it, but Affinity can no longer level Willow Connection.
- `shadowMode` is retained as a broad migration marker meaning some NPCs are still legacy-authoritative; it no longer means every relationship record is side-effect-free.

Temporary compatibility projections must remain clearly marked and removable.

## Relationship content registration

Authored relationship definitions are now discovered through:

```text
/data/relationships/index.json
-> one or more RelationshipDefinitionBundle files
-> generic merge/registration
```

The runtime loader does not enumerate Willow or Lyra in TypeScript. Adding another authored relationship bundle should normally be a content-registration change rather than a new NPC-specific branch in generic relationship mechanics.

The loader temporarily accepts the older single-bundle response shape for migration/test compatibility.

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

For unmigrated production NPCs, the legacy relationship and Trait gates remain in place.

## Current Lyra falsification path

```text
Strategic defeat
-> coercion reflected
-> reluctant co-training
-> ideological friction
-> mutual calibration
-> consequential harmonic cooperation
-> contested landmark Memory
-> evidence-qualified Connection II
```

This path deliberately tests whether deep Connection can emerge while immediate liking remains negative.

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
13. A new relationship archetype is not considered generalized if it requires an NPC-id conditional inside generic relationship mechanics.

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

## Adversarial progression proof inside Willow

`Willow Disagrees` remains intentionally capable of:

```text
Affinity ↓
Trust slightly ↓
Understanding ↑
Shared Meaning ↑
Connection Progress ↑
```

This was the first runtime proof that Connection is not a renamed affection meter; M6 extends that proof to a relationship whose overall Affinity remains negative.

## Bond-derived Essence

Willow is now the first production NPC using:

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

# M6 — Lyra Adversarial Universality Proof — Implemented

M6 is intentionally a **falsification test of the generic relationship model**, not a second full campaign slice.

Lyra's existing narrative role is an ideological and battlefield adversary who becomes a dialectic counterpart through containment, resistance, forced cooperation, mutual calibration, and consequential shared action. The proof encodes that arc as authored relationship evidence without adding Lyra-specific logic to reducers, selectors, qualification, Memory formation, or Essence calculation.

## Authored proof bundle

`public/data/relationships/lyra.json` defines six one-time Experiences:

1. `Strategic Defeat, Not Submission`;
2. `Coercion Reflected`;
3. `Reluctant Co-Training`;
4. `Ideological Friction`;
5. `Mutual Calibration`;
6. `Enemies in Phase`.

The final Experience forms the contested landmark Memory `Enemies in Phase`.

The sequence is deliberately mixed rather than monotonically positive: several beats reduce Affinity and/or Trust while increasing Understanding, Shared Meaning, Reliance, reciprocity, and Connection Progress.

## Generic Connection qualification

Lyra uses the same data-driven `ConnectionQualificationRule` mechanism as Willow.

### Connection I

Requires:

- at least 18 Connection Progress;
- two Experiences;
- both initial adversarial assessment Experiences;
- at least 18 Understanding.

### Connection II

Requires:

- at least 70 Connection Progress;
- six Experiences;
- reluctant co-training;
- the defining proto-bond Experience;
- a Memory tagged `AdversarialBond`;
- at least 55 Understanding;
- at least 40 Shared Meaning.

No relationship reducer or selector contains a special Lyra branch. The generic authoring loader also contains no Lyra identifier; Lyra enters through the relationship-content manifest.

## Expected/qualified adversarial state

The authored sequence produces:

```text
Connection Level: 2
Connection Progress: 83
Affinity: -35
Understanding: 64
Shared Meaning: 46
Stability: contested
Landmark Memory: Enemies in Phase
```

This is the key M6 result: **deep, evidence-qualified Connection coexists with negative Affinity and unresolved ideological conflict.**

The result falsifies the concern that the new model is merely an affection meter with extra fields, at least for this authored adversarial case.

## Essence scope boundary

Lyra's M6 config deliberately sets relationship-derived Essence to disabled.

That is intentional. M6 asks whether the relationship ontology and qualification machinery generalize to an adversarial bond. It does not conflate that question with a second economy cutover or a Lyra Trait migration.

## Debug visibility

The development Debug page includes a Lyra universality panel that replays the six authored Experiences through the same authored-experience thunk used by the relationship runtime and shows:

- current authority registration;
- Connection level and qualification evidence;
- Affinity;
- Stability;
- Connection Progress;
- Understanding and Shared Meaning;
- Experience/Memory counts;
- the intentionally disabled Lyra Essence contribution.

# Save compatibility

M3 saves may contain a Relationships slice but lack M4 fields such as:

- progression definitions;
- Trait assimilation state;
- Connection qualification evidence;
- tether state.

Reducers and selectors lazily normalize those additive fields. Existing Experience and Memory history is preserved; missing Memories are not fabricated.

Full pre-Relationships legacy save migration — including conservative mapping from historical `connectionDepth` with explicit legacy-derived provenance — remains Phase I work.

The relationship-content manifest does not fabricate Lyra history for existing saves; authored Experiences are still recorded only when their events occur or when deliberately injected by development tooling/tests.

# Automated qualification

The Build Validation workflow now includes:

```text
npm ci
npx tsc --noEmit
RelationshipRuntime.test.ts
RelationshipLyraUniversality.test.ts
npm run build
```

The Willow/M4 suite covers:

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

The Lyra/M6 suite additionally covers:

- manifest-driven multi-bundle authoring;
- registration of Lyra through content rather than hardcoded loader entries;
- six adversarial authored Experiences;
- a contested landmark Memory;
- generic Connection I/II qualification;
- final negative Affinity with Connection II;
- high Understanding and Shared Meaning despite conflict;
- contested stability;
- Lyra Essence remaining disabled during the ontology proof.

Exact-head qualification status must be taken from the latest PR Build Validation run. A green run on an older commit does not qualify a later documentation or code candidate.

# Still legacy / deferred

The relationship redesign is **not** a whole-game migration yet.

Still deferred:

- production Connection authority for NPCs other than Willow;
- full player-facing Lyra NPC/dialogue/quest integration beyond the M6 runtime/debug proof;
- Lyra relationship-derived Essence or Trait migration;
- broad campaign content migration;
- full Trait discovery redesign;
- full pre-Relationships save migration;
- procedural/LLM Memories;
- autonomous NPC social simulation;
- Copy-system redesign;
- multiple Essence currencies;
- advanced distance/tether simulation;
- authenticity/endgame mechanics.

## M5 qualification note

The Willow gameplay surfaces required for the authored causal sequence are implemented, but M5's stronger wording — that a fresh player can complete the entire causal loop **and explain it** — has not been separately qualified by an end-to-end human/UX run. Do not silently treat runtime/unit qualification as proof of player comprehension.

## Next engineering milestone

With the Lyra adversarial universality test implemented, the core model now has two materially different proofs:

```text
Willow: mentor/student progression with positive and corrective beats
Lyra: adversarial/dialectic progression with negative overall Affinity
```

The highest-value next step is **not broad NPC conversion immediately**. First close the remaining M5 evidence gap with one fresh-player end-to-end Willow run, recording whether the player can actually answer:

- why Connection deepened;
- why passive Essence changed;
- why `WillowsWisdom` was locked or unlocked;
- what role the landmark Memories and assimilation evidence played.

If that UX qualification passes, broad NPC migration can begin from the manifest/data-driven pattern rather than by adding new generic-system exceptions.
