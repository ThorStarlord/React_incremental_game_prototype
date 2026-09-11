# Documentation Authority Index

**Status:** CURRENT AUTHORITY for document classification  
**Reconciled against integrated implementation baseline:** `5bdf808154a62bdb85c1bee55777f9be35f1395e`  
**Last reconciled:** 2026-09-11

## Purpose

This file is the canonical documentation-classification index. Do not infer authority from file age, folder depth, detail, or how confident an older document sounds.

The repository uses four classifications:

```text
CURRENT AUTHORITY
REFERENCE
HISTORICAL EVIDENCE
SUPERSEDED
```

## Required reading order

For a new engineering or coding-agent session, read in this order:

1. [`STATUS.md`](../STATUS.md) — current repository state, integrated work, evidence ceiling, and next decisions.
2. [`docs/CURRENT.md`](CURRENT.md) — this classification index.
3. [`RUNBOOK.md`](../RUNBOOK.md) — setup, validation, exact-head CI, diagnostics, and integration procedure.
4. [`specification/README.md`](../specification/README.md) — technical/product authority map and domain-specific source chain.
5. The specific current contract/result documents named by those indexes.
6. Historical or reference material only as needed for provenance.

`README.md` is orientation, not final technical or product authority.

## Conflict-resolution rule

Authority is scope-sensitive rather than simply newest-file-wins:

```text
current STATUS / docs/CURRENT
-> explicitly current contract or result for the affected scope
-> specification/README authority chain
-> current feature/domain specification
-> repository implementation + executable qualification evidence
-> reference documents
-> historical evidence
-> superseded conclusions
```

If a conflict still cannot be resolved, perform a bounded reconciliation before changing production behavior.

## Current authority matrix

