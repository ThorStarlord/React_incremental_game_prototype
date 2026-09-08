# React Incremental RPG Prototype — Technical Specification

This specification documents the design, architecture, implementation status, and empirical qualification history of the React Incremental RPG Prototype.

The project uses React, TypeScript, Redux Toolkit, Material UI, listener middleware, data-driven content, versioned save/load, and focused behavioral qualification.

## Product authority through M25 Complete Chapter Vertical Slice PASS

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
- [`Technical/M20ProductionCopyTaskAutomationResult.md`](Technical/M20ProductionCopyTaskAutomationResult.md) — qualified routine Copy automation;
- [`Technical/M21BoundedOfflineProgressResult.md`](Technical/M21BoundedOfflineProgressResult.md) — qualified bounded offline settlement;
- [`Technical/CheckpointCIncrementalIntegrationResult.md`](Technical/CheckpointCIncrementalIntegrationResult.md) — historical first `CHECKPOINT_C_WEAK` verdict;
- [`Technical/IncrementalIntegrationRepairResult.md`](Technical/IncrementalIntegrationRepairResult.md) — qualified earned-routine + visible-return repair;
- [`Technical/CheckpointCIncrementalIntegrationRerunResult.md`](Technical/CheckpointCIncrementalIntegrationRerunResult.md) — fresh `CHECKPOINT_C_PASS`;
- [`Technical/M22SocialKnowledgePropagationResult.md`](Technical/M22SocialKnowledgePropagationResult.md) + [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md) — bounded `M22_PASS` authority;
- [`Technical/M23FactionReputationResult.md`](Technical/M23FactionReputationResult.md) + [`Features/FactionSystem.md`](Features/FactionSystem.md) — bounded `M23_PASS` authority;
- [`Technical/M24ObjectiveWorldStateResult.md`](Technical/M24ObjectiveWorldStateResult.md) + [`Features/WorldStateSystem.md`](Features/WorldStateSystem.md) — bounded `M24_PASS` authority;
- [`Technical/M25CompleteChapterVerticalSliceResult.md`](Technical/M25CompleteChapterVerticalSliceResult.md) — complete chapter composition authority;
- [`Technical/PostM25ProductDirection.md`](Technical/PostM25ProductDirection.md) — post-M25 product hypotheses and current human-review boundary;
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — historical execution program that culminated in M25.

Current milestone status is:

```text
Checkpoint C first evaluation: WEAK
Incremental Integration Repair: PASS
Fresh Checkpoint C rerun: PASS
M22 Social Knowledge Propagation: PASS — bounded
M23 Faction Reputation: PASS — bounded
M24 Objective World State: PASS — bounded
M25 Complete Chapter Vertical Slice: PASS
Automated post-M17 implementation program: COMPLETE
Human Integrated Playability / Product Review: NEXT
M26: NOT AUTHORIZED
```

M22's PASS remains intentionally narrow: one existing objective Forge-practice event, one direct witness, one explicit report path, and one real downstream Knowledge consumer.

M23's PASS is bounded: two institutions, explicit institutional mutations, two institutional consumers, persistence, and demonstrated independence from personal Relationship and Knowledge.

M24's PASS is bounded to one existing region, two typed objective conditions, two explicit player-caused mutations, two cross-NPC consumers, persistence/reset/legacy neutrality, and demonstrated independence from Relationship, Knowledge, and Faction. It does not claim generalized world simulation.

M25's PASS composes the already-qualified Relationship, Trait, Combat, Exploration, Knowledge, Faction, World-State, Copy, persistence, and bounded Offline authorities into two strategically distinct Merchant District chapter routes without a chapter engine, chapter-local shadow state, generalized condition DSL, or new save schema. It does not qualify human comprehension, pacing, fun, final balance, retention, campaign scalability, or generalized chapter authoring.

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

M23 proves personal Relationship is not institutional standing; M24 proves neither social axis is objective regional World State; M25 proves those independent authorities can still compose causally in one chapter.

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

M25 composes permanent Trait capability into a complete chapter route while preserving player choice and independent downstream authorities.

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

The bounded repair qualified encounter location, anchored Willow/Gronk co-presence, and immediate post-travel spatial feedback. A fresh rerun then produced `CHECKPOINT_B_PASS`.

The Incremental Integration Repair adds one more bounded active use of Exploration: **Forge Assistance practice exists only in City Center** and establishes player familiarity with that routine. M22 reuses that already-qualified event plus Gronk's existing City Center anchor as its direct-witness proof.

