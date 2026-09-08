# React Incremental RPG Prototype — Technical Specification

This specification documents the design, architecture, implementation status, and empirical qualification history of the React Incremental RPG Prototype.

The project uses React, TypeScript, Redux Toolkit, Material UI, listener middleware, data-driven content, save migration, and focused behavioral qualification.

## Product authority through M21

Read the milestone records as an authority chain rather than assuming older design prose describes the current runtime.

The most relevant current records are:

- [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) — broad domain/migration authority;
- [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md) — Trait-to-gameplay doctrine;
- [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md) — post-M17 product/status alignment;
- [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md) + [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) — bounded travel authority;
- [`Technical/M19WorldDerivedTetherResult.md`](Technical/M19WorldDerivedTetherResult.md) + [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — bounded world-derived spatial Tether;
- [`Technical/CheckpointBActiveRpgLoopResult.md`](Technical/CheckpointBActiveRpgLoopResult.md) — historical first `CHECKPOINT_B_WEAK` verdict;
- [`Technical/ActiveRpgLoopIntegrationRepairResult.md`](Technical/ActiveRpgLoopIntegrationRepairResult.md) — qualified repair of the observed active-loop gaps;
- [`Technical/CheckpointBActiveRpgLoopRerunResult.md`](Technical/CheckpointBActiveRpgLoopRerunResult.md) — fresh `CHECKPOINT_B_PASS` after the repair;
- [`Technical/M20ProductionCopyTaskAutomation.md`](Technical/M20ProductionCopyTaskAutomation.md) — preregistered M20 contract;
- [`Technical/M20ProductionCopyTaskAutomationReconAmendment.md`](Technical/M20ProductionCopyTaskAutomationReconAmendment.md) — frozen M20 production probes/architecture decisions;
- [`Technical/M20ProductionCopyTaskAutomationResult.md`](Technical/M20ProductionCopyTaskAutomationResult.md) — qualified M20 automation result and evidence ceiling;
- [`Technical/M21BoundedOfflineProgress.md`](Technical/M21BoundedOfflineProgress.md) — preregistered M21 offline-settlement contract;
- [`Technical/M21BoundedOfflineProgressReconAmendment.md`](Technical/M21BoundedOfflineProgressReconAmendment.md) — frozen timestamp/cap/allowlist semantics;
- [`Technical/M21BoundedOfflineProgressResult.md`](Technical/M21BoundedOfflineProgressResult.md) — qualified bounded offline-progress result and evidence ceiling;
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — planned sequence through M25, subject to actual milestone preregistration/results.

---

## Canonical Relationship model

The product rule is not:

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

---

## Trait-to-gameplay authority

M16 established and M17 independently exercised:

```text
Relationship -> qualifies learning
Trait        -> owns durable capability
Gameplay     -> determines local applicability
Player       -> chooses whether to use it
Relationship -> interprets the result when relationally meaningful
```

This preserves Relationship provenance without making Relationship state a hidden gameplay permission system.

---

## Spatial authority

M18/M19 plus the Active RPG Loop Integration Repair establish:

```text
Exploration -> authored topology / direct adjacency
Player      -> canonical current player location
NPC         -> bounded canonical world anchors where qualified
Relationship-> historical Bond + authored/static Tether fallback
Selector    -> current effective spatial Tether projection
Essence     -> consumes effective Tether
Quest/Story -> reacts independently to location facts
Combat      -> may consume canonical encounter location requirements
NPC UI      -> anchored in-person actions consume canonical co-presence
```

The first Checkpoint B evaluation found three active-play bypasses:

1. Telluric Echo combat could ignore location;
2. anchored NPC in-person interaction could ignore canonical co-presence;
3. legal travel did not immediately surface the Tether/Essence opportunity cost.

That historical verdict remains correctly recorded as `CHECKPOINT_B_WEAK`.

The bounded repair then qualified:

```text
canonical world presence -> Telluric Echo encounter availability
canonical world presence -> anchored Willow/Gronk in-person interaction availability
successful legal travel  -> immediate bounded Tether consequence feedback
```

A fresh evaluation after the repair then produced:

```text
CHECKPOINT_B_PASS
M20 authorized
```

That fresh PASS, not the repair by itself, authorized automation work.

---

## M20 Copy automation authority

M20 is behaviorally qualified.

The product doctrine is:

```text
player experiences / understands an activity
-> activity becomes routine
-> player may delegate routine execution to a Copy
-> Copy produces a bounded ordinary consequence

meaningful / irreversible decision
-> remains player authority
```

The qualified production probes are:

```text
Forge Assistance
60s base
maturity >= 50
role = guardian | agent
canonical Copy presence = location_city_center
-> +15 Gold
```

and:

```text
Resonance Calibration
90s base
maturity >= 75
loyalty >= 55
role = researcher | agent
-> +8 Essence
```

Both reuse the existing `Copy.activeTask` / GameLoop progression substrate through one authored task-definition contract.

M20 also qualifies:

- below-UI task legality;
- busy-Copy rejection;
- deterministic role duration modifiers;
- task-specific ordinary rewards;
- exact-once completion;
- mid-task save/load continuation;
- post-completion replay safety;
- canonical M18 location resolution for the Forge location requirement;
- unchanged Relationship and Quest narrative state during qualified routine task completion.

M20 itself did not qualify offline progress; that later boundary is owned by M21.

M20 still does **not** qualify autonomous agents, Copy travel simulation, generalized task scripting, social knowledge, faction reputation, generalized world state, or irreversible narrative-decision automation.

See [`Features/CopySystem.md`](Features/CopySystem.md) for the reconciled Copy feature contract.

---

## M21 offline-progress authority

M21 is behaviorally qualified as a **bounded snapshot settlement**, not as full background simulation.

Canonical timing is:

```text
loaded versioned save-envelope timestamp
+
resume Date.now()
-> clamp elapsed interval to at most 8 hours
```

Settlement occurs only when the restored save says the GameLoop was running and not paused.

The explicit offline allowlist is exactly:

```text
1. persisted passive Essence generation
2. already-running M20 Copy production task progress/completion
```

Settlement order is:

```text
saved essence.generationRate snapshot x bounded elapsed
-> passive Essence
-> existing M20 Copy task progress/completion
```

M21 reuses the existing `processPassiveGenerationThunk` and `processCopyTasksThunk` authorities instead of replaying `App.tsx`'s entire live GameLoop.

It qualifies:

- zero settlement for missing/legacy-zero/future/equal timestamps;
- an eight-hour maximum offline interval;
- zero settlement for saved paused/stopped GameLoop state;
- deterministic passive Essence snapshot accrual;
- partial M20 task progress offline;
- M20 task completion with authored reward exactly once;
- excess elapsed time discarded after that task completes;
- no automatic task restart/queue/selection;
- replay protection for the same restored save-envelope timestamp;
- a later ordinary save timestamp becoming a legitimate new settlement identity;
- player-facing `While you were away` summary feedback;
- unchanged Relationship/Quest/player-location authority in the positive qualification probe;
- unchanged save-schema version.

M21 explicitly does **not** process Quest timers, Relationship evidence, dialogue, Combat, travel, Copy general growth/loyalty decay, Trait choices, status effects, regeneration, or generalized GameLoop ticks offline.

The current evidence ceiling also excludes anti-cheat/server time, device-clock tamper resistance, event-time segmented rate recalculation, generalized offline economy/world simulation, and final balance of the eight-hour cap.

See [`Features/GameLoopSystem.md`](Features/GameLoopSystem.md) and [`Features/EssenceSystem.md`](Features/EssenceSystem.md) for the reconciled feature contracts.

---

## Core game loop

The currently proven direction is now:

```text
Discover person / problem
-> participate in meaningful event
-> create Relationship evidence
-> change Bond / Connection
-> change passive Essence and Trait-learning conditions
-> learn / equip / Resonate capability
-> travel to an authored location when required
-> current presence may change effective Tether / Essence intensity
-> encounters and anchored in-person interactions consume canonical presence where qualified
-> use capability in gameplay
-> create story / world consequence
-> other characters interpret the result
-> create new Relationship evidence
-> identify understood routine work
-> delegate bounded routine execution to a qualified Copy
-> ordinary routine progression may continue through bounded offline-safe settlement
-> return player attention to higher-order active decisions
```

The incremental/automation layer is intended to support the RPG rather than replace its meaningful decisions.

---

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
- generic runtime contracts before content-specific exceptions;
- explicit domain authority rather than duplicated cross-system flags;
- positive allowlists for bounded automation/offline execution;
- exact-head qualification for milestone PRs;
- explicit evidence ceilings on experimental claims.

---

## Specification structure

### Product / reconciliation

- [`GameDesignDocument.md`](GameDesignDocument.md) — product vision and gameplay loop; later empirical records override stale near-term status where necessary
- [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md)
- [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md)
- [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md)
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md)
- [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md)
- [`Technical/M19WorldDerivedTetherResult.md`](Technical/M19WorldDerivedTetherResult.md)
- [`Technical/CheckpointBActiveRpgLoopResult.md`](Technical/CheckpointBActiveRpgLoopResult.md)
- [`Technical/ActiveRpgLoopIntegrationRepairResult.md`](Technical/ActiveRpgLoopIntegrationRepairResult.md)
- [`Technical/CheckpointBActiveRpgLoopRerunResult.md`](Technical/CheckpointBActiveRpgLoopRerunResult.md)
- [`Technical/M20ProductionCopyTaskAutomation.md`](Technical/M20ProductionCopyTaskAutomation.md)
- [`Technical/M20ProductionCopyTaskAutomationReconAmendment.md`](Technical/M20ProductionCopyTaskAutomationReconAmendment.md)
- [`Technical/M20ProductionCopyTaskAutomationResult.md`](Technical/M20ProductionCopyTaskAutomationResult.md)
- [`Technical/M21BoundedOfflineProgress.md`](Technical/M21BoundedOfflineProgress.md)
- [`Technical/M21BoundedOfflineProgressReconAmendment.md`](Technical/M21BoundedOfflineProgressReconAmendment.md)
- [`Technical/M21BoundedOfflineProgressResult.md`](Technical/M21BoundedOfflineProgressResult.md)

