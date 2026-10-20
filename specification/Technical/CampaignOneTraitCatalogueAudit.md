# Campaign One Trait Catalogue Audit

**Status:** CURRENT / bounded feature-completion audit  
**Scope:** Campaign One Trait catalogue, universal-pattern fit, and runtime effect authority  
**Trait-family identity:** [TraitIdentity.md](../Features/TraitIdentity.md)  
**Runtime contract:** [TraitSystem.md](../Features/TraitSystem.md)  
**2026-09-28 reconciliation:** [UniversalTraitOntologyReconciliation.md](UniversalTraitOntologyReconciliation.md)  
**Purpose:** Preserve useful catalogue content without letting historical perk metadata resurrect cut systems or narrow Trait identity back to "capability perk."

## Decision rule

A Trait definition is evidence that an authored **pattern** exists in the catalogue.

It is **not** evidence that Campaign One must build a subsystem to execute every historical effect key.

The current hierarchy is:

~~~text
universal Trait identity
-> salient authored pattern
-> qualified live runtime/capability consumer
-> optional assimilation/Stabilization
-> current expression

NOT

legacy JSON effect
-> mandatory new subsystem
~~~

Universal in-world ontology does not mean universal runtime serialization.

## Campaign One relationship-derived cognitive core

| Trait | Source | Nature | Current role |
| --- | --- | --- | --- |
| Willow's Wisdom | Elder Willow | cognitive | slow/systemic reasoning; Quest/Combat use; Structural Steward component |
| Scholarly Insight | Elara | cognitive | evidence-first model revision; Quest/Combat use; Countermodeler component |
| Constraint Sense | Gronk | cognitive-procedural | constraint-first judgment; GC08/GC09 use; Structural Steward component |
| Adversarial Calibration | Lyra | cognitive-relational | precise opponent modeling; GC08/GC09 use; Countermodeler component |

These four remain the bounded Campaign One relationship-derived buildcraft core.

They do **not** define the full Trait ontology.

## Cross-category universality proof

Existing catalogue entries are sufficient to prove that the runtime Trait type is broader than cognitive capability:

| Trait | Current authoring nature | Current qualified role |
| --- | --- | --- |
| Resilient Constitution | physiological | expressed direct Player max-health effect |
| Battle Hardened | procedural / embodied | expressed direct Player combat-stat effects |
| Tome of Forbidden Knowledge | semantic knowledge | expressed mixed Player-stat effect; historical ID names the source artifact |
| Essence Flow | metaphysical | live named Copy shared/inherited Essence-generation multiplier |
| Willow's Wisdom | cognitive | relationship-derived semantic capability |

No new Memory Trait is required merely to fill a taxonomy row.

## Runtime authority classes

Current effect authority distinguishes:

~~~text
direct_player_stat
named_runtime
semantic_capability
deferred_legacy
~~~

### Direct Player-stat authority

The effect is consumed by Player stat recalculation while the Trait is **expressed**.

Examples include active fields on:

- Battle Hardened;
- Resilient Constitution;
- Arcane Intellect;
- Swift Strikes;
- Iron Will;
- Lucky Charm;
- Tome of Forbidden Knowledge;
- Heart of the Mountain;
- Whispers of the Void;
- Mental Focus.

### Named runtime authority

The effect has a real bounded consumer outside generic Player stat recalculation.

Canonical current example:

- Essence Flow -> Copy shared/inherited Essence-generation multiplier.

A named-runtime pattern is a real Trait pattern and may be Stabilized under the universal ontology even when its present useful expression is primarily through sharing.

### Semantic capability authority

The Trait is consumed through authored gameplay semantics rather than a generic numeric effect.

The four relationship-derived cognitive Traits are the canonical examples.

### Deferred legacy metadata

Historical effect metadata with no current qualified consumer remains inert.

Examples include old generic skill-XP, crafting-quality, generic charisma, passive relationship-growth, stealth, or other prototype-era keys whose systems are not current Campaign One authority.

## Stabilization authority

A discovered Trait may become permanently assimilated only if it has at least one qualified live authority:

~~~text
direct Player-stat authority
OR named runtime authority
OR semantic capability authority
-> may support Stabilization

deferred-only metadata
-> cannot consume Essence for Stabilization
~~~

This prevents a Trait from spending Essence for an effect that literally has no current runtime meaning.

It also intentionally supersedes the earlier rule that a named-runtime-only Trait could never become permanent Player content.

### Essence Flow

Essence Flow has one explicit live consumer: when shared with or inherited by a Copy, its Essence-generation multiplier contributes to that Copy's generation.

Under the universal ontology:

