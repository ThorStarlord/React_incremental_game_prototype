# Relationship Progression Redesign

**Status:** Implemented core redesign; production-qualified through M19; Checkpoint B = WEAK  
**Current authority:** `Technical/PostM14ProductReconciliation.md` + `Technical/PostM16TraitGameplayReconciliation.md` + `Technical/PostM17ProductReconciliation.md` + `Technical/M18ExplorationTravelResult.md` + `Technical/M19WorldDerivedTetherResult.md` + `Technical/CheckpointBActiveRpgLoopResult.md` + `Features/RelationshipExperienceSystem.md`  
**Purpose:** Provide a compact index to the redesign history and current production authority.

## 1. Current state after Checkpoint B

The Relationship redesign is no longer a target-only migration package.

The implemented production path is:

```text
Story / gameplay event
-> authored Relationship Experience
-> Relationship dimensions + Connection Progress
-> optional Memory
-> evidence-qualified Connection
-> Bond-derived Essence / Trait / story consequences
-> learned permanent Trait may alter later gameplay
-> player may travel through objective world space
-> current world presence may modulate effective Tether / Essence
-> later consequence becomes new Relationship evidence
```

M16 qualified the first bounded quest-gameplay payoff from Relationship-mediated learning. M17 independently extended permanent-Trait capability authority into one bounded deterministic Combat encounter while preserving a viable no-Trait route and player decision authority. M18 established canonical player-facing travel through a bounded authored graph. M19 then qualified those objective spatial facts modulating current Relationship-derived Essence through effective Tether without rewriting historical Bond state.

Checkpoint B evaluated whether those pieces already compose into one coherent active RPG loop. The result is **WEAK** rather than FAIL: the underlying authorities are substantially compatible and the Willow M16 -> M17 content chain is real, but Combat encounter availability and anchored-NPC active interaction can still bypass canonical world presence. M20 is therefore not authorized until a bounded active-loop integration repair is qualified and the checkpoint is re-run.

The relationship authoring manifest currently registers production bundles for:

- Elder Willow;
- Lyra;
- Elara;
- Gronk;
- Silas;
- Valerius.

These registered production Relationships use Relationship-domain Connection authority rather than the old automatic Affinity -> `connectionDepth` progression model.

Legacy `NPC.connectionDepth` and other old fields may remain as compatibility projections for consumers/saves that have not been deliberately migrated.

## 2. Canonical design package

Read in this order:

