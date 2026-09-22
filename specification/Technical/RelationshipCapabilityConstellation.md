# Relationship Capability Constellation

**Status:** CURRENT BOUNDED TECHNICAL AUTHORITY — candidate until exact-head qualification/merge  
**Evidence basis:** HEURISTIC design finding + deterministic implementation qualification  
**Human product-value evidence:** UNPROVEN  
**Scope:** Campaign One relationship-derived build specialization only

## Purpose

Campaign One already establishes durable Relationship-derived capability identity and two recurring two-Trait build profiles:

- **Structural Steward** — `WillowsWisdom + ConstraintSense`;
- **Countermodeler** — `ScholarlyInsight + AdversarialCalibration`.

Before this package, every permanently learned Trait remained simultaneously available for every pair-gated route. That made authored profiles meaningful as provenance but left no canonical distinction between:

```text
what the protagonist has permanently learned
and
what the protagonist is currently organizing their approach around
```

The bounded Relationship Capability Constellation introduces that missing distinction without adding a generic skill tree, capability graph, narrative DSL, Story state root, or new progression currency.

## Authority model

The canonical chain is:

```text
Relationship history
-> qualifies discovery / assimilation / Resonance

player.permanentTraits
-> owns durable learned capability

player.doctrineFocus
-> owns current specialization choice

Doctrine selectors
-> derive emergent active profile

Dialogue / Quest
-> decide whether that derived profile is locally applicable

Player
-> chooses whether to use the available action

Relationship / Knowledge / Faction / World State
-> own the resulting consequences in their existing domains
```

The core invariant is:

> **An emergent doctrine is derived state, not separately persisted progression.**

There is no `structuralSteward: true` or persisted `activeDoctrineIds` flag.

## Player state

`PlayerState` owns the only new canonical state:

```ts
interface DoctrineFocusState {
  foregroundedPermanentTraitIds: string[];
}

interface PlayerState {
  // ...
  permanentTraits: string[];
  traitSlots: TraitSlot[];
  doctrineFocus: DoctrineFocusState;
}
```

Semantics:

- `permanentTraits` = everything the protagonist has durably learned;
- `traitSlots` = the existing temporary pre-permanence Trait-equipping surface;
- `doctrineFocus` = permanently learned principles the player is deliberately foregrounding together.

Doctrine focus is not temporary Trait attunement and does not erase permanent knowledge.

Campaign One currently caps doctrine focus at **2** Traits.

## Bounded definitions

Production doctrine definitions live in:

```text
src/features/Traits/state/DoctrineDefinitions.ts
```

The only authorized definitions in this package are the two profiles already established by Campaign One content:

```text
structural_steward
= WillowsWisdom + ConstraintSense

countermodeler
= ScholarlyInsight + AdversarialCalibration
```

This does not authorize the speculative six-pair lattice, arbitrary N-way combinations, a generic capability graph, or automatic doctrine generation.

## Mutation authority

Raw Player reducers stay intentionally narrow:

- `setDoctrineFocus([...traitIds])`;
- `clearDoctrineFocus()`.

Cross-domain validation is performed by Trait thunks:

- `setDoctrineFocusThunk([...traitIds])`;
- `activateDoctrineThunk(doctrineId)`;
- `clearDoctrineFocusThunk()`.

The validated path enforces:

```text
doctrineFocus subset-of permanentTraits
AND
unique foregrounded Traits <= 2
```

Doctrine switching is atomic: the complete focus array changes in one Redux transition rather than exposing transient half-switched profiles.

Removing a permanent Trait also removes that Trait from doctrine focus defensively.

## Derived doctrine authority

`DoctrineSelectors.ts` provides:

- `selectDoctrineFocusTraitIds`;
- `selectActiveDoctrineIds`;
- `selectIsDoctrineActive`.

A doctrine is active only when every required Trait is both:

1. permanently learned; and
2. currently foregrounded.

This double check intentionally fails closed if a malformed/corrupt runtime state foregrounds a Trait that the player does not permanently own.

## Quest consumption

`QuestResolutionOption` now supports:

```ts
requiredActiveDoctrineIds?: DoctrineId[];
```

The existing permanent-Trait gate remains independently valid:

```ts
requiredPermanentTraitIds?: string[];
```

This creates two different authoring meanings:

