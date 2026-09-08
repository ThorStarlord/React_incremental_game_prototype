# React Incremental RPG Prototype — Technical Specification

This specification documents the design, architecture, implementation status, and empirical qualification history of the React Incremental RPG Prototype.

The project uses React, TypeScript, Redux Toolkit, Material UI, listener middleware, data-driven content, versioned save/load, and focused behavioral qualification.

## Product authority through M24 Objective World State PASS

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
- [`Technical/M22SocialKnowledgePropagation.md`](Technical/M22SocialKnowledgePropagation.md) — preregistered M22 scientific/authority contract;
- [`Technical/M22SocialKnowledgePropagationReconAmendment.md`](Technical/M22SocialKnowledgePropagationReconAmendment.md) — frozen objective-event, witness, report, persistence, and consumer semantics;
- [`Technical/M22SocialKnowledgePropagationResult.md`](Technical/M22SocialKnowledgePropagationResult.md) + [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md) — bounded `M22_PASS` authority;
- [`Technical/M23FactionReputation.md`](Technical/M23FactionReputation.md) — preregistered M23 institutional-vs-personal authority contract;
- [`Technical/M23FactionReputationReconAmendment.md`](Technical/M23FactionReputationReconAmendment.md) — frozen faction identities, quest routing, Rule-of-Two, consumer, persistence, and no-spillover semantics;
- [`Technical/M23FactionReputationResult.md`](Technical/M23FactionReputationResult.md) + [`Features/FactionSystem.md`](Features/FactionSystem.md) — bounded `M23_PASS` authority;
- [`Technical/M24ObjectiveWorldState.md`](Technical/M24ObjectiveWorldState.md) — preregistered objective-world authority contract;
- [`Technical/M24ObjectiveWorldStateReconAmendment.md`](Technical/M24ObjectiveWorldStateReconAmendment.md) — frozen Merchant District fields, mutation/consumer paths, persistence, and no-simulation semantics;
- [`Technical/M24ObjectiveWorldStateResult.md`](Technical/M24ObjectiveWorldStateResult.md) + [`Features/WorldStateSystem.md`](Features/WorldStateSystem.md) — bounded `M24_PASS` authority;
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — planned sequence through M25, subject to actual milestone preregistration/results.

Current milestone status is:

```text
Checkpoint C first evaluation: WEAK
Incremental Integration Repair: PASS
Fresh Checkpoint C rerun: PASS
M22 Social Knowledge Propagation: PASS — bounded
M23 Faction Reputation: PASS — bounded
M24 Objective World State: PASS — bounded
M25 Complete Chapter Vertical Slice: AUTHORIZED NEXT only after qualified M24 merge
```

M22's PASS remains intentionally narrow: one existing objective Forge-practice event, one direct witness, one explicit report path, and one real downstream Knowledge consumer.

M23's PASS is also bounded: two institutions, explicit institutional mutations, two institutional consumers, persistence, and demonstrated independence from personal Relationship and Knowledge.

M24's PASS is bounded to one existing region, two typed objective conditions, two explicit player-caused mutations, two cross-NPC consumers, persistence/reset/legacy neutrality, and demonstrated independence from Relationship, Knowledge, and Faction. It does not claim generalized world simulation.

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

M23 proves personal Relationship is not institutional standing; M24 further proves neither social axis is objective regional World State.

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

The Incremental Integration Repair adds one more bounded active use of Exploration: **Forge Assistance practice exists only in City Center** and establishes player familiarity with that routine. M22 reuses that already-qualified event plus Gronk's existing City Center anchor as its direct-witness proof.

M24 reuses the existing M18 Merchant District identifier as the only qualified World State region. It does not create a parallel location system.

---

## M20 Copy automation authority

M20 behavior remains qualified.

The product doctrine is executable:

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

M20 qualified authored IDs, below-UI legality, deterministic role duration modifiers, busy rejection, task-specific rewards, exact-once completion, mid-task save/load continuity, canonical Forge location resolution, and unchanged Relationship/Quest narrative state during routine completion.

### Repair-added familiarity authority

Checkpoint C correctly observed that M20 did not yet prove the first half of its doctrine. The repair adds player-owned persisted familiarity for exactly the two M20 task IDs.

```text
Forge Assistance familiarity
<- one active City Center Forge practice (+5 Gold once)

Resonance Calibration familiarity
<- successful active Trait Resonance
```

`startCopyProductionTaskThunk` requires familiarity **below the UI**, in addition to the existing per-Copy requirements.

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

