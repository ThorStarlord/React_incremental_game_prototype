# Documentation Authority Index

**Status:** CURRENT AUTHORITY for document classification  
**Integrated implementation baseline:** `ff829ce6ee4da8a693adfb783fe843775403326d`  
**Current maturity:** PLAYABLE PRE-ALPHA  
**Last reconciled:** 2026-09-11

## Purpose

This file is the canonical documentation-classification index. Do not infer authority from file age, folder depth, detail, or historical confidence.

The repository uses four classifications:

```text
CURRENT AUTHORITY
REFERENCE
HISTORICAL EVIDENCE
SUPERSEDED
```

## Required reading order

For a new engineering or coding-agent session:

1. [`STATUS.md`](../STATUS.md) — current state, active queue, evidence ceiling.
2. [`docs/CURRENT.md`](CURRENT.md) — this classification index.
3. [`specification/GameCompletionDefinition.md`](../specification/GameCompletionDefinition.md) — the product-level 1.0 definition and stop condition.
4. [`specification/Features/FeatureScopeMatrix.md`](../specification/Features/FeatureScopeMatrix.md) — what 1.0 includes, minimizes, defers, or cuts.
5. [`specification/Progression/GameProgressionArc.md`](../specification/Progression/GameProgressionArc.md) and [`specification/Narrative/CampaignArchitecture.md`](../specification/Narrative/CampaignArchitecture.md) — progression and campaign scope.
6. [`specification/Technical/GameCompletionRoadmap.md`](../specification/Technical/GameCompletionRoadmap.md) — active implementation program.
7. [`RUNBOOK.md`](../RUNBOOK.md) — operating / qualification procedure.
8. [`specification/README.md`](../specification/README.md) — domain-specific authority map.
9. The specific current contract/result records relevant to the active package.
10. Reference / historical evidence only as needed.

`README.md` is orientation, not final technical or product authority.

## Conflict-resolution rule

Authority is scope-sensitive:

```text
STATUS / docs/CURRENT
-> GameCompletionDefinition
-> FeatureScopeMatrix + ProgressionArc + CampaignArchitecture
-> GameCompletionRoadmap + relevant maturity contract
-> current affected domain contract/result
-> specification/README authority map
-> executable implementation + qualification evidence
-> reference
-> historical evidence
-> superseded conclusions
```

If two CURRENT records conflict within the same scope, reconcile the conflict before changing production behavior.

## Current authority matrix

