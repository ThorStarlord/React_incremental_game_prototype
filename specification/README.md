# React Incremental RPG Prototype — Technical Specification

This specification documents the design, architecture, implementation status, and empirical qualification history of the React Incremental RPG Prototype.

The project uses React, TypeScript, Redux Toolkit, Material UI, listener middleware, data-driven content, versioned save/load, and focused behavioral qualification.

## Product authority through M23 Faction Reputation PASS

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
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — planned sequence through M25, subject to actual milestone preregistration/results.

Current milestone status is:

```text
Checkpoint C first evaluation: WEAK
Incremental Integration Repair: PASS
Fresh Checkpoint C rerun: PASS
M22 Social Knowledge Propagation: PASS — bounded
M23 Faction Reputation: PASS — bounded
M24 Objective World State: AUTHORIZED NEXT after qualified M23 merge
```

M22's PASS remains intentionally narrow: one existing objective Forge-practice event, one direct witness, one explicit report path, and one real downstream Knowledge consumer.

M23's PASS is also bounded: two institutions, explicit institutional mutations, two institutional consumers, persistence, and demonstrated independence from personal Relationship and Knowledge. It does not claim diplomacy or objective regional World State.

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

M23 further proves that personal Relationship is not institutional standing.

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

The Incremental Integration Repair adds one more bounded active use of Exploration: **Forge Assistance practice exists only in City Center** and establishes player familiarity with that routine. M22 then reuses that already-qualified event plus Gronk's existing City Center anchor as its direct-witness proof. Neither milestone creates generalized crafting or location-resource simulation.

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

M21 still does **not** process Quest timers, Relationship evidence, dialogue, Combat, travel, Copy general growth/loyalty decay, Trait choices, status effects, regeneration, Knowledge, Faction Reputation, or generalized GameLoop ticks offline.

---

## Shared notification / visible-return authority

The first Checkpoint C evaluation found a real presentation seam:

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

The bounded reason is that both historical seams are present in production and no new structural contradiction was found: routine delegation is downstream of active familiarity; Copy capability requirements remain independent; offline progression remains the same two-consumer allowlist with an 8-hour cap and no task chaining; Gold/Essence remain existing currencies; and return feedback is player-visible.

The fresh PASS does **not** qualify final economy balance, repeatable manual Forge gameplay, final notification UX, human pacing/fun, generalized automation, or any M22+ behavior by itself.

---

## M22 social Knowledge authority

M22 establishes the first bounded first-class Knowledge domain.

Canonical separation:

```text
OBJECTIVE SOURCE -> whether an event/fact is true
KNOWLEDGE        -> which NPC knows that fact
RELATIONSHIP     -> what shared history means between people
FACTION          -> how an institution regards the player
```

### Qualified objective event

The existing qualified City Center Forge-practice record remains objective authority:

```text
Player.routineFamiliarity.forge_assistance
source = city_center_forge_assistance
```

M22's stable awareness reference is:

```text
fact_m22_player_practiced_forge_assistance
```

Knowledge does not become a second source of truth.

### Direct witness path

```text
successful City Center Forge practice
+
canonical Gronk co-presence
-> Gronk knows Forge-practice fact
-> Valerius remains ignorant
```

The event becoming true does not broadcast knowledge globally.

### Explicit report path

```text
Player has objectively practiced Forge Assistance
+
Valerius still ignorant
-> valerius_m22_forge_report
-> KNOWLEDGE_FACT effect for Valerius
-> Valerius knows
```

### Downstream Knowledge consumer

```text
Valerius ignorant
-> valerius_m22_forge_logistics unavailable/rejected

Valerius informed
-> valerius_m22_forge_logistics available/accepted
```

The consumer reads canonical Knowledge, not Relationship evidence or quest completion as a substitute.

### Persistence and reset

```text
Gronk knows / Valerius ignorant
-> save/load
-> divergence preserved
```

