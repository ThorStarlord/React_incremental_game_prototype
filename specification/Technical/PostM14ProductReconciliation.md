# Post-M14 Product and Design Reconciliation

**Status:** Canonical post-M14 product authority  
**Baseline:** `0e85835cc1db0a4a0f8aee0ac3233013589977af`  
**Baseline tree:** `6fd9912d57fc53186d5573513a125a2dede3b2e8`  
**Scope:** Reconcile the high-level game design and feature specifications with the Relationship architecture empirically qualified through M4-M14.

## 1. Why this document exists

The repository now contains two generations of product language:

1. an older prototype model in which Affinity functioned as relationship XP, reaching a threshold automatically increased `connectionDepth`, and `connectionDepth` broadly drove Essence and Trait gates;
2. the Relationship-domain model implemented and qualified through M4-M14, where authored Experiences and Memories provide durable evidence, Bond dimensions describe current meaning, and Connection is qualification of relational significance rather than accumulated approval.

The second model is authoritative for new product design and new relationship-authored content.

Legacy fields and compatibility paths may remain in runtime for NPCs, Traits, Copy mechanics, UI, saves, or tools that have not been deliberately migrated. Their continued existence is not a design instruction to extend the legacy model.

## 2. Canonical product identity

The game is an incremental RPG in which **relationship history becomes power and narrative causality**.

The distinctive progression promise is not simply that NPCs like the player more over time. It is:

```text
Discover a person / problem
-> participate in meaningful events
-> form Relationship Experiences and Memories
-> change the Bond Profile and qualified Connection
-> alter ongoing Essence potential and Trait-learning conditions
-> acquire or internalize capabilities
-> use those capabilities in gameplay
-> change the world / story
-> other characters interpret those consequences
-> create new Relationship history
-> eventually automate routine work through Copies
```

The intended loop is therefore both narrative and incremental:

```text
Story / gameplay
-> Relationship evidence
-> persistent relational state
-> power / access / passive production
-> new gameplay capability
-> new story / world consequence
-> new Relationship evidence
```

## 3. Canonical relationship vocabulary

### Relationship Experience
A durable event record that says **what happened between the participants and why it mattered relationally**.

### Memory
A landmark Relationship Experience retained as durable evidence of how the relationship became what it is.

### Bond Profile
The current interpreted relationship state, including universal dimensions, Connection, Memories, resonance/stability information, and derived consequences.

### Affinity
Current positive or negative disposition. Affinity remains useful for short-horizon reactions, service pricing/access, tone, temporary conflict, and legacy compatibility.

**Affinity is not Connection XP.**

### Connection Progress
Readiness toward a higher Connection level based on accumulated relational significance.

### Connection Level
Evidence-qualified depth/significance of the relationship. It is not synonymous with affection and cannot increase solely because Affinity reaches a numeric threshold.

## 4. Domain authority map

| Domain | Owns | Must not become |
|---|---|---|
| Story / Dialogue / Quest | Events, objectives, authored choices, what physically/socially happens | A duplicate relationship ledger |
| Relationships | Relational interpretation, Experiences, Memories, Bond dimensions, Connection | A general-purpose world-state database |
| Traits | Discovery, temporary use, assimilation, permanent capability | A substitute relationship score |
| Essence | Resource balance, passive generation, spending | A one-time loot reward for every relationship event |
| Player | Character stats, permanent Traits, active loadout | Owner of NPC relationship truth |
| World / Exploration | Location, travel, objective environmental/world conditions | A hidden social-state store |
| Factions | Collective/institutional standing when introduced | Average personal relationship score |
| Copies | Delegated entities, growth, loyalty, roles, routine automation | Automatic authority over irreversible narrative decisions |
| Save / Meta | Persistence, versioning, session metadata | Semantic authority over any gameplay domain |

## 5. Empirically qualified Relationship ladder

The current architecture is supported by the accumulated M4-M14 qualification history.

### M4-M10 — core migration and persistence

Established Relationship Experiences, Memories, Bond-derived Connection, Trait discovery/assimilation for migrated slices, save migration/reconciliation, and the first relationship-derived Essence behavior.

### M11 — adversarial universality

Qualified Lyra as a production adversarial/dialectical relationship. Low/negative Affinity did not prevent meaningful Connection progression.

### M12 — authoring scalability

Qualified Gronk, Silas, and Valerius as distinct production relationship archetypes without repeated generic engine changes.

### M13 — narrative causality

Qualified a bounded Story -> Relationship -> later Story -> new Relationship evidence loop across Silas and Valerius, including save/load persistence of causal evidence.

### M14 — shared social consequence

Qualified one shared story decision producing distinct, conflicting Relationship interpretations for Valerius, Silas, and Gronk, then independently reproduced multi-NPC fan-out in a second probe.

M14 also produced a negative architecture finding: existing dialogue effect fan-out was sufficient; no plural quest Relationship field or new social bridge was warranted.

## 6. Current implementation / migration status

