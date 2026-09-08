# Relationship Progression Redesign

**Status:** Implemented core redesign; production-qualified through M19  
**Current authority:** `Technical/PostM14ProductReconciliation.md` + `Technical/PostM16TraitGameplayReconciliation.md` + `Technical/PostM17ProductReconciliation.md` + `Technical/M18ExplorationTravelResult.md` + `Technical/M19WorldDerivedTetherResult.md` + `Features/RelationshipExperienceSystem.md`  
**Purpose:** Provide a compact index to the redesign history and current production authority.

## 1. Current state after M19

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
6. [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — planned execution program after M17;
7. [`GameDesignDocument.md`](GameDesignDocument.md) — current product loop and direction;
8. [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship ontology and invariants;
9. [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark Memory model;
10. [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — Relationship-derived Essence, Tether, and Trait assimilation/Resonance;
11. [`Features/TraitSystem.md`](Features/TraitSystem.md) — current Trait lifecycle and capability authority;
12. [`Features/QuestSystem.md`](Features/QuestSystem.md) — current qualified permanent-Trait quest consumption surface;
13. [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md) — bounded M17 Combat capability and evidence ceiling;
14. [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) — bounded M18 travel and M19 spatial-world integration boundary;
15. milestone-specific qualification documents under `Technical/`.

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
- stored `BondProfile.tetherState` remains the authored/static fallback for Relationship sources without a qualified world-presence projection.

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

M19 now qualifies a bounded world-derived spatial Tether input to that formula for Willow and Gronk while preserving authored/static Tether for unanchored Relationships. This does **not** yet qualify spatial `Absent`, activity-derived `Engaged`/`Deeply Engaged`, moving NPCs, or a generalized presence simulation.

## 7. Legacy compatibility remains intentional

Do not delete old fields merely because the ontology has moved on.

Compatibility surfaces include:

- NPC `affinity` / `connectionDepth` fields;
- unmigrated Trait gates;
- Copy calculations still consuming legacy parent-NPC values;
- old UI/debug surfaces;
- save migration code;
- authored/static Tether for Relationship sources without qualified world anchoring.

Migration rule:

> isolate and migrate a legacy consumer deliberately when its owning milestone provides evidence and tests; do not extend the legacy rule into new Relationship-authority content.

## 8. Current checkpoint and next unknown

M19 completes the planned active-RPG mechanics sequence through player travel and bounded spatial presence.

What is now qualified remains deliberately bounded:

```text
Relationship history
-> permanent learned Trait
-> optional quest/combat capability
-> player choice
-> objective player travel
-> current spatial presence may modulate effective Tether / Essence
-> ordinary gameplay consequence
```

The next step is **Checkpoint B — Active RPG Loop**, not automatic M20 implementation.

Checkpoint B asks:

> Do Relationship, Trait, Combat, Travel, Presence/Tether, Quest, and Essence now feel like one coherent active RPG loop rather than separate technical features?

It should evaluate spatial agency, capability identity, combat context, presence, opportunity cost, economy/system legibility, and whether Copy automation would enhance meaningful active play rather than hide a weak loop.

If Checkpoint B passes, the next planned code-bearing milestone is M20 — Copy Task Automation Qualification. If it is WEAK or FAIL, improve/reconsider the active RPG loop first.

The working execution program is maintained in `Technical/PostM17MilestoneRoadmap.md`. Later milestone semantics remain provisional until each is preregistered against the actual repository state.

## 9. Evidence ceiling

M4-M19 do not prove:

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
- broad Trait/build balance.

They do prove that the Relationship domain is sufficiently expressive and generic to support multiple production archetypes, persistent narrative causality, bounded multi-NPC shared consequences, long-horizon callbacks, Relationship-derived permanent Traits that alter bounded quest/combat gameplay, and current spatial presence that modulates Relationship-derived Essence without rewriting historical Relationship authority.

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

Future agents should use those as empirical history while treating the current reconciliation/result documents as authority for their respective scopes.