M21 continues to qualify missing/future/equal timestamps, the eight-hour cap, paused/stopped saves, passive Essence snapshot accrual, partial Copy progress, exact-once Copy completion, discarded excess elapsed time, no task restart/chaining, replay protection, and unchanged narrative authority.

M21 still does **not** process Quest timers, Relationship evidence, dialogue, Combat, travel, Copy general growth/loyalty decay, Trait choices, status effects, regeneration, Knowledge, Faction Reputation, World State, or generalized GameLoop ticks offline.

---

## Shared notification / visible-return authority

The first Checkpoint C evaluation found a presentation seam:

```text
M21 settlement
-> shared Redux notification queue
-> no demonstrated mounted shared renderer
```

The repair qualifies:

```text
feature / M21 dispatches addNotification
-> NotificationSlice.notifications.items
-> GlobalNotificationHost in GameLayout
-> MUI Snackbar + Alert
-> player-visible message
-> removeNotification on dismissal
```

The composed repair proof renders a `While you were away` message after bounded offline Copy completion.

See [`Features/NotificationSystem.md`](Features/NotificationSystem.md).

---

## Checkpoint C history, repair, and fresh rerun

The first post-M21 evaluation produced:

```text
CHECKPOINT_C_WEAK
bounded incremental-integration repair required
M22 not authorized
```

It found two blocking seams: no demonstrated learned-routine prerequisite before automation, and no demonstrated mounted renderer for offline return summaries.

The repair qualified both:

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

The fresh rerun then produced:

```text
CHECKPOINT_C_PASS
```

The PASS remains bounded and does not claim final economy balance, repeatable manual Forge gameplay, final notification UX, human pacing/fun, or generalized automation.

---

## M22 social Knowledge authority

M22 establishes the first bounded first-class Knowledge domain.

Canonical separation now reads:

```text
OBJECTIVE SOURCE   -> whether an event/fact is true
WORLD STATE        -> persistent objective regional conditions
KNOWLEDGE          -> which NPC knows a fact
RELATIONSHIP       -> what shared history means between people
FACTION REPUTATION -> how an institution regards the player
```

The first qualified Knowledge fact references the existing Player-owned City Center Forge-practice event.

Direct witness:

```text
successful City Center Forge practice
+
canonical Gronk co-presence
-> Gronk knows Forge-practice fact
-> Valerius remains ignorant
```

Explicit report:

```text
Player has objectively practiced Forge Assistance
+
Valerius still ignorant
-> valerius_m22_forge_report
-> KNOWLEDGE_FACT
-> Valerius knows
```

Downstream consumer:

```text
Valerius ignorant
-> valerius_m22_forge_logistics unavailable/rejected

Valerius informed
-> available/accepted
```

M24 preserves M22's boundary by explicitly proving Forge/Knowledge activity leaves the new `worldState` root unchanged.

See [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md) and [`Technical/M22SocialKnowledgePropagationResult.md`](Technical/M22SocialKnowledgePropagationResult.md).

---

## M23 Faction Reputation authority

M23 establishes first-class institutional standing:

```ts
FactionState {
  reputationByFactionId: Record<string, number>
}
```

It corrects historical faction-tagged Quest `REPUTATION` routing so the named institution changes rather than the quest giver's personal Affinity.

City Watch divergence:

```text
valerius_exp_order_questioned
-> valerius_m23_public_override
-> positive/mixed Valerius Relationship evidence
-> City Watch -10
```

With the same Relationship evidence, City Watch -10 blocks institutional clearance while City Watch 0 permits it.

Merchants Guild divergence:

```text
gronk_m23_guild_audit
-> Merchants Guild +12
-> Gronk Relationship unchanged
-> Guild priority available
```

At Merchants Guild +12, Relationship-only `gronk_blade_held` still requires its personal evidence.

The dormant reputation bands and ally/rival spillover machinery remain unused/unqualified.

See [`Features/FactionSystem.md`](Features/FactionSystem.md) and [`Technical/M23FactionReputationResult.md`](Technical/M23FactionReputationResult.md).

---

## M24 Objective World State authority

M24 establishes the first bounded first-class persistent regional World State domain.

Root:

```text
worldState
```

Qualified region:

```text
location_merchant_district
```

Qualified fields:

```text
watchPresence: normal | heavy
tradeFlow:     normal | strong
```

Missing root/region/field reads through neutral defaults:

```text
watchPresence = normal
tradeFlow = normal
```

### Patrol-density mutation and consumer

```text
valerius_exp_m23_public_override
-> valerius_m24_redeploy_patrols
-> explicit player decision
-> Merchant District watchPresence = heavy
```

The action adds no automatic Relationship, Faction, or Knowledge mutation.