| Concern | Classification | Current source(s) | Notes |
| --- | --- | --- | --- |
| Repository state | CURRENT AUTHORITY | [`STATUS.md`](../STATUS.md) | First source for what is complete, pending, unproven, or unauthorized. |
| Documentation classification | CURRENT AUTHORITY | [`docs/CURRENT.md`](CURRENT.md) | Determines how older repository prose should be interpreted. |
| Operating / CI procedure | CURRENT AUTHORITY | [`RUNBOOK.md`](../RUNBOOK.md), [`.github/workflows/build-validation.yml`](../.github/workflows/build-validation.yml) | Workflow file is executable CI truth; RUNBOOK explains intended use. |
| Technical authority map | CURRENT AUTHORITY | [`specification/README.md`](../specification/README.md) | Routes to current domain-specific contracts/results. |
| M25 complete chapter | CURRENT AUTHORITY | [`specification/Technical/M25CompleteChapterVerticalSliceResult.md`](../specification/Technical/M25CompleteChapterVerticalSliceResult.md) | Bounded complete-chapter composition; does not prove human product quality. |
| Post-M25 product boundary | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ProductDirection.md`](../specification/Technical/PostM25ProductDirection.md) | Product hypotheses, human-evidence boundary, anti-expansion controls. `M26` remains **NOT AUTHORIZED** by technical evidence alone. |
| Product Direction decision readiness | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ProductDirectionDecisionReadiness.md`](../specification/Technical/PostM25ProductDirectionDecisionReadiness.md) | Compares demonstrated candidate identities without making the Product Direction Decision. |
| Post-M25 implementation accounting | CURRENT AUTHORITY | [`specification/Technical/PostM25ImplementationRoadmap.md`](../specification/Technical/PostM25ImplementationRoadmap.md) | Closed program record; the former six-step post-M25 queue is complete and must not be restarted by inertia. |
| Three-chapter repository friction | HISTORICAL EVIDENCE / CLOSED AUDIT | [`specification/Technical/PostM25ThreeChapterFrictionAudit.md`](../specification/Technical/PostM25ThreeChapterFrictionAudit.md) | Findings remain authoritative provenance; its R1–R3 queue is complete. |
| Chapter-definition integrity repair | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md`](../specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md) | Integrated R1–R3 result, exact-head qualification, runtime-aligned dialogue catalogue, and anti-expansion boundary. |
| Scheduler async backpressure | CURRENT AUTHORITY | [`specification/Technical/GameLoopAsyncTickBacklogPolicyContract.md`](../specification/Technical/GameLoopAsyncTickBacklogPolicyContract.md), [`specification/Technical/GameLoopBoundedBacklogControlRepair.md`](../specification/Technical/GameLoopBoundedBacklogControlRepair.md) | `SERIAL_BACKPRESSURE_V1`. |
| GameLoop lifecycle remainder | CURRENT AUTHORITY | [`specification/Technical/GameLoopLifecycleRemainderPolicy.md`](../specification/Technical/GameLoopLifecycleRemainderPolicy.md) | `FRESH_LOOP_RESET_V1`. |
| Timed-Quest precision | CURRENT AUTHORITY | [`specification/Technical/GameLoopTimedQuestPrecisionResolution.md`](../specification/Technical/GameLoopTimedQuestPrecisionResolution.md), [`specification/Technical/GameLoopQuestTimingIntegrationQualification.md`](../specification/Technical/GameLoopQuestTimingIntegrationQualification.md) | Comparison-only precision handling; raw/persisted values remain unchanged. |
| Offline progression | CURRENT AUTHORITY | [`specification/Technical/M21BoundedOfflineProgressResult.md`](../specification/Technical/M21BoundedOfflineProgressResult.md) | Positive allowlist remains bounded; timed Quests remain online-only. |

## Current post-M25 records

The following are **CURRENT AUTHORITY** for their bounded scopes:

- [`specification/Technical/PostM25ProductDirectionDecisionReadiness.md`](../specification/Technical/PostM25ProductDirectionDecisionReadiness.md) — decision-preparation evidence matrix for causal legibility, relationship-derived buildcraft, earned delegation, and heterogeneous composition; no final direction is selected.
- [`specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md`](../specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md) — integrated chapter identity/reference/API repair; `chapter:validate` is now part of content-intelligence qualification.
- [`specification/Technical/PostM25ContentIntelligence.md`](../specification/Technical/PostM25ContentIntelligence.md) — developer-side authoring integrity, dependency/reachability intelligence, and route tracing.
- [`specification/Technical/PostM25SecondChapterQualification.md`](../specification/Technical/PostM25SecondChapterQualification.md) — Archive Inquiry as the qualified second heterogeneous chapter-scale projection without a ChapterEngine.
- [`specification/Technical/PostM25PlayerInsightProjection.md`](../specification/Technical/PostM25PlayerInsightProjection.md) — Causal Journal, Opportunity Map, Relationship-Derived Build, and read-only Player Insight boundaries.
- [`specification/Technical/PostM25RuleOfTwoChapterArchitecture.md`](../specification/Technical/PostM25RuleOfTwoChapterArchitecture.md) — bounded requirement extraction justified by repeated chapter projection behavior.
- [`specification/Technical/PostM25ContextualCausalLegibility.md`](../specification/Technical/PostM25ContextualCausalLegibility.md) — spoiler-safe contextual `Available because` dialogue explanation contract.
- [`specification/Technical/PostM25CrossDomainTraitBuildcraft.md`](../specification/Technical/PostM25CrossDomainTraitBuildcraft.md) — cross-domain semantic Trait application and capability-ownership boundaries.
- [`specification/Technical/PostM25ThirdHeterogeneousChapter.md`](../specification/Technical/PostM25ThirdHeterogeneousChapter.md) — `Enemies in Phase` as a third heterogeneous chapter projection over existing Lyra evidence.
- [`specification/Technical/PostM25CopyRoutineStrategy.md`](../specification/Technical/PostM25CopyRoutineStrategy.md) — player-authored bounded routine priority and explicit preferred-task delegation.

The post-M25 GameLoop timing/backpressure/lifecycle qualification records remain current for their stated technical scopes. Use [`specification/README.md`](../specification/README.md) for the complete current chain.

## Closed audit / program records

These records remain important provenance but are **not pending implementation queues**:

- [`specification/Technical/PostM25ImplementationRoadmap.md`](../specification/Technical/PostM25ImplementationRoadmap.md) — closed six-package post-M25 program record.
- [`specification/Technical/PostM25ThreeChapterFrictionAudit.md`](../specification/Technical/PostM25ThreeChapterFrictionAudit.md) — closed audit; R1–R3 were implemented by PR #108 and are represented by `PostM25ChapterDefinitionIntegrityRepair.md`.

## Reference

The following are useful but subordinate to the current authority chain:

- [`README.md`](../README.md) — repository orientation and entry links.
- [`specification/GameDesignDocument.md`](../specification/GameDesignDocument.md) — broad product/design intent.
- `specification/Features/`, `specification/Narrative/`, and `specification/UI_UX/` — feature, narrative, and UI/UX context unless explicitly promoted by the technical authority map.
- [`specification/Technical/ArchitectureOverview.md`](../specification/Technical/ArchitectureOverview.md) — legacy architecture reference only; its manual-only testing/CI statements are superseded.
- [`docs/analysis/`](analysis/) — architecture/component analyses and provenance.

## Historical evidence

Older milestone reports, checkpoint artifacts, PR handoffs, synthetic-review captures, and analysis files may remain valuable **HISTORICAL EVIDENCE** even after their active decision role ends. Preserve them for auditability; do not silently turn them back into implementation queues.

This includes Build Validation #335, whose failure is useful provenance for the chapter-integrity repair: it exposed an incomplete validator dialogue catalogue, not invalid chapter content. Build Validation #336 on exact head `458d1fead28fea3e92c33db5e8baee319d55c3ed` supersedes that candidate as qualification evidence.

## Explicitly superseded conclusions

The following records remain historical evidence, but their identified verdicts or assumptions are **SUPERSEDED**:

- [`specification/Technical/CheckpointBActiveRpgLoopResult.md`](../specification/Technical/CheckpointBActiveRpgLoopResult.md) — its first weak verdict is superseded by later repair/rerun PASS evidence.
- [`specification/Technical/CheckpointCIncrementalIntegrationResult.md`](../specification/Technical/CheckpointCIncrementalIntegrationResult.md) — its first weak verdict is superseded by later repair/rerun PASS evidence.
- [`specification/Technical/ArchitectureOverview.md`](../specification/Technical/ArchitectureOverview.md) statements that testing is manual-only or that authoritative CI is absent — superseded by current Build Validation, `RUNBOOK.md`, and accumulated qualification history.
- Candidate-only milestone handoff PR #98 — superseded by the integrated handoff and current `STATUS.md`.
- Former `.github/workflows/gemini-review.yml`, `gemini.md`, and `GEMINI_API_KEY` dependence — retired; deterministic Build Validation is current merge authority.
- Any old post-M25 queue that treats timing-hardening Packages 1–3, content intelligence, Archive Inquiry, Player Insight, Rule-of-Two extraction, contextual causality, cross-domain Trait buildcraft, the third chapter, Copy routine priority, Product Direction decision-readiness preparation, or chapter-integrity R1–R3 as pending.
- The former test assumption that the repository must contain exactly two chapter definitions. Archive Inquiry remains the qualified second chapter, but later heterogeneous chapter projections are valid.

A `SUPERSEDED` label applies to the identified conclusion/scope, not necessarily every historical fact in the file.

## Current unresolved human authority gate

Issue #109 — **Human Integrated Playability / Product Review** — is intentionally unresolved. Only genuine fresh human evidence can satisfy it. Automated tests, synthetic UI smoke, repository inspection, or an LLM-authored opinion must not be relabeled as human product evidence.

Until that evidence exists:

```text
Product Direction Decision: PENDING
M26: NOT AUTHORIZED
```

## Product-evidence ceiling

Repository qualification does **not** prove:

- fresh-player comprehension or discoverability;
- perceived responsiveness;
- causal terminology comprehension;
- pacing quality;
- fairness or final balance;
- enjoyment;
- retention / desire to continue;
- generalized campaign scalability;
- production-device/background behavior outside the qualified envelope;
- a final Product Direction decision;
- M26 authorization.

If human validation is unavailable, repository-only or hermetic work may continue only after a fresh reconciliation identifies a legitimate bounded bottleneck. Claims must remain below this evidence ceiling.

## Maintenance rule

When a change creates, supersedes, or materially reinterprets an authoritative document:

1. update this index in the same package or milestone handoff;
2. update `STATUS.md` if repository state/authority changed;
3. update `RUNBOOK.md` if operating or qualification procedure changed;
4. keep `README.md` concise and navigational;
5. preserve historical records rather than silently rewriting them into current-looking documents;
6. run `npm run docs:authority:validate` before merge;
7. if `main` moves before merge, reconcile the candidate and re-run Build Validation on the exact new head.
