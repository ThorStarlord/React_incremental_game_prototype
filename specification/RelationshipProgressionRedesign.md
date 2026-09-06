# Relationship Progression Redesign

**Status:** Target design approved; staged production migration in progress  
**Runtime status:** M4–M10 integrated on `main`; M11 Lyra player-facing production rollout implemented on its candidate branch; Willow, Elara, and Lyra use Relationship authority while remaining production NPCs are still legacy-authoritative  
**Purpose:** Provide one authority/index for the relationship, Essence, Memory, Trait Resonance, and persistence redesign while production migration continues.

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
- [`Technical/FreshPlayerWillowQualification.md`](Technical/FreshPlayerWillowQualification.md) — routed mechanical qualification and original human-comprehension evidence boundary.
- [`Technical/WorkspaceCognitiveWalkthrough.md`](Technical/WorkspaceCognitiveWalkthrough.md) — workspace-based player-facing causal-legibility qualification after narrowing the M5 claim.
- [`Technical/ElaraRelationshipMigration.md`](Technical/ElaraRelationshipMigration.md) — M7 collaborative/inquiry archetype migration.
- [`Technical/TraitDiscoveryContract.md`](Technical/TraitDiscoveryContract.md) — M8 authored Trait-discovery lifecycle.
- [`Technical/LegacyRelationshipSaveMigration.md`](Technical/LegacyRelationshipSaveMigration.md) — M9 provenance-preserving legacy Relationship reconciliation.
- [`Technical/SaveSchemaMigrationSystem.md`](Technical/SaveSchemaMigrationSystem.md) — M10 explicit persistent save-schema identity and forward migration.
- [`Technical/LyraProductionRelationshipVerticalSlice.md`](Technical/LyraProductionRelationshipVerticalSlice.md) — M11 player-facing adversarial production rollout and persistence proof.

## Authority during migration

Authority is now **per NPC** rather than globally legacy or globally new.

- `RelationshipProgressionDefinition.connectionAuthority` declares whether an NPC uses legacy Connection progression or the Relationships domain.
- **Elder Willow:** `BondProfile.connectionLevel` is authoritative in playable runtime.
- **Scholar Elara:** the Relationships domain is authoritative for her collaborative/inquiry production content and `ScholarlyInsight` progression.
- **Lyra:** the Relationships domain is authoritative for the M6 ontology proof and, under M11, for her normal player-facing Dialogue/Quest/Relationship production route.
- **Other production NPCs:** existing Affinity/`connectionDepth` behavior remains authoritative until separately migrated.
- Migrated NPCs may retain legacy `NPC.connectionDepth` only as a compatibility projection for consumers that have not migrated yet.
- Authored Affinity is projected to the NPC field where existing dialogue/service UI still reads it, but Affinity cannot itself level migrated Connection.
- `shadowMode` is retained as a broad migration marker meaning some NPCs are still legacy-authoritative; it no longer means every relationship record is side-effect-free.

Temporary compatibility projections must remain clearly marked and removable.

## Relationship content registration

Authored relationship definitions are now discovered through:

```text
/data/relationships/index.json
-> one or more RelationshipDefinitionBundle files
-> generic merge/registration
```

The runtime loader does not enumerate Willow, Elara, or Lyra in TypeScript. Adding another authored relationship bundle should normally be a content-registration change rather than a new NPC-specific branch in generic relationship mechanics.

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

## Current Lyra production path

```text
Strategic defeat
-> coercion reflected
-> Connection I
-> reluctant co-training through a normal Quest resolution
-> ideological friction
-> mutual calibration
-> consequential harmonic cooperation
-> contested landmark Memory
-> evidence-qualified Connection II
-> contested-bond passive Essence
```

This path deliberately demonstrates that deep Connection and ongoing relationship-derived Essence can emerge while immediate liking remains negative. M11 moves the M6 ontology proof onto ordinary player-facing production surfaces without adding Lyra-specific generic mechanics.

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
14. Save migration may preserve known progress but must not manufacture unavailable Experience, Memory, or Trait-learning history.

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

