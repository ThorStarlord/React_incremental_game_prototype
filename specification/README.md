# React Incremental RPG — Specification Authority Map

This file routes readers to the current product, completion, technical and domain authorities. It does not duplicate every historical milestone narrative.

**Current maturity:** PLAYABLE PRE-ALPHA  
**Integrated implementation baseline:** `7f306f3b6a69a27c250c1986df976cc518119821`  
**Human Product Review:** issue #109 OPEN / UNPROVEN

## Authority chain

Read current authority in this order:

```text
STATUS.md
-> docs/CURRENT.md
-> GameCompletionDefinition.md
-> Features/FeatureScopeMatrix.md
-> Progression/GameProgressionArc.md + Narrative/CampaignArchitecture.md
-> Technical/GameCompletionRoadmap.md
-> relevant Alpha / Beta / Release completion contract
-> affected current domain contract/result
-> executable implementation + qualification
-> reference / historical evidence only as needed
```

Authority is scope-sensitive. Older detailed prose does not override the current 1.0 scope, and a green technical test does not promote a human-quality claim.

## Current game-completion authorities

### Finished-game definition

- [`GameCompletionDefinition.md`](GameCompletionDefinition.md) — **CURRENT AUTHORITY** for what Campaign One / 1.0 is, what counts as complete, and when to stop adding 1.0 scope.

The current target is a bounded isolated-planet Campaign One where consequential relationships teach durable capabilities, remembered history explains later possibilities, and understood repetition becomes deliberately delegatable.

### Feature scope

- [`Features/FeatureScopeMatrix.md`](Features/FeatureScopeMatrix.md) — **CURRENT AUTHORITY** for `CORE_1_0`, `SUPPORTING_1_0`, `MINIMAL_1_0`, `DEFER_POST_1_0`, and `CUT` decisions.

Important consequences:

```text
Traits                         -> capability/skill authority for 1.0
separate generic Skills        -> CUT
Generic Crafting               -> CUT for Campaign One
General Inventory/Equipment    -> DEFER_POST_1_0 unless campaign evidence promotes it
canonical save/load/import     -> CORE_1_0
duplicate Saves system         -> CUT
ChapterEngine / narrative DSL  -> CUT absent repeated concrete need
autonomous Copy decisions      -> CUT
interplanetary campaign / NG+  -> DEFER_POST_1_0
```

### Whole-game progression

- [`Progression/GameProgressionArc.md`](Progression/GameProgressionArc.md) — **CURRENT AUTHORITY** for the progression transformation:

```text
Personal Agency
-> Relationship-Shaped Specialization
-> Networked Mastery
-> Strategic Synthesis
```

### Campaign structure

- [`Narrative/CampaignArchitecture.md`](Narrative/CampaignArchitecture.md) — **CURRENT AUTHORITY** for the bounded Campaign One spine:

```text
Prologue
Ch1 Merchant District Crisis      [integrated]
Ch2 Archive Inquiry               [integrated]
Ch3 Enemies in Phase              [integrated]
Ch4 Lattice Under Strain          [to build]
Ch5 The Chrono-Crypt              [to build]
Ch6 Network Under Pressure        [to build]
Ch7 Counterphase                  [to build]
Finale — The Telluric Echo        [to build]
Epilogue                          [to build]
```

The broad [`Narrative/Synopsis.md`](Narrative/Synopsis.md) remains narrative reference; `CampaignArchitecture.md` owns bounded 1.0 production scope.

### Active implementation roadmap

- [`Technical/GameCompletionRoadmap.md`](Technical/GameCompletionRoadmap.md) — **CURRENT AUTHORITY** for GC-00→GC-14 and the dependency path to 1.0.

There is no automatic M27. Every active package must close a named 1.0 completion requirement or a demonstrated blocker to one.

### Maturity gates

- [`Technical/AlphaCompletionContract.md`](Technical/AlphaCompletionContract.md) — **CURRENT AUTHORITY** for Alpha: whole structural game playable New Game -> Epilogue through normal UI.
- [`Technical/BetaCompletionContract.md`](Technical/BetaCompletionContract.md) — **CURRENT AUTHORITY** for Content Alpha/Beta: content lock, genuine human evidence, UX/pacing/balance/reliability/accessibility/browser readiness.
- [`Technical/ReleaseQualificationContract.md`](Technical/ReleaseQualificationContract.md) — **CURRENT AUTHORITY** for exact Release Candidate / 1.0 promotion.

## Provisional Product Direction and governance

