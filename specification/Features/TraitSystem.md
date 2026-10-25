# Trait System Specification

**Implementation status:** Universal Trait ownership/expression migration implemented on current candidate; exact-head qualification pending  
**Identity authority:** [TraitIdentity.md](TraitIdentity.md)  
**Scope reconciliation:** [UniversalTraitOntologyReconciliation.md](../Technical/UniversalTraitOntologyReconciliation.md)  
**Catalogue audit:** [CampaignOneTraitCatalogueAudit.md](../Technical/CampaignOneTraitCatalogueAudit.md)  
**Discovery contract:** [TraitDiscoveryContract.md](../Technical/TraitDiscoveryContract.md)  
**Doctrine:** [RelationshipCapabilityConstellation.md](../Technical/RelationshipCapabilityConstellation.md)

## 1. Purpose

This document owns **how Traits work mechanically**.

Trait Identity owns what a Trait means creatively:

> A Trait is a discrete, stable, salient pattern of being.

The runtime intentionally represents only salient authored patterns.

## 2. Current state model

The compatibility-preserving state mapping is:

~~~text
player.permanentTraits
= assimilated Trait library
= permanently available patterns

player.traitSlots
= expression capacity
= currently manifested patterns

traits.discoveredTraits
= recognized patterns

relationships.traitAssimilation
= relationship-mediated reconstruction evidence

player.doctrineFocus.foregroundedPermanentTraitIds
= compatibility field for deliberately foregrounded assimilated Trait IDs
~~~

Historical field names do not preserve historical semantics.

## 3. Universal Trait lifecycle

~~~text
source instantiates pattern
-> Resonance / meaningful contact
-> Discovery / recognition
-> Assimilation / reconstruction
-> temporary Expression may become available
-> evidence reaches Stabilization readiness
-> Essence Stabilization
-> permanent assimilated ownership
-> free Expression / Suppression within capacity
~~~

These progression terms must remain distinct.

### Resonance

Alignment/contact that makes a foreign pattern legible and transferable.

### Discovery

Recognition that the pattern exists.

### Assimilation

Increasing ability to reconstruct/reproduce the pattern.

### Stabilization

Essence-backed durable ownership.

### Expression

Current manifestation of an available pattern.

## 4. Discovery

A Trait must be discovered before Stabilization.

Trait definitions may declare:

~~~typescript
type TraitDiscoveryMode = 'initial' | 'authored';

discoveryMode?: TraitDiscoveryMode;
~~~

- initial — recognized when definitions load;
- authored — hidden until an authored event reveals the pattern;
- omitted — compatibility behavior equivalent to initial.

Current authored relationship discoveries:

- Willow's Wisdom — The First Lesson;
- Scholarly Insight — The Contradictory Footnote;
- Constraint Sense — Measure Twice;
- Adversarial Calibration — Coercion Reflected.

Loading definitions preserves earned discovery.

New Game recomputes discovery from initial patterns and clears authored discoveries.

## 5. Trait nature metadata

A Trait may declare optional identity metadata:

~~~typescript
interface TraitIdentityMetadata {
  nature: string;
  sourceProvenance?: string;
  notes?: string;
}

identity?: TraitIdentityMetadata;
~~~

This is authoring metadata, not a closed enum.

Current bounded proof includes cognitive, physiological, procedural, semantic-knowledge and metaphysical examples.

## 6. Source provenance

Trait source is no longer assumed to mean NPC.

A Trait may originate from:

- another person;
- practice;
- knowledge;
- an event;
- a relic;
- a place;
- an organism;
- metaphysical exposure;
- another authored source.

Relationship gating applies only when:

- sourceNpc is explicitly declared; or
- a legacy source value resolves to an actual NPC.

This prevents a relic or place identifier from accidentally being treated as an NPC Connection requirement.

## 7. Relationship-mediated assimilation

Relationship-derived Traits store assimilation evidence by source NPC + Trait:

~~~typescript
interface TraitAssimilationState {
  traitId: string;
  sourceNpcId: string;
  progress: number;
  compatibility: number;
  lastUpdatedAt: number;
  qualifyingMemoryIds: string[];
}
~~~

Authored Relationship Experiences may:

- discover a Trait;
- increase assimilation;
- increase compatibility;
- create landmark Memory evidence.

Positive Affinity is not required as the universal cause.

Meaningful rivalry, conflict, dependence and adversarial calibration may also qualify authored learning.

Campaign One deliberately uses authored Experiences rather than a continuous proximity simulator.

## 8. Stabilization readiness

Current Stabilization readiness evaluates:

~~~text
Trait definition exists
+ Trait discovered
+ not already assimilated
+ live runtime/capability authority exists
+ relationship evidence when source is relationship-mediated
+ Trait prerequisites are assimilated
+ enough Essence
-> ready
~~~

