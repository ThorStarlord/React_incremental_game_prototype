# Essence and Resonance Model

**Design Status:** Canonical target design; runtime implementation pending  
**Scope:** Relationship-derived Essence generation and Trait assimilation/Resonance  
**Replaces when implemented:** direct `connectionDepth * NPC_CONTRIBUTION_MULTIPLIER` as the complete relationship contribution and `connectionDepth + Essence` as the complete Trait Resonance gate

## 1. Purpose

This document defines how relationship history becomes power without turning meaningful scenes into loot drops.

The system has two separate responsibilities:

1. **Essence generation:** a continuously accumulating resource produced by meaningful relational connection;
2. **Trait Resonance:** a transformation process through which the protagonist assimilates and permanently integrates patterns learned through another character.

The central rule is:

> Relationship events change the conditions under which Essence is generated and Traits are assimilated. They do not directly harvest Essence as event rewards.

---

## 2. Essence ontology

Essence represents the usable metaphysical potential produced by persistent relational significance.

Essence is not synonymous with affection, friendship, romance, moral goodness, or consent.

Meaningful rivalry, dependency, ideological conflict, mentorship, loyalty, fear, admiration, love, betrayal, and shared survival can all contribute to a powerful bond if the relationship has become durable and identity-relevant.

This allows the protagonist's early instrumental worldview to function mechanically while preserving room for later discovery that reciprocal bonds can support qualitatively different forms of Resonance.

---

## 3. Rate, not harvest

### 3.1 Canonical rule

Relationship Experiences and Memories do not award discrete Essence merely for occurring.

Incorrect target design:

```text
The Seed Preserved
+420 Essence
```

Correct target design:

```text
The Seed Preserved
-> Bond Profile changes
-> Resonance Quality changes
-> Willow's ongoing Essence contribution changes
```

The visible Essence balance later reflects time spent generating at the new rate.

### 3.2 Exception boundary

Other game systems may still award Essence if there is an independently justified source, but relationship milestones themselves must not be designed as Essence harvest events.

The current `quest_willow_ancient_seed` reward of `100 Essence` is therefore considered a migration target. It should eventually be replaced by a relationship consequence or another non-harvest reward unless the story establishes an independent Essence source.

---

## 4. Target Essence contribution formula

For v1 planning and implementation, use:

```text
NPC Essence Rate
= Connection Base Rate
× Resonance Quality
× Tether Modifier
× Stability Modifier
```

Total passive generation remains:

```text
Total Essence Rate
= Global Base Rate
+ Sum(NPC Essence Rate)
+ Copy contributions
+ other explicitly authored sources
```

This preserves the existing incremental-game economy while making relationship quality matter.

---

## 5. Connection Base Rate

Connection Level provides the basic production potential of a relationship.

Initial balancing values are intentionally provisional:

| Connection Level | Working Base Rate / sec |
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

These values are balancing defaults, not narrative truth. The semantic meaning of Connection Levels is defined in `RelationshipExperienceSystem.md`.

---

## 6. Resonance Quality

Resonance Quality represents how strongly the relationship's accumulated history supports meaningful metaphysical coupling.

It is derived from the Bond Profile and Memory evidence rather than stored as an arbitrary author-entered reward.

### 6.1 Initial dimensions

A simple first-pass derived score may use:

- Understanding
- Shared Meaning
- Trust
- Reciprocity
- relevant custom dimensions
- Memory resonance tags

Affinity is intentionally a weak or optional input. Current liking should not dominate deep resonance.

Reliance may contribute strongly to instrumental Bonds but should not be treated as equivalent to mutual understanding.

### 6.2 Working implementation bands

| Quality | Multiplier | Meaning |
|---|---:|---|
| Weak | 0.60× | connection exists but has little coherent shared meaning |
| Stable | 1.00× | ordinary established bond |
| Strong | 1.25× | substantial understanding/shared history |
| Deep | 1.50× | relationship meaning strongly reinforces the connection |
| Exceptional | 2.00× | rare identity-level or metaphysical resonance |

The UI may expose the qualitative band and effective rate without exposing every formula term.

---

## 7. Tether Modifier

Tether models active relational proximity/contact.

The initial target is:

| State | Multiplier | Description |
|---|---:|---|
| Absent | 0.20× | no current interaction; only residual established bond flow |
| Remote | 0.40× | meaningful remote awareness/contact |
| Nearby | 0.75× | same area/environment |
| Present | 1.00× | ordinary shared presence |
| Engaged | 1.25× | active conversation/cooperation/shared task |
| Deeply Engaged | 1.50× | unusually intense shared attention or resonance activity |

### 7.1 Distance progression principle

Early relationships should depend heavily on proximity. Deeper Connections may reduce the effective penalty of distance.

The exact distance curve is deferred until the basic vertical slice works.

---

## 8. Stability Modifier

Stability represents whether the current Bond Profile is coherent enough to sustain its expected flow.

| State | Multiplier | Meaning |
|---|---:|---|
| Ruptured | 0.25× | bond remains historically significant but currently destabilized |
| Contested | 0.65× | serious contradiction, betrayal, or unresolved tension |
| Strained | 0.85× | active friction without structural rupture |
| Stable | 1.00× | coherent current relationship |
| Reinforced | 1.10× | recently affirmed by meaningful Experience or Memory |

Stability should respond to relationship events; it is not a morality score.

---

## 9. Trait lifecycle target

The existing Discover -> Equip -> Resonate lifecycle remains valid, but Resonance gains an assimilation stage.

Target lifecycle:

