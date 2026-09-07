# Relationship Progression Redesign

**Status:** Implemented core redesign; production-qualified through M14  
**Current authority:** `Technical/PostM14ProductReconciliation.md` + `Features/RelationshipExperienceSystem.md`  
**Purpose:** Provide a compact index to the redesign history and current production authority.

## 1. Current state after M14

The Relationship redesign is no longer a target-only migration package.

The implemented production path is:

```text
Story / gameplay event
-> authored Relationship Experience
-> Relationship dimensions + Connection Progress
-> optional Memory
-> evidence-qualified Connection
-> Bond-derived Essence / Trait / story consequences
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

1. [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) — post-M14 product authority, domain boundaries, migration status, roadmap correction;
2. [`GameDesignDocument.md`](GameDesignDocument.md) — current product loop and direction;
3. [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship ontology and invariants;
4. [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark Memory model;
5. [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — Relationship-derived Essence + Trait assimilation/Resonance;
6. [`Features/TraitSystem.md`](Features/TraitSystem.md) — current Trait runtime contract;
7. milestone-specific qualification documents under `Technical/`.

`Technical/RelationshipSystemMigrationPlan.md` is now a historical implementation record, not the active roadmap.

## 3. Authority model

`RelationshipProgressionDefinition.connectionAuthority` remains the technical switch distinguishing Relationship-domain authority from legacy compatibility behavior.

For Relationship-authority NPCs:

- `BondProfile.connectionLevel` is semantic Connection authority;
- authored Experience/Memory evidence qualifies progression;
- Affinity may still project into NPC state for service/UI compatibility;
- legacy `NPC.connectionDepth` may remain for unmigrated consumers but cannot level the migrated Relationship;
- important story consequences should use generic Relationship evidence instead of shadow social flags.

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

## 6. Current Trait/Essence reality

The redesign package originally described Trait assimilation as future work. That statement is now obsolete.

Willow's Wisdom and Scholarly Insight already use:

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

## 8. Next unknown

The next Relationship-specific scientific question is not another archetype or dimension.

### Proposed M15 — Long-Horizon Relationship Callback Qualification

> Can old Relationship evidence remain causally relevant after unrelated intervening content, additional Relationship changes, and save/load?

After M15, the project should move toward **Trait-driven gameplay payoff** because Trait assimilation already exists.

## 9. Evidence ceiling

M4-M14 do not prove:

- arbitrary whole-campaign branching;
- autonomous social simulation;
- global NPC knowledge propagation;
- player enjoyment or pacing;
- complete faction/world-state architecture;
- complete combat/exploration/Copy automation loops.

They do prove that the Relationship domain is sufficiently expressive and generic to support multiple production archetypes, persistent narrative causality, and bounded multi-NPC shared consequences.

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

Future agents should use those as empirical history while treating the post-M14 reconciliation as current product authority.