### Core feature specifications

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship Experiences, Memories, Bond dimensions, Connection
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark relational evidence
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — Relationship-to-power ontology including bounded spatial Tether
- [`Features/EssenceSystem.md`](Features/EssenceSystem.md) — passive Essence runtime, recalculation boundaries, bounded M21 offline snapshot accrual
- [`Features/TraitSystem.md`](Features/TraitSystem.md) — discovery, equip, assimilation, Resonance, permanent gameplay capability
- [`Features/NPCSystem.md`](Features/NPCSystem.md) — NPC identity/services/dialogue/quest integration and compatibility boundaries
- [`Features/QuestSystem.md`](Features/QuestSystem.md) — quest lifecycle, authored resolution choices, permanent-Trait resolution gates
- [`Features/CopySystem.md`](Features/CopySystem.md) — Copy growth, loyalty, Traits, roles, qualified M20 routine production tasks
- [`Features/GameLoopSystem.md`](Features/GameLoopSystem.md) — live fixed-timestep progression + bounded M21 offline settlement orchestration
- [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md) — M17 deterministic encounter plus bounded canonical-location launch authority
- [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) — M18 travel, M19 spatial Tether inputs, bounded active-play presence integration

### Technical documentation

- [`Technical/ArchitectureOverview.md`](Technical/ArchitectureOverview.md)
- [`Technical/StateManagement.md`](Technical/StateManagement.md)
- [`Technical/DataModel.md`](Technical/DataModel.md)
- milestone qualification/reconciliation records under `Technical/`