```text
Discover
  -> Equip / Attune temporarily
  -> Accumulate relevant Experiences
  -> Form qualifying Memories
  -> Assimilate through sustained tether/contact
  -> Meet Resonance qualification
  -> Spend Essence
  -> Permanent Trait integration
```

Temporary equipping remains mechanically useful because it allows the protagonist to experience a pattern before permanently integrating it.

---

## 10. Trait semantic profile

Traits sourced from NPCs should eventually support metadata such as:

```text
resonanceTags: [Wisdom, Patience, PatternRecognition]
sourceNpc: npc_elder_willow
minimumConnectionLevel: 2
requiredMemoryTags: [Application]
assimilationDifficulty: 1.0
```

Not every Trait needs all fields. The model should allow simple Traits to remain simple.

---

## 11. Assimilation

Assimilation is progress toward genuinely internalizing a Trait pattern.

A planning formula is:

```text
Assimilation per hour
= Trait Baseline
× Connection Multiplier
× Compatibility Multiplier
× Tether Modifier
× Memory Evidence Modifier
```

### 11.1 Trait Baseline

Represents inherent difficulty or complexity.

### 11.2 Connection Multiplier

Higher qualified Connection makes sustained attunement more effective.

### 11.3 Compatibility Multiplier

Derived from alignment between Trait `resonanceTags` and the relationship's accumulated Experience/Memory tags.

### 11.4 Tether Modifier

Requires actual contact/proximity in early and mid progression. A high-intensity Experience can improve future assimilation conditions but does not substitute for all tether time.

### 11.5 Memory Evidence Modifier

Qualifying Memories provide evidence that the protagonist has done more than merely observe the Trait.

---

## 12. Resonance qualification

A sourced Trait may become permanently Resonatable when all authored requirements are met.

Canonical categories of requirement:

1. **Discovery:** the protagonist knows the Trait exists;
2. **Connection:** minimum qualified Connection Level;
3. **Assimilation:** sufficient assimilation progress;
4. **Evidence:** required Memory or resonance-tag evidence;
5. **Essence:** sufficient spendable Essence;
6. **Prerequisites:** any explicit Trait prerequisites.

The precise requirements should be visible to the player at an appropriate level of abstraction.

---

## 13. Willow's Wisdom target profile

Initial authored target:

```text
Trait: Willow's Wisdom
Source: npc_elder_willow
Essence Cost: 40
Minimum Connection Level: 2
Assimilation Threshold: 100%
Resonance Tags:
  Wisdom
  Patience
  Stewardship
  Understanding
  Application

Required Evidence:
  at least one Memory tagged Application

Strong Supporting Memories:
  The Seed Preserved
  The Lesson Made Yours
```

`The Lesson Made Yours` is the cleanest evidence because it proves independent use of Willow's underlying pattern rather than passive agreement.

The current `essenceCost: 40` may be retained for the first implementation to reduce balancing churn.

---

## 14. Instrumental vs reciprocal Bonds

Both can generate substantial Essence.

The distinction should initially appear through the Bond Profile rather than a hidden moral modifier.

Example instrumental profile:

```text
Trust: 65
Understanding: 70
Shared Meaning: 55
Reliance: 90
Vulnerability: 20
Reciprocity: 15
```

Example reciprocal profile:

```text
Trust: 80
Understanding: 85
Shared Meaning: 85
Reliance: 55
Vulnerability: 70
Reciprocity: 80
```

Both may generate strong Essence. Later high-order mechanics may require qualities such as Reciprocity or mutual Vulnerability and therefore become unavailable to purely extractive Bonds.

This is the target mechanism behind the existing narrative claim that authentic bonds have qualitatively different signatures.

---

## 15. Player-facing explanations

The UI should answer `why?` without requiring the player to inspect formulas.

Example:

```text
Elder Willow
Connection II — Familiar
Essence Resonance: Strong
Contribution: 0.13 / sec

Why:
+ Strong mutual understanding
+ The Seed Preserved remains a defining shared memory
+ Currently in active conversation
```

Trait example:

```text
Willow's Wisdom
Assimilation: 72%

Ready:
[x] Trait discovered
[x] Connection II
[x] Relevant shared memory
[ ] Assimilation complete
[x] 40 Essence available
```

---

## 16. Invariants

1. Relationship Experiences do not directly mint Essence as their default reward.
2. Connection Level alone does not fully determine Essence output.
3. Current Affinity alone does not determine Resonance Quality.
4. High-intensity events cannot bypass all required assimilation time.
5. Trait Resonance is not merely a currency purchase.
6. Memory evidence must correspond to authored narrative events.
7. Manipulative Bonds remain mechanically viable.
8. Reciprocal Bonds may later unlock qualitatively different outcomes rather than receiving a universal flat bonus.
9. The player should be able to understand why a Trait is or is not Resonatable.
10. Balancing constants may change without changing the ontology.

---

## 17. Migration notes

Current runtime behavior remains valid until explicitly migrated:

- Essence currently uses `BASE_RATE + sum(connectionDepth * NPC_CONTRIBUTION_MULTIPLIER)`;
- Trait Resonance currently checks Essence and minimum `connectionDepth`;
- some quests currently award one-time Essence.

These are implementation facts, not the target design defined here.

See `../Technical/RelationshipSystemMigrationPlan.md` for sequencing.

---

## 18. Cross-references

- `RelationshipExperienceSystem.md`
- `MemorySystem.md`
- `TraitSystem.md`
- `EssenceSystem.md`
- `../Narrative/ElderWillowVerticalSlice.md`
- `../Technical/RelationshipSystemMigrationPlan.md`
