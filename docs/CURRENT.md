# Documentation Authority Index

**Status:** CURRENT AUTHORITY for document classification  
**Reconciled base before GC-12 merge:** `02f06426e05c345380e51ae19a1061b5ed5e1bb2`  
**Current maturity:** CONTENT_ALPHA / HUMAN-UNVALIDATED  
**Current strategic stage:** FEATURE_COMPLETION / PRODUCT_DEPTH  
**Last reconciled:** 2026-09-23

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

1. [`AGENTS.md`](../AGENTS.md) — repository-wide agent behavior and evidence-to-authority policy.
2. [`STATUS.md`](../STATUS.md) — current state, active lanes, evidence ceiling.
3. [`docs/CURRENT.md`](CURRENT.md) — this classification index.
4. [`HANDOFF.md`](../HANDOFF.md) — current re-entry summary; subordinate to the authorities below where scope differs.
5. [`specification/GameCompletionDefinition.md`](../specification/GameCompletionDefinition.md) — the product-level 1.0 definition and stop condition.
6. [`specification/Features/FeatureScopeMatrix.md`](../specification/Features/FeatureScopeMatrix.md) — what 1.0 includes, minimizes, defers, or cuts.
7. [`specification/Progression/GameProgressionArc.md`](../specification/Progression/GameProgressionArc.md) and [`specification/Narrative/CampaignArchitecture.md`](../specification/Narrative/CampaignArchitecture.md) — progression and campaign scope.
8. [`specification/Technical/GameCompletionRoadmap.md`](../specification/Technical/GameCompletionRoadmap.md) — active implementation program.
9. [`RUNBOOK.md`](../RUNBOOK.md) — operating / qualification procedure.
10. [`specification/README.md`](../specification/README.md) — domain-specific authority map.
11. The specific current contract/result records relevant to the active package.
12. Reference / historical evidence only as needed.

[`CLAUDE.md`](../CLAUDE.md) is a thin adapter to `AGENTS.md`; it is not an independent source of policy.

`README.md` is orientation, not final technical or product authority.

## Conflict-resolution rule

Authority is scope-sensitive:

