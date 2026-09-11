# React Incremental RPG Prototype — Specification Authority Map

This file is the technical/product **authority chain** for the React Incremental RPG Prototype. It routes a reader to current records rather than duplicating every historical milestone narrative.

## Authority chain

Read repository authority in this order:

```text
STATUS.md
-> docs/CURRENT.md
-> RUNBOOK.md
-> specification/README.md
-> current domain contract/result records
-> executable implementation + qualification tests
-> reference / historical evidence only as needed
```

Authority is scope-sensitive. A later implementation record does not automatically override a still-current product boundary, and older detailed prose does not override current executable contracts.

## Current repository boundary

```text
M25 Complete Chapter Vertical Slice: PASS
Post-M25 GameLoop Timing Hardening: COMPLETE / INTEGRATED
Post-M25 Content Intelligence: COMPLETE / INTEGRATED
Archive Inquiry second chapter: QUALIFIED / INTEGRATED
Player Insight projections: COMPLETE / INTEGRATED
Post-M25 Product-Depth Packages: COMPLETE / INTEGRATED
Human Integrated Playability / Product Review: DEFERRED / UNPROVEN
Product Direction Decision: PENDING
M26: NOT AUTHORIZED
```

Repository qualification proves bounded technical behavior and composition. It does not prove human comprehension, pacing, fairness, enjoyment, retention, final balance, or final Product Direction.

## Current records — product and implementation direction

- [`Technical/PostM25ProductDirection.md`](Technical/PostM25ProductDirection.md) — candidate product thesis, human-review boundary, promotion conditions, and anti-expansion controls. This remains the product-evidence boundary and does **not** authorize M26.
- [`Technical/PostM25ImplementationRoadmap.md`](Technical/PostM25ImplementationRoadmap.md) — reconciles post-M25 hypotheses with work actually delivered through PR #104 so future sessions do not restart completed packages.
- [`Technical/M25CompleteChapterVerticalSliceResult.md`](Technical/M25CompleteChapterVerticalSliceResult.md) — M25 complete-chapter composition authority.

The currently strongest candidate product pattern is:

```text
meaningful active play
-> independent Relationship / Knowledge / Faction / World consequences
-> durable relationship-derived capability
-> tactical/social application
-> understood routine
-> deliberate Copy delegation
-> bounded offline continuation where explicitly allowed
-> return attention to novelty and higher-order decisions
```

## Current records — post-M25 content and chapter architecture

- [`Technical/PostM25ContentIntelligence.md`](Technical/PostM25ContentIntelligence.md) — deterministic authored-content integrity, dependency/reachability intelligence, route tracing, and rejection self-tests.
- [`Technical/PostM25SecondChapterQualification.md`](Technical/PostM25SecondChapterQualification.md) — **Archive Inquiry**, the qualified second heterogeneous chapter-scale projection over existing Elara authority.
- [`Technical/PostM25RuleOfTwoChapterArchitecture.md`](Technical/PostM25RuleOfTwoChapterArchitecture.md) — the bounded shared requirement evaluator extracted from repeated Merchant District / Archive Inquiry projection behavior.
- [`Technical/PostM25ThirdHeterogeneousChapter.md`](Technical/PostM25ThirdHeterogeneousChapter.md) — **Enemies in Phase**, a third one-route heterogeneous chapter-scale projection over existing Lyra evidence.

Current chapter-scale evidence is therefore:

```text
Merchant District Crisis
-> institutions / trade / public order / world-state consequences
-> two conclusions

Archive Inquiry
-> evidence / model revision / independent verification
-> two distinct relationship histories

Enemies in Phase
-> adversarial learning / calibration / necessary cooperation
-> one route
```

All three are projections over canonical domain authorities. There is still no generalized `ChapterEngine`, chapter reducer, chapter-local save root, or generalized narrative condition DSL.

## Current records — player legibility and relationship-derived buildcraft

