# Handoff — Feature Completion / Product Depth

**Handoff status:** CURRENT RE-ENTRY AUTHORITY  
**Reconciled baseline before this activation package:** `fbc19da437c0cfc7b0cd6dd9078741bc8b19f9f3`  
**Current maturity:** `FEATURE_COMPLETE / HUMAN-UNVALIDATED`  
**Deterministic readiness:** `TECHNICAL_BETA_READY`  
**Release preparation:** `TECHNICAL_RELEASE_PREPARED / RC_ENTRY_BLOCKED / 1.0_PROMOTION_BLOCKED`  
**Current strategic stage:** `BETA_CONVERGENCE / HUMAN_VALIDATION`  
**Current product responsibilities:** Beta convergence / human validation on the existing feature-complete Campaign One  
**Current human evidence:** `0 / 5` accepted first sessions; `0 / 3` accepted external full playthroughs  
**Operator procedure:** `docs/release/BetaExecutionRunbook.md`

## Current re-entry frontier

PR #154 merged the second materially distinct Mastery Compression standing responsibility.
Archive Verification and Forge Assistance now differ by role/location context, work type,
and exception family while preserving player-owned resolution. Candidate B therefore
passes its bounded exit test; do not add a third standing responsibility unless later
evidence shows genuinely different player value.

## Feature-completion stop boundary — 2026-09-26

The B -> A -> C repository construction sequence has converged and the Candidate-A exact head qualified before PR #156 merged as `fd94adef92b30124e9d96e722f0d60ead811c4fa`:

- **B:** Archive + Forge standing responsibilities provide distinct role/location work
  and exception families; do not add a third by symmetry.
- **A:** existing capabilities/doctrines now repeat across GC06/GC08/GC09/GC10 with
  single-capability independent use, visible provenance, and finale payoff.
- **C:** existing GC08-GC10 authored decisions already compose Relationship, Knowledge,
  Faction, World State, build and delegation deeply enough for Campaign One; no generic
  strategy simulator is warranted.

The next lane is the already-defined human Beta/product-validation
and convergence work. Preserve `TECHNICAL_BETA_READY` while keeping `BETA_PASS=NO`
until the governing human evidence exists.

## Repository reality

Campaign One is structurally and authorially complete from New Game through the state-responsive Epilogue.

That sentence describes **campaign-spine and integration completeness**, not a claim that every core gameplay feature is at finished-game depth. The GC records below remain valid historical qualification; several associated systems are still L1/L2 bounded implementations and may be deepened without reopening or rewriting those milestones.

```text
GC-00  completion-program authority                  COMPLETE
GC-01  1.0 player-surface cleanup                    COMPLETE
GC-02  Prologue / onboarding                         COMPLETE
GC-03  Chapters 1-3 campaign integration             COMPLETE
GC-04  relationship-derived buildcraft breadth       COMPLETE
GC-05  earned-delegation breadth                     COMPLETE
GC-06  Chapter 4 — Lattice Under Strain              COMPLETE
GC-07  Chapter 5 — The Chrono-Crypt                  COMPLETE
GC-08  Chapter 6 — Network Under Pressure            COMPLETE
GC-09  Chapter 7 — Counterphase                      COMPLETE
GC-10  Finale + state-responsive Epilogue            COMPLETE
GC-11  Alpha qualification                           COMPLETE
GC-12  Content Alpha                                 COMPLETE
GC-13  deterministic Beta readiness                  QUALIFIED
GC-13  genuine human Beta evidence                   OPEN
GC-14  release-promotion guard                       QUALIFIED
GC-14  immutable RC / final 1.0 promotion            BLOCKED
```

Do not reopen closed GC packages as if their historical contracts failed. Instead, deepen the current gameplay domains directly when feature-maturity analysis shows that the bounded implementation is still below L4.

