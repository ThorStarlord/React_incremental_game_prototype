# React Incremental RPG Prototype — Technical Specification

This specification documents the design, architecture, implementation status, and empirical qualification history of the React Incremental RPG Prototype.

The project uses React, TypeScript, Redux Toolkit, Material UI, listener middleware, data-driven content, save migration, and focused behavioral qualification.

## Product authority through the Active RPG Loop Integration Repair

Read [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) for broad domain/migration authority, [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md) for Trait-to-gameplay doctrine, [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md) for post-M17 product/status alignment, [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md) plus [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) for bounded travel authority, [`Technical/M19WorldDerivedTetherResult.md`](Technical/M19WorldDerivedTetherResult.md) plus [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) for bounded world-derived spatial Tether, [`Technical/CheckpointBActiveRpgLoopResult.md`](Technical/CheckpointBActiveRpgLoopResult.md) for the original `CHECKPOINT_B_WEAK` verdict, and [`Technical/ActiveRpgLoopIntegrationRepairResult.md`](Technical/ActiveRpgLoopIntegrationRepairResult.md) for the qualified bounded repair. The planned execution sequence through M25 lives in [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md).

The canonical Relationship product rule is no longer:

```text
Affinity reaches threshold
-> connectionDepth increases
```

For Relationship-authority content the current model is:

```text
Story / gameplay event
-> Relationship Experience
-> Bond-dimension changes
-> optional Memory
-> Connection Progress + semantic qualification
-> Bond Profile
-> Essence / Trait / story consequences
```

Legacy `affinity` and `connectionDepth` fields remain valid compatibility surfaces where deliberately retained, but they are not the product model for new Relationship-authority content.

For learned gameplay capability, M16 established and M17 independently exercised the qualified boundary:

```text
Relationship -> qualifies learning
Trait        -> owns durable capability
Gameplay     -> determines local applicability
Player       -> chooses whether to use it
Relationship -> interprets the result when relationally meaningful
```

M18/M19 establish the spatial authority:

```text
Exploration -> owns authored topology / direct adjacency
Player      -> owns canonical current player location
NPC         -> owns bounded canonical world anchors where qualified
Relationship-> owns historical Bond + authored/static Tether fallback
Selector    -> derives current effective spatial Tether
Essence     -> consumes effective Tether
Quest/Story -> reacts independently to location facts
```

Checkpoint B found that these authorities were substantially compatible but still bypassable at active-play boundaries: the M17 encounter could surface without consuming `Player.location`, anchored NPC in-person interaction could be opened globally, and travel did not immediately explain Tether opportunity cost. That evaluation remains historically valid as `CHECKPOINT_B_WEAK`.

The subsequent **Active RPG Loop Integration Repair is now independently qualified**. It adds only the bounded missing bridges:

```text
canonical world presence -> Telluric Echo encounter availability
canonical world presence -> anchored Willow/Gronk in-person interaction availability
successful legal travel  -> immediate bounded Tether consequence feedback
```

The repair does **not** itself convert Checkpoint B to PASS. The current authorization state is therefore:

```text
repair qualified
-> fresh Checkpoint B re-run required
-> M20 still NOT authorized
```

## Core game loop

```text
Discover person / problem
-> participate in meaningful event
-> create Relationship evidence
-> change Bond / Connection
-> change passive Essence and Trait-learning conditions
-> learn / equip / Resonate capability
-> travel to an authored location when required
-> current presence may change effective Tether / Essence intensity
-> in-person encounters/interactions consume canonical presence where qualified
-> use capability in gameplay
-> create story / world consequence
-> other characters interpret the result
-> create new Relationship evidence
-> eventually automate routine work through Copies
```

The loop above remains the target. The bounded repair closes the specific world-presence bypasses that made the first Checkpoint-B evaluation WEAK; a fresh Checkpoint-B evaluation must now decide whether the repaired active loop is coherent enough to authorize automation.

## Architecture overview

### Technology stack

- **Frontend:** React 18+ with TypeScript
- **State:** Redux Toolkit slices, thunks, selectors, listener middleware
- **UI:** Material UI
- **Routing:** React Router v6
- **Build:** Create React App toolchain
- **Persistence:** versioned save/load with migration and import/export
- **Qualification:** TypeScript, focused behavioral tests, accumulated milestone gates, production build

### Design patterns

- feature-sliced organization;
- container/presentation separation where useful;
- data-driven authored content;
- generic runtime contracts before NPC-specific exceptions;
- exact-head qualification for milestone PRs;
- explicit evidence ceilings on experimental claims.

