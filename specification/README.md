# React Incremental RPG Prototype — Technical Specification

This specification documents the design, architecture, implementation status, and empirical qualification history of the React Incremental RPG Prototype.

The project uses React, TypeScript, Redux Toolkit, Material UI, listener middleware, data-driven content, save migration, and focused behavioral qualification.

## Product authority after M14

Read [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) before extending relationship, Trait, Essence, Copy, narrative, or world progression.

The canonical product rule is no longer:

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

## Core game loop

```text
Discover person / problem
-> participate in meaningful event
-> create Relationship evidence
-> change Bond / Connection
-> change passive Essence and Trait-learning conditions
-> learn / equip / Resonate capability
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
- [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) — current authority map, migration status, and roadmap correction

### Core feature specifications

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship Experiences, Memories, Bond dimensions, Connection
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark relational evidence
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — relationship-to-power ontology
- [`Features/EssenceSystem.md`](Features/EssenceSystem.md) — current passive Essence runtime
- [`Features/TraitSystem.md`](Features/TraitSystem.md) — discovery, equip, assimilation, Resonance
- [`Features/NPCSystem.md`](Features/NPCSystem.md) — NPC identity/services/dialogue/quest integration and legacy compatibility boundary
- [`Features/QuestSystem.md`](Features/QuestSystem.md) — quest lifecycle and authored resolution choices
- [`Features/CopySystem.md`](Features/CopySystem.md) — Copy growth, loyalty, Trait sharing, roles/tasks
- [`Features/GameLoopSystem.md`](Features/GameLoopSystem.md) — real-time progression and autosave
- [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md) — current combat event-bus scaffold

### Technical documentation

- [`Technical/ArchitectureOverview.md`](Technical/ArchitectureOverview.md)
- [`Technical/StateManagement.md`](Technical/StateManagement.md)
- [`Technical/DataModel.md`](Technical/DataModel.md)
- Relationship migration/qualification records under `Technical/`

### UI / UX

- [`UI_UX/UserFlows.md`](UI_UX/UserFlows.md)
- [`UI_UX/LayoutDesign.md`](UI_UX/LayoutDesign.md)
- [`UI_UX/ComponentSpecification.md`](UI_UX/ComponentSpecification.md)

### Narrative

- [`Narrative/Synopsis.md`](Narrative/Synopsis.md) — macro plot and act structure
- [`Narrative/Characters.md`](Narrative/Characters.md) — character bios and arcs
- [`Narrative/WorldLore.md`](Narrative/WorldLore.md) — factions, cosmology, relics, setting hooks

## Current implementation status after M14

| Area | Status | Notes |
|---|---|---|
| Player | Strong foundation | stats/loadout/progression infrastructure exists |
| Relationship Experiences / Memories / Bond | Qualified production runtime | accumulated M4-M14 evidence |
| Relationship Connection authority | Qualified for registered bundles | legacy NPC compatibility remains |
| Essence | Functional + Relationship-derived contributions | world-derived Tether and broad economy work remain |
| Traits | Core + relationship-mediated discovery/assimilation | Willow/Elara qualified; broader gameplay payoff needed |
| Quest | Expanded foundation | richer graphs/maps/authoring/campaign presentation deferred |
| Narrative integration | Bounded qualified slices | M13 causal loop; M14 multi-NPC shared consequence |
| Copy | Substantial partial implementation | growth/loyalty/Traits/roles exist; production automation depth remains |
| GameLoop | Implemented | offline progress deferred |
| Save/load | Implemented + migration qualification | accumulated Relationship/Trait/save tests active |
| Combat | Scaffold only | event bus; no real encounter loop yet |
| Exploration | Partial | no complete player-facing travel/world layer yet |
| Faction / world state | Partial concepts | dedicated authority still future work |

## Qualification history

The Relationship redesign is no longer a purely planned architecture.

Key milestones:

- **M4-M10:** core Relationship migration, Memories, Trait evidence, save migration/reconciliation;
- **M11:** Lyra adversarial universality;
- **M12:** production authoring scalability across Gronk/Silas/Valerius;
- **M13:** persisted Relationship evidence causes later story;
- **M14:** one shared decision creates distinct/conflicting consequences across multiple NPC relationships.

Milestone qualification is documented under `Technical/` and exercised in Build Validation.

## Testing policy

The old prototype rule that automated tests were intentionally out of scope is obsolete.

Current milestone work should preserve:

1. TypeScript correctness;
2. focused behavioral tests for the changed capability;
3. accumulated Relationship/Trait/save migration qualification;
4. production build;
5. exact-head PR qualification before merge when operating under the milestone workflow.

Do not remove prior gates merely because a new milestone focuses on another subsystem.

## Near-term development direction

The immediate next code-bearing milestone is **M15 — Long-Horizon Relationship Callback Qualification**.

The post-M14 audit also corrected a draft-roadmap assumption: relationship-mediated Trait assimilation is already implemented for Willow and Elara. After M15, the highest-value payoff is therefore to prove that a Relationship-derived Trait materially changes gameplay, then build outward into combat, exploration, Tether, Copy automation, offline progress, social knowledge, factions, world state, and finally a complete chapter vertical slice.

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

When an older specification conflicts with the post-M14 authority chain, do not silently revive the old behavior as design truth.

Use this reading order:

1. `Technical/PostM14ProductReconciliation.md`;
2. `GameDesignDocument.md`;
3. `Features/RelationshipExperienceSystem.md` / `EssenceResonanceModel.md`;
4. the relevant current feature spec;
5. milestone-specific qualification evidence.

If the runtime still uses a legacy rule, document it as compatibility/migration debt and migrate it deliberately rather than pretending it is the modern product model.