~~~text
live metaphysical pattern
+ named runtime consumer
-> legal Stabilization candidate
-> permanently available to Player after Stabilization
-> useful while expressed/shared
~~~

Stabilization does not invent an always-active Player Essence bonus.

## Expression authority

Permanent assimilation and active effect are separate:

~~~text
assimilated
= permanently available

expressed
= currently manifested
~~~

Direct Player effects and authored semantic Trait gates consume current expression.

Suppressing an assimilated Trait removes current manifestation without deleting ownership.

## Sharing authority

A Player Trait is shareable when it is currently expressed and the target supports sharing.

~~~text
expressed temporary Trait -> shareable
expressed assimilated Trait -> shareable
suppressed Trait -> not shareable
~~~

Stabilization alone must not unshare a pattern that remains expressed.

Sharing does not permanently assimilate the Trait into the target.

## Catalogue policy

### KEEP when the pattern and current consumer are coherent

Do not delete useful direct-stat, semantic, or named-runtime Traits merely because they are not part of the four relationship-derived cognitive core.

### REINTERPRET only when content pulls the concept

Several historical names can describe valid universal patterns but their old effect metadata may be obsolete.

Examples:

- Essence Siphon;
- Combat Reflexes;
- Silver Tongue;
- Shadow Walker;
- Elemental Affinity;
- Essence Affinity;
- Mentor's Insight.

A future package may give one of these a coherent source/provenance and qualified consumer when actual content requires it.

### DEFER rather than resurrect cut systems

- Quick Learner must not recreate a generic Skills progression layer;
- Master Craftsman must not recreate generic Crafting;
- inventory/equipment-style expansion must not be inferred from Trait metadata.

Procedural skill can be a Trait without a parallel skill-tree subsystem.

### Relationship-state multipliers are especially weak fits

Relationship Sage and Growing Affinity currently carry historical generic relationship-growth metadata.

That is a weak fit because Relationship progression is evidence-bearing shared history, not a meter that should improve automatically because a Trait exists.

Do not activate those old effects without a new bounded design that respects Relationship authority.

### REMOVE only through a bounded content package

No mass deletion is authorized by this audit.

Compatibility IDs and saves remain stable until a concrete removal package proves a definition is unreachable, misleading, or harmful.

## Artifact-like Trait names

Some historical Trait IDs/names look like inventory items.

Tome of Forbidden Knowledge is the current example.

Under the universal ontology, the runtime Trait should be interpreted as the **internalized knowledge pattern**, while the historical ID may continue to name the source artifact for compatibility.

Do not infer a requirement for generic Inventory/Equipment from an artifact-like Trait ID.

## Effect execution contract

A Trait effect is production-authoritative only with:

~~~text
named consumer
+ deterministic qualification
+ player-facing causal explanation where meaningful
~~~

Recognized effect-key metadata alone is insufficient.

Current legitimate consumer forms include:

1. expressed Player-stat calculation;
2. named target/runtime calculation;
3. authored semantic requirement.

The historical content key `requiredPermanentTraitIds` remains for compatibility, but current Quest/Dialogue/Combat runtime interprets it against **expressed** Trait IDs.

## Doctrine relationship

Doctrine is not the universal Trait taxonomy.

Doctrine is a bounded higher-order synthesis over specific cognitive/operational Traits.

Current Doctrine requires:

~~~text
assimilated
+ expressed
+ foregrounded
~~~

Campaign One remains limited to Structural Steward and Countermodeler.

Do not auto-generate doctrines from arbitrary catalogue combinations.

## Presets

Trait preset data structures remain compatibility/deferred infrastructure.

Universal Trait expression may eventually create a demonstrated need for player loadout presets, but that feature is not automatically authorized by the ontology revision.

## Current catalogue disposition

The 27-entry catalogue may be read in four broad operational groups:

1. **relationship-derived semantic core** — four canonical cognitive Traits;
2. **live direct-stat texture** — existing expressed Player-stat patterns;
3. **live named-runtime pattern** — currently exemplified by Essence Flow;
4. **legacy/deferred metadata** — definitions whose historical effects lack current qualified consumers.

This classification is operational, not a closed fictional taxonomy.

## Evidence boundary

This audit can establish:

- which current effects have real consumers;
- which patterns may legally Stabilize;
- that expression owns current Player effect/capability use;
- that a named-runtime Trait can be assimilated;
- that deferred-only metadata remains inert;
- that cross-category Trait nature is representable without catalogue expansion.

It cannot establish:

- that players understand the catalogue;
- that the catalogue breadth feels coherent;
- that expression capacity is fun;
- that current stat values are well balanced;
- that a legacy concept should be promoted solely because it could fit the ontology.

Those remain human/design evidence questions.