Only relationship configs explicitly marked `essence.enabled` participate in the new NPC source, preventing migrated NPCs from being double-counted with unmigrated NPC behavior.

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

### Trait discovery status

M4 originally inherited a prototype behavior where Trait catalog loading broadly implied discovery. **M8 resolved that limitation.** Relationship-mediated Traits can now use authored discovery: `WillowsWisdom` is revealed by `The First Lesson`, and `ScholarlyInsight` by Elara's contradictory-footnote evidence. Catalog loading is no longer equivalent to discovery for authored Traits.

## Player/debug visibility

The NPC Trait panel explains relationship-mediated gates with:

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
- exact Relationship Essence contribution;
- Trait assimilation and relevant Memories;
- idempotent authored-event injection for development qualification.

# M5 — Routed Mechanical and Workspace Causal-Legibility Qualification — Implemented

M5 is now split into two claims that can actually be supported from the workspace.

## Routed mechanical qualification

`RelationshipFreshGame.test.tsx` proves that the normal `/game/npcs/:npcId` player path can complete the preserve-branch Willow loop from fresh state without Debug injection:

```text
New Game
-> Willow at Connection 0
-> Dialogue
-> Connection I
-> Ancient Seed offer / quest
-> preserve / awaken decision
-> The Seed Preserved Memory
-> disagreement
-> teaching
-> independent application
-> Connection II / 100% assimilation
-> player-facing relationship explanation
-> passive Essence accumulation
-> Trait gate
-> final Resonance
-> permanent Willow's Wisdom
```

The routed qualification exposed and fixed several player-path defects, including route-level NPC reinitialization, missing routed Dialogue/Relationship surfaces, legacy coarse tab gates, stale New Game state, and invalid MUI Tabs composition.

## Workspace causal-legibility qualification

`Technical/WorkspaceCognitiveWalkthrough.md` evaluates only normal player-facing evidence and excludes Debug/specification prose as evidence.

It qualifies the narrower claim that the intended causal model is **present and reconstructible from the game itself**:

- Affinity is explicitly distinguished from Connection;
- Connection progress explicitly states that progress alone is insufficient and names qualifying Experience/Memory evidence;
- Memories are explicitly described as defining experiences usable as evidence rather than loot;
- passive Essence is explicitly described as an ongoing consequence of the current bond rather than a scene drop;
- `WillowsWisdom` visibly requires Connection, assimilation, compatibility, Memory evidence, and Essence;
- teaching and independent application give assimilation a visible learning/internalization referent;
- final Resonance explicitly describes Essence as the stabilization cost for an already-assimilated pattern.

### Evidence ceiling

M5 does **not** claim that an unaided human participant has empirically demonstrated comprehension. A real player may still skip explanatory surfaces, ignore text, or misunderstand terminology.

The merge-scope claim is therefore:

> **The Willow causal model is mechanically traversable and player-facing causal evidence is sufficient for the intended model to be reconstructible.**

Human usability/comprehension research remains valuable but is deferred from PR #25's merge claim rather than silently treated as passed.

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

M6 originally required:

- at least 70 Connection Progress;
- six Experiences;
- reluctant co-training;
- the defining proto-bond Experience;
- a Memory tagged `AdversarialBond`;
- at least 55 Understanding;
- at least 40 Shared Meaning.

M11 productionizes the same arc and strengthens the Connection II evidence contract by also requiring `Mutual Calibration` and minimum Reciprocity.

No relationship reducer or selector contains a special Lyra branch. The generic authoring loader also contains no Lyra identifier; Lyra enters through the relationship-content manifest.

## Expected/qualified adversarial state

The authored sequence produces:

```text
Connection Level: 2
Connection Progress: 83
Affinity: -35
Trust: 19
Understanding: 64
Shared Meaning: 46
Reliance: 16
Vulnerability: 13
Reciprocity: 18
Stability: contested
Landmark Memory: Enemies in Phase
```

This remains the key M6/M11 result: **deep, evidence-qualified Connection coexists with negative Affinity and unresolved ideological conflict.**

