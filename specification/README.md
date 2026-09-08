# React Incremental RPG Prototype — Technical Specification

This specification documents the design, architecture, implementation status, and empirical qualification history of the React Incremental RPG Prototype.

The project uses React, TypeScript, Redux Toolkit, Material UI, listener middleware, data-driven content, versioned save/load, and focused behavioral qualification.

## Product authority through fresh Checkpoint C PASS

Read milestone records as an authority chain rather than assuming older design prose describes the current runtime.

The most relevant current records are:

- [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md) — broad domain/migration authority;
- [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md) — Trait-to-gameplay doctrine;
- [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md) — post-M17 product/status alignment;
- [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md) + [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) — bounded travel authority;
- [`Technical/M19WorldDerivedTetherResult.md`](Technical/M19WorldDerivedTetherResult.md) + [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — bounded world-derived spatial Tether;
- [`Technical/CheckpointBActiveRpgLoopResult.md`](Technical/CheckpointBActiveRpgLoopResult.md) — historical first `CHECKPOINT_B_WEAK` verdict;
- [`Technical/ActiveRpgLoopIntegrationRepairResult.md`](Technical/ActiveRpgLoopIntegrationRepairResult.md) — qualified repair of the observed active-loop gaps;
- [`Technical/CheckpointBActiveRpgLoopRerunResult.md`](Technical/CheckpointBActiveRpgLoopRerunResult.md) — fresh `CHECKPOINT_B_PASS` that authorized M20;
- [`Technical/M20ProductionCopyTaskAutomation.md`](Technical/M20ProductionCopyTaskAutomation.md) — preregistered M20 contract;
- [`Technical/M20ProductionCopyTaskAutomationReconAmendment.md`](Technical/M20ProductionCopyTaskAutomationReconAmendment.md) — frozen M20 implementation semantics;
- [`Technical/M20ProductionCopyTaskAutomationResult.md`](Technical/M20ProductionCopyTaskAutomationResult.md) — qualified routine Copy automation;
- [`Technical/M21BoundedOfflineProgress.md`](Technical/M21BoundedOfflineProgress.md) — preregistered M21 contract;
- [`Technical/M21BoundedOfflineProgressReconAmendment.md`](Technical/M21BoundedOfflineProgressReconAmendment.md) — frozen time/cap/allowlist semantics;
- [`Technical/M21BoundedOfflineProgressResult.md`](Technical/M21BoundedOfflineProgressResult.md) — qualified bounded offline settlement;
- [`Technical/CheckpointCIncrementalIntegration.md`](Technical/CheckpointCIncrementalIntegration.md) — preregistered post-M21 integration checkpoint;
- [`Technical/CheckpointCIncrementalIntegrationResult.md`](Technical/CheckpointCIncrementalIntegrationResult.md) — historical first `CHECKPOINT_C_WEAK` verdict;
- [`Technical/IncrementalIntegrationRepair.md`](Technical/IncrementalIntegrationRepair.md) — preregistered bounded repair;
- [`Technical/IncrementalIntegrationRepairReconAmendment.md`](Technical/IncrementalIntegrationRepairReconAmendment.md) — frozen repair implementation decisions;
- [`Technical/IncrementalIntegrationRepairResult.md`](Technical/IncrementalIntegrationRepairResult.md) — qualified repair result and evidence ceiling;
- [`Technical/CheckpointCIncrementalIntegrationRerun.md`](Technical/CheckpointCIncrementalIntegrationRerun.md) — fresh rerun preregistration against repaired main;
- [`Technical/CheckpointCIncrementalIntegrationRerunResult.md`](Technical/CheckpointCIncrementalIntegrationRerunResult.md) — fresh `CHECKPOINT_C_PASS` and bounded evidence ceiling;
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — planned sequence through M25, subject to actual milestone preregistration/results.

The historical first Checkpoint C result and repair remain preserved. Current status is:

```text
Checkpoint C first evaluation: WEAK
Incremental Integration Repair: PASS
Fresh Checkpoint C rerun: PASS
M22: AUTHORIZED AS NEXT CANDIDATE
```

M22 behavior is not yet implemented or qualified; it must begin from the merged Checkpoint C rerun baseline with its own preregistration and recon.

---

## Canonical Relationship model

The product rule for modern Relationship-authority content is:

```text
Story / gameplay event
-> Relationship Experience
-> Bond-dimension changes
-> optional Memory
-> Connection Progress + semantic qualification
-> Bond Profile
-> Essence / Trait / story consequences
```

It is not merely:

```text
Affinity threshold
-> connectionDepth increase
```

Legacy `affinity` and `connectionDepth` remain compatibility surfaces where deliberately retained, but they are not the product model for new Relationship-authority content.

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

The Incremental Integration Repair later reuses successful active Trait Resonance as one **routine-familiarity learning source**. That does not change Trait capability authority; it records that the player has personally experienced the Resonance process strongly enough to delegate the bounded `resonance_calibration` routine.

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

The first Checkpoint B evaluation found three bypasses:

1. Telluric Echo combat could ignore location;
2. anchored NPC in-person interaction could ignore canonical co-presence;
3. legal travel did not immediately surface Tether/Essence opportunity cost.

The bounded repair qualified encounter location, anchored Willow/Gronk co-presence, and immediate post-travel spatial feedback. A fresh rerun then produced:

```text
CHECKPOINT_B_PASS
M20 authorized
```

The current Incremental Integration Repair adds one more bounded active use of Exploration: **Forge Assistance practice exists only in City Center** and establishes player familiarity with that routine. It does not create generalized crafting or location-resource simulation.

---

## M20 Copy automation authority

M20 behavior remains qualified.

The product doctrine is now executable rather than only aspirational:

```text
player experiences / understands an activity
-> activity becomes familiar routine
-> player may delegate routine execution to a Copy
-> Copy produces a bounded ordinary consequence

meaningful / irreversible decision
-> remains player authority
```

The two production tasks remain:

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

M20 originally qualified their task-execution contract: authored IDs, below-UI legality, deterministic role duration modifiers, busy rejection, task-specific rewards, exact-once completion, mid-task save/load continuity, canonical Forge location resolution, and unchanged Relationship/Quest narrative state during routine completion.

### Repair-added familiarity authority

Checkpoint C correctly observed that M20 did not yet prove the first half of its doctrine. The repair now adds player-owned persisted familiarity for exactly the two M20 task IDs.

```text
Forge Assistance familiarity
<- one active City Center Forge practice (+5 Gold once)

Resonance Calibration familiarity
<- successful active Trait Resonance
```

`startCopyProductionTaskThunk` now requires familiarity **below the UI**, in addition to the existing per-Copy requirements.

The Copy panel keeps unfamiliar routines visible and explains the active action required to learn them.

See [`Features/CopySystem.md`](Features/CopySystem.md) and [`Technical/IncrementalIntegrationRepairResult.md`](Technical/IncrementalIntegrationRepairResult.md).

---

## M21 offline-progress authority

M21 remains a bounded **snapshot settlement**, not full background simulation.

Canonical timing:

```text
loaded versioned save-envelope timestamp
+
resume Date.now()
-> clamp elapsed interval to at most 8 hours
```

Settlement occurs only when restored GameLoop state is running and not paused.

The explicit offline allowlist remains exactly:

```text
1. persisted passive Essence generation
2. already-running M20 Copy production task progress/completion
```

Settlement order remains:

```text
saved essence.generationRate snapshot x bounded elapsed
-> passive Essence
-> existing M20 Copy task progress/completion
```

The repair does **not** add routine learning as an offline consumer. A Copy task can only already be running if the player earned familiarity and deliberately assigned it before the save.

M21 continues to qualify:

- missing/legacy-zero/future/equal timestamp -> no settlement;
- eight-hour maximum interval;
- paused/stopped save -> no settlement;
- deterministic passive Essence snapshot accrual;
- partial Copy task progress;
- one task completion with authored reward exactly once;
- excess elapsed time discarded after completion;
- no automatic task restart/queue/selection;
- restored-save timestamp replay protection;
- later ordinary save timestamp as a legitimate new settlement identity;
- unchanged Relationship/Quest/player-location authority in its positive probe;
- unchanged save-schema version.

M21 still does **not** process Quest timers, Relationship evidence, dialogue, Combat, travel, Copy general growth/loyalty decay, Trait choices, status effects, regeneration, or generalized GameLoop ticks offline.

---

## Shared notification / visible-return authority

The first Checkpoint C evaluation found a real presentation seam:

```text
M21 settlement
-> shared Redux notification queue
-> no demonstrated mounted shared renderer
```

The repair now qualifies:

```text
feature / M21 dispatches addNotification
-> NotificationSlice.notifications.items
-> GlobalNotificationHost in GameLayout
-> MUI Snackbar + Alert
-> player-visible message
-> removeNotification on dismissal
```

The composed repair proof specifically renders the M21 message:

```text
While you were away: ... completed Forge Assistance ...
```

after a saved running task completes during bounded offline settlement.

The separate local `useMenuNotifications` hook remains separate; the repair did not create an M21-specific duplicate store.

See [`Features/NotificationSystem.md`](Features/NotificationSystem.md).

---

## Checkpoint C history, repair, and fresh rerun

### First evaluation

The first post-M21 integration evaluation produced:

```text
CHECKPOINT_C_WEAK
bounded incremental-integration repair required
M22 not authorized
```

It found two blocking seams:

```text
ACTIVE PLAY -> AUTOMATION
no demonstrated learned-routine prerequisite

OFFLINE AUTOMATION -> RETURN TO ACTIVE PLAY
summary queued but no demonstrated shared production renderer
```

The architecture itself remained healthy: assignment was deliberate, narrative authority stayed player-owned, offline progression remained allowlisted, and Gold/Essence were existing active-RPG currencies.

### Bounded repair

The Incremental Integration Repair qualifies both seams:

```text
active Forge practice / successful Trait Resonance
-> persisted player familiarity
-> below-UI Copy delegation prerequisite
```

and:

```text
M21 shared return summary
-> mounted GlobalNotificationHost
-> visible player feedback
```

The repair also proves one composed path:

```text
active City Center Forge practice
-> familiarity
-> deliberate agent Copy assignment
-> save running Forge task
-> load
-> 60s M21 settlement
-> Forge completion
-> +15 Gold once
-> task clears
-> visible While you were away summary
-> duplicate settlement rejected
```

Relationship, Quest, and canonical player-location state remain unchanged across the offline portion of that probe.

### Fresh rerun

The separate fresh Checkpoint C rerun re-applied the original seven integration dimensions and ten anti-idle falsifiers rather than allowing the repair to grade itself.

It produced:

```text
CHECKPOINT_C_PASS
```

The bounded reason is that both historical seams are now present in production and no new structural contradiction was found: routine delegation is downstream of active familiarity; Copy capability requirements remain independent; offline progression remains the same two-consumer allowlist with an 8-hour cap and no task chaining; Gold/Essence remain existing currencies; and return feedback is player-visible.

The fresh PASS does **not** qualify final economy balance, repeatable manual Forge gameplay, final notification UX, human pacing/fun, generalized automation, or any M22+ behavior.

M22 Social Knowledge Propagation is therefore the next authorized candidate after the rerun merge.

---

## Core game loop

The currently qualified direction is now:

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
-> personally experience bounded routine work
-> persist routine familiarity
-> delegate that understood routine to a qualified Copy
-> existing live task progression executes it
-> already-running routine may continue through bounded M21 offline settlement
-> shared return summary visibly reports what changed
-> return player attention to higher-order active decisions
```

The incremental/automation layer is intended to compress understood repetition, not replace active meaning-making.

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
- player-owned routine familiarity distinct from per-Copy capability;
- exact-head qualification for milestone PRs;
- explicit evidence ceilings on experimental claims.

---

## Specification structure

### Product / reconciliation

- [`GameDesignDocument.md`](GameDesignDocument.md)
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
- [`Technical/CheckpointCIncrementalIntegration.md`](Technical/CheckpointCIncrementalIntegration.md)
- [`Technical/CheckpointCIncrementalIntegrationResult.md`](Technical/CheckpointCIncrementalIntegrationResult.md)
- [`Technical/IncrementalIntegrationRepair.md`](Technical/IncrementalIntegrationRepair.md)
- [`Technical/IncrementalIntegrationRepairReconAmendment.md`](Technical/IncrementalIntegrationRepairReconAmendment.md)
- [`Technical/IncrementalIntegrationRepairResult.md`](Technical/IncrementalIntegrationRepairResult.md)
- [`Technical/CheckpointCIncrementalIntegrationRerun.md`](Technical/CheckpointCIncrementalIntegrationRerun.md)
- [`Technical/CheckpointCIncrementalIntegrationRerunResult.md`](Technical/CheckpointCIncrementalIntegrationRerunResult.md)

### Core feature specifications

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship Experiences, Memories, Bond dimensions, Connection
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark relational evidence
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — Relationship-to-power ontology including spatial Tether
- [`Features/EssenceSystem.md`](Features/EssenceSystem.md) — passive Essence runtime and bounded M21 offline snapshot accrual
- [`Features/TraitSystem.md`](Features/TraitSystem.md) — discovery, assimilation, Resonance, permanent gameplay capability
- [`Features/NPCSystem.md`](Features/NPCSystem.md) — NPC identity/services/dialogue/quest integration
- [`Features/QuestSystem.md`](Features/QuestSystem.md) — quest lifecycle and authored resolution choices
- [`Features/CopySystem.md`](Features/CopySystem.md) — Copy progression, Traits, roles, M20 tasks, repair familiarity prerequisite, M21 continuation
- [`Features/GameLoopSystem.md`](Features/GameLoopSystem.md) — live fixed timestep + bounded M21 settlement + repaired visible-return path
- [`Features/NotificationSystem.md`](Features/NotificationSystem.md) — shared queue + qualified production renderer
- [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md) — M17 encounter and canonical-location launch authority
- [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md) — M18 travel, M19 spatial facts, active presence integration

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

## Current implementation status

| Area | Status | Notes |
|---|---|---|
| Player | Strong foundation + bounded routine familiarity | canonical location + optional persisted familiarity for the two current M20 routines |
| Relationship Experiences / Memories / Bond | Qualified production runtime | accumulated regression evidence preserved through repair |
| Relationship Connection authority | Qualified for registered bundles | legacy compatibility remains |
| Essence | Functional + Relationship-derived + spatial Tether + bounded offline snapshot accrual | M21 max 8h; not event-time simulation |
| Traits | Core + relationship-mediated discovery/assimilation + gameplay capability | successful active Resonance now also teaches calibration familiarity; no offline Trait choices |
| Quest | Expanded foundation | permanent-Trait resolution gates; offline repair preserves Quest authority |
| Narrative integration | Bounded qualified slices | M13-M15 plus later controls; no offline narrative replay |
| Copy | **M20 PASS + familiarity repair PASS + M21 continuation** | two tasks only; unfamiliar assignment rejected below UI; no autonomous selection |
| GameLoop | **M21 PASS** | canonical timestamp, 8h cap, two-consumer allowlist, replay guard |
| Shared notifications | **Repair PASS** | `GlobalNotificationHost` mounted in `GameLayout`; M21 summary visibly rendered |
| Save/load | Implemented + migration qualification | familiarity/task state persist through full RootState; schema remains v1 |
| Combat | Bounded qualified vertical slice + presence gate | Telluric Echo requires Whispering Woods; no offline Combat |
| Exploration | Bounded qualified travel/presence + Forge learning surface | City Center active Forge practice is one bounded repair interaction; no generalized crafting |
| Spatial Tether | Bounded qualified projection | Willow/Gronk anchors; no offline spatial replay |
| NPC active presence | Bounded qualified integration | anchored in-person actions require co-presence |
| Active RPG integration | **Checkpoint B PASS** | first WEAK -> repair PASS -> fresh PASS |
| Offline progress | **M21 PASS — bounded** | passive Essence + already-running M20 task only |
| Incremental integration | **Checkpoint C PASS — bounded** | first WEAK -> repair PASS -> fresh rerun PASS; final balance/human UX remain unqualified |
| Social knowledge | **Authorized next candidate** | M22 behavior not yet implemented; preregistration/recon required |
| Faction reputation | Future | M23 |
| Objective world state | Future | M24 |

---

## Qualification history

Key milestones:

- **M4-M10:** Relationship migration, Memories, Trait evidence, save migration/reconciliation;
- **M11:** Lyra adversarial universality;
- **M12:** production authoring scalability across Gronk/Silas/Valerius;
- **M13:** persisted Relationship evidence causes later story;
- **M14:** one shared decision creates distinct/conflicting multi-Relationship consequences;
- **M15:** old/new Relationship evidence composes across intervening content and save/load;
- **M16:** Relationship-derived permanent Traits materially change bounded Quest solution space;
- **Checkpoint A:** Trait-to-gameplay authority reconciled;
- **M17:** bounded deterministic Combat with optional permanent-`WillowsWisdom` tactical route and Quest `KILL` integration;
- **P17.5:** post-M17 reconciliation;
- **M18:** bounded authored travel graph, below-UI route legality, save/load, `REACH_LOCATION` consequence;
- **M19:** player + NPC anchors derive bounded spatial Tether without rewriting Bond history;
- **Checkpoint B first evaluation:** `CHECKPOINT_B_WEAK`;
- **Active RPG Loop Integration Repair:** PASS;
- **Checkpoint B fresh rerun:** `CHECKPOINT_B_PASS`; M20 authorized;
- **M20:** PASS — two authored routine Copy tasks, deterministic live progress, exact-once ordinary rewards, save/load continuity, narrative authority preserved;
- **M21:** PASS — bounded save-envelope offline settlement for passive Essence + an already-running M20 task;
- **Checkpoint C first evaluation:** `CHECKPOINT_C_WEAK` — missing earned-routine bridge + missing mounted shared return renderer; M22 blocked;
- **Incremental Integration Repair:** **PASS** — player-owned Rule-of-Two familiarity + below-UI enforcement + active Forge/Resonance sources + shared production notification host + composed active->automation->offline->visible-return proof;
- **Checkpoint C fresh rerun:** **`CHECKPOINT_C_PASS`** — repaired composition satisfies the bounded integration rubric; M22 becomes the next authorized candidate after the rerun merge.

Milestone records live under `Technical/`; executable gates live in Build Validation.

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

The current workflow includes an additive **Checkpoint C incremental integration repair qualification** gate while preserving M21, M20, active-loop repair, modified historical, accumulated M4-M19, TypeScript, and production-build gates.

---

## Near-term development direction

Fresh Checkpoint C now passes. The next authorized candidate is:

```text
M22 — Social Knowledge Propagation
```

M22 must not inherit provisional roadmap assumptions as implementation truth. Start from the merged Checkpoint C rerun baseline and perform fresh recon before freezing the exact knowledge model and production probes.

The governing M22 boundary is expected to preserve:

```text
WORLD        -> what objectively happened?
KNOWLEDGE    -> who knows it happened?
RELATIONSHIP -> what shared history means between specific people
FACTION      -> how an institution regards the player
```

but exact M22 semantics remain provisional until preregistered against the then-current repository.

Current sequence:

```text
M20 Copy Task Automation: PASS
-> M21 Bounded Offline Progress: PASS
-> Checkpoint C first evaluation: WEAK
-> Incremental Integration Repair: PASS
-> fresh Checkpoint C rerun: PASS
-> M22 Social Knowledge Propagation: AUTHORIZED NEXT
-> M23 Faction Reputation
-> M24 Objective World State
-> M25 Complete Chapter Vertical Slice
-> Human integrated playability / product review
```

Individual future milestone semantics remain provisional until preregistered against the then-current repository.

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

Use this reading order for the current post-Checkpoint-C product:

1. `Technical/PostM14ProductReconciliation.md` for broad domain/migration authority;
2. `Technical/PostM16TraitGameplayReconciliation.md` for Trait-to-gameplay doctrine;
3. `Technical/PostM17ProductReconciliation.md` for post-M17 alignment;
4. `Technical/M18ExplorationTravelResult.md` + `Features/ExplorationSystem.md` for player-travel authority;
5. `Technical/M19WorldDerivedTetherResult.md` + `Features/EssenceResonanceModel.md` for bounded spatial-Tether authority;
6. `Technical/CheckpointBActiveRpgLoopResult.md` for the historical first active-RPG verdict;
7. `Technical/ActiveRpgLoopIntegrationRepairResult.md` for its repair evidence;
8. `Technical/CheckpointBActiveRpgLoopRerunResult.md` for the fresh PASS that authorized M20;
9. `Technical/M20ProductionCopyTaskAutomationResult.md` for original M20 task-execution authority;
10. `Technical/M21BoundedOfflineProgressResult.md` for original bounded offline-settlement authority;
11. `Technical/CheckpointCIncrementalIntegrationResult.md` for the historical first incremental-integration verdict;
12. `Technical/IncrementalIntegrationRepairResult.md` + `Features/CopySystem.md` + `Features/GameLoopSystem.md` + `Features/NotificationSystem.md` for the qualified repair authority;
13. `Technical/CheckpointCIncrementalIntegrationRerunResult.md` for the fresh PASS that authorizes M22 as the next candidate;
14. milestone preregistration/recon records for exact experiment contracts;
15. `Technical/PostM17MilestoneRoadmap.md` for future planned sequencing;
16. `GameDesignDocument.md` and older feature prose where not superseded.

If runtime still uses a legacy rule, document it as compatibility/migration debt and migrate it deliberately rather than pretending it is the modern product model.