### UI / UX

- [`UI_UX/UserFlows.md`](UI_UX/UserFlows.md)
- [`UI_UX/LayoutDesign.md`](UI_UX/LayoutDesign.md)
- [`UI_UX/ComponentSpecification.md`](UI_UX/ComponentSpecification.md)

### Narrative

- [`Narrative/Synopsis.md`](Narrative/Synopsis.md)
- [`Narrative/Characters.md`](Narrative/Characters.md)
- [`Narrative/WorldLore.md`](Narrative/WorldLore.md)

---

## Current implementation status through M21

| Area | Status | Notes |
|---|---|---|
| Player | Strong foundation | stats/loadout/progression; canonical fresh location `location_city_center` |
| Relationship Experiences / Memories / Bond | Qualified production runtime | accumulated regression evidence preserved through M21 |
| Relationship Connection authority | Qualified for registered bundles | legacy compatibility remains |
| Essence | Functional + Relationship-derived contributions + bounded spatial Tether + bounded offline snapshot accrual | M21 settles persisted rate for max 8h; not event-time simulation |
| Traits | Core + relationship-mediated discovery/assimilation + bounded gameplay capability | Willow/Elara proof slices; no offline Trait choices |
| Quest | Expanded foundation | Trait resolution gate + ordinary M18 location listener; M20/M21 preserve Quest decision authority |
| Narrative integration | Bounded qualified slices | M13/M14/M15 plus active-loop closure controls; M21 does not replay narrative offline |
| Copy | **Bounded production automation + offline task continuation qualified** | two M20 authored tasks; M21 may advance/complete an already-running task, never auto-assign another |
| GameLoop | **Live progression + bounded offline settlement qualified** | canonical save timestamp, 8h cap, two-consumer allowlist, replay guard |
| Save/load | Implemented + migration qualification | versioned timestamp is M21 wall-clock authority; no schema bump |
| Combat | Bounded qualified vertical slice + presence gate | Telluric Echo requires canonical Whispering Woods presence; no offline Combat |
| Exploration | Bounded qualified vertical slice + cross-domain integration | four authored locations, legal direct travel, Quest/Tether/presence integration; no offline travel |
| Spatial Tether | Bounded qualified projection | Willow/Gronk anchors; authored fallback for unanchored Relationships; no offline spatial replay |
| NPC active presence | Bounded qualified integration | anchored in-person actions require co-presence; remote inspection remains distinct |
| Active RPG integration | **Checkpoint B PASS** | first evaluation WEAK -> repair PASS -> fresh rerun PASS |
| Offline progress | **M21 PASS — bounded** | passive Essence + already-running M20 task only; 8h cap; exact-once restored-save identity |
| Incremental integration | Pending evaluation | Checkpoint C is next; must judge whether M20/M21 support rather than displace active play |
| Social knowledge | Future | M22, not authorized until Checkpoint C outcome permits progression |
| Faction reputation | Future | M23 |
| Objective world state | Future | M24 |