Later:

```text
watchPresence normal
-> silas_m24_patrol_pressure unavailable/rejected

watchPresence heavy
-> Silas topic available/accepted
```

with Silas social state held constant.

### Freight-throughput mutation and consumer

```text
Merchants Guild >= 10
-> gronk_m24_release_verified_freight available
```

At that same Guild standing, before the explicit action:

```text
tradeFlow = normal
```

After the player releases verified contract freight:

```text
tradeFlow = strong
Merchants Guild standing unchanged
Gronk Relationship unchanged
Knowledge unchanged
```

Later:

```text
tradeFlow normal
-> valerius_m24_freight_corridor unavailable/rejected

tradeFlow strong
-> Valerius topic available/accepted
```

### Gate and persistence authority

M24 adds exact-value `requiredWorldState` dialogue requirements and a typed `WORLD_STATE_SET` effect. UI and `processNPCInteractionThunk` use the same fail-closed requirement helper; malformed requirements reject.

World State persists through normal RootState save/load, missing legacy-like state is neutral, and new-game Player reset clears it.

M24 adds no offline World State progression.

### Evidence ceiling

M24 does not qualify additional regions/fields, generalized world fact registries, arbitrary condition DSLs, city/economy/population/ecology simulation, territory control, patrol AI, World-State-gated Trade or Combat, automatic social interpretation, offline world progression, M25 chapter composition, or human pacing/fun.

See [`Features/WorldStateSystem.md`](Features/WorldStateSystem.md) and [`Technical/M24ObjectiveWorldStateResult.md`](Technical/M24ObjectiveWorldStateResult.md).

---

## Core game loop

The currently qualified direction is now:

```text
Discover person / problem
-> participate in meaningful event
-> create Relationship evidence where relationally meaningful
-> change Bond / Connection
-> change passive Essence and Trait-learning conditions
-> learn / equip / Resonate capability
-> travel to an authored location when required
-> current presence may change effective Tether / Essence intensity
-> encounters and anchored in-person interactions consume canonical presence where qualified
-> use capability in gameplay
-> create story / objective event consequence
-> only legitimate witnesses know selected objective facts where Knowledge is authored
-> explicit communication may inform another NPC where authored
-> institutions may acquire explicit standing consequences independently
-> personal Relationship and institutional Faction standing can diverge
-> player may explicitly change persistent objective World State where authored
-> later NPC/content can consume that objective state independently of social axes
-> create new Relationship evidence when relationally meaningful
-> personally experience bounded routine work
-> persist routine familiarity
-> delegate that understood routine to a qualified Copy
-> already-running routine may continue through bounded M21 offline settlement
-> shared return summary visibly reports what changed
-> return player attention to higher-order active decisions
```

The incremental layer compresses understood repetition rather than replacing active meaning-making. Knowledge represents awareness, Faction represents institutional regard, and World State represents objective conditions rather than social interpretation.

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
- objective truth/state separate from per-NPC Knowledge;
- Knowledge separate from personal Relationship meaning;
- Faction standing separate from both Knowledge and personal Relationship;
- World State separate from all social interpretation;
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
- milestone qualification/reconciliation records under [`Technical/`](Technical/), including M18-M24 and Checkpoints B/C.