## Essence scope boundary: M6 historical scope vs M11 production scope

M6 deliberately set relationship-derived Lyra Essence to disabled so the ontology proof would not also become an economy cutover.

M11 changes that production scope deliberately: Lyra's Relationship config now enables Essence and uses the same generic Connection × Resonance Quality × Tether × Stability calculation as other migrated relationships. At the qualified M11 final state, contested Stability reduces the contribution to `0.065/sec` while Affinity remains `-35`.

This is not a Lyra-specific formula. It demonstrates that meaningful hostile entanglement can be metaphysically productive without being affectionate.

## Debug and production visibility

The development Debug page retains the Lyra universality panel as an isolated M6 diagnostic surface.

M11 additionally routes the same six-beat semantics through normal production NPC/Dialogue/Quest/Relationship UI, including player-visible Connection evidence, contested Stability, `Enemies in Phase`, and passive Essence.

# M7 — Elara Collaborative Relationship Migration — Implemented

Elara provides the third relationship archetype: reciprocal intellectual collaboration rather than mentorship or adversarial conflict.

Her production content is manifest-driven and reaches Connection II through challenge, contradictory evidence, reciprocal revision, a theory neither participant owns, and independent verification. `ScholarlyInsight` is relationship-mediated and uses the generic Trait discovery/assimilation/Resonance machinery rather than an Elara-specific engine branch.

M7 establishes that a third relationship archetype can be expressed primarily as production authoring/configuration on the same generic model.

# M8 — Authored Trait Discovery — Implemented

M8 separates Trait definition loading from Trait discovery.

- legacy/simple Traits may remain initially known for compatibility;
- relationship-mediated Traits may declare authored discovery;
- Relationship Experiences can reveal a Trait pattern;
- replay can repair an older save that contains the Experience but lacks the newer discovery flag;
- New Game resets authored discoveries without erasing Trait definitions;
- undiscovered authored Traits do not leak identity/cost/Memory/assimilation details through the normal NPC Trait UI.

Discovery, assimilation, and Resonance are therefore distinct lifecycle stages.

# M9 — Legacy Relationship Save Reconciliation — Implemented

M9 preserves old `connectionDepth` conservatively for Relationship-authoritative NPCs without inventing modern causal history.

A legacy-derived Bond may preserve:

- bounded Connection level;
- legacy Affinity;
- explicit provenance.

It does not fabricate:

- Experiences;
- Memories;
- qualification evidence;
- semantic dimensions such as Understanding or Reciprocity;
- Trait discovery/assimilation evidence.

Existing modern Bond Profiles are never overwritten by the compatibility migration.

# M10 — Save Schema Versioning & Migration — Implemented

M10 makes persistent representation evolution explicit.

- missing historical `schemaVersion` is the one distinguishable legacy representation, v0;
- current save schema is v1;
- migrations run as explicit adjacent ordered transitions;
- local loads and imports use the same persistent migration authority;
- future/invalid schema identities fail safely;
- persistent migration runs before Redux state installation;
- content-dependent Relationship reconciliation remains a separate post-install runtime phase.

This makes M9 and M10 complementary rather than overlapping: M10 transforms saved representations; M9 interprets legacy relationship progress against current authored content without fabricating history.

# M11 — Lyra Production Relationship Rollout — Implemented Candidate

M11 moves Lyra from M6 ontology proof to ordinary production gameplay.

The production route uses:

- a real `npc_lyra` definition in the production catalog;
- six normal player-facing Dialogue beats;
- a real `Reluctant Co-Training` Quest resolution;
- Connection I and II through generic evidence qualification;
- a player-visible contested `Enemies in Phase` Memory;
- generic contested-bond passive Essence;
- mid-arc save/load continuity;
- final save-code import/export continuity;
- historical Lyra save coexistence without fabricated modern evidence.

The deterministic final state remains:

