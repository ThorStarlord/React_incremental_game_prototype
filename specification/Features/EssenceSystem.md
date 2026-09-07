# Essence System Specification

**Status:** Implemented state/passive generation with Relationship-derived sources and Copy contributions; reconciled after M14  
**Canonical model:** See `EssenceResonanceModel.md` and `../Technical/PostM14ProductReconciliation.md`.

Essence is the game's core metaphysical resource representing accumulated capacity for influence, growth, and permanent Trait Resonance.

## 1. Current authoritative runtime

The passive generation pipeline combines:

```text
Total Essence Rate
= global base rate
+ sum(enabled Relationship-derived NPC contributions)
+ qualifying Copy contributions
+ other explicitly implemented sources
```

The old product description:

```text
sum(all NPC connectionDepth x multiplier)
```

is not the modern Relationship authority and must not be reintroduced as the generic source model.

Legacy constants/fields may remain for compatibility, but migrated Relationship bundles provide their own explicit contribution contract.

## 2. Global base generation

`ESSENCE_GENERATION.BASE_RATE_PER_SECOND` provides a non-zero prototype floor independent of Relationships.

The base rate remains useful while the wider economy is still being balanced.

## 3. Relationship-derived generation

A Relationship bundle may enable Essence in its `RelationshipProgressionDefinition`.

The post-M14 authoring manifest includes:

- Elder Willow;
- Lyra;
- Elara;
- Gronk;
- Silas;
- Valerius.

These production Relationships use `connectionAuthority = relationships`, and their authoring can enable Relationship-derived Essence without depending on legacy NPC `connectionDepth` as the semantic source.

### Formula

```text
NPC Essence Rate
= Connection Base Rate
x Resonance Quality Multiplier
x Tether Modifier
x Stability Modifier
```

### Connection Base Rate

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

These are balance constants, not the semantic definition of Connection.

### Resonance Quality

The implemented projection uses Bond information including:

- Trust;
- Understanding;
- Shared Meaning;
- Reciprocity;
- landmark Memory evidence.

Working bands:

| Quality | Multiplier |
|---|---:|
| Weak | 0.60x |
| Stable | 1.00x |
| Strong | 1.25x |
| Deep | 1.50x |
| Exceptional | 2.00x |

Low Affinity does not imply zero Resonance Quality.

### Tether

The model supports:

| Tether | Multiplier |
|---|---:|
| Absent | 0.20x |
| Remote | 0.40x |
| Nearby | 0.75x |
| Present | 1.00x |
| Engaged | 1.25x |
| Deeply Engaged | 1.50x |

Current production use is still bounded/static/authored rather than a full world-derived presence simulation. Relationship bundles can declare a starting Tether state, and authored teaching/engagement can provide bounded evidence.

A future world/travel milestone should derive Tether from location/presence/activity instead of treating these current defaults as the final simulation.

### Stability

Working states:

| Stability | Multiplier |
|---|---:|
| Ruptured | 0.25x |
| Contested | 0.65x |
| Strained | 0.85x |
| Stable | 1.00x |
| Reinforced | 1.10x |

Stability is relational coherence, not morality.

## 4. Rate, not harvest

Relationship Experiences and Memories normally change the conditions under which Essence is generated.

Correct relationship pattern:

```text
meaningful event
-> Relationship Experience
-> Bond / Connection / quality change
-> future Essence rate changes
```

Not:

```text
meaningful relationship event
-> arbitrary one-time Essence loot
```

A non-relationship game system may still award one-time Essence when independently justified by its own resource/event semantics.

## 5. Passive accrual

Passive generation uses elapsed game time while the GameLoop is running and not paused:

```text
generated = generationRate x elapsedTime
```

Offline progression remains a future capability; normal online passive accrual does not imply offline simulation is already solved.

## 6. Copy contribution

Qualifying Copies continue to contribute through the Copy/Essence integration.

Copy contributions are independent from Relationship-derived NPC contributions.

Do not reinterpret Copy maturity/loyalty as Relationship Bond dimensions without a dedicated redesign.

## 7. Trait Resonance sink

Essence remains a primary cost for permanent Trait Resonance.

### Relationship-mediated Traits

For migrated Traits such as Willow's Wisdom and Scholarly Insight:

```text
Trait discovered
+ qualified Relationship Connection
+ assimilation threshold
+ compatibility threshold
+ required Memory evidence
+ prerequisites
+ enough Essence
+ authored final Resonance Experience
-> spend Essence
-> permanent Trait
```

Essence is the final stabilization cost; it cannot substitute for missing evidence.

### Legacy Traits

Unmigrated Traits may still use compatibility `connectionDepth` gates.

That path exists to preserve current behavior, not to define new product design.

## 8. Recalculation inputs

The generation rate can change when relevant inputs change, including:

- Relationship runtime initialization;
- qualified Connection changes;
- Relationship Experiences affecting Bond quality/stability;
- Relationship bundle/Tether inputs;
- Copy maturity/loyalty qualification;
- other explicit existing rate sources.

Each source should be counted once through its own domain contract.

## 9. Explainability

Player/debug presentation should answer **why is this rate what it is?**

Useful per-Relationship explanation includes:

```text
Connection base
Resonance Quality band
Tether state/modifier
Stability state/modifier
Effective contribution
```

The general Essence UI is still an incomplete per-source economy inspector and can be improved later without changing the ontology.

## 10. Current limitations

- no full offline progression;
- no world-derived Tether simulation;
- no campaign-wide economy rebalance;
- limited per-source history/analytics presentation;
- many legacy/simple Traits still retain compatibility Resonance behavior;
- no claim that current balance constants are final.

## 11. Invariants

1. A Relationship Experience does not normally mint Essence directly.
2. Relationship state may change future passive rate.
3. Connection Level alone does not fully determine output.
4. Current Affinity alone does not determine Resonance Quality.
5. A migrated Relationship source is counted exactly once.
6. Legacy NPC `connectionDepth` is not silently converted into Relationship evidence.
7. Copy contributions remain an independent source.
8. Essence cannot substitute for missing discovery/assimilation/Memory evidence on migrated Trait Resonance.
9. World-derived Tether is still future work; current authored/static Tether must not be overstated as a full presence simulation.

## 12. Cross-references

- `../Technical/PostM14ProductReconciliation.md`
- `RelationshipExperienceSystem.md`
- `EssenceResonanceModel.md`
- `TraitSystem.md`
- `CopySystem.md`
- `GameLoopSystem.md`