### Core feature specifications

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship Experiences, Memories, Bond dimensions, Connection
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark relational evidence
- [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md) — per-NPC awareness of objective facts; M22 bounded authority
- [`Features/FactionSystem.md`](Features/FactionSystem.md) — independent institutional standing; M23 bounded authority
- [`Features/WorldStateSystem.md`](Features/WorldStateSystem.md) — persistent objective regional conditions; M24 bounded authority
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — Relationship-to-power ontology including spatial Tether
- [`Features/EssenceSystem.md`](Features/EssenceSystem.md) — passive Essence runtime and bounded M21 offline snapshot accrual
- [`Features/TraitSystem.md`](Features/TraitSystem.md) — discovery, assimilation, Resonance, permanent gameplay capability
- [`Features/NPCSystem.md`](Features/NPCSystem.md) — NPC identity/services/dialogue/quest + cross-domain gate integration
- [`Features/QuestSystem.md`](Features/QuestSystem.md) — quest lifecycle, authored resolutions, faction-tagged reputation routing
- [`Features/CopySystem.md`](Features/CopySystem.md) — Copy progression, M20 tasks, familiarity prerequisite, M21 continuation
- [`Features/GameLoopSystem.md`](Features/GameLoopSystem.md) — live fixed timestep + bounded M21 settlement + visible-return path
- [`Features/NotificationSystem.md`](Features/NotificationSystem.md) — shared queue + qualified renderer
- [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md) — M17 encounter and location launch authority
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
| Player | Strong foundation + bounded routine familiarity | canonical location + persisted familiarity for two M20 routines |
| Relationship Experiences / Memories / Bond | Qualified production runtime | accumulated regression evidence preserved through M24 |
| Relationship Connection authority | Qualified for registered bundles | legacy compatibility remains |
| Knowledge | **M22 PASS — bounded** | one fact; witness + report + downstream consumer; no auto propagation |
| Faction Reputation | **M23 PASS — bounded** | City Watch + Merchants Guild; independent from Relationship/Knowledge/World State |
| Objective World State | **M24 PASS — bounded** | Merchant District `watchPresence` + `tradeFlow`; two explicit mutations + two cross-NPC consumers; no simulation |
| Essence | Functional + Relationship-derived + spatial Tether + bounded offline snapshot accrual | M21 max 8h; not event-time simulation |
| Traits | Core + relationship-mediated discovery/assimilation + gameplay capability | active Resonance also teaches calibration familiarity; no offline Trait choices |
| Quest | Expanded foundation + corrected faction Reputation routing | World State is not inferred from quest completion |
| Narrative integration | Bounded qualified slices | M13-M15 + M22 Knowledge + M23 Faction + M24 World State consumers |
| Copy | **M20 PASS + familiarity repair PASS + M21 continuation** | two tasks only; no autonomous selection |
| GameLoop | **M21 PASS** | canonical timestamp, 8h cap, two-consumer allowlist, replay guard |
| Shared notifications | **Repair PASS** | mounted production host; M21 summary visibly rendered |
| Save/load | Implemented + migration qualification | Knowledge/Faction/WorldState/familiarity/task state persist; schema remains v1 |
| Combat | Bounded qualified vertical slice + presence gate | no M24 World-State-gated Combat claim |
| Exploration | Bounded qualified travel/presence + Forge learning surface | Merchant District identity reused by M24; no generalized simulation |
| Spatial Tether | Bounded qualified projection | Willow/Gronk anchors; no offline spatial replay |
| NPC active presence | Bounded qualified integration | dialogue now supports Relationship/Knowledge/Faction/World-State gates |
| Active RPG integration | **Checkpoint B PASS** | first WEAK -> repair PASS -> fresh PASS |
| Offline progress | **M21 PASS — bounded** | passive Essence + already-running M20 task only; social/World State excluded |
| Incremental integration | **Checkpoint C PASS — bounded** | first WEAK -> repair PASS -> fresh rerun PASS |
| Complete chapter | Future next candidate | M25 only after M24 qualified merge |

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
- **M18:** bounded authored travel graph, route legality, save/load, `REACH_LOCATION` consequence;
- **M19:** player + NPC anchors derive bounded spatial Tether without rewriting Bond history;
- **Checkpoint B first evaluation:** `CHECKPOINT_B_WEAK`;
- **Active RPG Loop Integration Repair:** PASS;
- **Checkpoint B fresh rerun:** `CHECKPOINT_B_PASS`; M20 authorized;
- **M20:** PASS — two authored routine Copy tasks, deterministic live progress, exact-once rewards, save/load continuity, narrative authority preserved;
- **M21:** PASS — bounded save-envelope offline settlement for passive Essence + already-running M20 task;
- **Checkpoint C first evaluation:** `CHECKPOINT_C_WEAK`;
- **Incremental Integration Repair:** PASS — earned-routine bridge + shared visible return path;
- **Checkpoint C fresh rerun:** `CHECKPOINT_C_PASS`;
- **M22:** `M22_PASS` — objective event can produce divergent per-NPC knowledge, explicit reporting transfers the fact, later content consumes Knowledge independently;
- **M23:** `M23_PASS` — City Watch and Merchants Guild use first-class institutional standing independent from personal Relationship/Knowledge; legacy faction reward routing normalized;
- **M24:** `M24_PASS` — Merchant District persists two typed objective conditions; explicit patrol/freight actions mutate them; later Silas/Valerius content consumes them independently from Relationship/Knowledge/Faction; persistence/reset/legacy neutrality and no-offline progression qualified.

Milestone records live under `Technical/`; executable gates live in Build Validation.

---

## Testing policy

Current milestone work preserves:

1. TypeScript correctness;
2. focused behavioral qualification for the changed capability;
3. earlier milestone/regression evidence relevant to shared runtime;
4. production build;
5. exact-head PR qualification before merge;
6. explicit separation between diagnostic/review signals and merge authority.