Current-schema legacy-like state lacking `knowledge` means no recorded facts; M21 offline settlement does not invent awareness. New-game Player reset clears Knowledge.

### Evidence ceiling

M22 qualifies one fact, one direct witness path, one explicit report path, one downstream consumer, persistence, idempotence, and domain separation. It does **not** qualify rumor graphs, automatic gossip, misinformation, confidence, forgetting, epistemic inference, player Knowledge, historical M13 awareness migration, or objective regional World State.

Faction Reputation is now separately qualified by M23 rather than being a Knowledge responsibility.

See [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md) and [`Technical/M22SocialKnowledgePropagationResult.md`](Technical/M22SocialKnowledgePropagationResult.md).

---

## M23 Faction Reputation authority

M23 establishes the first bounded first-class institutional-standing domain.

Root state:

```ts
FactionState {
  reputationByFactionId: Record<string, number>
}
```

Missing standing is neutral (`0`) and is not inferred from Relationship or Knowledge.

### Recon normalization

The repository already authored faction-tagged Quest `REPUTATION` rewards, but the runtime ignored `reward.faction` and changed the giver NPC's personal Affinity.

M23 corrects that semantic conflation:

```text
REPUTATION + faction
-> named Faction standing
-> no implicit giver-NPC Relationship mutation
```

Existing City Watch quest rewards now route to City Watch.

### City Watch divergence

```text
valerius_exp_order_questioned
-> valerius_m23_public_override
-> positive/mixed Valerius personal Relationship evidence
-> City Watch -10
```

Then:

```text
same Valerius Relationship evidence
City Watch -10
-> valerius_m23_watch_clearance unavailable/rejected

same Valerius Relationship evidence
City Watch 0
-> clearance available/accepted
```

This proves personal trust cannot substitute for institutional standing.

### Merchants Guild divergence

```text
gronk_m23_guild_audit
-> Merchants Guild +12
-> Gronk Relationship unchanged
-> gronk_m23_guild_priority available
```

Conversely:

```text
Merchants Guild +12
without gronk_exp_quality_over_finish
-> gronk_blade_held still unavailable
```

This proves institutional standing cannot substitute for personal Relationship evidence.

### Persistence and separation

M23 qualifies save/load of City Watch + Merchants Guild standing alongside independent Relationship state, neutral legacy-like missing Faction state, new-game reset, and unchanged Knowledge during Faction mutations.

The dormant legacy reputation-band and ally/rival `calculateSpillover` machinery remains unused and unqualified.

### Evidence ceiling

M23 does not qualify reputation tiers, final numeric balance, diplomacy, allied/rival spillover, institutional Knowledge/consensus, faction-vs-faction simulation, decay, territory/patrol simulation, or objective regional World State.