```text
Connection 2
Connection Progress 83
Affinity -35
Trust 19
Understanding 64
Shared Meaning 46
Reliance 16
Vulnerability 13
Reciprocity 18
Stability contested
Memory: Enemies in Phase
Passive Essence: 0.065/sec
```

See [`Technical/LyraProductionRelationshipVerticalSlice.md`](Technical/LyraProductionRelationshipVerticalSlice.md) for the full contract and evidence ceiling.

# Save compatibility

Save compatibility now has two explicit layers.

## Persistent representation — M10

Historical/current save payloads are identified by schema version and migrated deterministically to the current persistent envelope before Redux installation.

## Relationship interpretation — M9

After current state is installed, current relationship definitions may conservatively reconcile legacy `connectionDepth` into a bounded, provenance-marked Relationship baseline.

The system preserves known progress without fabricating missing Experience/Memory history. New authored Experiences accumulate normally afterward.

Reducers/selectors still defensively normalize additive optional fields from older modern Relationship saves where appropriate.

# Automated qualification

The Build Validation workflow includes:

```text
npm ci
npx tsc --noEmit
RelationshipRuntime.test.ts
RelationshipLyraUniversality.test.ts
RelationshipFreshGame.test.tsx
RelationshipElaraCollaboration.test.ts
RelationshipLyraProduction.test.tsx
TraitDiscovery.test.ts
RelationshipLegacySaveMigration.test.ts
saveSchema.test.ts
saveUtils.test.ts
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
- contested Stability.

The routed M5 suite covers the complete normal-player Willow preserve branch through permanent `WillowsWisdom` Resonance without Debug injection.

The M7 suite covers collaborative Elara progression, authored Trait discovery, reciprocal evidence, recovery from the cautious branch, and permanent `ScholarlyInsight`.

The M8 suite covers definition-vs-discovery lifecycle semantics, New Game reset, reload preservation, and additive save repair.

The M9 suite covers bounded legacy Connection preservation, provenance, idempotency, modern-profile protection, weak migrated Essence, and failure to bypass modern Trait evidence.

The M10 suites cover schema identity, v0 interpretation, ordered migration, future-version rejection, local/import parity, UTF-8 save-code transport, and imported metadata preservation.

The M11 suite covers production Lyra data wiring, normal routed Dialogue/Quest progression, negative Affinity at Connection II, contested Memory/Essence, save/load, import/export, legacy coexistence, and absence of `npc_lyra` branches from generic runtime files.

Exact-head qualification status must be taken from the latest PR Build Validation run. A green run on an older commit does not qualify a later documentation or code candidate.

# Still legacy / deferred

The relationship redesign is **not** a whole-game migration yet.

Still deferred:

- production Relationship authority/content migration for the rest of the legacy cast beyond Willow, Elara, and Lyra;
- broad campaign content migration and discovery/onboarding integration for the expanded cast;
- a Lyra relationship-mediated Trait, unless a later milestone identifies a distinct learning hypothesis worth testing;
- human usability/comprehension research beyond workspace causal-legibility audits;
- procedural/LLM Memories;
- autonomous NPC social simulation;
- Copy-system redesign;
- multiple Essence currencies;
- advanced distance/tether simulation;
- authenticity/endgame mechanics;
- global relationship/Essence balance across a production-sized cast.

## Next engineering milestone

The core model now has complementary forms of evidence:

```text
Willow: complete mentor/student relationship-to-power mechanism + routed player proof
Elara: collaborative/inquiry production archetype + authored Trait lifecycle
Lyra: adversarial/dialectic production archetype with negative Affinity + contested Essence
M9/M10: historical compatibility + explicit persistent-state evolution
```

The next high-value question is no longer whether one more archetype can be represented. It is whether **production authoring scales across the broader cast without repeated engine work**.

The natural next milestone is therefore a bounded relationship content-migration wave that measures authoring throughput, data duplication, validation failures, and TypeScript changes per migrated NPC. If each new NPC can be implemented mostly as authored data, the framework has moved from demonstrated generality to scalable production capability.

Human playtesting remains useful future product research and should remain separate from mechanical qualification unless explicitly brought back into scope.