## Specification structure

### Product / reconciliation

- [`GameDesignDocument.md`](GameDesignDocument.md) — product vision and gameplay loop; later empirical checkpoint/result documents override stale near-term status where necessary
- [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) — broad domain authority, migration status, and compatibility boundaries
- [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md) — current Trait-gameplay doctrine and evidence/design boundary
- [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md) — product/status alignment after qualified M17 combat
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — planned execution program from M18 through M25
- [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md) — M18 empirical travel result and evidence ceiling
- [`Technical/M19WorldDerivedTetherResult.md`](Technical/M19WorldDerivedTetherResult.md) — M19 empirical spatial-Tether result and evidence ceiling
- [`Technical/CheckpointBActiveRpgLoop.md`](Technical/CheckpointBActiveRpgLoop.md) — frozen first Checkpoint-B evaluation contract
- [`Technical/CheckpointBActiveRpgLoopResult.md`](Technical/CheckpointBActiveRpgLoopResult.md) — first Checkpoint-B `WEAK` verdict and observed integration gaps
- [`Technical/ActiveRpgLoopIntegrationRepairQualification.md`](Technical/ActiveRpgLoopIntegrationRepairQualification.md) — frozen repair scientific contract
- [`Technical/ActiveRpgLoopIntegrationRepairReconAmendment.md`](Technical/ActiveRpgLoopIntegrationRepairReconAmendment.md) — frozen bounded repair architecture decisions
- [`Technical/ActiveRpgLoopIntegrationRepairResult.md`](Technical/ActiveRpgLoopIntegrationRepairResult.md) — qualified repair result, diagnostic history, and current authorization boundary

### Core feature specifications

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship Experiences, Memories, Bond dimensions, Connection
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark relational evidence
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — relationship-to-power ontology including bounded M19 spatial Tether
- [`Features/EssenceSystem.md`](Features/EssenceSystem.md) — current passive Essence runtime and recalculation boundaries
- [`Features/TraitSystem.md`](Features/TraitSystem.md) — discovery, equip, assimilation, Resonance, and qualified permanent gameplay capability
- [`Features/NPCSystem.md`](Features/NPCSystem.md) — NPC identity/services/dialogue/quest integration and legacy compatibility boundary
- [`Features/QuestSystem.md`](Features/QuestSystem.md) — quest lifecycle, authored resolution choices, and permanent-Trait resolution gates
- [`Features/CopySystem.md`](Features/CopySystem.md) — Copy growth, loyalty, Trait sharing, roles/tasks
- [`Features/GameLoopSystem.md`](Features/GameLoopSystem.md) — real-time progression and autosave
- [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md) — M17 deterministic encounter plus bounded canonical-location launch authority
- [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) — M18 travel, M19 spatial Tether inputs, and bounded active-play presence integration

### Technical documentation

- [`Technical/ArchitectureOverview.md`](Technical/ArchitectureOverview.md)
- [`Technical/StateManagement.md`](Technical/StateManagement.md)
- [`Technical/DataModel.md`](Technical/DataModel.md)
- Relationship/Trait/gameplay migration and qualification records under `Technical/`

### UI / UX

- [`UI_UX/UserFlows.md`](UI_UX/UserFlows.md)
- [`UI_UX/LayoutDesign.md`](UI_UX/LayoutDesign.md)
- [`UI_UX/ComponentSpecification.md`](UI_UX/ComponentSpecification.md)

### Narrative

- [`Narrative/Synopsis.md`](Narrative/Synopsis.md) — macro plot and act structure
- [`Narrative/Characters.md`](Narrative/Characters.md) — character bios and arcs
- [`Narrative/WorldLore.md`](Narrative/WorldLore.md) — factions, cosmology, relics, setting hooks

## Current implementation status after the Active RPG Loop Integration Repair

