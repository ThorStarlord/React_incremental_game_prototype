# Handoff — Beta Convergence / Human Evidence

**Handoff status:** CURRENT RE-ENTRY AUTHORITY  
**Reconciled baseline before this activation package:** `fbc19da437c0cfc7b0cd6dd9078741bc8b19f9f3`  
**Current maturity:** `CONTENT_ALPHA / HUMAN-UNVALIDATED`  
**Deterministic readiness:** `TECHNICAL_BETA_READY`  
**Release preparation:** `TECHNICAL_RELEASE_PREPARED / RC_ENTRY_BLOCKED / 1.0_PROMOTION_BLOCKED`  
**Current strategic stage:** `BETA_CONVERGENCE / HUMAN_EVIDENCE`  
**Feature-completion state:** `FEATURE_COMPLETE / REPOSITORY-QUALIFIED / HUMAN-UNVALIDATED`  
**Current product responsibilities:** collect genuine Beta evidence; apply only bounded evidence-backed hardening inside locked Campaign One scope  
**Current human evidence:** `0 / 5` accepted first sessions; `0 / 3` accepted external full playthroughs  
**Operator procedure:** `docs/release/BetaExecutionRunbook.md`

## Current re-entry frontier

The A/B/C feature-depth sequence is closed. Candidate B converged through Archive + Forge,
Candidate A converged through repeated independent capability use plus selective doctrine
consumption, and Candidate C already satisfies its authored strategic-composition exit shape.
The closure rationale and reopening conditions are recorded in
[`specification/Technical/FeatureCompletionConvergenceResult.md`](specification/Technical/FeatureCompletionConvergenceResult.md).

Do not restart feature-depth construction merely because another implementation is possible.

## Feature-completion stop boundary — 2026-09-26

The B -> A -> C repository construction sequence has converged and the Candidate-A exact head qualified before PR #156 merged as `fd94adef92b30124e9d96e722f0d60ead811c4fa`:

- **B:** Archive + Forge standing responsibilities provide distinct role/location work
  and exception families; do not add a third by symmetry.
- **A:** existing capabilities/doctrines now repeat across GC06/GC08/GC09/GC10 with
  single-capability independent use, visible provenance, and finale payoff.
- **C:** existing GC08-GC10 authored decisions already compose Relationship, Knowledge,
  Faction, World State, build and delegation deeply enough for Campaign One; no generic
  strategy simulator is warranted.

The active lane is the already-defined Beta/product-validation and convergence work.
Preserve `TECHNICAL_BETA_READY` while keeping `BETA_PASS=NO` until the governing human
evidence exists. Bounded repository-owned hardening may continue only from concrete
findings inside the locked 1.0 scope.

## Repository reality

Campaign One is structurally and authorially complete from New Game through the state-responsive Epilogue.

That sentence describes **campaign-spine and integration completeness**. The repository now also records the bounded Campaign One feature set as `FEATURE_COMPLETE / REPOSITORY-QUALIFIED / HUMAN-UNVALIDATED`. Some systems remain intentionally narrow by design; narrowness alone is no longer authority to deepen them. Reopening feature construction requires concrete contradictory evidence or explicit governance revision.

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

Do not reopen closed GC packages or the completed A/B/C sequence as if their historical contracts failed. Route current work through the Beta contract and concrete findings.

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

### Primary lane — Beta human evidence / product convergence

Issue #109 is the canonical human product-evidence backlog. The Beta contract requires
at least 5 accepted first sessions and 3 accepted external full playthroughs before
`BETA_PASS`.

Human evidence must remain genuine. Automated tests, synthetic traversal, repository
analysis, and LLM review may diagnose or reproduce findings but cannot count toward the
human floor.

### Concurrent repository lane — bounded evidence-backed hardening

While human evidence is being collected, repository work may continue only when a
concrete finding justifies a bounded change inside the locked Campaign One scope.

Allowed evidence classes include deterministic, heuristic, synthetic, accessibility,
reliability, presentation, pacing, balance, persistence, and release-readiness findings.

Default response:

```text
concrete finding
-> smallest affected layer
-> bounded repair
-> deterministic regression coverage where applicable
-> exact-head Build Validation
```

Do not use the open human gate as permission to invent new feature depth.

## Scope lock, not repository freeze

Preserve the bounded Campaign One product boundary:

- no Chapters 8+ or interplanetary continuation;
- no generic Skills or Crafting;
- no generalized ChapterEngine / narrative DSL without repeated concrete need;
- no autonomous irreversible Copy planning;
- no generalized simulation or New Game+ merely to create work.

Inside that boundary, bounded repair remains open but speculative feature depth is closed. A historical PASS is evidence to preserve; it is not a queue to restart.

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

> Campaign One's bounded 1.0 feature construction is repository-complete and deterministically qualified, but the product remains human-unvalidated. The active question is now whether real players can understand, use, complete, and value the finished interaction model. Collect that evidence, repair concrete failures at the smallest layer, and do not reopen feature construction by inertia.
