# Campaign One Trait Catalogue Disposition

**Status:** CURRENT Candidate A implementation authority  
**Scope:** Campaign One / 1.0 Trait catalogue only  
**Purpose:** prevent historical perk data from implying supported gameplay that the current product does not actually own.

## Governing rule

`campaignOneDisposition` is catalogue authority, not rarity or power.

```text
keep
-> supported Campaign One progression surface

rework
-> definition retained, but hidden from ordinary initial discovery until its runtime meaning is repaired

defer
-> plausible future mechanic, but not part of the Campaign One player progression surface

remove_1_0
-> depends on a system explicitly cut from Campaign One
```

Only `keep` Traits may seed ordinary initial discovery. A `keep` Trait with
`discoveryMode = authored` still remains hidden until its authored discovery
event occurs.

This is intentionally conservative. Retaining a JSON definition is not evidence
that its effect is implemented or that 1.0 should expose it.

## KEEP — current Campaign One surface

| Trait | Current authority |
| --- | --- |
| BattleHardened | Direct PlayerStats: Attack / Defense |
| EssenceFlow | Copy-sharing/inheritance support: +15% Copy Essence generation using additive fractional semantics |
| ResilientConstitution | Direct PlayerStats: Max Health |
| ArcaneIntellect | Direct PlayerStats: Max Mana / Mana Regen |
| SwiftStrikes | Direct PlayerStats: Speed / Attack |
| IronWill | Direct PlayerStats: Defense |
| LuckyCharm | Direct PlayerStats: Critical Chance |
| HeartOfTheMountain | Direct PlayerStats: Max Health / Defense |
| WhispersOfTheVoid | Direct PlayerStats: Critical Chance / Mana Regen tradeoff |
| WillowsWisdom | Authored relationship-derived capability; permanent capability gates + doctrine input |
| ScholarlyInsight | Authored relationship-derived capability; permanent capability gates + doctrine input |
| ConstraintSense | Authored relationship-derived capability; independent GC08 application + Structural Steward input |
| AdversarialCalibration | Authored relationship-derived capability; independent GC08 application + Countermodeler input |

## REWORK — retained but not player-presented yet

| Trait | Reason |
| --- | --- |
| MentalFocus | Mixes supported Mana Regen with an unqualified direct Attribute mutation (`intelligence`) |
| TomeOfForbiddenKnowledge | Mixes supported PlayerStats with an unqualified direct Attribute mutation; needs an authored Campaign One role before exposure |

Rework does **not** authorize a generic Attribute-modifier engine. A future
package should either give these Traits an explicit Campaign One meaning or keep
them outside 1.0.

## DEFER — no current Campaign One runtime consumer

| Trait | Deferred dependency |
| --- | --- |
| BargainingMaster | Shop discount runtime |
| MentorsInsight | Player-wide Essence gain multiplier |
| EssenceSiphon | Combat Essence siphon behavior |
| RelationshipSage | Generic Relationship gain multiplier |
| CombatReflexes | Generic dodge authority |
| GrowingAffinity | Passive Relationship growth |
| SilverTongue | Trait-driven Attribute/social modifier |
| ShadowWalker | Stealth gameplay |
| ElementalAffinity | Generic magic-damage gameplay |
| EssenceAffinity | Player Essence capacity/generation modifier |

These definitions may remain for compatibility/reference. They must not be
ordinary initial discoveries until an explicit depth decision supplies a real
consumer.

## REMOVE_FROM_1_0

| Trait | Reason |
| --- | --- |
| QuickLearner | Depends on the generic Skills system, which is CUT for Campaign One |
| MasterCraftsman | Depends on generic Crafting progression, which is CUT for Campaign One |

The data can remain to avoid unnecessary destructive migration. Its presence
does not make the mechanic part of 1.0.

## Effect runtime authority

`TraitEffectContract.ts` now classifies every production effect key as one of:

- `player_stat`;
- `copy_essence`;
- `semantic_capability`;
- `deferred_1_0`;
- `removed_1_0`.

The generic Player stat processor applies only `player_stat` effects. Domain
effects require an explicit domain consumer. This removes the old ambiguity
where an effect name could be "recognized" without actually doing anything.

`EssenceFlow.essenceGenerationMultiplier` is normalized to `0.15`: the Copy
formula is `1 + sum(bonuses)`, so `0.15` means +15%.

## Explicitly not authorized

This audit does not authorize:

- a large new Trait catalogue;
- generic Skills;
- generic Crafting;
- a universal effect DSL;
- direct mutation of Player attributes by Trait metadata;
- automatic implementation of every historical special-effect key.

The next value in Traits should come from meaningful authored capability
consumption, not from reviving obsolete subsystem breadth.