| Concern | Classification | Current source(s) | Notes |
| --- | --- | --- | --- |
| Repository state | CURRENT AUTHORITY | [`STATUS.md`](../STATUS.md) | First source for complete/pending/unproven work. |
| Documentation classification | CURRENT AUTHORITY | [`docs/CURRENT.md`](CURRENT.md) | This file. |
| 1.0 completion / stop condition | CURRENT AUTHORITY | [`specification/GameCompletionDefinition.md`](../specification/GameCompletionDefinition.md) | Defines the smallest complete Campaign One / 1.0. |
| 1.0 feature scope | CURRENT AUTHORITY | [`specification/Features/FeatureScopeMatrix.md`](../specification/Features/FeatureScopeMatrix.md) | Core/minimal/deferred/cut decisions. |
| Whole-game progression | CURRENT AUTHORITY | [`specification/Progression/GameProgressionArc.md`](../specification/Progression/GameProgressionArc.md) | Personal action -> specialization -> networked mastery -> strategic synthesis. |
| Campaign One structure | CURRENT AUTHORITY | [`specification/Narrative/CampaignArchitecture.md`](../specification/Narrative/CampaignArchitecture.md) | Prologue + Ch1–7 + finale + epilogue. |
| Active implementation program | CURRENT AUTHORITY | [`specification/Technical/GameCompletionRoadmap.md`](../specification/Technical/GameCompletionRoadmap.md) | GC-00→GC-14; no automatic M27. |
| Alpha definition | CURRENT AUTHORITY | [`specification/Technical/AlphaCompletionContract.md`](../specification/Technical/AlphaCompletionContract.md) | Whole structural game playable New Game -> Epilogue. |
| Beta definition | CURRENT AUTHORITY | [`specification/Technical/BetaCompletionContract.md`](../specification/Technical/BetaCompletionContract.md) | Content locked + human product evidence + UX/balance/reliability. |
| Release / 1.0 qualification | CURRENT AUTHORITY | [`specification/Technical/ReleaseQualificationContract.md`](../specification/Technical/ReleaseQualificationContract.md) | Exact production candidate, browser/full-run/recovery evidence. |
| Operating / CI procedure | CURRENT AUTHORITY | [`RUNBOOK.md`](../RUNBOOK.md), [`.github/workflows/build-validation.yml`](../.github/workflows/build-validation.yml) | Workflow is executable CI truth; RUNBOOK explains intended use. |
| Domain authority map | CURRENT AUTHORITY | [`specification/README.md`](../specification/README.md) | Routes to current technical/domain records. |
| Provisional governance boundary | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ProvisionalGovernanceDecision.md`](../specification/Technical/PostM25ProvisionalGovernanceDecision.md) | Allows bounded reversible human-unvalidated product development; does not create human evidence. |
| Provisional Product Direction | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ProvisionalProductDirectionDecision.md`](../specification/Technical/PostM25ProvisionalProductDirectionDecision.md) | Relationship-derived capability buildcraft + causal legibility + earned delegation. |
| M26 result | CURRENT AUTHORITY, integrated | [`specification/Technical/M26ProvisionalProductDepthResult.md`](../specification/Technical/M26ProvisionalProductDepthResult.md) | Exact-head #340 PASS; M26 closed. |
| GC-01 player-surface cleanup | CURRENT AUTHORITY, integrated | [`specification/Technical/GC01PlayerSurfaceScopeCleanupResult.md`](../specification/Technical/GC01PlayerSurfaceScopeCleanupResult.md) | Exact-head #343 PASS; PR #117 merged; cut/deferred placeholders no longer primary 1.0 surfaces. |
| Human Product Review | CURRENT HUMAN-EVIDENCE AUTHORITY | issue #109 | Open/unproven. Automation cannot satisfy it. |
| M25 complete chapter | CURRENT AUTHORITY, bounded | [`specification/Technical/M25CompleteChapterVerticalSliceResult.md`](../specification/Technical/M25CompleteChapterVerticalSliceResult.md) | Qualified first complete two-route chapter. |
| Post-M25 product evidence boundary | REFERENCE / predecessor authority | [`specification/Technical/PostM25ProductDirection.md`](../specification/Technical/PostM25ProductDirection.md) | Its anti-expansion/evidence doctrine remains useful; completion scope is now governed above. |
| Product Direction decision readiness | HISTORICAL EVIDENCE / predecessor | [`specification/Technical/PostM25ProductDirectionDecisionReadiness.md`](../specification/Technical/PostM25ProductDirectionDecisionReadiness.md) | Led to provisional governance/direction decision; no longer active implementation queue. |
| Closed post-M25 implementation accounting | HISTORICAL EVIDENCE / CLOSED | [`specification/Technical/PostM25ImplementationRoadmap.md`](../specification/Technical/PostM25ImplementationRoadmap.md) | Former program; do not restart. |
| Three-chapter friction audit | HISTORICAL EVIDENCE / CLOSED | [`specification/Technical/PostM25ThreeChapterFrictionAudit.md`](../specification/Technical/PostM25ThreeChapterFrictionAudit.md) | R1–R3 complete. |
| Chapter-definition integrity repair | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md`](../specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md) | Derived IDs/reference validation/runtime-aligned dialogue catalog. |
| Scheduler async backpressure | CURRENT AUTHORITY | [`specification/Technical/GameLoopAsyncTickBacklogPolicyContract.md`](../specification/Technical/GameLoopAsyncTickBacklogPolicyContract.md), [`specification/Technical/GameLoopBoundedBacklogControlRepair.md`](../specification/Technical/GameLoopBoundedBacklogControlRepair.md) | `SERIAL_BACKPRESSURE_V1`. |
| GameLoop lifecycle remainder | CURRENT AUTHORITY | [`specification/Technical/GameLoopLifecycleRemainderPolicy.md`](../specification/Technical/GameLoopLifecycleRemainderPolicy.md) | `FRESH_LOOP_RESET_V1`. |
| Timed-Quest precision | CURRENT AUTHORITY | [`specification/Technical/GameLoopTimedQuestPrecisionResolution.md`](../specification/Technical/GameLoopTimedQuestPrecisionResolution.md), [`specification/Technical/GameLoopQuestTimingIntegrationQualification.md`](../specification/Technical/GameLoopQuestTimingIntegrationQualification.md) | Comparison-only precision; persisted values unchanged. |
| Bounded offline progression | CURRENT AUTHORITY | [`specification/Technical/M21BoundedOfflineProgressResult.md`](../specification/Technical/M21BoundedOfflineProgressResult.md) | Explicit allowlist; timed Quests remain online-only offline. |

## Current completion authorities

The following collectively own the path to 1.0:

```text
GameCompletionDefinition.md
-> Features/FeatureScopeMatrix.md
-> Progression/GameProgressionArc.md
-> Narrative/CampaignArchitecture.md
-> Technical/GameCompletionRoadmap.md
-> Technical/AlphaCompletionContract.md
-> Technical/BetaCompletionContract.md
-> Technical/ReleaseQualificationContract.md
```

These records are **PROVISIONAL / HUMAN-UNVALIDATED** where they make player-experience assumptions. Their scope decisions are nevertheless current repository authority under the provisional governance decision until revised.

## Current technical/domain authorities retained

Important current bounded records also include:

- `PostM25ContentIntelligence.md` — authoring integrity/reachability/route tracing;
- `PostM25SecondChapterQualification.md` — Archive Inquiry;
- `PostM25PlayerInsightProjection.md` — Causal Journal / Opportunity Map / Relationship-Derived Build;
- `PostM25RuleOfTwoChapterArchitecture.md` — shared requirement evaluator;
- `PostM25ContextualCausalLegibility.md` — spoiler-safe explanation;
- `PostM25CrossDomainTraitBuildcraft.md` — semantic cross-domain Trait use;
- `PostM25ThirdHeterogeneousChapter.md` — Enemies in Phase;
- `PostM25CopyRoutineStrategy.md` — explicit routine priority / Start Preferred;
- `M26ProvisionalProductDepthResult.md` — visible capability/mastery/delegation provenance;
- `GC01PlayerSurfaceScopeCleanupResult.md` — integrated 1.0 player-surface cleanup and rejection qualification.

Use [`specification/README.md`](../specification/README.md) for the broader domain map.

## Current maturity interpretation

Historical documents and package metadata may still contain the word **prototype**. That is not a current maturity verdict.

Current maturity is:

```text
PLAYABLE PRE-ALPHA
```

The repository has passed proof-of-concept, systems-prototype and bounded vertical-slice stages. It has not yet passed Alpha because Campaign One is not playable New Game -> Epilogue.

GC-01 is now complete. The next completion-program responsibility is GC-02 Prologue / onboarding.

## Explicit 1.0 scope consequences

Current scope decisions include:

- separate generic Skills/skill-tree: `CUT` for 1.0;
- generic Crafting: `CUT` for Campaign One;
- general Inventory/Equipment: `DEFER_POST_1_0` unless campaign evidence promotes it;
- dedicated duplicate Saves system: `CUT`; use existing canonical persistence authority;
- generic ChapterEngine / narrative DSL: `CUT` absent repeated concrete need;
- autonomous Copy planning / automatic irreversible decisions: `CUT`;
- offline narrative/social/world decision execution: `CUT`;
- interplanetary continuation / AI-war campaign / New Game+: `DEFER_POST_1_0`.

Do not treat old feature specs, placeholder routes, lore hooks, or expansion ideas as authority that silently overrides these decisions.

## Human evidence authority

Issue #109 remains open. Under the completion program it is no longer a total freeze on bounded pre-Alpha development; it becomes required evidence for Beta and final player-quality claims.

Automated tests, synthetic UI observation, code review and repository analysis do **not** establish:

- fresh-player comprehension/discoverability;
- pacing;
- fairness/final balance;
- enjoyment;
- emotional impact;
- retention/desire to continue;
- market preference.

## Historical evidence

Older milestone reports, checkpoint artifacts, PR handoffs, synthetic-review captures and analysis files remain useful provenance. Preserve them; do not turn them back into active queues.

Notable history:

- [`specification/Technical/CheckpointBActiveRpgLoopResult.md`](../specification/Technical/CheckpointBActiveRpgLoopResult.md) — first weak verdict superseded by later repair/rerun PASS.
- [`specification/Technical/CheckpointCIncrementalIntegrationResult.md`](../specification/Technical/CheckpointCIncrementalIntegrationResult.md) — first weak verdict superseded by repair/rerun PASS; the M26 wording assertion repair did not change its behavioral authority.
- Build Validation #335 — useful failure provenance for chapter-integrity validator source mismatch; superseded by #336 PASS.
- Build Validation #339 — useful failure provenance for stale historical Copy-detail wording; superseded by M26 exact candidate #340 PASS.
- Build Validation #343 — qualified GC-01 player-surface cleanup on exact candidate `caabc1581316dab33f7eeb98dac9b32072ec57df` before PR #117 integration.

## Explicitly superseded conclusions

The following must not govern new work:

- `ArchitectureOverview.md` claims that testing is manual-only or authoritative CI is absent;
- retired `.github/workflows/gemini-review.yml`, `gemini.md`, or `GEMINI_API_KEY` merge dependency;
- any queue treating M4–M26, GC-01, post-M25 content intelligence, the three-chapter R1–R3 repair, Player Insight, cross-domain Trait buildcraft, or Copy provenance as pending;
- any statement that Product Direction is still entirely unselected: it is now **provisionally selected / human-unvalidated**;
- any statement that M26 remains unauthorized: it has been explicitly authorized, qualified and integrated;
- any implication that technical green tests authorize M27;
- any old feature placeholder that implies Skills, Crafting, general Inventory, or a duplicate save system must ship in 1.0.

A `SUPERSEDED` label applies to the identified conclusion/scope, not necessarily every historical fact in the file.

## Maintenance rule

When work creates, supersedes or materially reinterprets authority:

1. update/create the affected domain/completion contract;
2. update this index in the same handoff;
3. update `STATUS.md` when repository state or queue changes;
4. update `RUNBOOK.md` when commands/procedure changes;
5. keep `README.md` navigational;
6. update `specification/README.md` when authority routing changes;
7. preserve historical evidence instead of deleting useful provenance;
8. run `npm run docs:authority:validate`;
9. require exact-head Build Validation before merge.

## Governing rule

> **A future package must close a named 1.0 completion requirement or a demonstrated blocker to one. Technical possibility alone is not authorization.**
