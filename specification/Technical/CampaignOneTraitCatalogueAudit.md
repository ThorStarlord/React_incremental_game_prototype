# Campaign One Trait Catalogue Audit

**Status:** CURRENT / bounded feature-completion audit  
**Scope:** Campaign One Trait catalogue and runtime effect authority  
**Purpose:** Prevent legacy perk metadata from forcing obsolete Skills/Crafting-era systems back into 1.0.

## Decision rule

A Trait definition is not evidence that Campaign One must build a subsystem to execute every historical effect key.

The current hierarchy is:

```text
relationship-derived capability identity
-> authored gameplay consumers
-> bounded passive/direct effects where already useful

NOT

legacy JSON effect
-> mandatory new subsystem
```

## Production capability core — KEEP / DEEPEN

| Trait | Source | Current role |
| --- | --- | --- |
| `WillowsWisdom` | Elder Willow | systemic/slow-pattern reasoning; independent Quest/Combat use; Structural Steward component |
| `ScholarlyInsight` | Elara | evidence-first model revision; independent Quest/Combat use; Countermodeler component |
| `ConstraintSense` | Gronk | constraint-first judgment; independent GC08 bottleneck use; Structural Steward component |
| `AdversarialCalibration` | Lyra | opponent-model calibration; independent GC08 stress-test use; Countermodeler component |

These four authored Traits are the canonical Candidate-A capability-buildcraft core. Future depth should preferentially add repeated, causally legible consumers of these identities rather than grow the catalogue.

## Legacy catalogue policy

### KEEP where the current runtime already gives the Trait a real bounded effect

Direct PlayerStats Traits may remain as secondary passive build texture when their effect is actually consumed by the stat pipeline.

Examples include `BattleHardened`, `ResilientConstitution`, `ArcaneIntellect` for its PlayerStats fields, `SwiftStrikes`, `IronWill`, `LuckyCharm`, `HeartOfTheMountain`, and `WhispersOfTheVoid`.

### REWORK only when pulled by an existing Campaign One system

`EssenceFlow` now has one explicit named consumer: when shared with or inherited by a Copy, `essenceGenerationMultiplier` contributes to that Copy's Essence generation. Its player-facing description states that exact scope. Because Campaign One has no permanent Player-owned consumer for that effect, `EssenceFlow` is **temporary/shareable runtime content, not a legal permanent Resonance purchase**.

Definitions such as `CombatReflexes`, `RelationshipSage`, or `EssenceSiphon` may remain catalogue content for compatibility, but a named consumer and tested value proposition must exist before their special-effect metadata is treated as production authority.

### DEFER rather than resurrect cut systems

- `QuickLearner.skillXpMultiplier` must not recreate generic Skills;
- `MasterCraftsman.craftingQualityBonus` must not recreate generic Crafting;
- inventory/equipment-style expansion must not be inferred from Trait metadata.

### REMOVE / CHANGE only through a bounded content package

No mass deletion is authorized by this audit. Existing saves/content references remain stable until a concrete removal package proves a definition is unreachable or harmful.

## Permanent Resonance authority

Runtime authority and permanent Player authority are deliberately different questions.

```text
direct Player-stat effect
OR semantic capability
-> may support permanent Resonance

named runtime effect with no permanent Player consumer
-> may remain temporary/shareable
-> cannot consume Essence for permanent Resonance

deferred-only historical metadata
-> cannot consume Essence for permanent Resonance
```

This closes the player-trust failure mode where a catalogue entry could spend Essence while its advertised effect had no current Player runtime. Mixed Traits remain legal when at least one durable Player effect is real; compatibility metadata is not mass-deleted.

Temporary slots therefore have a bounded Campaign One role:

```text
discover
-> experiment / use a qualified temporary effect
-> optionally share while equipped
-> permanently internalize only when permanent Player authority exists
```

Doctrine remains the current-specialization layer for learned relationship capabilities. Trait presets remain deferred until temporary attunement creates a demonstrated loadout problem.

## Effect execution contract

There are two legitimate forms of Trait gameplay authority:

1. generic direct/passive execution through an explicit consuming runtime such as PlayerStats or a named Copy calculation;
2. semantic capability execution through authored requirements such as `requiredPermanentTraitIds` or `requiredActiveDoctrineIds`.

An effect key being recognized by naming utilities is **not** sufficient evidence that it executes in production.

New special effects require:

```text
named consumer
+ deterministic test
+ player-facing causal explanation where meaningful
```

## Candidate-A next depth question

The first Candidate-A depth package resolves doctrine consumption selectively: GC08 preparation and GC10 finale consume active doctrine after GC06, while GC07 and GC09 remain permanent-capability gates. The coherence package additionally gives `ConstraintSense` and `AdversarialCalibration` independent GC08 distributed-preparation uses, so all four authored source Traits now have at least one identity outside merely being half of a doctrine.

Prefer selective strategic-posture consumers and independent source-Trait uses over:

- further mass conversion of remaining late-campaign pair gates;
- a generic N-way capability graph;
- a large new Trait catalogue;
- Trait presets before temporary-attunement depth creates a real loadout problem.