```text
requiredPermanentTraitIds
= the protagonist has learned this capability

requiredActiveDoctrineIds
= the protagonist's current specialization synthesizes this profile
```

`QuestResolutionAvailability.ts` evaluates both requirements for presentation.

`resolveQuestOutcomeThunk` independently re-evaluates both requirements before any authored Relationship effect, item cost, reward, or resolution mutation. Hiding an option in the UI is never the correctness boundary.

## Dialogue consumption

`DialogueNode` now supports:

```ts
requiredActiveDoctrineIds?: DoctrineId[];
```

`selectAvailableNPCDialogueChoices` composes current active doctrine state into the existing spoiler-safe prerequisite projection.

Available doctrine-qualified topics may explain themselves with player-safe causal text such as:

```text
Active doctrine: Structural Steward
```

Unavailable topics remain hidden without leaking the missing doctrine as a future-content hint.

`processNPCInteractionThunk` independently enforces the same doctrine requirement so direct thunk invocation cannot bypass presentation.

## Existing Campaign One content

This package deliberately **does not** rewrite existing GC06-GC10 two-Trait quest routes from `requiredPermanentTraitIds` to `requiredActiveDoctrineIds`.

Reason:

- the new Redux authority and consumption seam are being qualified here;
- Campaign One currently has no dedicated player-facing doctrine-selection surface;
- converting existing production content immediately would create invisible specialization locks.

The existing routes therefore remain backward-compatible while the bounded active-doctrine contract becomes available to authored content that has an explicit, legible selection path.

Promoting existing campaign routes to active-doctrine gating requires a player-facing selection/legibility package and its own normal-UI qualification; it does not require a new state architecture.

## Save schema v2

Doctrine focus is canonical Player state and therefore persists.

Schema v2 adds:

```ts
player.doctrineFocus = {
  foregroundedPermanentTraitIds: string[]
}
```

The explicit migration is:

```text
v1
-> v2
-> save-schema-v1-to-v2-doctrine-focus
```

Historical saves receive neutral empty focus when the field is absent.

Migration does **not** infer an active doctrine from permanent Trait ownership. Doing so would manufacture a specialization choice the historical save never recorded.

If a v1-shaped payload already carries a structurally valid focus list, migration preserves and normalizes the string IDs.

## Qualification

Focused deterministic coverage:

```text
src/features/Traits/state/RelationshipCapabilityConstellation.test.ts
```

The qualification covers:

1. learned Traits remain permanent while doctrine focus switches;
2. Structural Steward and Countermodeler are mutually distinct under the two-focus cap;
3. unlearned Traits cannot be selected through the validated thunk;
4. malformed raw focus cannot manufacture an active doctrine;
5. Quest presentation rejects inactive doctrine;
6. direct Quest thunk invocation rejects inactive doctrine before consequences;
7. activating the doctrine makes the same Quest action legal;
8. direct Dialogue thunk invocation rejects inactive doctrine;
9. the same Dialogue becomes legal after doctrine activation;
10. schema v1 gains neutral doctrine focus through explicit v2 migration.

Existing whole-game tests remain regression authority for all Campaign One baseline routes.

## Non-goals

This package does not add:

- a separate Skills system;
- a class system;
- a generic capability graph;
- arbitrary AND/OR/NOT condition expressions;
- a generalized narrative-condition DSL;
- automatic doctrine discovery from behavior;
- more than the two already-established Campaign One profiles;
- three-Trait or N-Trait synthesis;
- doctrine-specific Copy autonomy;
- offline doctrine switching;
- new campaign chapters/content;
- human evidence that players understand or enjoy doctrine specialization.

## Claim ceiling

After deterministic qualification the repository may claim:

> The runtime has a bounded canonical distinction between durably learned Relationship-derived Traits and the player's current two-Trait specialization; the two established Campaign One profiles can be derived fail-closed and consumed symmetrically by Quest and Dialogue availability/enforcement.

It may **not** claim that:

- players understand the distinction;
- switching feels meaningful rather than cumbersome;
- two focus slots are the ideal balance;
- Structural Steward or Countermodeler is more fun;
- doctrine gating improves pacing or replayability;
- the selection UX is complete.

Those require player-facing selection work and/or human Beta evidence.

## Governing principle

> **Persist the player's durable knowledge and current choice; derive the archetype.**