M24 reuses the existing M18 Merchant District identifier as the only qualified World State region. M25 composes legal travel repeatedly through both chapter routes without creating a parallel location system.

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

Checkpoint C later added player-owned persisted familiarity for exactly the two M20 task IDs:

```text
Forge Assistance familiarity
<- one active City Center Forge practice (+5 Gold once)

Resonance Calibration familiarity
<- successful active Trait Resonance
```

`startCopyProductionTaskThunk` requires familiarity below the UI, in addition to the existing per-Copy requirements.

M25 demonstrates the composed active-to-automation chain inside both complete chapter routes: personal Forge practice -> familiarity -> deliberate Copy assignment -> save/load -> bounded offline completion.

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

M21 does **not** process Quest timers, Relationship evidence, dialogue, Combat, travel, Copy general growth/loyalty decay, Trait choices, Knowledge, Faction Reputation, World State, or generalized GameLoop ticks offline.

M25 proves bounded offline settlement can occur late in a complete chapter without auto-resolving the chapter's meaningful player-owned decisions.

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

---

## M22 social Knowledge authority

M22 establishes the first bounded first-class Knowledge domain.

Canonical separation is:

```text
OBJECTIVE SOURCE   -> whether an event/fact is true
WORLD STATE        -> persistent objective regional conditions
KNOWLEDGE          -> which NPC knows a fact
RELATIONSHIP       -> what shared history means between people
FACTION REPUTATION -> how an institution regards the player
```

Qualified direct witness:

```text
successful City Center Forge practice
+
canonical Gronk co-presence
-> Gronk knows Forge-practice fact
-> Valerius remains ignorant
```

Qualified explicit report:

```text
Player has objectively practiced Forge Assistance
+
Valerius still ignorant
-> valerius_m22_forge_report
-> Valerius knows
```

M25 composes this divergence and explicit transfer inside both complete chapter routes.

---

## M23 Faction Reputation authority

M23 establishes first-class institutional standing.

City Watch divergence:

```text
valerius_exp_order_questioned
-> valerius_m23_public_override
-> positive/mixed Valerius Relationship evidence
-> City Watch -10
```

Merchants Guild divergence:

```text
gronk_m23_guild_audit
-> Merchants Guild +12
-> Gronk Relationship unchanged
```

The dormant reputation bands and ally/rival spillover machinery remain unused/unqualified.

M25 uses the two institutions as materially different route consequences rather than cosmetic counters.

---

## M24 Objective World State authority

M24 establishes the first bounded first-class persistent regional World State domain.

Qualified region:

```text
location_merchant_district
```

Qualified fields:

```text
watchPresence: normal | heavy
tradeFlow:     normal | strong
```

The public-order path can explicitly produce `watchPresence = heavy`; the trade-recovery path can explicitly produce `tradeFlow = strong`. Cross-NPC content consumes those objective conditions independently from Relationship, Knowledge, and Faction.

M24 does not qualify generalized world simulation, and M25 does not widen that claim.

---

## M25 complete chapter composition authority

M25 qualifies two strategically distinct production routes:

```text
Route A — Public Order / Institutional Friction
Route B — Quiet Network / Trade Recovery
```

Both routes begin from the same class of controlled pre-chapter history and compose existing Relationship, Trait, Exploration, Combat, Knowledge, Faction, World-State, Copy, persistence, and Offline authorities through ordinary production surfaces.

The routes differ materially in:

- shared M14 decision;
- multi-NPC Relationship interpretation;
- Quest work;
- long-horizon Silas callback;
- Combat tactic selected;
- affected institution;
- Faction standing;
- objective Merchant District condition;
- downstream World-State consumer;
- final NPC / conclusion.

The routes deliberately converge on Forge familiarity, Knowledge transfer, Copy delegation, persistence, and offline settlement because those are shared capabilities rather than route identity.

M25 adds no chapter reducer, generalized ChapterEngine, new save root, generalized condition DSL, dynamic content discovery framework, or one giant chapter-completion flag.

Its central architectural result is:

```text
shared systems
!=
shared outcome
```

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
- explicit evidence ceilings on experimental claims;
- Rule-of-Two pressure before generalized abstraction.

---

## Specification structure

### Product / reconciliation