- [`Technical/PostM25PlayerInsightProjection.md`](Technical/PostM25PlayerInsightProjection.md) — Causal Journal, Opportunity Map, Relationship-Derived Build, spoiler boundaries, and read-only projection authority.
- [`Technical/PostM25ContextualCausalLegibility.md`](Technical/PostM25ContextualCausalLegibility.md) — contextual `Available because` explanations for already-visible dialogue topics; unavailable topics remain hidden and expose no prerequisite hints.
- [`Technical/PostM25CrossDomainTraitBuildcraft.md`](Technical/PostM25CrossDomainTraitBuildcraft.md) — relationship-derived Traits retain durable capability identity across more than one gameplay domain while permanent Trait state remains capability authority.

Trait authority remains:

```text
Relationship -> qualifies learning / explains provenance
Trait        -> owns durable capability
Gameplay     -> determines local applicability
Player       -> chooses whether to use it
```

The post-M25 buildcraft qualification adds `ScholarlyInsight` as a semantic combat capability in addition to its existing investigation/Quest use. Baseline actions remain viable, so the Trait expands solution space rather than becoming mandatory universal power.

## Current records — Copy and incremental authority

- [`Technical/M20ProductionCopyTaskAutomationResult.md`](Technical/M20ProductionCopyTaskAutomationResult.md) — qualified bounded Copy production-task execution.
- [`Technical/M21BoundedOfflineProgressResult.md`](Technical/M21BoundedOfflineProgressResult.md) — bounded offline snapshot settlement authority.
- [`Technical/PostM25CopyRoutineStrategy.md`](Technical/PostM25CopyRoutineStrategy.md) — player-authored ordered routine priority over the existing M20 allowlist, plus explicit `Start Preferred` delegation through existing M20 eligibility and one-active-task authority.

The product doctrine remains:

```text
player personally understands routine
-> routine familiarity persists
-> player may deliberately delegate approved repetition
-> Copy executes bounded ordinary consequence

novel / meaningful / irreversible decision
-> remains player authority
```

Post-M25 routine priority does **not** automatically chain tasks and does not authorize autonomous narrative, social, Knowledge, Faction, World State, travel, Quest, or combat decisions.

## Current records — GameLoop timing and progression

The integrated post-M25 timing model remains governed by the current GameLoop records, especially:

- [`Technical/GameLoopAsyncTickBacklogPolicyContract.md`](Technical/GameLoopAsyncTickBacklogPolicyContract.md) — `SERIAL_BACKPRESSURE_V1`.
- [`Technical/GameLoopBoundedBacklogControlRepair.md`](Technical/GameLoopBoundedBacklogControlRepair.md) — bounded implementation repair preserving the async backlog contract.
- [`Technical/GameLoopLifecycleRemainderPolicy.md`](Technical/GameLoopLifecycleRemainderPolicy.md) — `FRESH_LOOP_RESET_V1`.
- [`Technical/GameLoopUnifiedTimingHardeningCompositionQualification.md`](Technical/GameLoopUnifiedTimingHardeningCompositionQualification.md) — integrated timing composition authority.
- [`Technical/GameLoopBackpressureCadenceProgressionStressQualification.md`](Technical/GameLoopBackpressureCadenceProgressionStressQualification.md) — backpressure/cadence/progression stress qualification.
- [`Technical/GameLoopTimedQuestPrecisionResolution.md`](Technical/GameLoopTimedQuestPrecisionResolution.md) — comparison-only timed-Quest floating-point precision semantics.
- [`Technical/GameLoopQuestTimingIntegrationQualification.md`](Technical/GameLoopQuestTimingIntegrationQualification.md) — Quest timing integration evidence.

Key invariants:

```text
SERIAL_BACKPRESSURE_V1
-> at most one unresolved admitted fixed step
-> logical time retained in accumulator
-> no per-tick FIFO backlog
-> no drop / skip / coalescing / concurrent consumers

FRESH_LOOP_RESET_V1
-> continuous execution preserves sub-step remainder
-> pause/resume preserves remainder but rejects paused wall time
-> stop/start discards remainder
-> unmount/remount discards remainder
-> save/load + fresh mount discards remainder
```

M21 offline authority remains separate and bounded; timed Quests remain online-only during offline settlement.

## Current records — active RPG domain chain

### Relationship / Memory / Trait

Use the M4-M17 current contracts/results and later reconciliation records under [`Technical/`](Technical/) together with feature documents under [`Features/`](Features/). Important current doctrine is that Relationship evidence and Memories explain social history and learning provenance, while Traits own durable capability identity.

