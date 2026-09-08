# Essence System Specification

**Status:** Implemented passive generation with Relationship-derived sources, bounded world-derived spatial Tether, Copy contributions, and bounded M21 offline snapshot accrual  
**Canonical model:** See `EssenceResonanceModel.md`, `../Technical/PostM14ProductReconciliation.md`, `../Technical/M19WorldDerivedTetherResult.md`, and `../Technical/M21BoundedOfflineProgressResult.md`.

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

The registered authoring manifest includes:

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

M19 qualifies a bounded world-derived **spatial** projection for two independently anchored Relationship-authority NPCs:

```text
npc_elder_willow     -> location_whispering_woods
npc_blacksmith_gronk -> location_city_center
```

Using the M18 canonical player-location graph:

```text
same canonical location           -> Present
directly adjacent location        -> Nearby
other distinct canonical location -> Remote
```

This is a current-world projection rather than Relationship history. Travel does not rewrite Connection, Bond dimensions, Memories, Stability, Resonance Quality, or the stored authored Tether fallback.

For Relationship-authority NPCs without an M19 canonical anchor, the existing stored `BondProfile.tetherState` remains authoritative as the authored/static fallback. M19 therefore does not globally reinterpret all Tether as physical proximity.

M19 does not derive `Absent`, `Engaged`, or `Deeply Engaged` from space, and it does not qualify NPC schedules, moving NPC positions, continuous distance, Copy presence, or activity-derived presence.

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

### Online

Passive generation uses elapsed game time while the GameLoop is running and not paused:

```text
generated = generationRate x elapsedTime
```

The online authority is `processPassiveGenerationThunk(deltaTime)`.

### M21 bounded offline accrual

M21 qualifies one explicit snapshot settlement using the same passive-generation authority.

```text
canonical saved envelope timestamp
+
resume timestamp
-> bounded elapsed interval (max 8h)
-> persisted generationRate snapshot x elapsed
-> gain Essence
```

M21 settlement occurs only when the restored save says the GameLoop was running and not paused.

The offline orchestrator then processes the second allowed consumer—already-running M20 Copy tasks—but it does not replay the full GameLoop.

Important limitation:

```text
saved generationRate snapshot
```

is used for the entire bounded interval. M21 does not simulate event-time changes to Relationship/Tether/Copy-derived rates during absence.

Therefore M21 qualifies deterministic bounded snapshot accrual, not a general offline temporal economy simulator.

## 6. Copy contribution

Qualifying Copies continue to contribute through the Copy/Essence integration.

Copy contributions are independent from Relationship-derived NPC contributions.

Do not reinterpret Copy maturity/loyalty as Relationship Bond dimensions without a dedicated redesign.

M20 also qualifies `Resonance Calibration` as a one-shot authored Copy production reward of +8 Essence. That ordinary task reward is separate from passive generation-rate calculation.

During M21 offline settlement, an already-running M20 task may complete through its existing task authority. M21 does not automatically start another task.

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

M21 does not make Trait discovery, assimilation, or Resonance decisions offline.

## 8. Recalculation inputs

The cached passive generation rate changes online when relevant inputs change, including:

- Relationship runtime initialization;
- qualified Connection changes;
- Relationship Experiences affecting Bond quality/stability;
- authored/static Relationship Tether inputs;
- M19 player-location changes that alter effective spatial Tether;
- Copy maturity/loyalty qualification;
- other explicit existing rate sources.

M19 reuses the existing `setLocation` event boundary: after location-sensitive Quest/escort processing, the listener recalculates the existing pure Essence-rate function and refreshes `essence.generationRate`. It does not dispatch a Relationship Tether mutation.

Each source should be counted once through its own domain contract.

M21 intentionally consumes the **persisted cached rate** at save time rather than running these recalculation triggers offline.

## 9. Explainability

Player/debug presentation should answer **why is this rate what it is?**

Useful per-Relationship explanation includes:

```text
Connection base
Resonance Quality band
Effective Tether state + source (spatial or authored)
Stability state/modifier
Effective contribution
```

M19 exposes the effective Tether state and whether it came from the bounded spatial projection or authored/static fallback, so presentation and calculation use the same state.

M21 adds a bounded return summary beginning `While you were away:` for offline-safe settlement. That summary reports ordinary accrued output/task progress; it does not reinterpret why the saved generation rate had its value.

The general Essence UI is still an incomplete per-source economy inspector and can be improved later without changing the ontology.

## 10. Current limitations

- M21 offline progression is bounded to snapshot passive Essence + already-running M20 Copy tasks, not full offline simulation;
- maximum qualified offline interval is an 8-hour prototype cap, not final balance;
- no anti-cheat/server-authoritative time or device-clock tamper protection;
- no event-time rate segmentation/recalculation during the offline interval;
- world-derived spatial Tether is bounded to the M19 qualified anchors/states rather than a full presence simulation;
- no spatially derived `Absent` state;
- no general activity-derived `Engaged` / `Deeply Engaged` semantics;
- no NPC schedules or moving NPC world positions;
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
9. Objective movement may alter effective spatial Tether and current Essence intensity without rewriting historical Relationship significance.
10. Unanchored Relationship sources retain authored/static Tether until a world-presence authority is explicitly qualified for them.
11. M19's spatial Tether is a bounded projection, not a complete proximity/presence simulation.
12. M21 offline Essence uses the persisted generation-rate snapshot and a bounded canonical save-envelope interval; it does not replay Relationship/world causes offline.
13. M21 cannot silently resolve narrative, Relationship, Quest, Combat, travel, or Trait choices merely because time elapsed.

## 12. Cross-references

- `../Technical/PostM14ProductReconciliation.md`
- `../Technical/M19WorldDerivedTetherQualification.md`
- `../Technical/M19WorldDerivedTetherResult.md`
- `../Technical/M21BoundedOfflineProgress.md`
- `../Technical/M21BoundedOfflineProgressReconAmendment.md`
- `../Technical/M21BoundedOfflineProgressResult.md`
- `RelationshipExperienceSystem.md`
- `EssenceResonanceModel.md`
- `TraitSystem.md`
- `CopySystem.md`
- `GameLoopSystem.md`
- `ExplorationSystem.md`