- [`GameDesignDocument.md`](GameDesignDocument.md)
- [`Technical/PostM14ProductReconciliation.md`](Technical/PostM14ProductReconciliation.md)
- [`Technical/PostM16TraitGameplayReconciliation.md`](Technical/PostM16TraitGameplayReconciliation.md)
- [`Technical/PostM17ProductReconciliation.md`](Technical/PostM17ProductReconciliation.md)
- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — historical execution program through M25
- [`Technical/PostM25ProductDirection.md`](Technical/PostM25ProductDirection.md) — current hypotheses and human-review boundary
- milestone qualification/reconciliation records under [`Technical/`](Technical/), including M18-M25 and Checkpoints B/C.

### Core feature specifications

- [`Features/RelationshipExperienceSystem.md`](Features/RelationshipExperienceSystem.md)
- [`Features/MemorySystem.md`](Features/MemorySystem.md)
- [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md)
- [`Features/FactionSystem.md`](Features/FactionSystem.md)
- [`Features/WorldStateSystem.md`](Features/WorldStateSystem.md)
- [`Features/EssenceResonanceModel.md`](Features/EssenceResonanceModel.md)
- [`Features/EssenceSystem.md`](Features/EssenceSystem.md)
- [`Features/TraitSystem.md`](Features/TraitSystem.md)
- [`Features/NPCSystem.md`](Features/NPCSystem.md)
- [`Features/QuestSystem.md`](Features/QuestSystem.md)
- [`Features/CopySystem.md`](Features/CopySystem.md)
- [`Features/GameLoopSystem.md`](Features/GameLoopSystem.md)
- [`Features/NotificationSystem.md`](Features/NotificationSystem.md)
- [`Features/CombatSystem_MVP.md`](Features/CombatSystem_MVP.md)
- [`Features/ExplorationSystem.md`](Features/ExplorationSystem.md)

---

## Current implementation status

| Area | Status | Notes |
|---|---|---|
| Player | Strong foundation + bounded routine familiarity | canonical location + persisted familiarity for two M20 routines |
| Relationship Experiences / Memories / Bond | Qualified production runtime | accumulated regression evidence preserved through M25 |
| Relationship Connection authority | Qualified for registered bundles | legacy compatibility remains |
| Knowledge | **M22 PASS — bounded** | one fact; witness + report + downstream consumer; no auto propagation |
| Faction Reputation | **M23 PASS — bounded** | City Watch + Merchants Guild; independent from Relationship/Knowledge/World State |
| Objective World State | **M24 PASS — bounded** | Merchant District `watchPresence` + `tradeFlow`; explicit mutations + consumers; no simulation |
| Essence | Functional + Relationship-derived + spatial Tether + bounded offline snapshot accrual | M21 max 8h; not event-time simulation |
| Traits | Core + relationship-mediated discovery/assimilation + gameplay capability | no generalized buildcraft claim |
| Quest | Expanded foundation + integrated chapter usage | no generalized chapter scripting authority |
| Narrative integration | **M25 complete chapter composition PASS** | two strategically distinct routes using canonical authorities |
| Copy | **M20 PASS + familiarity repair PASS + M21 continuation** | two tasks only; no autonomous selection |
| GameLoop | **M21 PASS** | canonical timestamp, 8h cap, two-consumer allowlist, replay guard |
| Shared notifications | **Repair PASS** | mounted production host; M21 summary visibly rendered |
| Save/load | Implemented + migration qualification | integrated M25 state survives ordinary persistence boundaries |
| Combat | Bounded qualified vertical slice + presence gate | one encounter; no generalized Combat completeness |
| Exploration | Bounded qualified travel/presence | four-location graph; no generalized simulation |
| Spatial Tether | Bounded qualified projection | Willow/Gronk anchors; no offline spatial replay |
| NPC active presence | Bounded qualified integration | in-person actions consume canonical co-presence where anchored |
| Active RPG integration | **Checkpoint B PASS** | first WEAK -> repair PASS -> fresh PASS |
| Offline progress | **M21 PASS — bounded** | passive Essence + already-running M20 task only |
| Incremental integration | **Checkpoint C PASS — bounded** | first WEAK -> repair PASS -> fresh rerun PASS |
| Complete chapter | **M25 PASS** | two strategically distinct Merchant District routes; no chapter engine |
| Human integrated playability | **NEXT / unqualified** | comprehension, pacing, emotional impact, fun, retention remain open |
| M26+ | **NOT AUTHORIZED** | post-M25 direction awaits human/product review |

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
- **Checkpoint B fresh rerun:** `CHECKPOINT_B_PASS`;
- **M20:** PASS — two authored routine Copy tasks, deterministic live progress, exact-once rewards, save/load continuity, narrative authority preserved;
- **M21:** PASS — bounded save-envelope offline settlement for passive Essence + already-running M20 task;
- **Checkpoint C first evaluation:** `CHECKPOINT_C_WEAK`;
- **Incremental Integration Repair:** PASS — earned-routine bridge + shared visible return path;
- **Checkpoint C fresh rerun:** `CHECKPOINT_C_PASS`;
- **M22:** `M22_PASS` — objective event can produce divergent per-NPC knowledge, explicit reporting transfers the fact, later content consumes Knowledge independently;
- **M23:** `M23_PASS` — City Watch and Merchants Guild use first-class institutional standing independent from personal Relationship/Knowledge;
- **M24:** `M24_PASS` — Merchant District persists two typed objective conditions with explicit mutations and cross-NPC consumers;
- **M25:** `M25_PASS` — two complete strategically distinct Merchant District routes compose Relationship, Trait, Combat, Exploration, Knowledge, Faction, World State, Copy, persistence, and bounded Offline authorities without a chapter engine or chapter-local shadow state.

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