1. [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) — broad domain authority, migration status, and compatibility boundaries;
2. [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md) — post-M16 Trait-to-gameplay doctrine and evidence/design boundary;
3. [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md) — product/status alignment after qualified M17 combat;
4. [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md) — qualified bounded player-facing travel and location authority;
5. [`Technical/M19WorldDerivedTetherResult.md`](Technical/M19WorldDerivedTetherResult.md) — qualified bounded world-derived spatial Tether and evidence ceiling;
6. [`Technical/CheckpointBActiveRpgLoopResult.md`](Technical/CheckpointBActiveRpgLoopResult.md) — current active-RPG integration verdict and M20 authorization gate;
7. [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — planned execution program after M17, subject to checkpoint overrides;
8. [`GameDesignDocument.md`](GameDesignDocument.md) — product loop and direction; its pre-Checkpoint-B near-term section is superseded by the Checkpoint B result until repair/reconciliation;
9. [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship ontology and invariants;
10. [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark Memory model;
11. [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — Relationship-derived Essence, Tether, and Trait assimilation/Resonance;
12. [`Features/TraitSystem.md`](Features/TraitSystem.md) — current Trait lifecycle and capability authority;
13. [`Features/QuestSystem.md`](Features/QuestSystem.md) — current qualified permanent-Trait quest consumption surface;
14. [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md) — bounded M17 Combat capability and evidence ceiling;
15. [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) — bounded M18 travel and M19 spatial-world integration boundary;
16. milestone-specific qualification documents under `Technical/`.

`Technical/RelationshipSystemMigrationPlan.md` is a historical implementation record, not the active roadmap.

## 3. Authority model

`RelationshipProgressionDefinition.connectionAuthority` remains the technical switch distinguishing Relationship-domain authority from legacy compatibility behavior.

For Relationship-authority NPCs:

- `BondProfile.connectionLevel` is semantic Connection authority;
- authored Experience/Memory evidence qualifies progression;
- Affinity may still project into NPC state for service/UI compatibility;
- legacy `NPC.connectionDepth` may remain for unmigrated consumers but cannot level the migrated Relationship;
- important story consequences should use generic Relationship evidence instead of shadow social flags;
- Relationship evidence may qualify Trait learning, but permanent Trait state owns the durable learned capability once Resonance completes;
- downstream gameplay domains such as Quest or Combat determine local applicability of an already-owned capability rather than re-querying Relationship depth as a hidden skill check;
- objective Player/NPC world-location facts may derive **effective current Tether** where qualified, but travel does not rewrite historical Connection, Bond dimensions, Memories, Stability, or Resonance Quality;
- stored `BondProfile.tetherState` remains the authored/static fallback for Relationship sources without a qualified world-presence projection;
- Checkpoint B does **not** authorize active NPC interaction or encounters to ignore canonical world presence merely because Relationship information can be browsed remotely.

## 4. Relationship content registration

Authored definitions are discovered through:

```text
/data/relationships/index.json
-> RelationshipDefinitionBundle files
-> generic merge / registration
```

The current manifest includes Willow, Lyra, Elara, Gronk, Silas, and Valerius.

Adding another production Relationship should normally be a content-registration task rather than a TypeScript NPC-specific branch.

M19's NPC spatial anchors are separately owned by bounded NPC-domain world-anchor definitions; Relationship runtime consumes the generic lookup and does not branch on Willow/Gronk IDs.

## 5. Implemented progression proofs

### M4-M10 — foundation and migration

Established:

- Relationship slice/types/authoring;
- Experience idempotency;
- Memory formation;
- Bond dimensions;
- evidence-qualified Connection;
- Relationship-derived Essence;
- relationship-mediated Trait discovery/assimilation for migrated slices;
- save reconciliation and schema migration.

### M11 — Lyra universality

Qualified a player-facing adversarial Relationship whose Affinity can remain negative while Connection/Understanding/Shared Meaning deepen.

### M12 — production authoring scalability

Migrated/qualified Gronk, Silas, and Valerius as distinct relationship archetypes without repeated generic runtime changes.

The authoring manifest became the repeated-content registration surface.

### M13 — narrative causality

Qualified a bounded cross-NPC story loop:

```text
Silas story event
-> Relationship evidence
-> save/load
-> later Valerius story gate/consequence
-> new Relationship evidence
```

This established persisted Relationship evidence as narrative causality rather than passive history only.

### M14 — shared social consequence

Qualified one shared decision producing distinct Relationship consequences for Valerius, Silas, and Gronk.

A second independent probe reproduced multi-NPC fan-out.

The Rule-of-Two result was **no new generic bridge**: the existing dialogue effect array was already sufficient.

### M15 — long-horizon callback

Qualified old Relationship evidence remaining causally relevant after intervening content, later reinforcing or contradictory Relationship evidence, unrelated NPC activity, and save/load.

The result established that old and newer evidence can jointly determine later story availability without deleting historical Memory or adding duplicate story flags.

### M16 — Trait-driven gameplay

Qualified the first bounded gameplay payoff from Relationship-mediated learning:

```text
Relationship evidence
-> permanent Trait
-> alternate gameplay capability
-> player choice
-> different consequence
-> new Relationship evidence
```

`WillowsWisdom` and `ScholarlyInsight` independently required the same missing quest semantic, justifying exactly one bounded generic contract: `QuestResolutionOption.requiredPermanentTraitIds`.

M16 also qualified that a strong Relationship without the permanent Trait is insufficient for the Trait-only gameplay route.

### Checkpoint A — post-M16 Trait gameplay reconciliation

Canonicalized the boundary:

```text
Relationship -> acquisition provenance
Trait        -> durable learned capability
Gameplay     -> local applicability
Player       -> decision
Relationship -> interpretation of consequences when relationally meaningful
```

It also established design rules such as capability != decision, Trait-enabled != objectively best, permanent learning normally survives later Relationship deterioration, and important Traits should have coherent capability identity across contexts.

### M17 — Trait-sensitive combat

Qualified one deterministic player-facing Telluric Echo encounter in which permanent `WillowsWisdom` exposes an optional two-step tactical route (`Trace the Cycle` -> `Disrupt the Feedback`) while a conventional no-Trait Strike/Guard route remains viable.

M17 also qualified:

- strong Willow Relationship without permanent `WillowsWisdom` is still insufficient for the combat capability;
- the Trait route remains optional rather than automatic;
- missing-Trait, wrong-phase, and post-terminal direct bypass attempts reject before mutation;
- legitimate victory feeds the existing Combat `targetKilled` -> Quest `KILL` objective bridge;
- encounter state can remain transient for this bounded proof rather than forcing a Combat Redux/save-schema expansion;
- Quest and Combat independently needing the same permanent-Trait ownership semantic justifies a bounded shared pure predicate in the Trait domain, not a generalized ability/condition DSL.

### M18 — bounded exploration / travel

Qualified one four-location authored graph with player-facing legal travel, direct-route enforcement below UI, canonical `Player.location`, existing `REACH_LOCATION` Quest integration, save/load continuation, and a narrow compatibility alias for legacy `"City Center"` player values.

M18 deliberately introduced no Exploration reducer, pathfinding engine, travel-time simulation, or duplicate location authority.

### M19 — world-derived spatial Tether

Qualified objective player location modulating current Relationship-derived Essence for two independent Relationship-authority NPCs:

```text
Willow anchor -> Whispering Woods
Gronk anchor  -> City Center

same location        -> Present
direct neighbor      -> Nearby
other known location -> Remote
```

M19 also qualified:

- Willow and Gronk use one generic spatial derivation rather than NPC-specific Relationship branches;
- moving toward one Relationship can make another more remote from the same world fact;
- effective spatial Tether changes current Essence contribution and cached generation rate;
- travel leaves the stored Bond Profile unchanged;
- unanchored Relationships retain authored/static Tether;
- save/load reconstructs spatial Tether from persisted Player location plus static NPC anchor definitions without proximity flags or a schema bump.

### Checkpoint B — active RPG loop evaluation

Checkpoint B tested whether the existing Relationship, Trait, Quest, Combat, Travel, Tether, and Essence surfaces already function as one coherent active RPG loop.

Strong findings:

- Relationship -> Trait provenance is player-facing and explainable;
- `WillowsWisdom` keeps a coherent slow-pattern/systemic-causation identity across M16 Quest and M17 Combat;
- the Willow M16 -> M17 quest sequence is genuinely production-linked through ordinary completed-quest prerequisites;
- Travel already feeds both Quest location objectives and M19 spatial Tether/Essence;
- Relationship summaries expose the causal Essence/Tether breakdown;
- bounded gameplay -> Relationship closure exists through authored resolution Experiences.

Blocking findings:

- the active M17 `KILL` encounter is surfaced globally from the Dashboard without consuming `Player.location`;
- discovered NPCs remain globally selectable for active interaction, while the legacy `same_location` filter compares descriptive NPC location strings against canonical Player location IDs;
- spatial Tether/Essence opportunity cost is explainable but not surfaced close to the travel decision.

Verdict:

```text
CHECKPOINT_B_WEAK
bounded active-loop integration repair required
M20 not authorized
```

This is a bounded integration problem, not evidence that the Relationship ontology itself requires redesign.

## 6. Current Trait/Essence reality

Willow's Wisdom and Scholarly Insight use:

```text
Authored discovery
+ qualified Relationship Connection
+ assimilation
+ compatibility
+ Memory evidence
+ Essence
+ authored final Resonance Experience
-> permanent Trait
```

M16 demonstrates permanent Trait state can be consumed by ordinary quest gameplay as capability authority. M17 demonstrates the same authority can be consumed by Combat without returning to Relationship metrics as hidden skill checks.

Likewise, Relationship-derived Essence is implemented for enabled Relationship bundles through the Bond-based formula rather than a live global `connectionDepth x multiplier` rule.

M19 qualifies a bounded world-derived spatial Tether input to that formula for Willow and Gronk while preserving authored/static Tether for unanchored Relationships. This does **not** yet qualify spatial `Absent`, activity-derived `Engaged`/`Deeply Engaged`, moving NPCs, or a generalized presence simulation.

Checkpoint B adds a product-integration boundary: world-derived presence is not fully coherent until anchored NPC active interaction and spatially situated encounter availability consume those same canonical world facts.

## 7. Legacy compatibility remains intentional

Do not delete old fields merely because the ontology has moved on.

Compatibility surfaces include:

- NPC `affinity` / `connectionDepth` fields;
- unmigrated Trait gates;
- Copy calculations still consuming legacy parent-NPC values;
- old UI/debug surfaces;
- save migration code;
- authored/static Tether for Relationship sources without qualified world anchoring;
- descriptive `NPC.location` strings that must not be confused with canonical M18 Player/world location IDs.

Migration rule:

> isolate and migrate a legacy consumer deliberately when its owning milestone provides evidence and tests; do not extend the legacy rule into new Relationship-authority content.

## 8. Current checkpoint and next unknown

Checkpoint B is **WEAK**.

The next step is **not M20**. It is a bounded Active RPG Loop Integration Repair that should recon and qualify the smallest solution to:

```text
canonical world presence -> encounter availability
canonical world presence -> anchored NPC active interaction availability
travel/presence change    -> bounded player-facing consequence feedback
```

The repair must preserve M18 legal-travel authority, M19 derived-not-stored Tether, Relationship history isolation from travel, and all accumulated M4-M19 qualification.

Remote browsing of known Relationship information may remain distinct from active in-person interaction. The repair must not grow into coordinates, NPC schedules, autonomous movement, travel time, generalized pathfinding, generalized encounter-condition DSLs, or world simulation merely to satisfy the checkpoint.

After the repair is independently qualified, **re-run Checkpoint B**. Only:

```text
CHECKPOINT_B_PASS
M20 authorized
```

authorizes the Copy Task Automation milestone.

The working execution program remains in `Technical/PostM17MilestoneRoadmap.md`, but `Technical/CheckpointBActiveRpgLoopResult.md` is the current authorization override.

## 9. Evidence ceiling

M4-M19 plus Checkpoint B do not prove:

- arbitrary whole-campaign branching;
- autonomous social simulation;
- global NPC knowledge propagation;
- player enjoyment or pacing;
- complete faction/world-state architecture;
- a generalized or complete combat system beyond the bounded M17 encounter;
- open-world or campaign-scale exploration;
- generalized/dynamic NPC presence or schedules;
- continuous-distance Tether or activity-derived higher Tether states;
- complete Copy automation/offline loops;
- temporary Trait gameplay semantics;
- broad Trait/build balance;
- that the current active world loop is ready for automation.

They do prove that the Relationship domain is sufficiently expressive and generic to support multiple production archetypes, persistent narrative causality, bounded multi-NPC shared consequences, long-horizon callbacks, Relationship-derived permanent Traits that alter bounded quest/combat gameplay, and current spatial presence that modulates Relationship-derived Essence without rewriting historical Relationship authority.

Checkpoint B additionally establishes that these systems are substantially compatible but not yet sufficiently integrated across world-presence boundaries to authorize M20.

## 10. Historical references

Detailed historical migration evidence remains in Git history and milestone documents including:

- `Technical/FreshPlayerWillowQualification.md`
- `Technical/WorkspaceCognitiveWalkthrough.md`
- `Technical/ElaraRelationshipMigration.md`
- `Technical/TraitDiscoveryContract.md`
- `Technical/LegacyRelationshipSaveMigration.md`
- `Technical/SaveSchemaMigrationSystem.md`
- `Technical/LyraProductionRelationshipVerticalSlice.md`
- `Technical/NarrativeRelationshipIntegrationQualification.md`
- `Technical/M14MultiNpcRelationshipConsequenceQualification.md`
- `Technical/M15LongHorizonRelationshipCallbackQualification.md`
- `Technical/M16TraitDrivenGameplayQualification.md`
- `Technical/PostM16TraitGameplayReconciliation.md`
- `Technical/M17NarrowCombatVerticalSliceQualification.md`
- `Technical/M17NarrowCombatVerticalSliceReconAmendment.md`
- `Technical/M17NarrowCombatVerticalSliceResult.md`
- `Technical/PostM17ProductReconciliation.md`
- `Technical/M18ExplorationTravelQualification.md`
- `Technical/M18ExplorationTravelReconAmendment.md`
- `Technical/M18ExplorationTravelResult.md`
- `Technical/M19WorldDerivedTetherQualification.md`
- `Technical/M19WorldDerivedTetherReconAmendment.md`
- `Technical/M19WorldDerivedTetherReconCorrection.md`
- `Technical/M19WorldDerivedTetherResult.md`
- `Technical/CheckpointBActiveRpgLoop.md`
- `Technical/CheckpointBActiveRpgLoopResult.md`

Future agents should use those as empirical history while treating the current reconciliation/result documents as authority for their respective scopes.