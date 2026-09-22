# Milestone Handoff — GC-14 / Pre-Beta

**Handoff status:** CURRENT RE-ENTRY AUTHORITY  
**Reconciled baseline before this activation package:** `4b725286eadaf6b2c61076e532b0f48513a3687e`  
**Current maturity:** `CONTENT_ALPHA / HUMAN-UNVALIDATED`  
**Deterministic readiness:** `TECHNICAL_BETA_READY`  
**Release preparation:** `TECHNICAL_RELEASE_PREPARED / RC_ENTRY_BLOCKED / 1.0_PROMOTION_BLOCKED`  
**Current product responsibilities:** human Beta evidence + bounded repository-answerable 1.0 hardening  
**Current human evidence:** `0 / 5` accepted first sessions; `0 / 3` accepted external full playthroughs  
**Operator procedure:** `docs/release/BetaExecutionRunbook.md`

## Repository reality

Campaign One is structurally and authorially complete from New Game through the state-responsive Epilogue.

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

The repository must not restart closed GC packages merely because Beta is externally blocked.

PR #139 completed the bounded pre-Beta player-surface hygiene pass without expanding scope: normal NPC/Essence pages no longer expose prototype/debug mutations, the Dashboard/Character surfaces no longer advertise deferred or internal concepts, Settings no longer exposes no-op import/export actions, and the unreachable legacy `GamePage` reset surface is removed. Exact head `4a64d8d53aea1a9c3385894ac89af570dec778d7` passed Build Validation #419 / run `35680087869`; GC-01 regression coverage owns these rejection checks.

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

## Concurrent responsibilities

### Lane A — genuine human Beta evidence

Issue #109 remains the canonical human product-evidence backlog.

Before `BETA_PASS`, current authority still requires at least:

- 5 fresh-player first-session observations on a current supported build;
- 3 external beginning-to-ending fresh-save playthroughs without developer intervention in required progression;
- classification and bounded repair of recurring severe findings;
- exact build/browser/session provenance for accepted evidence.

Synthetic observation, automated UI traversal, repository analysis and LLM judgment do not satisfy this human-evidence gate.

### Lane B — repository-answerable 1.0 hardening

Human evidence is not the only valid source of useful engineering work. While Lane A is open, continue bounded hardening of the existing Campaign One when deterministic, heuristic, synthetic, accessibility, reliability, presentation, pacing, balance, persistence, or release-readiness evidence identifies a concrete improvement.

Preserve the evidence class. Non-human work may improve the product, but it must not be reported as proof of actual player comprehension, enjoyment, preference, retention, or other human-experience claims.

## Scope lock, not work freeze

For the human lane, the preferred loop remains `human observation -> classification -> smallest repair -> deterministic regression -> human rerun when warranted`.

For repository-answerable hardening, use `finding -> evidence classification -> smallest repair -> deterministic regression -> exact-head qualification`.

Allowed evidence classes include:

- deterministic implementation/runtime findings;
- heuristic UX, information-hierarchy, terminology, accessibility, pacing and design findings;
- synthetic/browser playthrough findings;
- genuine human findings.

Examples of authorized bounded work include:

- navigation/discoverability and causal/state-legibility repairs;
- pacing, grind, balance, and delegation-timing repairs supported by concrete analysis;
- production-surface integrity and presentation polish;
- save/recovery and persistence hardening;
- browser/reliability/performance defects;
- accessibility/input defects;
- documentation/governance drift that can misroute agents;
- release qualification/deployment readiness;
- repairs directly justified by accepted human observations.

Do not create speculative systems, chapters, generalized engines, or post-1.0 scope merely to keep development busy while human evidence is pending.

Use `docs/release/BetaExecutionRunbook.md` for the human-evidence lane and `AGENTS.md` for the repository-wide evidence-to-authority rule.

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

## Do not reopen by inertia

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

> Campaign One no longer needs speculative implementation to prove that a complete game can exist. The next product question is whether fresh players can understand, complete and value the game that has already been built; repository changes should now be driven by release blockers or observed human evidence.