The exact M25 final candidate passed M25, M24, M23, M22, Checkpoint C repair, M21, M20, active-loop repair, modified historical qualification, accumulated M4-M19 qualification, TypeScript, and production build.

This documentation-only post-M25 reconciliation does not create a new behavioral milestone or inherit authority to claim new gameplay behavior.

---

## Near-term development direction

The automated post-M17 implementation program has completed at `M25_PASS`.

The only currently authorized next activity is:

```text
Human Integrated Playability / Product Review
```

The review should test the complete integrated experience rather than another isolated subsystem. It should evaluate discoverability, state and causal legibility, distinction between Relationship/Knowledge/Faction/World State, strategic agency, narrative/emotional coherence, incremental fit, pacing, and desire to continue.

`Technical/PostM25ProductDirection.md` records candidate hypotheses including:

- causal-legibility UX;
- a second heterogeneous complete chapter before a ChapterEngine;
- content-authoring intelligence / validators;
- deeper Relationship-derived Trait capability/buildcraft;
- selected World-State affordances;
- strategic institutional access from Faction Reputation;
- information-control gameplay from Knowledge;
- deeper earned Copy delegation;
- bounded Combat breadth;
- selective time/presence opportunity cost;
- technical stewardship.

These are **not** authorized milestones.

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
-> M25 Complete Chapter Vertical Slice: PASS
-> automated post-M17 implementation program: COMPLETE
-> Human Integrated Playability / Product Review: NEXT
-> Post-M25 Product Direction Decision
-> M26+: NOT AUTHORIZED until then
```

---

## Development workflow

For any future code-bearing milestone that is explicitly authorized after the post-M25 review:

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
├── m25-chapter-content.json
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

Use this reading order for the current post-M25 product:

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
17. `Technical/M25CompleteChapterVerticalSliceResult.md` for complete chapter composition authority;
18. `Technical/PostM25ProductDirection.md` for current post-M25 hypotheses and the human-review boundary;
19. milestone preregistration/recon records for exact historical experiment contracts;
20. `Technical/PostM17MilestoneRoadmap.md` as the historical roadmap that culminated in M25;
21. `GameDesignDocument.md` and older feature prose where not superseded.

If runtime still uses a legacy rule, document it as compatibility/migration debt and migrate it deliberately rather than pretending it is modern product authority.

If historical content uses Relationship evidence to stand in for cross-NPC awareness, treat it as pre-M22 authoring/migration debt unless a dedicated migration separates objective truth, Knowledge, and retained Relationship meaning.

If older code treats faction-tagged `REPUTATION` as giver-NPC Affinity or dormant ally/rival constants as active authority, M23 supersedes that interpretation.

If older prose uses Relationship, Knowledge, Faction, NPC flags, or Quest completion as shorthand for persistent regional conditions, M24's World State authority supersedes that interpretation within its bounded evidence ceiling.

If older prose describes M25 as future or merely authorized, `M25CompleteChapterVerticalSliceResult.md` supersedes that status. Post-M25 ideas remain hypotheses until separately authorized and qualified.