See [`Features/FactionSystem.md`](Features/FactionSystem.md) and [`Technical/M23FactionReputationResult.md`](Technical/M23FactionReputationResult.md).

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
-> explicit later communication may inform another NPC where authored
-> different NPCs can therefore interpret different information sets
-> institutions may acquire explicit standing consequences independently of those personal interpretations
-> personal Relationship and institutional Faction standing can diverge
-> create new Relationship evidence when relationally meaningful
-> personally experience bounded routine work
-> persist routine familiarity
-> delegate that understood routine to a qualified Copy
-> existing live task progression executes it
-> already-running routine may continue through bounded M21 offline settlement
-> shared return summary visibly reports what changed
-> return player attention to higher-order active decisions
```

The incremental/automation layer compresses understood repetition rather than replacing active meaning-making. Knowledge represents bounded awareness rather than automatic social simulation. Faction Reputation represents bounded institutional regard rather than politics or objective World State.

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
- objective truth separate from per-NPC Knowledge;
- Knowledge separate from personal Relationship meaning;
- Faction standing separate from both Knowledge and personal Relationship;
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
- [`Technical/M22SocialKnowledgePropagation.md`](Technical/M22SocialKnowledgePropagation.md)
- [`Technical/M22SocialKnowledgePropagationReconAmendment.md`](Technical/M22SocialKnowledgePropagationReconAmendment.md)
- [`Technical/M22SocialKnowledgePropagationResult.md`](Technical/M22SocialKnowledgePropagationResult.md)
- [`Technical/M23FactionReputation.md`](Technical/M23FactionReputation.md)
- [`Technical/M23FactionReputationReconAmendment.md`](Technical/M23FactionReputationReconAmendment.md)
- [`Technical/M23FactionReputationResult.md`](Technical/M23FactionReputationResult.md)

### Core feature specifications

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md) — Relationship Experiences, Memories, Bond dimensions, Connection
- [`Features/MemorySystem.md`](Features/MemorySystem.md) — landmark relational evidence
- [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md) — per-NPC awareness of objective facts; M22 bounded authority
- [`Features/FactionSystem.md`](Features/FactionSystem.md) — independent institutional standing; M23 bounded authority
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md) — Relationship-to-power ontology including spatial Tether
- [`Features/EssenceSystem.md`](Features/EssenceSystem.md) — passive Essence runtime and bounded M21 offline snapshot accrual
- [`Features/TraitSystem.md`](Features/TraitSystem.md) — discovery, assimilation, Resonance, permanent gameplay capability
- [`Features/NPCSystem.md`](Features/NPCSystem.md) — NPC identity/services/dialogue/quest + Knowledge/Faction integration
- [`Features/QuestSystem.md`](Features/QuestSystem.md) — quest lifecycle, authored resolutions, faction-tagged reputation routing
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
| Relationship Experiences / Memories / Bond | Qualified production runtime | accumulated regression evidence preserved through M23 |
| Relationship Connection authority | Qualified for registered bundles | legacy compatibility remains |
| Knowledge | **M22 PASS — bounded** | one fact; Gronk direct witness; Valerius explicit report; one downstream consumer; no auto propagation |
| Faction Reputation | **M23 PASS — bounded** | City Watch + Merchants Guild; independent from Relationship/Knowledge; no spillover/diplomacy |
| Essence | Functional + Relationship-derived + spatial Tether + bounded offline snapshot accrual | M21 max 8h; not event-time simulation |
| Traits | Core + relationship-mediated discovery/assimilation + gameplay capability | successful active Resonance also teaches calibration familiarity; no offline Trait choices |
| Quest | Expanded foundation + corrected faction Reputation routing | faction-tagged `REPUTATION` now targets named Faction rather than giver NPC Affinity |
| Narrative integration | Bounded qualified slices | M13-M15 + M22 Knowledge + M23 Faction consumers; historical pre-M22 awareness migration remains debt |
| Copy | **M20 PASS + familiarity repair PASS + M21 continuation** | two tasks only; unfamiliar assignment rejected below UI; no autonomous selection |
| GameLoop | **M21 PASS** | canonical timestamp, 8h cap, two-consumer allowlist, replay guard |
| Shared notifications | **Repair PASS** | `GlobalNotificationHost` mounted in `GameLayout`; M21 summary visibly rendered |
| Save/load | Implemented + migration qualification | Knowledge/Faction/familiarity/task state persist through full RootState; schema remains v1 |
| Combat | Bounded qualified vertical slice + presence gate | Telluric Echo requires Whispering Woods; no offline Combat |
| Exploration | Bounded qualified travel/presence + Forge learning surface | City Center Forge practice also supplies M22 objective event; no generalized crafting |
| Spatial Tether | Bounded qualified projection | Willow/Gronk anchors; no offline spatial replay |
| NPC active presence | Bounded qualified integration | Gronk co-presence also participates in M22 witness acquisition |
| Active RPG integration | **Checkpoint B PASS** | first WEAK -> repair PASS -> fresh PASS |
| Offline progress | **M21 PASS — bounded** | passive Essence + already-running M20 task only; Knowledge/Faction excluded |
| Incremental integration | **Checkpoint C PASS — bounded** | first WEAK -> repair PASS -> fresh rerun PASS; final balance/human UX remain unqualified |
| Social knowledge | **M22 PASS — bounded** | objective truth can diverge from per-NPC awareness and later content consumes Knowledge |
| Institutional standing | **M23 PASS — bounded** | personal NPC Relationship can diverge from institution-level reputation |
| Objective world state | **Authorized next candidate** | M24 requires separate preregistration/recon; not implemented by M23 |

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
- **Checkpoint C fresh rerun:** **`CHECKPOINT_C_PASS`** — repaired composition satisfies the bounded integration rubric; M22 authorized;
- **M22:** **`M22_PASS`** — one objective Forge event produces divergent Gronk/Valerius knowledge; explicit reporting transfers the fact; later Valerius content reads canonical Knowledge independently of Relationship/Faction/World-State authority;
- **M23:** **`M23_PASS`** — City Watch and Merchants Guild use one first-class Faction contract; personal Relationship and institutional standing diverge in both required directions; institutional and interpersonal consumers read their respective authorities independently; legacy faction-tagged Quest reputation routing is normalized.

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

The current workflow includes additive **M23 faction reputation** and **M22 social knowledge propagation** qualification gates while preserving Checkpoint C repair, M21, M20, active-loop repair, modified historical, accumulated M4-M19, TypeScript, and production-build gates.

---

## Near-term development direction

After a qualified merged M23 PASS, the next authorized candidate is:

```text
M24 — Objective World State
```

M24 must not infer implementation from the provisional roadmap alone. It must begin from the merged M23 baseline with fresh preregistration/recon.

The governing separation must preserve:

```text
WORLD        -> what objectively exists/happened
KNOWLEDGE    -> who knows which facts
RELATIONSHIP -> what shared history means between specific people
FACTION      -> how an institution regards the player
```

M24's core challenge is to add bounded persistent **objective conditions** without turning Knowledge, Relationship, or Faction state into shadow world facts.

Current sequence:

```text
M20 Copy Task Automation: PASS
-> M21 Bounded Offline Progress: PASS
-> Checkpoint C first evaluation: WEAK
-> Incremental Integration Repair: PASS
-> fresh Checkpoint C rerun: PASS
-> M22 Social Knowledge Propagation: PASS
-> M23 Faction Reputation: PASS
-> M24 Objective World State: AUTHORIZED NEXT after qualified M23 merge
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
│   ├── Knowledge/
│   ├── Factions/
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

