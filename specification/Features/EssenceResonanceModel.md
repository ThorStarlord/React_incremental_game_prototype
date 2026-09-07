# Essence and Resonance Model

**Design status:** Canonical model; substantial runtime implementation exists after M14  
**Scope:** Relationship-derived Essence generation and relationship-mediated Trait discovery / assimilation / permanent Resonance  
**Current gap:** broad gameplay exploitation, world-derived Tether, wider Trait migration, and economy balancing

## 1. Purpose

This document defines how relationship history becomes power without turning meaningful scenes into loot drops.

It has two connected responsibilities:

1. **Essence generation** — continuously accumulating metaphysical resource produced by meaningful relational significance;
2. **Trait Resonance** — permanent integration of a capability pattern after it has been discovered and sufficiently internalized.

Canonical rule:

> Relationship events change the conditions under which Essence is generated and Traits can be assimilated. They do not normally mint Essence merely for occurring.

## 2. Essence ontology

Essence represents usable metaphysical potential produced by persistent relational significance and other explicitly justified game sources.

Essence is not synonymous with:

- affection;
- friendship;
- romance;
- moral goodness;
- consent;
- obedience.

Rivalry, dependency, ideological conflict, mentorship, loyalty, betrayal, mutual leverage, professional reliance, love, or shared survival may all support a powerful bond when the relationship is durable and significant.

## 3. Rate, not harvest

Incorrect relationship design:

```text
Defining relationship event
-> +420 Essence
```

Canonical relationship design:

```text
Defining relationship event
-> Experience / Memory
-> Bond Profile changes
-> Connection / quality / stability changes
-> future passive Essence contribution changes
```

Other systems may still award one-time Essence when they provide an independently justified metaphysical/resource source.

## 4. Current Relationship Essence formula

For a Relationship-authority source with Essence enabled:

```text
NPC Essence Rate
= Connection Base Rate
x Resonance Quality
x Tether Modifier
x Stability Modifier
```

Total passive generation:

```text
Global Base Rate
+ sum(Relationship NPC Essence Rates)
+ Copy contributions
+ other explicit sources
```

This model is implemented in the current Relationship/Essence integration for registered authoring bundles. It is not merely a future replacement for the old `connectionDepth` model.

## 5. Connection Base Rate

Working values:

| Connection | Base / sec |
|---:|---:|
| 0 | 0.00 |
| 1 | 0.05 |
| 2 | 0.10 |
| 3 | 0.18 |
| 4 | 0.28 |
| 5 | 0.42 |
| 6 | 0.60 |
| 7 | 0.85 |
| 8 | 1.15 |
| 9 | 1.55 |
| 10 | 2.10 |

These values are balance defaults. The semantic definition of Connection lives in `RelationshipExperienceSystem.md`.

## 6. Resonance Quality

Resonance Quality represents how strongly accumulated Relationship history supports meaningful metaphysical coupling.

The current projection can use:

- Trust;
- Understanding;
- Shared Meaning;
- Reciprocity;
- landmark Memory evidence.

Affinity is intentionally not the dominant input.

Working bands:

| Quality | Multiplier | Meaning |
|---|---:|---|
| Weak | 0.60x | Connection exists but shared meaning is limited/incoherent |
| Stable | 1.00x | Established ordinary bond |
| Strong | 1.25x | Substantial understanding/shared history |
| Deep | 1.50x | Relationship meaning strongly reinforces the bond |
| Exceptional | 2.00x | Rare identity-level/metaphysical resonance |

This quality band is a projection for Essence; it does not replace the multidimensional Bond Profile.

## 7. Tether

Tether represents current relational presence/contact intensity.

| State | Multiplier |
|---|---:|
| Absent | 0.20x |
| Remote | 0.40x |
| Nearby | 0.75x |
| Present | 1.00x |
| Engaged | 1.25x |
| Deeply Engaged | 1.50x |

### Current implementation boundary

The states/formula exist and Relationship bundles may declare a starting Tether state. Current production use is bounded/static/authored rather than a complete world-derived presence model.

A later exploration/Tether milestone should derive Tether from facts such as:

- player/NPC location;
- active conversation;
- shared quest/task;
- travel/co-presence;
- remote contact.

Do not pretend the current starting state is a complete proximity simulation.

## 8. Stability

Stability represents whether the current Bond state is coherent enough to sustain its expected flow.

| State | Multiplier |
|---|---:|
| Ruptured | 0.25x |
| Contested | 0.65x |
| Strained | 0.85x |
| Stable | 1.00x |
| Reinforced | 1.10x |

Stability is not a morality score.

## 9. Trait lifecycle

For relationship-mediated Traits, the runtime already supports the conceptual lifecycle:

```text
Discover
-> temporarily Equip / Attune
-> accumulate assimilation + compatibility evidence
-> form qualifying Memory evidence
-> meet Relationship Connection requirement
-> satisfy prerequisites
-> spend Essence
-> record authored final Resonance Experience
-> permanent Trait integration
```

The earlier design framing that assimilation was wholly future work is obsolete.

## 10. Relationship-mediated Trait metadata

Current Trait definitions may declare optional metadata such as:

```text
discoveryMode
sourceNpc
minimumConnectionLevel
resonanceTags
requiredMemoryTags
assimilationDifficulty
assimilationThreshold
minimumCompatibility
resonanceExperienceId
```