PR #139 completed the bounded pre-Beta player-surface hygiene pass without expanding scope: normal NPC/Essence pages no longer expose prototype/debug mutations, the Dashboard/Character surfaces no longer advertise deferred or internal concepts, Settings no longer exposes no-op import/export actions, and the unreachable legacy `GamePage` reset surface is removed. Exact head `4a64d8d53aea1a9c3385894ac89af570dec778d7` passed Build Validation #419 / run `35680087869`; GC-01 regression coverage owns these rejection checks.

A bounded Trait depth-repair package also repairs the existing capability foundation without changing the active Candidate-B frontier: Resonance-level slot unlocks are enforced in Player state, permanent Resonance cost is owned by the Trait catalogue, shared readiness drives runtime plus the general Traits/Codex surfaces, and the Campaign One Trait Catalogue Audit explicitly separates the four authored capability Traits from legacy/deferred perk metadata. Focused validation is `npm run trait-depth:validate`.

The follow-on Trait coherence package closes the player-facing authority seams discovered by catalogue analysis. Deferred-only Traits and shared-runtime-only Traits can no longer spend Essence to become permanent Player Traits; `EssenceFlow` now describes its actual Copy-only runtime scope; NPC sharing accepts only equipped non-permanent Traits; temporary slots are explicitly experimentation/share staging; and GC08 distributed preparation independently consumes `ConstraintSense` and `AdversarialCalibration` without weakening the two established doctrines. No new Trait catalogue, generic capability graph, presets program, or automatic doctrine generation was added.

The bounded Relationship Capability Constellation now has one qualified player-facing vertical slice without promoting the deferred generic capability graph. Runtime derivation remains limited to **Structural Steward** and **Countermodeler**; the Traits surface exposes eligible Adopt / Switch / Clear controls with learned-Trait provenance, and Player Insight reports the active doctrine. GC06, GC08 preparation, and GC10 finale now require the matching active doctrine where current strategic posture is materially meaningful; GC07 and GC09 intentionally retain qualified permanent-Trait-pair gates to avoid repetitive switching friction. Save schema v2 persists focus without inventing specialization for old saves. Human comprehension, switching value and preference remain unproven.

## Current campaign spine

```text
New Game
-> Prologue / Elder Willow First Lesson
-> Chapter 1 — Merchant District Crisis
-> Chapter 2 — Archive Inquiry
-> Chapter 3 — Enemies in Phase
-> Chapter 4 — Lattice Under Strain
-> Chapter 5 — The Chrono-Crypt
-> Chapter 6 — Network Under Pressure
-> Chapter 7 — Counterphase
-> Finale — The Telluric Echo
-> state-responsive Epilogue
```

Campaign One ends on the isolated planet. Chapters 8+, interplanetary continuation, the larger AI-war thread and New Game+ remain post-1.0 unless current authority is explicitly revised.

## Product promise

> A narrative incremental RPG in which consequential relationships teach the protagonist durable capabilities, remembered history explains why later options exist, and personally understood repetitive work can be deliberately delegated so the player increasingly focuses on novel strategic and relational decisions.

Current provisional hierarchy:

```text
Primary promise      -> relationship-derived capability buildcraft
Supporting identity  -> causal legibility
Incremental identity -> earned delegation / mastery compression
Architecture         -> heterogeneous authored composition
```

This remains human-unvalidated. Deterministic qualification does not prove comprehension, pacing, fun, fairness, emotional impact, retention or preference.

## Current responsibilities

### Primary lane — feature completion / product depth

The Feature Completion Gap Analysis is complete in [`specification/Technical/FeatureCompletionGapAnalysis.md`](specification/Technical/FeatureCompletionGapAnalysis.md), and [`specification/Technical/FeatureCompleteResult.md`](specification/Technical/FeatureCompleteResult.md) records the construction stop. Candidate B is bounded-converged, Candidate A qualified and merged through PR #156 / Build Validation #477, and Candidate C is sufficient through existing GC08-GC10 composition. There is **no open feature-construction frontier**; the active lane is Beta convergence / human validation.

Prioritize missing gameplay depth such as:

- meaningful progression and variation inside existing systems;
- broader, authored use of relationship-derived capabilities;
- Mastery Compression that changes player attention across more than one narrow slice;
- useful cross-system interactions among Relationship, Traits, Knowledge, Faction, World State, Quest, Copy, Exploration, and Combat;
- player-facing consequences that make those systems feel like game features rather than state authorities.

Do not assume every system must become large. The purpose of the gap analysis is also to identify systems already sufficient for their supporting role.

### Secondary lane — human evidence / future Beta gate

Issue #109 remains the canonical human product-evidence backlog. Existing and future genuine sessions remain useful evidence, but their absence does not block current feature construction and their collection does not convert an L1/L2 feature into an L4 feature.

The current Beta contract still requires at least 5 accepted first sessions and 3 accepted external full playthroughs before `BETA_PASS`. That evidence lane is now active because `FEATURE_COMPLETE` has been recorded; do not fabricate or substitute automated evidence for those sessions.

## Scope boundary, not depth freeze

Preserve the bounded Campaign One product boundary:

- no Chapters 8+ or interplanetary continuation;
- no generic Skills or Crafting;
- no generalized ChapterEngine / narrative DSL without repeated concrete need;
- no autonomous irreversible Copy planning;
- no generalized simulation or New Game+ merely to create work.

Inside that boundary, feature depth is explicitly open. A historical vertical-slice or integration PASS is permission to build on a proven foundation, not a command to stop development.

Use `AGENTS.md`, `GameCompletionDefinition.md`, and `FeatureScopeMatrix.md` for the maturity model and work-selection rules.

## Release path after BETA_PASS

```text
BETA_PASS
-> intentionally version one immutable 1.0.0-rc.N candidate
-> exact-head Build Validation
-> full ordinary-UI New Game -> Epilogue qualification
-> representative divergent-history qualification
-> save/load/recovery/import-export qualification
-> Chromium + Firefox exact-RC evidence
-> deployment/static-host evidence
-> no release-blocking Known Defect
-> final promotion eligibility
-> 1.0.0
```

The GC-14 guard must continue to fail closed until these authorities are satisfied.

## Governance boundary

Issue #122 remains open: repository policy requires exact-head Build Validation before merge, but GitHub branch protection/ruleset enforcement is not currently enabled on `main`.

The connected GitHub workspace can inspect but cannot administer the required branch-protection setting. Until an administrator applies it, the procedural exact-head gate remains mandatory.

## Do not expand by inertia

Do not restart without new evidence:

- GameLoop/tick hardening;
- generic Skills;
- generic Crafting;
- general Inventory/Equipment economy;
- duplicate Saves;
- generalized ChapterEngine / narrative DSL;
- autonomous Copy planning;
- generalized simulation;
- Chapters 8+ / interplanetary continuation / New Game+;
- broad framework or toolchain migrations before they become demonstrated blockers.

Cross-repository ChatGPT/controller experiments are not part of the Campaign One completion path and should live outside this game's release queue.

## Re-entry sequence

```text
latest main
-> STATUS.md
-> docs/CURRENT.md
-> HANDOFF.md
-> specification/GameCompletionDefinition.md
-> specification/Features/FeatureScopeMatrix.md
-> specification/Progression/GameProgressionArc.md
-> specification/Narrative/CampaignArchitecture.md
-> specification/Technical/GameCompletionRoadmap.md
-> specification/Technical/BetaCompletionContract.md
-> specification/Technical/ReleaseQualificationContract.md
-> docs/release/BetaResult.md
-> docs/release/KnownDefects.md
-> RUNBOOK.md
```

## Governing handoff conclusion

> Campaign One has proved that its architecture, state authorities, campaign spine, persistence, and bounded gameplay slices can compose. The current question is no longer merely whether the game can traverse from New Game to Epilogue; it is whether the core features have enough depth, progression, variation, and cross-system consequence to constitute the finished game. Complete those features first. Dedicated Beta/release hardening comes afterward.