Use this reading order for the current post-M23 product:

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
12. `Technical/IncrementalIntegrationRepairResult.md` + `Features/CopySystem.md` + `Features/GameLoopSystem.md` + `Features/NotificationSystem.md` for qualified repair authority;
13. `Technical/CheckpointCIncrementalIntegrationRerunResult.md` for the fresh PASS that authorized M22;
14. `Technical/M22SocialKnowledgePropagationResult.md` + `Features/KnowledgeSystem.md` for bounded social-Knowledge authority;
15. `Technical/M23FactionReputationResult.md` + `Features/FactionSystem.md` + `Features/NPCSystem.md` + `Features/QuestSystem.md` for bounded institutional-standing authority;
16. milestone preregistration/recon records for exact experiment contracts;
17. `Technical/PostM17MilestoneRoadmap.md` for future planned sequencing;
18. `GameDesignDocument.md` and older feature prose where not superseded.

If runtime still uses a legacy rule, document it as compatibility/migration debt and migrate it deliberately rather than pretending it is the modern product model.

If historical content uses Relationship evidence to stand in for cross-NPC awareness, treat it as pre-M22 authoring/migration debt unless a dedicated migration explicitly separates objective truth, Knowledge, and retained Relationship meaning.

If older code treats faction-tagged `REPUTATION` as giver-NPC Affinity or dormant ally/rival constants as active authority, M23 supersedes that interpretation.