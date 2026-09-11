# Documentation Authority Index

**Status:** CURRENT AUTHORITY for document classification  
**Reconciled from `main`:** `56fbee2758ba734f1db67f40230a0970d67fd531`  
**Purpose:** prevent historical or superseded repository prose from being mistaken for current product, architecture, implementation, or CI authority.

This file classifies repository documentation by authority. It does **not** move or delete historical records. Older documents remain valuable evidence, but their age, location, or level of detail does not make them current authority.

## Required reading order

For a new engineering or coding-agent session, read in this order:

1. [`STATUS.md`](../STATUS.md) — current repository state, completed work, open authority gates, and next decisions.
2. [`docs/CURRENT.md`](CURRENT.md) — this classification index; determines how to interpret the rest of the documentation corpus.
3. [`RUNBOOK.md`](../RUNBOOK.md) — operational commands, CI procedure, exact-head qualification, and integration rules.
4. [`specification/README.md`](../specification/README.md) — technical/product authority map and domain-specific source chain.
5. The specific current contract/result documents named by those indexes for the concern being changed.
6. Historical or reference documents only as needed for provenance or context.

`README.md` is orientation, not the final authority for a disputed technical or product question.

## Classification vocabulary

### CURRENT AUTHORITY

A document that may be used to determine present repository state, an active contract, an accepted design boundary, or the current decision/evidence ceiling for its stated scope.

### REFERENCE

Useful context, architecture explanation, design intent, or contributor guidance that remains helpful but is subordinate to current reconciliations, accepted contracts, result documents, executable behavior, and tests.

### HISTORICAL EVIDENCE

A durable record of a prior experiment, qualification, milestone, PR, CI run, or decision state. Historical evidence may explain why the current contract exists, but it must not be treated as the current state when later authority supersedes it.

### SUPERSEDED

A document or verdict whose current-decision role has been explicitly replaced. Retain it for provenance; do not use its superseded conclusion to drive new implementation.

## Conflict-resolution rule

Documentation authority is **scope-sensitive**, not simply newest-file-wins.

When two documents appear to conflict:

```text
current STATUS / this authority index
-> explicitly ratified current contract or result for the affected scope
-> specification/README authority chain
-> current feature/domain specification
-> repository implementation + executable qualification evidence
-> reference documents
-> historical evidence
-> superseded conclusions
```

If the conflict still cannot be resolved, stop treating either prose statement as authoritative and perform a bounded reconciliation before changing production behavior.

A newer implementation does not automatically invalidate a still-current product boundary, and a newer prose file does not automatically override an explicitly accepted technical contract.

## Current authority matrix

