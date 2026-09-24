# Candidate A — Trait Buildcraft Depth Implementation

**Status:** IMPLEMENTED ON CANDIDATE BRANCH / VALIDATION COMMAND ADDED / HUMAN-UNVALIDATED  
**Candidate:** `feature/trait-authority-and-buildcraft-depth`  
**Scope:** bounded Campaign One relationship-derived capability buildcraft

## Problem addressed

The Trait architecture already supported relationship-derived learning, durable
capabilities, and two doctrines, but the product surface still had four major
mismatches:

1. historical generic perks were presented as if their effects were supported;
2. Resonance readiness was split between rich NPC UI and Essence-only generic UI;
3. visible Trait-slot unlock requirements did not have a runtime caller;
4. Doctrine Focus mattered mainly in GC06, while later pair gates often asked only
   whether the player had ever learned both Traits.

## Implemented package

### 1. Curated Campaign One catalogue

`campaignOneDisposition` separates `keep / rework / defer / remove_1_0`.
Only supported `keep` Traits seed ordinary initial discovery.

See `TraitCatalogDisposition.md`.

### 2. Authoritative effect contract

`TraitEffectContract.ts` names the runtime authority of every production effect
key. The generic Player processor now applies only PlayerStats-owned effects.
Domain-specific and deferred effects cannot silently masquerade as generic stat
execution.

### 3. Resonance authority repair

`TraitResonanceReadiness.ts` centralizes pre-commit gates:

```text
discovered
+ Connection
+ assimilation
+ compatibility
+ Memory evidence
+ prerequisites
+ authoritative catalogue Essence price
-> ready
```

Trait Management, the Codex, and the acquisition thunk consume the same
readiness projection.

Caller-supplied `essenceCost` is compatibility-only and ignored. Direct
`discoverTraitThunk` cannot reveal `discoveryMode = authored` Traits.

### 4. Trait-slot progression repair

`setResonanceLevel` now unlocks every Player Trait slot whose documented
Resonance-level requirement has been reached.

### 5. Sustained doctrine specialization

The bounded specialization arc is now:

```text
GC06
-> active doctrine affects Lattice Under Strain

GC07
-> active doctrine affects Counterphase derivation

GC08
-> active doctrine affects Network preparation

GC09 / GC10
-> durable learned pair can still contribute to culmination
```

This is deliberate. GC07-GC08 deepen medium-term posture. GC09-GC10 do **not**
require repetitive last-minute doctrine switching just to prove the player owns
the already-learned capabilities.

Baseline routes remain legal.

### 6. Independent component capability identity

The four doctrine inputs are not reduced to mere pair keys:

- `WillowsWisdom` retains independent Quest/Combat applications;
- `ScholarlyInsight` retains independent Quest/Combat applications;
- `ConstraintSense` gains an optional GC08 dialogue application with Gronk;
- `AdversarialCalibration` gains an optional GC08 dialogue application with Lyra.

The two new GC08 applications record authored Relationship Experiences and do
not block baseline campaign completion.

### 7. Permanent-Trait dialogue gate

Dialogue now supports `requiredPermanentTraitIds` with the same two-layer rule
used elsewhere:

- presentation stays spoiler-safe;
- `processNPCInteractionThunk` rejects direct bypass attempts.

## Preserved boundaries

This package does not add:

- a third doctrine;
- arbitrary N-way capability composition;
- a generic skill tree;
- a universal condition DSL;
- generic Crafting;
- an Attribute mutation engine;
- mandatory doctrine switching in every later chapter.

## Deterministic validation

Focused command:

```bash
npm run trait-depth:validate
```

It covers catalogue disposition, slot unlocking, authoritative price handling,
authored-discovery protection, effect-contract completeness, dialogue capability
gates, doctrine derivation, and GC07/GC08 specialization.

Repository implementation can establish these contracts. It cannot establish
fresh-player comprehension, balance, preference, or whether switching cadence
feels strategically meaningful rather than administrative. Those remain human
evidence questions for the later Beta lane.