- [`Technical/PostM25ProvisionalGovernanceDecision.md`](Technical/PostM25ProvisionalGovernanceDecision.md) — current bounded governance exception permitting reversible human-unvalidated product development while preserving the human-evidence ceiling.
- [`Technical/PostM25ProvisionalProductDirectionDecision.md`](Technical/PostM25ProvisionalProductDirectionDecision.md) — provisional hierarchy:
  1. relationship-derived capability buildcraft;
  2. causal legibility;
  3. earned delegation / mastery compression;
  4. heterogeneous authored composition.
- [`Technical/M26ProvisionalProductDepthResult.md`](Technical/M26ProvisionalProductDepthResult.md) — integrated provenance/readiness result; exact candidate `9b9b0380...`, Build Validation #340 PASS, PR #114 merged as `7f306f3b...`.

The earlier [`Technical/PostM25ProductDirectionDecisionReadiness.md`](Technical/PostM25ProductDirectionDecisionReadiness.md) is predecessor evidence, not the active implementation authority.

## Human evidence authority

Issue #109 — **Human Integrated Playability / Product Review** — remains open and unproven.

Under the game-completion program it is not a blanket freeze on all pre-Alpha work. It is the authority for claims that require fresh human observation and becomes a required input to `BETA_PASS`.

Automation must not claim:

- fresh-player comprehension/discoverability;
- pacing quality;
- fairness/final balance;
- enjoyment/emotional impact;
- retention/desire to continue;
- market preference.

## Current relationship / capability chain

### Relationship authority

Relationship progression is based on persistent Experiences, Memories, interpreted Bond state and evidence-qualified Connection rather than one universal relationship XP meter.

Use current Relationship contracts/results under [`Technical/`](Technical/) and feature references under [`Features/`](Features/), especially the current Relationship Experience/Memory authority linked by those records.

### Trait / capability authority

The governing separation remains:

```text
Relationship -> qualifies learning / explains provenance
Trait        -> owns durable capability
Gameplay     -> determines local applicability
Player       -> chooses whether to use it
```

Current relevant records include:

- [`Technical/PostM25CrossDomainTraitBuildcraft.md`](Technical/PostM25CrossDomainTraitBuildcraft.md) — semantic cross-domain capability use;
- [`Technical/PostM25PlayerInsightProjection.md`](Technical/PostM25PlayerInsightProjection.md) — read-only build/provenance projections;
- [`Technical/M26ProvisionalProductDepthResult.md`](Technical/M26ProvisionalProductDepthResult.md) — player-visible qualifying-Memory provenance.

The 1.0 completion floor is four durable relationship-derived capability identities across at least three anchor relationships, at least two with meaningful cross-domain use, and at least two viable late-game build profiles.

## Current causal-state separation

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

Do not collapse these into a universal progression/condition system without a new demonstrated completion blocker.

### Knowledge

- [`Technical/M22SocialKnowledgePropagationResult.md`](Technical/M22SocialKnowledgePropagationResult.md)
- [`Features/KnowledgeSystem.md`](Features/KnowledgeSystem.md)

### Faction Reputation

- [`Technical/M23FactionReputationResult.md`](Technical/M23FactionReputationResult.md)
- [`Features/FactionSystem.md`](Features/FactionSystem.md)

### Objective World State

- [`Technical/M24ObjectiveWorldStateResult.md`](Technical/M24ObjectiveWorldStateResult.md)
- [`Features/WorldStateSystem.md`](Features/WorldStateSystem.md)

## Current Copy / incremental authority

- [`Technical/M20ProductionCopyTaskAutomationResult.md`](Technical/M20ProductionCopyTaskAutomationResult.md) — bounded Copy task execution.
- [`Technical/M21BoundedOfflineProgressResult.md`](Technical/M21BoundedOfflineProgressResult.md) — bounded offline snapshot settlement.
- [`Technical/PostM25CopyRoutineStrategy.md`](Technical/PostM25CopyRoutineStrategy.md) — player-authored routine priority and explicit `Start Preferred` action.
- [`Technical/M26ProvisionalProductDepthResult.md`](Technical/M26ProvisionalProductDepthResult.md) — personal mastery provenance vs Copy-specific readiness.

Product doctrine:

```text
player personally learns routine
-> familiarity persists
-> player may deliberately delegate approved repetition
-> Copy executes bounded ordinary consequence

novel / meaningful / irreversible decision
-> remains player authority
```

The 1.0 completion floor is three personally mastered routine identities across at least two learning contexts.

## Current chapter/content architecture

