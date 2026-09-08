# Essence and Resonance Model

**Design status:** Canonical model; substantial runtime implementation qualified through M19  
**Scope:** Relationship-derived Essence generation and relationship-mediated Trait discovery / assimilation / permanent Resonance  
**Current gap:** broader spatial/activity Tether coverage, wider Trait migration, offline progression, and economy balancing

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

Tether represents **current relational presence/contact intensity**, not historical Relationship significance.

| State | Multiplier |
|---|---:|
| Absent | 0.20x |
| Remote | 0.40x |
| Nearby | 0.75x |
| Present | 1.00x |
| Engaged | 1.25x |
| Deeply Engaged | 1.50x |

### Qualified M19 spatial boundary

M19 qualifies a bounded world-derived spatial projection for two independently anchored production Relationship-authority NPCs:

```text
npc_elder_willow     -> location_whispering_woods
npc_blacksmith_gronk -> location_city_center
```

Using M18 canonical player location and direct adjacency:

```text
same canonical location           -> Present
directly adjacent location        -> Nearby
other distinct canonical location -> Remote
```

This projection is **derived at selector time**. Travel does not rewrite `BondProfile.tetherState`, Connection, Bond dimensions, Memories, Stability, or Resonance Quality.

The stored `BondProfile.tetherState` remains an authored/static fallback when no qualified canonical NPC world anchor exists. M19 therefore preserves existing unanchored Relationship behavior rather than globally reinterpreting every Tether as proximity.

### Explicitly still unqualified

M19 does not derive:

- `Absent` from spatial topology;
- `Engaged` or `Deeply Engaged` from conversation/activity;
- continuous distance;
- NPC schedules or moving NPC positions;
- Copy presence;
- travel-time/offline presence.

Future milestones may add those semantics only when separately warranted.

See `../Technical/M19WorldDerivedTetherQualification.md`, `../Technical/M19WorldDerivedTetherReconAmendment.md`, `../Technical/M19WorldDerivedTetherReconCorrection.md`, and `../Technical/M19WorldDerivedTetherResult.md`.

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

But this more continuous formula is **not required to claim that assimilation exists today** and was not introduced by M19.

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

M16 qualified permanent Relationship-derived Traits changing quest solution space, and M17 independently qualified a permanent Trait changing bounded tactical combat. Trait-driven gameplay payoff is therefore no longer a wholly future gap.

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
Effective Tether + source (spatial or authored)
Stability
Effective contribution
```

M19 exposes whether effective Tether came from the bounded spatial projection or the authored/static fallback so the displayed explanation matches the actual calculation.

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
| Tether states/modifier | Implemented |
| Authored/static Tether fallback | Implemented and preserved |
| World-derived spatial Tether | Bounded M19 qualification for Willow/Gronk: Remote/Nearby/Present |
| Activity-derived Engaged/Deeply Engaged | Not implemented as a general derivation |
| Authored Trait discovery | Implemented for Willow/Elara |
| Trait assimilation/compatibility | Implemented for Willow/Elara |
| Memory-based Resonance evidence | Implemented for Willow/Elara |
| Permanent Essence spend after qualification | Implemented |
| Trait-driven gameplay payoff | Qualified in bounded Quest and Combat slices (M16/M17) |
| Broad migration of all Traits | Not implemented |
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
11. Current world-derived spatial Tether is a bounded projection, not a full presence simulation.
12. Moving through the world must not itself rewrite historical Relationship significance.
13. Unanchored Relationships retain authored/static Tether until a world-presence authority is explicitly qualified for them.
14. Legacy `connectionDepth` gates may remain for unmigrated Traits but are compatibility behavior, not the new design rule.

## 19. Migration / roadmap notes

The following older claims are obsolete:

- that Relationship-derived Essence is wholly unimplemented;
- that Trait assimilation is wholly unimplemented;
- that all NPC Essence is a live `connectionDepth x multiplier` formula;
- that all Trait Resonance is only `connectionDepth + Essence`;
- that world-derived Tether is wholly unimplemented;
- that Trait-driven gameplay payoff is wholly unimplemented.

Current remaining migration/product work includes:

- broader Trait migration;
- broader NPC world anchoring only where needed;
- activity/context-derived higher Tether states if later warranted;
- offline progression;
- economy balancing and explainability;
- Copy/world integration.

## 20. Cross-references

- `../Technical/PostM14ProductReconciliation.md`
- `../Technical/PostM16TraitGameplayReconciliation.md`
- `../Technical/M19WorldDerivedTetherResult.md`
- `RelationshipExperienceSystem.md`
- `MemorySystem.md`
- `TraitSystem.md`
- `EssenceSystem.md`
- `QuestSystem.md`
- `ExplorationSystem.md`