### Live authority

A Trait may stabilize when at least one effect has:

- direct Player-stat authority;
- named runtime authority;
- semantic capability authority.

Deferred-only legacy effect metadata cannot stabilize.

This differs from the previous permanent-Player-only rule.

A named-runtime pattern such as Essence Flow may be legitimately assimilated even though its current useful consumer is Copy sharing/inheritance.

## 9. Stabilization transaction

Canonical thunk:

~~~typescript
stabilizeTraitWithEssenceThunk
~~~

Historical compatibility alias:

~~~typescript
acquireTraitWithEssenceThunk
~~~

Transaction order:

1. resolve Trait;
2. evaluate Stabilization readiness;
3. resolve catalogue-owned Essence cost;
4. validate/record authored final relationship event if declared;
5. spend Essence;
6. ensure discovery;
7. add Trait to assimilated library;
8. record Resonance Calibration familiarity;
9. preserve current expression;
10. notify success.

A failed gate spends no Essence and grants no ownership.

Stabilization is idempotently protected by assimilated ownership.

## 10. Assimilated ownership

Assimilated means:

> **The protagonist can reconstruct this pattern without continued source proximity.**

It does not mean always active.

Relationship deterioration therefore does not normally erase assimilated ownership.

Removal of an assimilated Trait requires an explicit future mechanic/fictional cause and is not part of current Campaign One.

## 11. Expression

Player Trait slots are expression capacity.

A currently expressed Trait:

- contributes qualified direct Player-stat effects;
- may satisfy authored semantic Trait requirements;
- may be shared/projected to supported NPC/Copy targets;
- can participate in active Doctrine when foregrounded.

An assimilated but suppressed Trait:

- remains permanently owned;
- contributes no current Player stat effect;
- does not satisfy current-expression capability gates;
- cannot be shared until expressed;
- may be re-expressed freely when capacity permits.

## 12. Expression swapping

Expression management no longer requires NPC proximity.

Current policy:

- player may express/suppress available patterns at will;
- no generic swap cost;
- no generic swap cooldown;
- no source NPC presence requirement;
- the Player begins with two unlocked expression slots so the two-Trait Doctrine model is legal from its first authored use;
- later Resonance levels expand expression capacity up to the existing maximum;
- locked slots still bound expression capacity;
- one Trait cannot occupy multiple Player expression slots simultaneously.

Expression choices may include:

- discovered temporary patterns;
- assimilated patterns.

Expression capacity remains governed by Player Trait-slot unlocks.

## 13. Direct stat effects

Player stat recalculation consumes **expressed Traits only**.

~~~text
assimilated + suppressed
-> no active Player stat effect

expressed
-> qualified effect applies
~~~

This makes ownership and build expression mechanically distinct.

## 14. Semantic capabilities

Authored Quest, Dialogue and Combat definitions retain the historical content key:

~~~typescript
requiredPermanentTraitIds?: string[];
~~~

For compatibility, the key is not mass-renamed in existing content.

Current interpretation:

> every listed Trait pattern must currently be **expressed**.

Therefore:

~~~text
assimilated
!= sufficient

expressed
= current capability availability
~~~

The underlying design invariant remains:

~~~text
capability != decision
~~~

A Trait can make an action legal without choosing it for the player or guaranteeing it is best.

## 15. Temporary Expression

Discovered non-stabilized Traits may use expression slots.

Current bounded Campaign One semantics use Discovery as enough for temporary expression.

This supports experimentation and sharing before permanent ownership.

The runtime does not currently model partial-expression strength from assimilation percentage.

That remains deferred until a real content case warrants it.

## 16. Sharing

Player sharing is controlled by current expression:

~~~text
expressed
-> shareable where target supports sharing

suppressed
-> not shareable
~~~

Assimilated Traits remain shareable while expressed.

Stabilization no longer unshares a Trait automatically.

Unequipping/suppressing or replacing an expressed Trait continues to remove incompatible current shares.

Sharing is projection, not permanent target assimilation.

## 17. Copy relationship

Copy inherited/shared Trait behavior remains a separate bounded authority.

Universal Player Trait identity does not imply:

- Copies can permanently assimilate arbitrary Traits;
- Copies can select their own Traits strategically;
- Copies can perform irreversible decisions;
- generic inheritance simulation.

Those require independent future evidence/authority.

## 18. Doctrine

Permanent ownership and strategic posture remain separate.

~~~text
assimilated library
= what patterns are permanently available

expression
= what patterns are manifested now

doctrine focus
= which expressed learned principles are deliberately foregrounded

active doctrine
= derived higher-order synthesis
~~~

Current doctrines:

- Structural Steward — Willow's Wisdom + Constraint Sense;
- Countermodeler — Scholarly Insight + Adversarial Calibration.