```text
AGENTS (agent behavior / evidence-to-authority)
+ STATUS / docs/CURRENT (state / classification)
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
| Agent operating policy | CURRENT AUTHORITY | [`AGENTS.md`](../AGENTS.md) | Defines evidence classes, work authorization, scope lock, and stop conditions for coding agents. |
| Claude adapter | ORIENTATION / NON-INDEPENDENT | [`CLAUDE.md`](../CLAUDE.md) | Delegates to `AGENTS.md`; must not duplicate mutable repository state or policy. |
| Repository state | CURRENT AUTHORITY | [`STATUS.md`](../STATUS.md) | First source for complete/pending/unproven work. |
| Documentation classification | CURRENT AUTHORITY | [`docs/CURRENT.md`](CURRENT.md) | This file. |
| Current handoff / re-entry | CURRENT AUTHORITY, summary | [`HANDOFF.md`](../HANDOFF.md) | Feature Completion / Product Depth re-entry summary; historical GC/Beta-readiness evidence is preserved but no longer defines the active optimization target. |
| 1.0 completion / stop condition | CURRENT AUTHORITY | [`specification/GameCompletionDefinition.md`](../specification/GameCompletionDefinition.md) | Defines the smallest complete Campaign One / 1.0. |
| 1.0 feature scope + maturity | CURRENT AUTHORITY | [`specification/Features/FeatureScopeMatrix.md`](../specification/Features/FeatureScopeMatrix.md) | Core/minimal/deferred/cut decisions plus current L0-L6 feature-maturity interpretation. |
| Whole-game progression | CURRENT AUTHORITY | [`specification/Progression/GameProgressionArc.md`](../specification/Progression/GameProgressionArc.md) | Personal action -> specialization -> networked mastery -> strategic synthesis. |
| Campaign One structure | CURRENT AUTHORITY | [`specification/Narrative/CampaignArchitecture.md`](../specification/Narrative/CampaignArchitecture.md) | Prologue + Ch1–7 + finale + epilogue. |
| Active implementation program | CURRENT AUTHORITY | [`specification/Technical/GameCompletionRoadmap.md`](../specification/Technical/GameCompletionRoadmap.md) | Preserves GC-00→GC-14 history and inserts Feature Completion / Product Depth before Beta activation; no automatic M27/GC-15. |
| Feature-completion breadth analysis | CURRENT STRATEGIC ANALYSIS | [`specification/Technical/FeatureCompletionGapAnalysis.md`](../specification/Technical/FeatureCompletionGapAnalysis.md) | Completed L0-L6 breadth scan; selects Candidate B Copy/Mastery Compression, then Candidate A buildcraft and Candidate C strategic consequence composition for depth investigation. |
| Alpha definition | CURRENT AUTHORITY | [`specification/Technical/AlphaCompletionContract.md`](../specification/Technical/AlphaCompletionContract.md) | Whole structural game playable New Game -> Epilogue. |
| Beta definition | CURRENT AUTHORITY | [`specification/Technical/BetaCompletionContract.md`](../specification/Technical/BetaCompletionContract.md) | Content locked + human product evidence + UX/balance/reliability. |
| Release / 1.0 qualification | CURRENT AUTHORITY | [`specification/Technical/ReleaseQualificationContract.md`](../specification/Technical/ReleaseQualificationContract.md) | Exact production candidate, browser/full-run/recovery evidence. Existing `docs/release/` records are preparation/reference until GC-13/GC-14 entry conditions are met. |
| Operating / CI procedure | CURRENT AUTHORITY | [`RUNBOOK.md`](../RUNBOOK.md), [`.github/workflows/build-validation.yml`](../.github/workflows/build-validation.yml) | Workflow is executable CI truth; RUNBOOK explains intended use. |
| Domain authority map | CURRENT AUTHORITY | [`specification/README.md`](../specification/README.md) | Routes to current technical/domain records. |
| Provisional governance boundary | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ProvisionalGovernanceDecision.md`](../specification/Technical/PostM25ProvisionalGovernanceDecision.md) | Allows bounded reversible human-unvalidated product development; does not create human evidence. |
| Provisional Product Direction | CURRENT AUTHORITY, bounded | [`specification/Technical/PostM25ProvisionalProductDirectionDecision.md`](../specification/Technical/PostM25ProvisionalProductDirectionDecision.md) | Relationship-derived capability buildcraft + causal legibility + earned delegation. |
| Relationship Capability Constellation | CURRENT AUTHORITY, bounded / HUMAN-UNVALIDATED | [`specification/Technical/RelationshipCapabilityConstellation.md`](../specification/Technical/RelationshipCapabilityConstellation.md) | Separates durable learned Traits from Player-owned doctrine focus; exposes a bounded player-facing selection/legibility surface; GC06 consumes active doctrine while later pair routes remain unchanged pending evidence. |
| Copy standing responsibility / exception escalation | CURRENT AUTHORITY, bounded / HUMAN-UNVALIDATED | [`specification/Technical/CopyStandingOrdersAndExceptionEscalationResult.md`](../specification/Technical/CopyStandingOrdersAndExceptionEscalationResult.md), [`specification/Features/CopySystem.md`](../specification/Features/CopySystem.md) | Explicit owner-directed scope revision: Archive Verification may maintain typed live work; generic queues/planners, offline chaining, and irreversible Copy decisions remain CUT. |
| M26 result | CURRENT AUTHORITY, integrated | [`specification/Technical/M26ProvisionalProductDepthResult.md`](../specification/Technical/M26ProvisionalProductDepthResult.md) | Exact-head #340 PASS; M26 closed. |
| GC-01 player-surface cleanup | CURRENT AUTHORITY, integrated | [`specification/Technical/GC01PlayerSurfaceScopeCleanupResult.md`](../specification/Technical/GC01PlayerSurfaceScopeCleanupResult.md) | Exact-head #343 PASS; PR #117 merged; cut/deferred placeholders no longer primary 1.0 surfaces. |
| GC-02 Prologue / onboarding | CURRENT AUTHORITY, integrated | PR #120 + `npm run gc02:validate` | Exact-head #352 PASS; fresh-save Willow First Lesson path integrated. |
| GC-03 opening campaign spine | CURRENT AUTHORITY, integrated | [`specification/Technical/GC03OpeningCampaignSpineResult.md`](../specification/Technical/GC03OpeningCampaignSpineResult.md) | Exact-head #353 PASS; Prologue -> Chapters 1-3 now one legal derived production sequence. |
| GC-04/05 breadth | CURRENT AUTHORITY, integrated | `npm run gc0405:validate` + PR #126 | Capability/buildcraft and earned-delegation floors integrated. |
| GC-06–GC-10 campaign completion | CURRENT AUTHORITY, integrated | `npm run gc06:validate` through `npm run gc10:validate` | Chapters 4-7, finale and state-responsive epilogue integrated. |
| GC-11 Alpha | CURRENT AUTHORITY, integrated | [`specification/Technical/GC11AlphaResult.md`](../specification/Technical/GC11AlphaResult.md) | Exact-head Build Validation #381 PASS; ALPHA_PASS / HUMAN_UNVALIDATED. |
| GC-12 Content Alpha | CURRENT AUTHORITY, integrated | [`specification/Technical/GC12ContentAlphaResult.md`](../specification/Technical/GC12ContentAlphaResult.md) | Authored-corpus qualification passed; CONTENT_ALPHA / HUMAN_UNVALIDATED. |
| GC-13 deterministic Beta readiness | CURRENT AUTHORITY, qualified | [`specification/Technical/GC13BetaTechnicalReadinessResult.md`](../specification/Technical/GC13BetaTechnicalReadinessResult.md) | Build Validation #394 PASS; Chromium + Firefox CI smoke PASS; TECHNICAL_BETA_READY / HUMAN_EVIDENCE_BLOCKED. |
| GC-13 Beta human evidence | CURRENT FUTURE EXTERNAL GATE | [`specification/Technical/BetaCompletionContract.md`](../specification/Technical/BetaCompletionContract.md) + issue #109 + [`docs/release/BetaHumanEvidenceTemplate.md`](release/BetaHumanEvidenceTemplate.md) | 0/5 first-session and 0/3 external full-run records; BETA_PASS = NO. |
| GC-14 release eligibility guard | CURRENT AUTHORITY, qualified | [`specification/Technical/GC14ReleaseEligibilityBlockedResult.md`](../specification/Technical/GC14ReleaseEligibilityBlockedResult.md) | Build Validation #405 PASS; deterministic release preparation is safe, but RC_ENTRY_BLOCKED and 1.0_PROMOTION_BLOCKED until governing external gates pass. |
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
- `PostM25CopyRoutineStrategy.md` — historical one-shot routine-priority baseline, extended by current standing-order authority;
- `CopyStandingOrdersAndExceptionEscalationResult.md` — bounded live condition maintenance + durable exception escalation;
- `M26ProvisionalProductDepthResult.md` — visible capability/mastery/delegation provenance;
- `../docs/release/BetaExecutionRunbook.md` — operational human-evidence collection, classification, repair routing and promotion sequence;
- `GC01PlayerSurfaceScopeCleanupResult.md` — integrated 1.0 player-surface cleanup and rejection qualification;
- `GC03OpeningCampaignSpineResult.md` — integrated Prologue -> Chapters 1-3 production spine and bounded cast-unlock qualification.