| Capability | Canonical design | Runtime status after M14 | Remaining gap |
|---|---|---|---|
| Relationship Experiences | Yes | Implemented / qualified | Broader content production |
| Memories | Yes | Implemented / qualified | Player-facing history/presentation can improve |
| Bond dimensions | Yes | Implemented / qualified | Balance and broader UI |
| Evidence-qualified Connection | Yes | Implemented for registered Relationship-authority NPCs | Legacy NPC compatibility remains |
| Relationship-derived Essence | Yes | Implemented for registered Relationship bundles with enabled Essence | World-derived Tether and economy balancing |
| Trait authored discovery | Yes | Implemented for Willow and Elara | Broader Trait migration |
| Trait assimilation / Memory evidence / Resonance | Yes | Implemented for Willow and Elara | Exploit it in more gameplay; broader Trait migration |
| Story consumes Relationship evidence | Yes | Implemented / qualified by M13 | Longer-horizon composition |
| One story choice affects multiple relationships | Yes | Implemented / qualified by M14 | Campaign-scale composition |
| Quest foundation | Yes | Expanded foundation | Richer graphs, map delivery, authoring, campaign presentation |
| Combat | Yes | Event-bus scaffold only | First real encounter model |
| Exploration / travel | Yes | Partial location/event support | Player-facing world graph/travel/resource acquisition |
| Relationship Tether | Yes | Formula/states exist; bounded authored/static use | Derive from world/presence/activity |
| Copy growth / loyalty / Trait sharing | Yes | Substantial partial implementation | Production task economy / deployment |
| Offline progress | Yes | Not implemented | Deterministic safe offline simulation |
| Social knowledge propagation | Future | Not implemented | Per-NPC knowledge without global omniscience |
| Faction reputation | Future | Partial reward/data concepts | Dedicated authority and personal/faction separation |
| World-state consequences | Future | Limited/ad hoc | Small explicit reusable world-state domain |

## 7. Legacy compatibility policy

The following may still exist legitimately:

- `npc.affinity`;
- `npc.connectionDepth`;
- legacy Trait Resonance gates for unmigrated Traits/NPCs;
- Copy calculations that still consume legacy NPC fields;
- UI/debug surfaces that expose old values;
- save migration code that reads old fields.

Rules for new work:

1. Do not use `affinity >= 100 -> connectionDepth + 1` as the product-level progression rule for new Relationship-authority content.
2. Do not add new direct `connectionDepth` dependencies when Relationship authority can supply the needed concept.
3. Do not delete legacy fields merely for conceptual cleanliness; migrate consumers deliberately with tests and save compatibility.
4. When a legacy field is still authoritative for an unmigrated subsystem, document that fact explicitly as compatibility behavior.
5. New story consequences should use Relationship Experiences/Memories for relational facts and another appropriate domain for non-relational facts.

## 8. Testing and qualification policy

The old prototype statement that automated tests are out of scope is obsolete.

Current engineering authority includes:

- TypeScript compilation;
- focused behavioral tests;
- accumulated Relationship/Trait/save migration qualification;
- production build;
- exact-head PR qualification before merge for milestone work.

New milestone work should preserve accumulated gates unless there is an explicit, recorded reason to change them.

## 9. Roadmap correction discovered during reconciliation

The pre-reconciliation draft roadmap proposed a future milestone to implement Relationship -> Trait assimilation.

Repository authority shows that this capability already exists for at least Willow and Elara:

```text
Authored Trait discovery
+ qualified Relationship Connection
+ assimilation progress
+ compatibility
+ required Memory evidence
+ Essence
+ authored Resonance Experience
-> permanent Trait
```

Therefore the project should **not** spend a future milestone rebuilding Trait assimilation as if it were absent.

The immediate next unknown remains:

### M15 — Long-Horizon Relationship Callback Qualification

Can old Relationship evidence remain causally relevant after intervening unrelated content, additional relationship change, and save/load?

After M15, the highest-value payoff should move directly toward **Trait-driven gameplay**: prove that a capability learned through relationship evidence changes how a real gameplay problem can be solved.

Milestone numbering after M15 should be frozen when each experiment is preregistered rather than preserving an obsolete draft number at the cost of duplicating implemented work.

## 10. Strategic checkpoints

### Checkpoint A — after Trait-driven gameplay proof

Ask whether the loop is compelling and legible:

```text
Relationship
-> learned capability
-> different gameplay
-> world/social consequence
-> new Relationship history
```

Do not expand combat/world scope if this core loop does not work.

### Checkpoint B — after Copy automation + offline progress

Ask whether incremental mechanics reinforce the narrative RPG or feel like an unrelated idle layer.

### Checkpoint C — after first complete chapter vertical slice

Ask whether the repository has become a small coherent game rather than a collection of individually qualified subsystems.

## 11. Canonical reading order for future work

For product/system decisions after M14, read in this order:

1. `Technical/PostM14ProductReconciliation.md` — authority map and current status;
2. `GameDesignDocument.md` — product vision and modern gameplay loop;
3. `Features/RelationshipExperienceSystem.md` — relationship ontology and invariants;
4. `Features/EssenceResonanceModel.md` — relationship-to-power model;
5. relevant feature specification (`TraitSystem`, `QuestSystem`, `CopySystem`, etc.);
6. milestone-specific technical qualification documents for empirical evidence.

When an older document conflicts with this authority chain, do not silently pick the older model. Treat the conflict as documentation or migration debt and resolve it explicitly.

## 12. Reconciliation boundary

This task changes documentation authority only.

It does **not**:

- migrate remaining legacy runtime fields;
- rebalance Essence;
- redesign Copy creation;
- add combat/exploration/offline systems;
- create M15 content;
- claim human fun or campaign completeness.

The next code-bearing milestone remains separately preregistered and qualified.