An active Doctrine requires each component Trait to be:

~~~text
assimilated
+ expressed
+ foregrounded
~~~

Doctrine adoption/switch is an explicit Player expression action. It places the Doctrine's pair into the first two unlocked expression slots, replacing current expression there if necessary while preserving assimilated ownership of replaced Traits.

It fails only when the Doctrine requires more expression slots than are unlocked.

## 19. Campaign One relationship examples

### Willow's Wisdom

- source: Elder Willow;
- discovery: The First Lesson;
- relationship-mediated assimilation;
- Memory evidence: Application;
- authored final stabilization event: willow_exp_resonance_wisdom;
- pattern: slow systemic causation.

### Scholarly Insight

- source: Elara;
- discovery: The Contradictory Footnote;
- Memory evidence: IndependentVerification;
- pattern: evidence-first model revision.

### Constraint Sense

- source: Gronk;
- discovery: Measure Twice;
- Memory evidence: ProfessionalReliance;
- pattern: load-bearing constraint recognition.

### Adversarial Calibration

- source: Lyra;
- discovery: Coercion Reflected;
- Memory evidence: AdversarialBond;
- pattern: precise opponent-modeling without requiring agreement/affection.

These are cognitive examples inside a universal ontology, not a definition of the full Trait family.

## 20. Save schema v3

Universal ownership/expression semantics are a save-semantic change.

Current schema:

~~~text
v3
~~~

v2 -> v3 migration:

1. preserves permanentTraits as assimilated ownership;
2. preserves existing expression-slot contents;
3. preserves doctrine focus;
4. fills unlocked empty slots deterministically:
   - doctrine-focus Traits first;
   - then remaining assimilated Traits in saved order;
5. never discards assimilated ownership when expression capacity is insufficient.

This prevents old always-active permanent Traits from silently becoming inaccessible after migration.

## 21. UI semantics

Current player-facing vocabulary should prefer:

- Discovered;
- Assimilation;
- Stabilization;
- Assimilated;
- Expressed;
- Suppressed;
- Doctrine.

Avoid teaching:

- permanent = always active;
- make permanent to free a slot;
- permanent Traits cannot be shared;
- close NPC proximity is required to swap Traits.

## 22. Universal domain boundaries

Trait is not a universal replacement for all state.

~~~text
Relationship
-> shared history and bond interpretation

Relationship Memory
-> historical evidence

Knowledge
-> who knows selected facts

Trait
-> salient internalizable pattern of being

Capability
-> what expressed Trait pattern(s) make possible

Routine familiarity
-> personal mastery evidence for delegation

Faction Reputation
-> institutional regard

World State
-> objective persistent conditions
~~~

Memory Traits and Knowledge Traits may exist without collapsing Relationship Memory or Knowledge authority.

## 23. Runtime invariants

1. Loading a definition is not automatically authored discovery.
2. Discovery is not assimilation.
3. Assimilation is not stabilization.
4. Stabilization is not always-active expression.
5. Assimilated ownership survives suppression.
6. Expression owns active Player Trait effects.
7. Expression owns current semantic Trait capabilities.
8. Expression is freely swappable within unlocked capacity.
9. Expression does not require source proximity.
10. The same Trait cannot occupy multiple Player expression slots.
11. A failed Stabilization gate spends no Essence.
12. A successful Stabilization spends catalogue cost once.
13. Stabilization preserves current expression.
14. Relationship evidence qualifies relationship-mediated assimilation.
15. Positive affection is not universally required for meaningful resonance.
16. Non-NPC provenance does not trigger NPC Connection gates.
17. Deferred-only legacy effects cannot stabilize.
18. Named-runtime patterns may stabilize when their runtime authority is real.
19. Sharing requires expression, not non-permanence.
20. Sharing does not grant target assimilation.
21. Doctrine requires assimilated + expressed + foregrounded components.
22. Capability availability does not make the Player's decision.

## 24. Non-goals

This migration does not introduce:

- continuous proximity simulation;
- every-memory serialization;
- every-knowledge-fact Traits;
- a closed universal Trait taxonomy enum;
- generic Skills;
- generic Crafting;
- generic inventory/equipment;
- automatic Trait extraction;
- arbitrary swap taxes/cooldowns;
- automatic personality overwrite;
- generic Trait-combination engine;
- new Campaign One chapters.

## 25. Evidence ceiling

Deterministic qualification can establish the runtime contracts above.

It cannot establish:

- comprehension;
- fun;
- pacing;
- desired expression capacity;
- satisfying assimilation timing;
- whether Trait hoarding feels powerful;
- whether universal Trait breadth feels coherent to players.

Those remain HUMAN-UNVALIDATED Beta questions.
