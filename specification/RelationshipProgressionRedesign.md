# Relationship Progression Redesign

**Status:** Implemented core redesign; production-qualified through M16  
**Current authority:** `Technical/PostM14ProductReconciliation.md` + `Technical/PostM16TraitGameplayReconciliation.md` + `Features/RelationshipExperienceSystem.md`  
**Purpose:** Provide a compact index to the redesign history and current production authority.

## 1. Current state after M16

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
-> later consequence becomes new Relationship evidence
```

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
3. [`GameDesignDocument.md`](GameDesignDocument.md) — current product loop and direction;
4. [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship ontology and invariants;
5. [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark Memory model;
6. [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — Relationship-derived Essence + Trait assimilation/Resonance;
7. [`Features/TraitSystem.md`](Features/TraitSystem.md) — current Trait lifecycle and capability authority;
8. [`Features/QuestSystem.md`](Features/QuestSystem.md) — current qualified permanent-Trait gameplay consumption surface;
9. milestone-specific qualification documents under `Technical/`.

`Technical/RelationshipSystemMigrationPlan.md` is a historical implementation record, not the active roadmap.

## 3. Authority model

`RelationshipProgressionDefinition.connectionAuthority` remains the technical switch distinguishing Relationship-domain authority from legacy compatibility behavior.

For Relationship-authority NPCs:

- `BondProfile.connectionLevel` is semantic Connection authority;
- authored Experience/Memory evidence qualifies progression;
- Affinity may still project into NPC state for service/UI compatibility;
- legacy `NPC.connectionDepth` may remain for unmigrated consumers but cannot level the migrated Relationship;
- important story consequences should use generic Relationship evidence instead of shadow social flags;
- Relationship evidence may qualify Trait learning, but permanent Trait state owns the durable learned capability once Resonance completes.

## 4. Relationship content registration

Authored definitions are discovered through:

```text
/data/relationships/index.json
-> RelationshipDefinitionBundle files
-> generic merge / registration
```

The current manifest includes Willow, Lyra, Elara, Gronk, Silas, and Valerius.

Adding another production Relationship should normally be a content-registration task rather than a TypeScript NPC-specific branch.

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

M16 further demonstrates that permanent Trait state can be consumed by ordinary gameplay as capability authority.

Likewise, Relationship-derived Essence is implemented for enabled Relationship bundles through the Bond-based formula rather than a live global `connectionDepth x multiplier` rule.

World-derived Tether remains future work.

## 7. Legacy compatibility remains intentional

Do not delete old fields merely because the ontology has moved on.

Compatibility surfaces include:

- NPC `affinity` / `connectionDepth` fields;
- unmigrated Trait gates;
- Copy calculations still consuming legacy parent-NPC values;
- old UI/debug surfaces;
- save migration code.

Migration rule:

> isolate and migrate a legacy consumer deliberately when its owning milestone provides evidence and tests; do not extend the legacy rule into new Relationship-authority content.

## 8. Current design checkpoint and next unknown

The immediate post-M16 task is not another Relationship dimension. It is the documentation-only Trait Gameplay Design Reconciliation in `Technical/PostM16TraitGameplayReconciliation.md`.

That checkpoint establishes, among other things:

- Relationship qualifies learning; Trait owns learned capability;
- capability does not make the player's decision;
- Trait-enabled should not mean objectively best;
- permanent Traits represent internalized character change;
- temporary/equipped Trait gameplay semantics remain deferred.

The next candidate code-bearing question is a narrow combat vertical slice:

> Can an existing Relationship-derived permanent Trait create a meaningful tactical option without becoming an automatic best action, pure passive stat bonus, or prerequisite for victory?

Milestone numbering remains provisional until that experiment is preregistered against the actual repository state.

## 9. Evidence ceiling

M4-M16 do not prove:

- arbitrary whole-campaign branching;
- autonomous social simulation;
- global NPC knowledge propagation;
- player enjoyment or pacing;
- complete faction/world-state architecture;
- complete combat/exploration/Copy automation loops;
- temporary Trait gameplay semantics;
- broad Trait/build balance.

They do prove that the Relationship domain is sufficiently expressive and generic to support multiple production archetypes, persistent narrative causality, bounded multi-NPC shared consequences, long-horizon callbacks, and a bounded Relationship-derived permanent Trait changing later gameplay.

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

Future agents should use those as empirical history while treating the post-M14 and post-M16 reconciliations as current authority for their respective scopes.