The first weak Checkpoint B verdict in [`Technical/CheckpointBActiveRpgLoopResult.md`](Technical/CheckpointBActiveRpgLoopResult.md) is historical evidence; later repair and rerun PASS records supersede that verdict for current decisions.

### Exploration / spatial authority

- [`Technical/M18ExplorationTravelResult.md`](Technical/M18ExplorationTravelResult.md) — bounded authored travel authority.
- [`Technical/M19WorldDerivedTetherResult.md`](Technical/M19WorldDerivedTetherResult.md) — bounded world-derived spatial Tether authority.

Player location remains canonical for player presence. NPC anchors and Relationship/Tether projections do not replace canonical spatial authority.

### Knowledge

- [`Technical/M22SocialKnowledgePropagationResult.md`](Technical/M22SocialKnowledgePropagationResult.md)
- [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md)

Knowledge answers **which NPC knows an objective fact**; it is not Relationship meaning, Faction standing, or objective World State.

### Faction Reputation

- [`Technical/M23FactionReputationResult.md`](Technical/M23FactionReputationResult.md)
- [`Features/FactionSystem.md`](Features/FactionSystem.md)

Faction Reputation answers **how an institution regards the player** and remains independent from personal Relationship and Knowledge.

### Objective World State

- [`Technical/M24ObjectiveWorldStateResult.md`](Technical/M24ObjectiveWorldStateResult.md)
- [`Features/WorldStateSystem.md`](Features/WorldStateSystem.md)

World State owns qualified objective regional conditions and remains independent from social interpretation.

## Current system separation

```text
OBJECTIVE EVENT / SOURCE -> what happened
WORLD STATE              -> persistent objective regional conditions
KNOWLEDGE                -> who knows selected facts
RELATIONSHIP             -> what shared history means personally
FACTION REPUTATION       -> how institutions regard the player
TRAIT                    -> durable learned capability
COPY                     -> bounded execution of understood routine
CHAPTER PROJECTION       -> read-only composition of existing authorities
```

Do not collapse these into a universal progression or condition system without new evidence.

## Current qualification surfaces

Executable authority is [`.github/workflows/build-validation.yml`](../.github/workflows/build-validation.yml). Operational commands belong in [`../RUNBOOK.md`](../RUNBOOK.md).

The current Build Validation includes, among other gates:

- documentation-authority validation;
- content-intelligence qualification;
- Archive Inquiry second-chapter qualification;
- Player Insight qualification;
- post-M25 product-depth qualification covering Rule-of-Two extraction, contextual causal legibility, cross-domain Trait buildcraft, third chapter, and Copy routine strategy;
- TypeScript checking with failure-only diagnostics;
- UI-only synthetic smoke;
- GameLoop timing/backpressure/lifecycle/drift qualification;
- M20-M25 milestone gates;
- active-loop and historical regression qualification;
- production build.

Exact-head green CI is necessary for merge but does not promote claims above the declared evidence ceiling.

## Reference records

Broad product and design context remains useful in:

- [`GameDesignDocument.md`](GameDesignDocument.md)
- [`Features/`](Features/)
- [`Narrative/`](Narrative/)
- [`UI_UX/`](UI_UX/)
- reconciliation and historical milestone records under [`Technical/`](Technical/)

[`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) is historical evidence for the completed program through M25, not the active roadmap for M26.

Use [`../docs/CURRENT.md`](../docs/CURRENT.md) before treating older technical records as present-state authority.

## Evidence ceiling and anti-expansion boundary

Repository qualification still does **not** prove:

- fresh-player comprehension or discoverability;
- causal terminology comprehension;
- pacing quality;
- fairness or final balance;
- emotional coherence;
- enjoyment;
- retention / desire to continue;
- final Product Direction;
- M26 authorization.

Do not infer permission from the current architecture to build a generalized ChapterEngine, narrative DSL, open-world simulation, NPC schedules, generalized economy, generalized belief/rumor simulation, autonomous irreversible Copy planning, or offline narrative/world simulation.

For new work, follow:

```text
real current bottleneck
-> observed concrete friction
-> repeated case where abstraction is relevant
-> smallest justified intervention
-> explicit deterministic qualification
-> preserve evidence ceiling
```