Use [`specification/README.md`](../specification/README.md) for the broader domain map.

## Current maturity interpretation

Historical documents and package metadata may still contain the word **prototype**. That is not a current maturity verdict. Likewise, the private package prerelease label `0.9.0-beta.1` is historical/tooling metadata and does not constitute `BETA_PASS`; maturity authority comes from the completion records below.

Current maturity is:

```text
CONTENT_ALPHA / HUMAN-UNVALIDATED
TECHNICAL_BETA_READY
HUMAN_EVIDENCE_BLOCKED
BETA_PASS = NO
TECHNICAL_RELEASE_PREPARED
RC_ENTRY_BLOCKED
1.0_PROMOTION_BLOCKED
```

The repository has passed proof-of-concept, systems-prototype, whole-game Alpha,
and Content Alpha qualification. Build Validation #394 established the GC-13
repository-controlled Beta engineering baseline, including Chromium 153 and
Firefox 155 visible-UI smoke on Linux CI, canonical recovery behavior, timing /
offline contracts, TypeScript, and production build. The later pre-Beta
player-surface candidate `4a64d8d53aea1a9c3385894ac89af570dec778d7` re-ran the
full Build Validation chain successfully as #419 / run `35680087869` before PR #139
merged to `main`.

This does not satisfy Beta. Issue #109 remains the current human-evidence gate:
5 accepted fresh-player first sessions and 3 accepted external full fresh-save
playthroughs are still required. Repository automation must not be relabeled as
that evidence.

