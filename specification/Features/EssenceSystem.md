# Essence System Specification

**Implementation Status:** ✅ State + passive generation + M4 Willow relationship contribution  
**Migration status:** Willow uses the new Bond-derived NPC source; unmigrated NPCs do not currently contribute through a legacy `connectionDepth` formula.

Essence is the game's core metaphysical resource representing accumulated capacity for influence, growth, and permanent Trait Resonance.

## 1. Current authoritative runtime

The current passive generation rate is calculated in `src/features/Essence/state/EssenceThunks.ts#updateEssenceGenerationRateThunk` as:

```text
Total Rate
= global base rate
+ Σ(explicitly migrated Relationship contributions)
+ qualifying Copy contributions
```

This is the authoritative description of current code.

### Important historical drift

Older revisions of this document described:

```text
BASE_RATE + Σ(connectionDepth × NPC_CONTRIBUTION_MULTIPLIER)
```

as implemented runtime behavior. That formula was no longer present when the relationship migration began. `NPC_CONTRIBUTION_MULTIPLIER` still exists as a legacy constant, but the pre-M4 generation thunk calculated only base + qualifying Copies.

M4 therefore **introduces** the first current relationship-derived NPC contribution through Elder Willow rather than replacing a live legacy NPC source.

## 2. Global base generation

`ESSENCE_GENERATION.BASE_RATE_PER_SECOND` remains active.

The base provides a non-zero prototype floor independent of relationships. It is intentionally preserved during migration so relationship-system validation does not simultaneously rebalance the entire early economy.

## 3. Relationship-derived generation

Only NPCs whose `RelationshipProgressionDefinition` explicitly enables relationship Essence participate in this source.

Elder Willow is the first migrated NPC.

### Formula

```text
NPC Essence Rate
= Connection Base Rate
× Resonance Quality Multiplier
× Tether Modifier
× Stability Modifier
```

### Connection Base Rate

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

### Resonance Quality

The current M4 implementation derives a simple, explainable quality score from:

- Trust;
- Understanding;
- Shared Meaning;
- Reciprocity;
- landmark Memory evidence.

The score maps to bands:

| Quality | Multiplier |
|---|---:|
| Weak | 0.60× |
| Stable | 1.00× |
| Strong | 1.25× |
| Deep | 1.50× |
| Exceptional | 2.00× |

This is deliberately an initial transparent projection, not a claim that all future relationship quality should reduce to one scalar.

### Tether

| Tether | Multiplier |
|---|---:|
| Absent | 0.20× |
| Remote | 0.40× |
| Nearby | 0.75× |
| Present | 1.00× |
| Engaged | 1.25× |
| Deeply Engaged | 1.50× |

For the Willow vertical slice, authored teaching sessions provide bounded tether/assimilation evidence. Robust world-location tether simulation remains deferred.

### Stability

| Stability | Multiplier |
|---|---:|
| Ruptured | 0.25× |
| Contested | 0.65× |
| Strained | 0.85× |
| Stable | 1.00× |
| Reinforced | 1.10× |

A hostile or strained relationship may therefore remain Essence-productive if it is consequential and resonant; low Affinity is not equivalent to zero Connection.

## 4. Copy contribution

Qualifying Copies continue to add their existing contribution through `calculateCopyEssenceGeneration`.

M4 does not redesign Copy progression or its Essence semantics.

## 5. Passive accrual

`processPassiveGenerationThunk` accrues:

```text
generated = generationRate × elapsedTime
```

while the game loop is running and not paused.

Relationship Experiences themselves do **not** normally grant a one-time Essence payout. Instead, qualifying relationship changes alter the future passive rate.

## 6. One-time Essence sources

One-time Essence may still exist when independently justified by a non-relationship resource or event.

Example in the Willow vertical slice:

- preserving/awakening the Ancient Seed forms relationship evidence and gives no immediate relationship Essence;
- consuming the Sunstone may grant a small immediate Essence amount because the **Sunstone itself** is being extracted as a metaphysical resource.

This distinction prevents relationship milestones from becoming disguised loot drops.

## 7. Trait Resonance sink

Permanent Trait Resonance remains an important Essence sink.

For unmigrated NPC-sourced Traits, the existing legacy gate remains:

```text
minimum source NPC connectionDepth
+ enough Essence
-> permanent Trait
```

For relationship-migrated Traits such as `WillowsWisdom`, Essence is only the final stabilization cost after relational evidence has already been earned:

```text
Trait discovered
+ qualified Connection
+ complete assimilation
+ compatibility
+ required Memory evidence
+ prerequisites
+ enough Essence
-> authored Resonance beat
-> spend Essence
-> permanent Trait
```

`WillowsWisdom` currently costs 40 Essence.

## 8. Recalculation triggers

The passive rate is recalculated when inputs that can affect it change, including:

- relationship runtime initialization;
- qualified Connection changes;
- authored Relationship Experiences that alter Bond quality/stability;
- relevant existing Copy changes;
- legacy callers that already request rate recalculation.

Only enabled Relationship definitions produce an NPC rate, preventing double-counting during staged migration.

## 9. Explainability / debug

`RelationshipDebugPanel` exposes Willow's contribution as:

```text
effective Willow rate
Connection base
Resonance Quality band + multiplier
Tether multiplier
Stability multiplier
```

This is the qualification surface for answering **why** the relationship changes passive production.

The general `EssencePage` still reflects the prototype's older UI architecture and is not yet a complete per-source economy inspector.

## 10. Current limitations

Not yet implemented as part of this migration:

- broad relationship-derived Essence contributions for every NPC;
- full offline progression;
- advanced distance/tether curves;
- generalized Trait/achievement multipliers across every source;
- production-quality per-source history charts;
- campaign-wide economy rebalance.

## 11. Invariants

1. A relationship Experience does not normally change current Essence balance directly.
2. Relationship milestones may change future passive rate.
3. A migrated NPC is counted exactly once in relationship-derived generation.
4. Unmigrated NPC `connectionDepth` is not silently treated as new Bond evidence.
5. Copy contributions remain independent unless the Copy system is explicitly redesigned later.
6. Essence cannot substitute for missing relational/assimilation evidence on migrated Trait Resonance.
