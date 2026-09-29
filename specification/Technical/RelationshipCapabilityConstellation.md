# Relationship Capability Constellation

**Status:** CURRENT BOUNDED TECHNICAL AUTHORITY — HUMAN-UNVALIDATED  
**Evidence basis:** HEURISTIC design finding + deterministic implementation qualification  
**Human product-value evidence:** UNPROVEN  
**Scope:** Campaign One relationship-derived Doctrine specialization only  
**Universal Trait authority:** [TraitIdentity.md](../Features/TraitIdentity.md), [TraitSystem.md](../Features/TraitSystem.md)

## Purpose

Campaign One has two recurring two-Trait strategic syntheses:

- **Structural Steward** — Willow's Wisdom + Constraint Sense;
- **Countermodeler** — Scholarly Insight + Adversarial Calibration.

The universal Trait revision preserves those profiles while making the state distinction explicit:

~~~text
assimilated library
= what Trait patterns are permanently available

expression
= what Trait patterns are manifested now

doctrine focus
= which expressed learned principles are deliberately foregrounded

active doctrine
= derived higher-order synthesis
~~~

Doctrine is not a second skill tree and is not the general Trait ontology.

## Authority model

~~~text
Relationship history
-> qualifies relationship-mediated discovery / assimilation

Trait assimilated library
-> owns durable patterns

Trait expression slots
-> own current manifestation

player.doctrineFocus
-> owns deliberate strategic foregrounding

Doctrine selectors
-> derive active profile

Dialogue / Quest
-> decide local applicability

Player
-> chooses whether to use the available action

Relationship / Knowledge / Faction / World State
-> own resulting consequences in their existing domains
~~~

The invariant remains:

> **Doctrine is derived state, not separately persisted progression.**

There is no persisted `structuralSteward: true` or `activeDoctrineIds` flag.

## Player state compatibility

~~~typescript
interface DoctrineFocusState {
  foregroundedPermanentTraitIds: string[];
}

interface PlayerState {
  permanentTraits: string[]; // legacy key: assimilated library
  traitSlots: TraitSlot[];    // currently expressed patterns
  doctrineFocus: DoctrineFocusState;
}
~~~

The field `foregroundedPermanentTraitIds` remains a compatibility name.

Campaign One doctrine focus capacity remains **2**.

## Bounded definitions

Production definitions live in:

~~~text
src/features/Traits/state/DoctrineDefinitions.ts
~~~

Only these two are authorized:

~~~text
structural_steward
= Willow's Wisdom + Constraint Sense

countermodeler
= Scholarly Insight + Adversarial Calibration
~~~

This does not authorize:

- speculative six-pair lattices;
- arbitrary N-way combinations;
- generic capability graphs;
- automatic Doctrine generation.

## Validated mutation authority

Raw Player reducers remain narrow:

- `setDoctrineFocus`;
- `clearDoctrineFocus`.

Validated Trait thunks own normal player mutation:

- `setDoctrineFocusThunk`;
- `activateDoctrineThunk`;
- `clearDoctrineFocusThunk`.

### Focus validation

Direct focus selection requires every foregrounded Trait to be:

~~~text
assimilated
+ currently expressed
~~~

and the unique focus set may contain at most 2 Traits.

### Doctrine adoption / switching

Adopting or switching Doctrine is itself an explicit Player expression decision.

Current behavior:

1. verify every required Trait is assimilated;
2. verify enough expression slots are unlocked;
3. place the Doctrine pair into the first unlocked expression slots;
4. replaced Traits remain safely assimilated;
5. set Doctrine focus to the required pair;
6. derived selector confirms the profile.

The action is atomic from the player's perspective and never deletes assimilated ownership.

## Initial expression capacity

Campaign One starts with **2 unlocked expression slots**.

That is necessary because the first authored Doctrine requires a two-Trait pair.

Later Resonance levels expand expression capacity toward the existing maximum of five.

This is expression capacity, not a Doctrine-specific slot system.

## Derived Doctrine authority

`DoctrineSelectors.ts` provides:

- `selectDoctrineFocusTraitIds`;
- `selectActiveDoctrineIds`;
- `selectIsDoctrineActive`.

A Doctrine is active only when every required Trait is simultaneously:

1. assimilated;
2. expressed;
3. foregrounded.

The selector fails closed if corrupt state foregrounds an unassimilated or suppressed Trait.

## Player-facing selection

The normal Traits surface exposes a bounded Doctrine tab.

Player-safe behavior:

- a Doctrine stays hidden until every required Trait is assimilated;
- an eligible Doctrine shows component Trait provenance;
- Adopt / Switch / Clear dispatch validated thunks;
- switching changes expression but never deletes ownership;
- Player Insight projects active Doctrine read-only.

Human comprehension and switching value remain unproven.

## Quest / Dialogue consumption

Authored content may declare:

~~~typescript
requiredActiveDoctrineIds?: DoctrineId[];
~~~

Presentation and authoritative mutation consume the same derived active-Doctrine authority.

A Doctrine requirement is therefore stronger than assimilated ownership:

~~~text
assimilated pair only
-> insufficient

assimilated + expressed + foregrounded pair
-> active Doctrine
~~~

## Relationship between ordinary Trait gates and Doctrine gates

Historical content key:

~~~typescript
requiredPermanentTraitIds?: string[];
~~~

is retained for compatibility, but current runtime meaning is **required currently expressed Trait IDs**.

Therefore Campaign One can support both:

~~~text
expressed individual Trait
-> local capability access

active Doctrine
-> higher-order strategic synthesis access
~~~

without making every individual capability require Doctrine switching.

## Current campaign role

- GC06 establishes the first explicit specialization decision.
- GC08 and GC10 consume active Doctrine where strategic posture is materially relevant.
- Individual expressed Trait use remains legal outside Doctrine where authored.
- GC09 includes independent component-Trait uses that prove Doctrine components retain standalone identity.

Historical milestone documents may still describe those gates as "permanent Trait" gates. They remain evidence of the implementation qualified at that time; current runtime semantics are owned here and in TraitSystem.

## Persistence

Save schema v3 persists:

- assimilated library;
- Trait expression slots;
- Doctrine focus.

v2 -> v3 migration preserves old ownership and deterministically restores expression, preferring Doctrine-focus Traits before remaining assimilated Traits.

No Doctrine boolean is invented.

## Evidence ceiling

Deterministic qualification may establish:

- eligible Doctrine discovery;
- legal adoption/switch/clear;
- expression changes caused by explicit Doctrine switching;
- derived active state;
- Quest/Dialogue gating;
- save/load continuity.

It cannot establish:

- fresh-player comprehension;
- desired switching frequency;
- whether two slots is the best long-term starting capacity;
- whether Doctrine feels meaningfully emergent;
- balance or preference.

Those remain HUMAN-UNVALIDATED Beta questions.