| Area | Status | Notes |
|---|---|---|
| Player | Strong foundation | stats/loadout/progression infrastructure exists; canonical fresh location is `location_city_center` |
| Relationship Experiences / Memories / Bond | Qualified production runtime | accumulated M4-M19 evidence |
| Relationship Connection authority | Qualified for registered bundles | legacy NPC compatibility remains |
| Essence | Functional + Relationship-derived contributions + bounded spatial Tether | Willow/Gronk spatial `Remote`/`Nearby`/`Present` qualified; authored fallback and broad economy work remain |
| Traits | Core + relationship-mediated discovery/assimilation + bounded gameplay capability | Willow/Elara qualified; temporary gameplay semantics deferred |
| Quest | Expanded foundation | permanent-Trait resolution gate qualified; ordinary `REACH_LOCATION` consumes M18 travel through existing listener |
| Narrative integration | Bounded qualified slices | M13 causal loop; M14 multi-NPC; M15 long-horizon callbacks |
| Copy | Substantial partial implementation | growth/loyalty/Traits/roles/tasks substrate exists; production automation depth remains; **M20 still blocked pending fresh Checkpoint B** |
| GameLoop | Implemented | offline progress deferred |
| Save/load | Implemented + migration qualification | M18 location and M19 derived spatial Tether reconstruct without new proximity persistence |
| Combat | Bounded qualified vertical slice + bounded presence gate | M17 encounter works; repair requires canonical Whispering Woods presence before entry |
| Exploration | Bounded qualified vertical slice + bounded cross-domain integration | four authored locations, legal direct travel, Quest integration, M19 Tether inputs, immediate post-travel Tether feedback |
| Spatial Tether | Bounded qualified projection | Willow/Gronk anchored; unanchored Relationships retain authored/static fallback; broader presence semantics deferred |
| NPC active presence | Bounded qualified integration | anchored Willow/Gronk require co-presence for in-person detailed actions; remote Overview/Relationship inspection remains available; unanchored NPCs retain legacy behavior |
| Active RPG integration | Repair qualified; checkpoint decision pending | original Checkpoint B = WEAK; bounded observed gaps repaired; fresh Checkpoint B rerun required |
| Faction / world state | Partial concepts | dedicated authority still future work |

## Qualification history

The Relationship/Trait/gameplay progression architecture is no longer a purely planned design.

Key milestones:

- **M4-M10:** core Relationship migration, Memories, Trait evidence, save migration/reconciliation;
- **M11:** Lyra adversarial universality;
- **M12:** production authoring scalability across Gronk/Silas/Valerius;
- **M13:** persisted Relationship evidence causes later story;
- **M14:** one shared decision creates distinct/conflicting consequences across multiple NPC relationships;
- **M15:** old and newer Relationship evidence compose across unrelated intervening content and save/load;
- **M16:** Relationship-derived permanent Traits materially change bounded quest gameplay solution space through a generic permanent-Trait resolution gate;
- **Checkpoint A:** post-M16 doctrine reconciled Relationship provenance, Trait capability authority, player decision authority, and anti-golden-option design rules;
- **M17:** one bounded deterministic Combat encounter demonstrates an optional permanent-`WillowsWisdom` tactical route while ordinary no-Trait victory remains viable, and legitimate victory advances an existing Quest `KILL` objective through the ordinary event bridge;
- **P17.5:** product/status canon reconciled after M17 without runtime change;
- **M18:** one bounded four-location graph supports player-facing legal travel, below-UI direct-route enforcement, save/load continuation, and existing `REACH_LOCATION` Quest consequences through the ordinary `setLocation` listener;
- **M19:** objective player location relative to two independently anchored Relationship-authority NPCs derives bounded spatial Tether and changes current Relationship-derived Essence intensity without rewriting historical Bond state; unanchored Relationships retain authored/static Tether and save/load reconstructs the spatial projection without proximity flags;
- **Checkpoint B (first evaluation):** **WEAK** — Relationship/Trait/Quest/Travel/Tether/Essence composition was substantial, but Combat and anchored-NPC active interaction could bypass canonical world presence and spatial consequence feedback was fragmented;
- **Active RPG Loop Integration Repair:** **PASS** — the existing Telluric Echo consumes canonical encounter location, anchored Willow/Gronk in-person actions consume co-presence while remote Relationship inspection remains available, and legal travel immediately reports bounded Tether opportunity cost without rewriting Bond history or adding a generalized world/presence engine. A fresh Checkpoint-B re-run remains required before M20.

Milestone qualification is documented under `Technical/` and exercised in Build Validation.

## Testing policy

The old prototype rule that automated tests were intentionally out of scope is obsolete.

Current milestone work should preserve:

1. TypeScript correctness;
2. focused behavioral tests for the changed capability;
3. accumulated Relationship/Trait/save/narrative/combat/exploration/Tether qualification;
4. production build;
5. exact-head PR qualification before merge when operating under the milestone workflow.

The active-loop repair also demonstrated why qualification should remain decomposable and bounded: an opaque combined Jest step was split into dedicated repair, modified historical, and otherwise unchanged accumulated groups with explicit timeouts. This preserved all evidence while making failures diagnosable.

Do not remove prior gates merely because a new milestone focuses on another subsystem.