---

## Qualification history

Key milestones:

- **M4-M10:** core Relationship migration, Memories, Trait evidence, save migration/reconciliation;
- **M11:** Lyra adversarial universality;
- **M12:** production authoring scalability across Gronk/Silas/Valerius;
- **M13:** persisted Relationship evidence causes later story;
- **M14:** one shared decision creates distinct/conflicting consequences across multiple Relationships;
- **M15:** old/new Relationship evidence composes across intervening content and save/load;
- **M16:** Relationship-derived permanent Traits materially change bounded Quest solution space;
- **Checkpoint A:** Trait-to-gameplay authority reconciled;
- **M17:** bounded deterministic Combat with an optional permanent-`WillowsWisdom` tactical route and ordinary Quest `KILL` integration;
- **P17.5:** post-M17 product/status reconciliation;
- **M18:** bounded authored travel graph, below-UI route legality, save/load, ordinary `REACH_LOCATION` consequence;
- **M19:** bounded spatial Tether derived from player location + two NPC anchors without rewriting Bond history;
- **Checkpoint B first evaluation:** `CHECKPOINT_B_WEAK` — three active world-presence/legibility gaps found;
- **Active RPG Loop Integration Repair:** PASS — bounded repair of encounter location, anchored NPC co-presence, and post-travel spatial feedback;
- **Checkpoint B fresh rerun:** `CHECKPOINT_B_PASS` — repaired active RPG loop qualified; M20 authorized;
- **M20:** PASS — two authored routine Copy tasks use one production contract with below-UI requirements, deterministic live progress, exact-once ordinary rewards, save/load continuity, and preserved narrative authority;
- **M21:** PASS — canonical save-envelope elapsed time settles an explicit two-consumer offline allowlist (passive Essence + already-running M20 task) once within an eight-hour cap while active/narrative domains remain untouched.

Milestone records live under `Technical/` and executable gates live in Build Validation.

---

## Testing policy

Current milestone work should preserve:

1. TypeScript correctness;
2. focused behavioral qualification for the changed capability;
3. earlier milestone/regression evidence relevant to shared runtime;
4. production build;
5. exact-head PR qualification before merge;
6. explicit separation between diagnostic/review signals and merge authority.