Do not remove prior gates merely because a later milestone focuses on another subsystem.

Build Validation + preregistered criteria are milestone merge authority. Repository Gemini review is diagnostic only.

The workflow now includes additive **M24 objective world state**, **M23 faction reputation**, and **M22 social knowledge propagation** gates while preserving Checkpoint C repair, M21, M20, active-loop repair, modified historical, accumulated M4-M19, TypeScript, and production-build gates.

---

## Near-term development direction

After the exact documentation-complete M24 PASS candidate is requalified and merged, the next authorized candidate is:

```text
M25 — Complete Chapter Vertical Slice
```

M25 is **not implemented or preregistered by M24**.

It must begin from the then-current merged M24 baseline and prove that already-qualified systems compose into a coherent playable chapter rather than merely coexist as isolated mechanics.

The governing separation entering M25 is:

```text
WORLD STATE        -> what objectively exists now
KNOWLEDGE          -> who knows which facts
RELATIONSHIP       -> what shared history means between people
FACTION REPUTATION -> how an institution regards the player
```

Current sequence:

```text
M20 Copy Task Automation: PASS
-> M21 Bounded Offline Progress: PASS
-> Checkpoint C first evaluation: WEAK
-> Incremental Integration Repair: PASS
-> fresh Checkpoint C rerun: PASS
-> M22 Social Knowledge Propagation: PASS
-> M23 Faction Reputation: PASS
-> M24 Objective World State: PASS
-> M25 Complete Chapter Vertical Slice: AUTHORIZED NEXT after qualified M24 merge
-> Human integrated playability / product review
```

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
│   ├── Knowledge/
│   ├── Factions/
│   ├── WorldState/
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
├── m24-world-state-content.json
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

Use this reading order for the current post-M24 product:

1. `Technical/PostM14ProductReconciliation.md` for broad domain/migration authority;
2. `Technical/PostM16TraitGameplayReconciliation.md` for Trait-to-gameplay doctrine;
3. `Technical/PostM17ProductReconciliation.md` for post-M17 alignment;
4. `Technical/M18ExplorationTravelResult.md` + `Features/ExplorationSystem.md` for player-travel authority;
5. `Technical/M19WorldDerivedTetherResult.md` + `Features/EssenceResonanceModel.md` for bounded spatial-Tether authority;
6. `Technical/CheckpointBActiveRpgLoopResult.md` for the historical first active-RPG verdict;
7. `Technical/ActiveRpgLoopIntegrationRepairResult.md` for its repair evidence;
8. `Technical/CheckpointBActiveRpgLoopRerunResult.md` for the fresh PASS that authorized M20;
9. `Technical/M20ProductionCopyTaskAutomationResult.md` for M20 task-execution authority;
10. `Technical/M21BoundedOfflineProgressResult.md` for bounded offline-settlement authority;
11. `Technical/CheckpointCIncrementalIntegrationResult.md` for the historical first incremental-integration verdict;
12. `Technical/IncrementalIntegrationRepairResult.md` + `Features/CopySystem.md` + `Features/GameLoopSystem.md` + `Features/NotificationSystem.md` for repair authority;
13. `Technical/CheckpointCIncrementalIntegrationRerunResult.md` for the fresh PASS that authorized M22;
14. `Technical/M22SocialKnowledgePropagationResult.md` + `Features/KnowledgeSystem.md` for bounded social-Knowledge authority;
15. `Technical/M23FactionReputationResult.md` + `Features/FactionSystem.md` + `Features/QuestSystem.md` for bounded institutional-standing authority;
16. `Technical/M24ObjectiveWorldStateResult.md` + `Features/WorldStateSystem.md` + `Features/NPCSystem.md` for bounded objective-regional-state authority;
17. milestone preregistration/recon records for exact experiment contracts;
18. `Technical/PostM17MilestoneRoadmap.md` for future planned sequencing;
19. `GameDesignDocument.md` and older feature prose where not superseded.

If runtime still uses a legacy rule, document it as compatibility/migration debt and migrate it deliberately rather than pretending it is modern product authority.

If historical content uses Relationship evidence to stand in for cross-NPC awareness, treat it as pre-M22 authoring/migration debt unless a dedicated migration separates objective truth, Knowledge, and retained Relationship meaning.

If older code treats faction-tagged `REPUTATION` as giver-NPC Affinity or dormant ally/rival constants as active authority, M23 supersedes that interpretation.

If older prose uses Relationship, Knowledge, Faction, NPC flags, or Quest completion as shorthand for persistent regional conditions, M24's World State authority supersedes that interpretation within its bounded evidence ceiling.