Two responsibilities now run concurrently:

1. collect the genuine human Beta evidence required by the current promotion contract; and
2. continue bounded repository-answerable hardening of the already-authorized Campaign One when deterministic, heuristic, synthetic, accessibility, reliability, presentation, pacing, balance, persistence, or release-readiness evidence identifies a concrete improvement.

The human-evidence gate limits human-experience claims; it is not a universal implementation freeze.

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

Issue #109 remains open and owns the current genuine-human Beta obligation. Non-human evidence must never be relabeled as accepted human observation.

Evidence classes have different claim ceilings:

- **deterministic findings** establish implementation/runtime behavior within exercised evidence;
- **heuristic findings** identify plausible UX, accessibility, pacing, presentation, terminology, or design risks;
- **synthetic findings** identify reproducible automated/simulated player-facing risks;
- **human findings** support actual participant-experience claims within the recorded sessions.

Automated tests, synthetic UI observation, code review and repository analysis do **not** establish actual:

- fresh-player comprehension/discoverability;
- perceived pacing;
- perceived fairness/final balance;
- enjoyment;
- emotional impact;
- retention/desire to continue;
- market preference.

That claim boundary does not prohibit bounded repair work. Deterministic, heuristic and synthetic evidence may justify improvements to the existing 1.0 scope while the human lane remains open.

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
- any old feature placeholder that implies Skills, Crafting, general Inventory, or a duplicate save system must ship in 1.0;
- any statement that those cut/deferred placeholder routes remain active player-facing Campaign One surfaces after GC-01.

A `SUPERSEDED` label applies to the identified conclusion/scope, not necessarily every historical fact in the file.

## Maintenance rule

When work creates, supersedes or materially reinterprets authority:

1. update/create the affected domain/completion contract;
2. update this index in the same handoff;
3. update `STATUS.md` when repository state or queue changes;
4. update `RUNBOOK.md` when commands/procedure changes;
5. update `AGENTS.md` when repository-wide agent behavior or evidence-to-authority policy changes;
6. keep `CLAUDE.md` as a thin adapter rather than a second policy source;
7. keep `README.md` navigational;
8. update `specification/README.md` when authority routing changes;
9. preserve historical evidence instead of deleting useful provenance;
10. run `npm run docs:authority:validate`;
11. require exact-head Build Validation before merge.

## Governing rule

> **A future package must improve an already-authorized Campaign One / release surface through a named requirement or a concrete deterministic, heuristic, synthetic, or human finding. Technical possibility alone is not authorization; missing human evidence alone is not a universal stop condition.**