The fields remain optional so legacy/simple Traits do not require unnecessary complexity.

## 11. Assimilation

Assimilation represents progress toward reproducing/internalizing a Trait pattern.

Current migrated slices use authored Relationship Experience effects to advance assimilation and compatibility.

A future richer time/proximity model may use a formula resembling:

```text
Assimilation rate
= Trait baseline
x Connection modifier
x compatibility
x Tether
x Memory evidence
```

But this more continuous formula is **not required to claim that assimilation exists today**.

The current bounded authored approach is already production-qualified for Willow/Elara.

## 12. Resonance qualification

A migrated sourced Trait may require:

1. **Discovery** — the protagonist recognizes the pattern;
2. **Connection** — sufficient qualified Relationship Connection;
3. **Assimilation** — sufficient learning progress;
4. **Compatibility** — sufficient pattern fit;
5. **Evidence** — required Memory/resonance tags;
6. **Prerequisites** — any Trait-specific dependencies;
7. **Essence** — enough spendable resource;
8. **Final authored event** — where configured, a valid final Resonance Experience.

The UI should explain these gates at an appropriate abstraction level.

## 13. Willow's Wisdom — implemented reference

`WillowsWisdom` is a production relationship-mediated Trait.

Current canonical path includes:

```text
The First Lesson
-> discovery + initial assimilation

Three Nights of Teaching
-> sustained practice

The Lesson Made Yours
-> independent application / qualifying evidence

qualified Connection + assimilation + compatibility + Memory + Essence
-> final Resonance
-> permanent Willow's Wisdom
```

This is not a future-only target; it is an implemented/qualified reference slice.

## 14. Scholarly Insight — second implemented reference

`ScholarlyInsight` provides a second relationship-mediated Trait proof through Elara.

Its semantic pattern is evidence-first model revision rather than passive agreement.

The presence of two production examples means the next highest-value unknown is no longer simply “can assimilation exist?”

The stronger product question is:

> Does a Relationship-derived Trait materially change how the player solves a gameplay problem?

## 15. Instrumental vs. reciprocal Bonds

Both instrumental and reciprocal Relationships may generate substantial Essence.

Differences should emerge from actual Bond dimensions/evidence rather than a hidden universal authenticity multiplier.

Example instrumental pattern:

```text
high Reliance
high Understanding
moderate Trust
low Reciprocity
low voluntary Vulnerability
```

Example reciprocal pattern:

```text
high Understanding
high Shared Meaning
high Trust
high Reciprocity
high voluntary Vulnerability
```

Later capabilities may require specific qualities where thematically/mechanically appropriate.

## 16. Player-facing explanation

The player should be able to answer:

### Why is this Relationship producing this Essence rate?

Useful explanation:

```text
Connection base
Resonance Quality
Tether
Stability
Effective contribution
```

### Why can/can't this Trait be Resonated?

Useful explanation:

```text
[x] discovered
[x] Connection requirement
[x] Memory evidence
[ ] assimilation complete
[x] compatibility
[x] Essence available
```

## 17. Current implementation status

| Capability | Status |
|---|---|
| Relationship-derived Essence formula | Implemented for enabled Relationship bundles |
| Bond-derived quality/stability inputs | Implemented/qualified in Relationship runtime |
| Tether states/modifier | Implemented as bounded/static/authored input |
| World-derived Tether | Not implemented |
| Authored Trait discovery | Implemented for Willow/Elara |
| Trait assimilation/compatibility | Implemented for Willow/Elara |
| Memory-based Resonance evidence | Implemented for Willow/Elara |
| Permanent Essence spend after qualification | Implemented |
| Broad migration of all Traits | Not implemented |
| Trait-driven gameplay payoff | Major remaining gap |
| Offline assimilation/progression | Not implemented |

## 18. Invariants

1. Relationship Experiences do not directly mint Essence as their default reward.
2. Connection Level alone does not fully determine Essence output.
3. Current Affinity alone does not determine Resonance Quality.
4. Trait Resonance is not merely a currency purchase for migrated Traits.
5. Discovery does not imply mastery.
6. Memory evidence must correspond to authored history.
7. Manipulative/instrumental Bonds remain mechanically viable.
8. Reciprocal Bonds may unlock qualitatively different outcomes only when explicit mechanics require those qualities.
9. The player should understand why a Trait is or is not ready for permanent Resonance.
10. Balance constants may change without changing the ontology.
11. Current authored/static Tether must not be overstated as world simulation.
12. Legacy `connectionDepth` gates may remain for unmigrated Traits but are compatibility behavior, not the new design rule.

## 19. Migration / roadmap notes

The following older claims are obsolete:

- that Relationship-derived Essence is wholly unimplemented;
- that Trait assimilation is wholly unimplemented;
- that all NPC Essence is a live `connectionDepth x multiplier` formula;
- that all Trait Resonance is only `connectionDepth + Essence`.

Current remaining migration/product work is instead:

- broader Trait migration;
- Trait-driven gameplay use;
- world-derived Tether;
- offline progression;
- economy balancing and explainability;
- Copy/world integration.

## 20. Cross-references

- `../Technical/PostM14ProductReconciliation.md`
- `RelationshipExperienceSystem.md`
- `MemorySystem.md`
- `TraitSystem.md`
- `EssenceSystem.md`
- `QuestSystem.md`
- milestone qualification documents under `../Technical/`