## Near-term development direction

The bounded **Active RPG Loop Integration Repair is qualified**.

The immediate next task is now a **fresh Checkpoint B — Active RPG Loop evaluation** against the merged repair.

The fresh checkpoint should reassess the original coherence dimensions, especially:

```text
Relationship -> Trait provenance
Trait -> Quest / Combat capability identity
Travel -> meaningful destination choice
Travel -> immediate spatial/Tether consequence legibility
canonical presence -> encounter availability
canonical presence -> anchored NPC in-person interaction
Gameplay consequence -> Relationship closure
```

Important boundaries remain:

- the repair PASS is not itself a Checkpoint-B PASS;
- remote inspection of known Relationship information remains distinct from active in-person interaction;
- do not introduce coordinates, NPC schedules, autonomous movement, travel time, pathfinding, a generalized encounter-condition DSL, or a world-state engine merely to make the checkpoint look complete;
- preserve M18 legal-travel authority and M19 derived-not-stored Tether;
- preserve all accumulated qualification.

Only a fresh:

```text
CHECKPOINT_B_PASS
M20 authorized
```

authorizes Copy Task Automation.

The remaining planned sequence is therefore:

```text
Checkpoint B first evaluation: WEAK
-> bounded Active RPG Loop Integration Repair: PASS
-> fresh Checkpoint B re-run
-> if PASS: M20 Copy Task Automation
-> M21 Offline Progress
-> Checkpoint C
-> M22 Social Knowledge Propagation
-> M23 Faction Reputation
-> M24 Objective World State
-> M25 Complete Chapter Vertical Slice
-> Human integrated playability review
```

See `Technical/PostM17MilestoneRoadmap.md` for the original working experiment program, `Technical/CheckpointBActiveRpgLoopResult.md` for the first evaluation, and `Technical/ActiveRpgLoopIntegrationRepairResult.md` for the current repair evidence. Individual future milestone semantics remain provisional until each experiment is preregistered against the actual then-current repository state.

## Development workflow

For milestone work:

```text
verify current main
-> freeze baseline SHA/tree
-> create dedicated branch
-> preregister question / acceptance / falsification
-> recon existing capability
-> implement smallest production proof
-> add focused qualification
-> run accumulated CI + production build
-> record results + evidence ceiling
-> requalify documentation-complete head
-> merge exact qualified SHA
-> verify main
-> stop at milestone boundary
```

For documentation-only reconciliation checkpoints, preserve the same exact-head merge discipline but do not invent runtime tests or behavior changes when the task is canon alignment.

## Repository structure

```text
src/
├── app/
├── features/
│   ├── Relationships/
│   ├── Player/
│   ├── Traits/
│   ├── NPCs/
│   ├── Quest/
│   ├── Essence/
│   ├── Copy/
│   ├── Combat/
│   ├── Exploration/
│   ├── GameLoop/
│   └── Settings/
├── shared/
├── pages/
├── routes/
└── layout/

public/data/
├── relationships/
├── dialogues.json
├── quests.json
└── npcs.json

specification/
├── Features/
├── Narrative/
├── Technical/
└── UI_UX/
```

## Canonical conflict rule

When an older specification conflicts with the current authority chain, do not silently revive old behavior as design truth.

Use this reading order:

1. `Technical/PostM14ProductReconciliation.md` for broad domain/migration authority;
2. `Technical/PostM16TraitGameplayReconciliation.md` for Trait-to-gameplay doctrine;
3. `Technical/PostM17ProductReconciliation.md` for post-M17 product/status alignment;
4. `Technical/M18ExplorationTravelResult.md` + `Features/ExplorationSystem.md` for qualified player-travel authority;
5. `Technical/M19WorldDerivedTetherResult.md` + `Features/EssenceResonanceModel.md` for qualified bounded spatial-Tether authority;
6. `Technical/CheckpointBActiveRpgLoopResult.md` for the first active-RPG integration verdict and the exact gaps it observed;
7. `Technical/ActiveRpgLoopIntegrationRepairResult.md` for the qualified repair of those gaps and the current requirement to re-run Checkpoint B;
8. `Technical/PostM17MilestoneRoadmap.md` for the planned future execution program subject to checkpoint overrides;
9. `GameDesignDocument.md`;
10. `Features/RelationshipExperienceSystem.md` / `EssenceResonanceModel.md`;
11. the relevant current feature spec;
12. milestone-specific qualification evidence.

If the runtime still uses a legacy rule, document it as compatibility/migration debt and migrate it deliberately rather than pretending it is the modern product model.