| Concern | Classification | Current source(s) | Notes |
| --- | --- | --- | --- |
| Repository/milestone state | CURRENT AUTHORITY | [`STATUS.md`](../STATUS.md) | First source for what is complete, pending, unproven, or unauthorized. |
| Documentation classification | CURRENT AUTHORITY | [`docs/CURRENT.md`](CURRENT.md) | Determines how older repository documents should be interpreted. |
| Operational/CI procedure | CURRENT AUTHORITY | [`RUNBOOK.md`](../RUNBOOK.md), [`.github/workflows/build-validation.yml`](../.github/workflows/build-validation.yml) | Workflow file is executable CI truth; RUNBOOK explains intended use. |
| Technical authority map | CURRENT AUTHORITY | [`specification/README.md`](../specification/README.md) | Routes to current domain-specific contracts/results. |
| M25 integrated product capability | CURRENT AUTHORITY | [`specification/Technical/M25CompleteChapterVerticalSliceResult.md`](../specification/Technical/M25CompleteChapterVerticalSliceResult.md) | Bounded complete-chapter composition; does not prove human product quality. |
| Post-M25 product boundary | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ProductDirection.md`](../specification/Technical/PostM25ProductDirection.md) | Current hypotheses and evidence boundary. It explicitly does **not** authorize M26. |
| Scheduler async backpressure | CURRENT AUTHORITY | [`specification/Technical/GameLoopAsyncTickBacklogPolicyContract.md`](../specification/Technical/GameLoopAsyncTickBacklogPolicyContract.md), [`specification/Technical/GameLoopBoundedBacklogControlRepair.md`](../specification/Technical/GameLoopBoundedBacklogControlRepair.md) | `SERIAL_BACKPRESSURE_V1`. |
| GameLoop lifecycle remainder | CURRENT AUTHORITY | [`specification/Technical/GameLoopLifecycleRemainderPolicy.md`](../specification/Technical/GameLoopLifecycleRemainderPolicy.md) | `FRESH_LOOP_RESET_V1`. |
| Composed post-M25 timing model | CURRENT AUTHORITY | [`specification/Technical/GameLoopUnifiedTimingHardeningCompositionQualification.md`](../specification/Technical/GameLoopUnifiedTimingHardeningCompositionQualification.md), [`specification/Technical/GameLoopBackpressureCadenceProgressionStressQualification.md`](../specification/Technical/GameLoopBackpressureCadenceProgressionStressQualification.md) | Composition/stress authority; no implicit widening to new background/offline policy. |
| Timed-Quest unit/precision semantics | CURRENT AUTHORITY | [`specification/Technical/GameLoopTimedQuestPrecisionResolution.md`](../specification/Technical/GameLoopTimedQuestPrecisionResolution.md), [`specification/Technical/GameLoopQuestTimingIntegrationQualification.md`](../specification/Technical/GameLoopQuestTimingIntegrationQualification.md) | Comparison-only precision handling; raw/persisted values remain unchanged. |
| Offline progression | CURRENT AUTHORITY | [`specification/Technical/M21BoundedOfflineProgressResult.md`](../specification/Technical/M21BoundedOfflineProgressResult.md) | Positive allowlist remains bounded; timed Quests remain online-only. |
| Repository merge authority | CURRENT AUTHORITY | [`STATUS.md`](../STATUS.md), [`RUNBOOK.md`](../RUNBOOK.md), [`.github/workflows/build-validation.yml`](../.github/workflows/build-validation.yml) | Deterministic Build Validation + preregistered acceptance criteria + explicitly declared authoritative gates. AI review is advisory unless deliberately re-authorized. |

## Reference matrix

These documents are useful, but they must be read through the current authority chain above.

| Document/group | Classification | Use |
| --- | --- | --- |
| [`README.md`](../README.md) | REFERENCE | Repository orientation, setup, current high-level state, and entry links. |
| [`specification/GameDesignDocument.md`](../specification/GameDesignDocument.md) | REFERENCE | Broad product/design intent; later reconciliations and bounded result documents may refine it. |
| [`specification/Features/`](../specification/Features/) | REFERENCE unless specifically promoted by `specification/README.md` | Domain explanations and feature-level intent. |
| [`specification/Requirements/`](../specification/Requirements/) | REFERENCE unless explicitly ratified by a current authority document | Requirement history and scope context. |
| [`specification/Narrative/`](../specification/Narrative/) | REFERENCE | Narrative/content context; not repository implementation-status authority. |
| [`specification/UI_UX/`](../specification/UI_UX/) | REFERENCE | UI/UX design context; human product quality claims still require the appropriate evidence gate. |
| [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) | REFERENCE | Contributor conventions; subordinate to current code, accepted contracts, and explicit repository governance. |

## Historical evidence matrix

| Document/group | Classification | Interpretation |
| --- | --- | --- |
| [`docs/analysis/`](analysis/) | HISTORICAL EVIDENCE / REFERENCE | Earlier architecture/component analyses. Useful for provenance; do not treat them as present-state authority without fresh verification. |
| [`specification/Technical/PostM17MilestoneRoadmap.md`](../specification/Technical/PostM17MilestoneRoadmap.md) | HISTORICAL EVIDENCE | Completed execution program that culminated in M25; it is not the active roadmap for M26. |
| Preflight, recon, qualification and result records under [`specification/Technical/`](../specification/Technical/) | HISTORICAL EVIDENCE unless listed as CURRENT AUTHORITY above or promoted by `specification/README.md` | Preserve experiment/decision provenance and evidence ceilings. |
| Closed/merged PR descriptions and GitHub Actions runs | HISTORICAL EVIDENCE | Immutable integration and qualification evidence; not a substitute for current `main` state. |
| Historical Gemini `API_KEY_INVALID` runs | HISTORICAL EVIDENCE | Explain prior merge blockage only. Gemini CI has been retired and is not a current gate. |

## Explicitly superseded conclusions

The following records remain valuable history, but their **verdicts** have been replaced:

| Document / record | Classification | Superseded by |
| --- | --- | --- |
| [`specification/Technical/CheckpointBActiveRpgLoopResult.md`](../specification/Technical/CheckpointBActiveRpgLoopResult.md) — first `CHECKPOINT_B_WEAK` verdict | SUPERSEDED | [`specification/Technical/ActiveRpgLoopIntegrationRepairResult.md`](../specification/Technical/ActiveRpgLoopIntegrationRepairResult.md) + [`specification/Technical/CheckpointBActiveRpgLoopRerunResult.md`](../specification/Technical/CheckpointBActiveRpgLoopRerunResult.md) (`CHECKPOINT_B_PASS`). |
| [`specification/Technical/CheckpointCIncrementalIntegrationResult.md`](../specification/Technical/CheckpointCIncrementalIntegrationResult.md) — first `CHECKPOINT_C_WEAK` verdict | SUPERSEDED | [`specification/Technical/IncrementalIntegrationRepairResult.md`](../specification/Technical/IncrementalIntegrationRepairResult.md) + [`specification/Technical/CheckpointCIncrementalIntegrationRerunResult.md`](../specification/Technical/CheckpointCIncrementalIntegrationRerunResult.md) (`CHECKPOINT_C_PASS`). |
| `specification/Technical/ArchitectureOverview.md` statements that automated tests are not required and that validation is manual-only | SUPERSEDED for testing/CI claims | Current Build Validation, `RUNBOOK.md`, `STATUS.md`, and post-M14+ qualification history. Treat the file as legacy architecture reference only until it is separately reconciled. |
| Candidate-only milestone handoff in PR #98 | SUPERSEDED | Integrated handoff merged by PR #99 and current `STATUS.md`. |
| Former `.github/workflows/gemini-review.yml` / `gemini.md` | SUPERSEDED / REMOVED | Deterministic Build Validation and current CI-governance policy. |

A `SUPERSEDED` label here applies to the identified conclusion/scope. It does not imply the entire historical record is useless or false.

## Product-evidence ceiling

No documentation classification may promote repository evidence beyond what the current product authority permits.

At this reconciliation point, repository qualification does **not** prove:

- fresh-player comprehension or discoverability;
- perceived responsiveness;
- pacing quality;
- fairness or final balance;
- enjoyment;
- retention / desire to continue;
- generalized campaign/chapter scalability;
- production-device/background behavior outside the qualified envelope;
- a final Product Direction decision;
- M26 authorization.

If human validation is unavailable, repository-only or hermetic work may continue when a fresh reconciliation identifies a legitimate bounded bottleneck, but claims must remain below this evidence ceiling.

## Maintenance rule

When a change creates, supersedes, or materially reinterprets an authoritative document:

1. update this index in the same package or milestone handoff;
2. update `STATUS.md` if repository state/authority changed;
3. update `RUNBOOK.md` if operating or qualification procedure changed;
4. keep `README.md` concise and navigational;
5. preserve historical records rather than silently rewriting them into current-looking documents;
6. run `npm run docs:authority:validate` before merge;
7. if `main` moves before merge, reconcile the candidate and re-run Build Validation on the exact new head.

## Non-goals

This authority index does not:

- authorize new gameplay or M26;
- replace domain-specific specifications;
- assert that every old document has been semantically audited line-by-line;
- require moving historical files into archive folders;
- permit deleting evidence simply because it is superseded;
- turn documentation into evidence of human product quality.
