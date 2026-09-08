# React Incremental RPG Prototype — Technical Specification

This specification documents the design, architecture, implementation status, and empirical qualification history of the React Incremental RPG Prototype.

The project uses React, TypeScript, Redux Toolkit, Material UI, listener middleware, data-driven content, save migration, and focused behavioral qualification.

## Product authority through M18

Read [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) for broad domain/migration authority, [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md) for Trait-to-gameplay doctrine, [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md) for post-M17 product/status alignment, and [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md) plus [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) for the qualified bounded travel layer. The planned execution sequence through M25 lives in [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md).

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

M18 adds a separate spatial boundary:

```text
Exploration -> owns authored topology / direct adjacency
Player      -> owns canonical current player location
Quest/Story -> reacts to location facts
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
-> use capability in gameplay
-> create story / world consequence
-> other characters interpret the result
-> create new Relationship evidence
-> eventually automate routine work through Copies
```

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

- [`GameDesignDocument.md`](GameDesignDocument.md) — current product vision and gameplay loop
- [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) — broad domain authority, migration status, and compatibility boundaries
- [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md) — current Trait-gameplay doctrine and evidence/design boundary
- [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md) — product/status alignment after qualified M17 combat
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — planned execution program from M18 through M25
- [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md) — M18 empirical result and evidence ceiling

### Core feature specifications

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship Experiences, Memories, Bond dimensions, Connection
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark relational evidence
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — relationship-to-power ontology
- [`Features/EssenceSystem.md`](Features/EssenceSystem.md) — current passive Essence runtime
- [`Features/TraitSystem.md`](Features/TraitSystem.md) — discovery, equip, assimilation, Resonance, and qualified permanent gameplay capability
- [`Features/NPCSystem.md`](Features/NPCSystem.md) — NPC identity/services/dialogue/quest integration and legacy compatibility boundary
- [`Features/QuestSystem.md`](Features/QuestSystem.md) — quest lifecycle, authored resolution choices, and permanent-Trait resolution gates
- [`Features/CopySystem.md`](Features/CopySystem.md) — Copy growth, loyalty, Trait sharing, roles/tasks
- [`Features/GameLoopSystem.md`](Features/GameLoopSystem.md) — real-time progression and autosave
- [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md) — event bus plus the bounded qualified M17 deterministic encounter vertical slice
- [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) — bounded M18 authored topology, direct travel authority, and Player-location boundary

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
- [`Narrative/Characters.md`](Narrative/Characters.md) — character bios, arcs, and hooks
- [`Narrative/WorldLore.md`](Narrative/WorldLore.md) — factions, cosmology, relics, setting hooks

## Current implementation status after M18

| Area | Status | Notes |
|---|---|---|
| Player | Strong foundation | stats/loadout/progression infrastructure exists; canonical fresh location is `location_city_center` |
| Relationship Experiences / Memories / Bond | Qualified production runtime | accumulated M4-M18 evidence |
| Relationship Connection authority | Qualified for registered bundles | legacy NPC compatibility remains |
| Essence | Functional + Relationship-derived contributions | world-derived Tether and broad economy work remain |
| Traits | Core + relationship-mediated discovery/assimilation + bounded gameplay capability | Willow/Elara qualified; temporary gameplay semantics deferred |
| Quest | Expanded foundation | permanent-Trait resolution gate qualified; ordinary `REACH_LOCATION` consumes M18 travel through existing listener |
| Narrative integration | Bounded qualified slices | M13 causal loop; M14 multi-NPC; M15 long-horizon callbacks |
| Copy | Substantial partial implementation | growth/loyalty/Traits/roles/tasks substrate exists; production automation depth remains |
| GameLoop | Implemented | offline progress deferred |
| Save/load | Implemented + migration qualification | M18 confirms canonical Player location survives ordinary save/load without a schema bump |
| Combat | Bounded qualified vertical slice | event bus + one deterministic player-facing encounter; broader combat remains incomplete |
| Exploration | Bounded qualified vertical slice | four authored locations, direct-adjacency UI/runtime enforcement, existing Quest integration; broader travel/world semantics remain future work |
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
- **M18:** one bounded four-location graph supports player-facing legal travel, below-UI direct-route enforcement, save/load continuation, and existing `REACH_LOCATION` Quest consequences through the ordinary `setLocation` listener.

Milestone qualification is documented under `Technical/` and exercised in Build Validation.

## Testing policy

The old prototype rule that automated tests were intentionally out of scope is obsolete.

Current milestone work should preserve:

1. TypeScript correctness;
2. focused behavioral tests for the changed capability;
3. accumulated Relationship/Trait/save/narrative/combat/exploration qualification;
4. production build;
5. exact-head PR qualification before merge when operating under the milestone workflow.

Do not remove prior gates merely because a new milestone focuses on another subsystem.

## Near-term development direction

The immediate next code-bearing candidate is **M19 — World-Derived Relationship Tether**.

M18 now establishes objective player-facing spatial facts through canonical Player location and authored direct adjacency. The next planned question is whether those world-presence facts can alter the **current intensity** of Relationship-derived Essence through Tether without rewriting historical Relationship state such as Connection, Memories, or Bond dimensions.

M19 must be separately preregistered against the actual post-M18 `main` before behavior changes.

The remaining planned sequence is:

```text
M19 World-Derived Tether
-> Checkpoint B
-> M20 Copy Task Automation
-> M21 Offline Progress
-> Checkpoint C
-> M22 Social Knowledge Propagation
-> M23 Faction Reputation
-> M24 Objective World State
-> M25 Complete Chapter Vertical Slice
-> Human integrated playability review
```

See `Technical/PostM17MilestoneRoadmap.md` for the working experiment program. Individual milestone semantics remain provisional until each experiment is preregistered against the actual then-current repository state.

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
5. `Technical/PostM17MilestoneRoadmap.md` for the planned future execution program;
6. `GameDesignDocument.md`;
7. `Features/RelationshipExperienceSystem.md` / `EssenceResonanceModel.md`;
8. the relevant current feature spec;
9. milestone-specific qualification evidence.

If the runtime still uses a legacy rule, document it as compatibility/migration debt and migrate it deliberately rather than pretending it is the modern product model.