- [`Technical/M25CompleteChapterVerticalSliceResult.md`](Technical/M25CompleteChapterVerticalSliceResult.md) — qualified two-route Merchant District chapter.
- [`Technical/PostM25SecondChapterQualification.md`](Technical/PostM25SecondChapterQualification.md) — Archive Inquiry.
- [`Technical/PostM25ThirdHeterogeneousChapter.md`](Technical/PostM25ThirdHeterogeneousChapter.md) — Enemies in Phase.
- [`Technical/PostM25RuleOfTwoChapterArchitecture.md`](Technical/PostM25RuleOfTwoChapterArchitecture.md) — bounded shared requirement helper.
- [`Technical/PostM25ChapterDefinitionIntegrityRepair.md`](Technical/PostM25ChapterDefinitionIntegrityRepair.md) — derived ChapterId + generic integrity qualification.
- [`Technical/PostM25ContentIntelligence.md`](Technical/PostM25ContentIntelligence.md) — content integrity, reachability and route tracing.

There remains no generalized `ChapterEngine`, chapter reducer/save root, or narrative condition DSL.

Focused chapter/content commands:

```bash
npm run content:intelligence:validate
npm run chapter:validate
```

## GameLoop timing authority

Current key records include:

- [`Technical/GameLoopAsyncTickBacklogPolicyContract.md`](Technical/GameLoopAsyncTickBacklogPolicyContract.md) — `SERIAL_BACKPRESSURE_V1`.
- [`Technical/GameLoopBoundedBacklogControlRepair.md`](Technical/GameLoopBoundedBacklogControlRepair.md).
- [`Technical/GameLoopLifecycleRemainderPolicy.md`](Technical/GameLoopLifecycleRemainderPolicy.md) — `FRESH_LOOP_RESET_V1`.
- [`Technical/GameLoopUnifiedTimingHardeningCompositionQualification.md`](Technical/GameLoopUnifiedTimingHardeningCompositionQualification.md).
- [`Technical/GameLoopTimedQuestPrecisionResolution.md`](Technical/GameLoopTimedQuestPrecisionResolution.md) — comparison-only precision semantics.
- [`Technical/GameLoopQuestTimingIntegrationQualification.md`](Technical/GameLoopQuestTimingIntegrationQualification.md).

Key invariants:

```text
SERIAL_BACKPRESSURE_V1
-> at most one unresolved admitted fixed step
-> retain excess logical milliseconds
-> no per-tick FIFO
-> no drop / skip / coalescing / concurrent consumers

FRESH_LOOP_RESET_V1
-> continuous execution and pause/resume preserve sub-step remainder
-> paused wall time rejected
-> stop/start, unmount/remount, save/load fresh mount discard remainder
```

M21 offline authority remains separate and bounded; timed Quests remain online-only during offline settlement.

## Current qualification surfaces

Executable CI authority:

```text
.github/workflows/build-validation.yml
```

Operational procedure:

- [`../RUNBOOK.md`](../RUNBOOK.md)

Current important commands include:

```bash
npm run docs:authority:validate
npm run content:intelligence:validate
npm run chapter:validate
npm run m26:validate
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
npm run build
```

`alpha:validate` and `release:validate` are **future required commands** defined by the maturity contracts. Do not claim they exist until their owning completion packages implement them.

## Historical / closed program records

The following remain useful provenance but are not active queues:

- [`Technical/PostM17MilestoneRoadmap.md`](Technical/PostM17MilestoneRoadmap.md) — historical program culminating in M25.
- [`Technical/PostM25ImplementationRoadmap.md`](Technical/PostM25ImplementationRoadmap.md) — closed post-M25 program.
- [`Technical/PostM25ThreeChapterFrictionAudit.md`](Technical/PostM25ThreeChapterFrictionAudit.md) — closed R1–R3 audit.
- first weak Checkpoint B/C verdicts — historical evidence superseded by their repair/rerun PASS records.
- Build Validation #335 failure — historical evidence for the runtime-aligned chapter-validator repair.
- Build Validation #339 failure — historical evidence for the M26 stale historical wording assertion; superseded by #340 PASS.

## Reference material

Broad product/lore/design reference remains in:

- [`GameDesignDocument.md`](GameDesignDocument.md)
- [`Narrative/Synopsis.md`](Narrative/Synopsis.md)
- [`Narrative/Characters.md`](Narrative/Characters.md)
- [`Narrative/WorldLore.md`](Narrative/WorldLore.md)
- [`Features/`](Features/)
- [`UI_UX/`](UI_UX/)

These files do not silently expand 1.0 scope. `GameCompletionDefinition.md` and `FeatureScopeMatrix.md` own that boundary.

## 1.0 governing rule

For any proposed work:

```text
identify unsatisfied Game Completion requirement
-> identify current concrete blocker
-> use existing authority if sufficient
-> introduce smallest intervention
-> qualify positive + negative paths
-> exact-head Build Validation
-> update completion status
```

> **Technical possibility is not a 1.0 requirement. Finish the bounded Campaign One before expanding the architecture.**