Do not remove prior gates merely because a later milestone focuses on another subsystem.

Build Validation + preregistered criteria are milestone merge authority. Repository Gemini review is not merge authority.

---

## Near-term development direction

After exact-head M21 qualification and merge, the next required step is:

```text
Checkpoint C — Incremental Integration
```

Checkpoint C must evaluate the product effect of the combined automation layer:

```text
M20 routine Copy delegation
+
M21 bounded offline-safe settlement
```

The question is not merely whether those mechanisms execute correctly—they now do within their evidence ceilings. The checkpoint must ask whether they **support the active RPG** by removing understood routine repetition while preserving meaningful player attention and agency.

Evaluate whether automation/offline progression:

- reduces repetition without making manual active play irrelevant;
- preserves meaningful decisions;
- makes Relationships/capabilities/Copies more useful rather than bypassing them;
- produces legible ordinary resource flow;
- frees the player for higher-order problems;
- avoids rewarding absence more strongly than participation.

The preferred doctrine remains:

```text
player experiences / understands activity
-> routine portion may be automated
-> meaningful decision remains active/player-driven
```

Checkpoint C has **not** been started by M21.

M22 Social Knowledge Propagation is **not yet authorized** merely because M21 passed. The checkpoint result must decide whether the incremental layer is coherent enough to proceed.

The remaining planned sequence is:

```text
M20 Copy Task Automation: PASS
-> M21 Bounded Offline Progress: PASS
-> Checkpoint C — Incremental Integration
-> if checkpoint permits: M22 Social Knowledge Propagation
-> M23 Faction Reputation
-> M24 Objective World State
-> M25 Complete Chapter Vertical Slice
-> Human integrated playability / product review
```

Individual future milestone semantics remain provisional until preregistered against the actual then-current repository state.

---

## Development workflow

For code-bearing milestones:

```text
verify current main
-> freeze baseline SHA/tree
-> create dedicated branch
-> preregister question / acceptance / falsification
-> recon existing capability
-> freeze recon amendments when findings change implementation semantics
-> implement smallest production proof
-> add focused qualification
-> run accumulated CI + production build
-> freeze first complete behavioral SHA/tree
-> record result + evidence ceiling
-> reconcile canon
-> requalify documentation-complete exact head
-> merge exact qualified SHA
-> verify integrated tree
-> claim post-merge CI only when an actual merge-commit run exists
-> stop at milestone boundary
```

For documentation-only checkpoints, preserve the same exact-head discipline without inventing runtime changes.

---

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

---

## Canonical conflict rule

When an older specification conflicts with current qualified authority, do not silently revive old behavior as design truth.

Use this reading order for the current M21-era product:

1. `Technical/PostM14ProductReconciliation.md` for broad domain/migration authority;
2. `Technical/PostM16TraitGameplayReconciliation.md` for Trait-to-gameplay doctrine;
3. `Technical/PostM17ProductReconciliation.md` for post-M17 alignment;
4. `Technical/M18ExplorationTravelResult.md` + `Features/ExplorationSystem.md` for qualified player-travel authority;
5. `Technical/M19WorldDerivedTetherResult.md` + `Features/EssenceResonanceModel.md` for bounded spatial-Tether authority;
6. `Technical/CheckpointBActiveRpgLoopResult.md` for the historical first active-RPG verdict;
7. `Technical/ActiveRpgLoopIntegrationRepairResult.md` for the repair evidence;
8. `Technical/CheckpointBActiveRpgLoopRerunResult.md` for the fresh PASS that authorized M20;
9. `Technical/M20ProductionCopyTaskAutomationResult.md` + `Features/CopySystem.md` for qualified routine Copy automation authority;
10. `Technical/M21BoundedOfflineProgressResult.md` + `Features/GameLoopSystem.md` + `Features/EssenceSystem.md` for bounded offline-settlement authority;
11. milestone preregistration/recon records for the exact experiment contract;
12. `Technical/PostM17MilestoneRoadmap.md` for future planned sequencing;
13. `GameDesignDocument.md` and other older feature prose where not superseded.

If runtime still uses a legacy rule, document it as compatibility/migration debt and migrate it deliberately rather than pretending it is the modern product model.