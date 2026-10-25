# Handoff — Campaign One 1.0 Released

## 2026-10-25 — CURRENT RE-ENTRY: source-only merge authorization

- **Owner explicit direction:** always merge eligible owner-directed PRs without waiting for unit tests or evidence/browser tests. Current `AGENTS.md` supersedes historical 2026-10-20 D3 test-gated merge language below for ordinary PR merges. Inspect actual GitHub mergeability/branch dependencies, preserve provenance, and disclose **UNTESTED / UNQUALIFIED** rather than inventing a PASS.
- [PR #190](https://github.com/ThorStarlord/React_incremental_game_prototype/pull/190) is the bounded Merchant District aftercare source integration. Refer to `specification/Technical/PostUI4DistrictAftercareCandidate.md` for exact scope and unexecuted acceptance cases. GitHub PR metadata—not an assumed SHA in this handoff—establishes actual merge outcome.
- Historical `v1.0.0` release, release contract, and human-Beta evidence remain independent. Other open Trait branches #165/#178 are overlapping/conflicted; #180/#182 are stacked on #178 and must not be blindly or forcibly merged into main.


## 2026-10-25 — Optional research continuation: simulated players and divergent product futures

- UI4 PRs #185/#186 are already merged and technically qualified. Do not reopen or requalify them merely to begin this exploratory work.
- Owner has requested a **coding-agent simulation** and exploration of other repository-documented game ideas. Execution packet: specification/Technical/UI4CodingAgentSimulationCampaign.md. Exploration and status crosswalk: specification/Technical/PostUI4DivergentExploration.md.
- The six-profile **blind panel is NOT RUN** in the GitHub-only controller context; it needs independently spawned agent participants and UI-only observation/action artifacts. Never count role predictions, scripted full-campaign tests or this handoff as actual simulated participant evidence.
- Provisional A/B/C exploration (Trait identity, Knowledge strategy, tangible World/Faction consequences) includes bounded non-canon examples in specification/Technical/PostUI4ScenarioStressTest.md and is not automatically an approved new 1.1 roadmap. Existing Trait drafts #178/#180/#182 remain separate and unqualified; no change to v1.0.0, issue #109 or BETA_PASS=NO.


## 2026-10-25 — UI4 integrated, release-tag and human boundary preserved

- `main` after [PR #185](https://github.com/ThorStarlord/React_incremental_game_prototype/pull/185) is `528d014d8de6b6cf775e4f6b229eb74b3b748dca`. The qualified exact PR head `cfad4349` passed [Build Validation #40158794677](https://github.com/ThorStarlord/React_incremental_game_prototype/actions/runs/40158794677), including two divergent full-campaign histories in **Chromium and Firefox** (Distributed 105/105, Fortified 104/104), four save/Continue checkpoints each and export/import.
- Existing UI4 contract/evidence: `docs/ui/Phase4PlayerClarity.md`. The nested NPC detail → NPC list navigation regression was observed in actual full-campaign browser evidence, fixed, retested and closed on the qualifying head. UI4 is **integrated**, not pending. The candidate handoff section below is historical.
- Next responsibility is not an automatic UI5. Normal post-1.0 maintenance remains bounded; genuine fresh-player evaluation is **external and outstanding** under issue #109 and `docs/ui/Phase2HumanEvaluation.md`. Preserve **FEATURE_COMPLETE / HUMAN-UNVALIDATED, BETA_PASS=NO**, original v1.0.0 tag, and the separate unqualified 1.1 Traits drafts.


## 2026-10-25 — UI4 re-entry, bounded source candidate

- Branch **codex/ui4-player-experience-20261025** begins from merged UX3 main **96f6c595**. Owner requested autonomous implementation of the prior UI review, not a new 1.1 product scope. Change map: docs/ui/Phase4PlayerClarity.md.
- Exact-head Build Validation of the final UI4 PR is required before any merge; investigate deterministic, browser, TypeScript, or campaign failure at source. Browser screenshots and automated campaigns do not establish fresh-player comprehension or preferences.
- PR #184 is already integrated; the prior UI2/UI3 entries below are historical. Do not restart UX3, alter v1.0.0, merge 1.1 Traits, or report external human sessions that did not occur.

## 2026-10-24 — Current re-entry: UI2/UI3 merged
- `main = 41037697019dc7dcb8c9256d37002f230f737c26` after merged PR #181. Qualified exact PR head `e1f32ca70d231b0f415032bc50c0ac29d5a08fcf` via full Build Validation #40090580707 (both real browsers, both authored campaign outcomes, saves and import/export all green). The original `v1.0.0` tag is unchanged.
- The earlier 2026-10-23/24 *draft / pending* handoff sections below are historical, not the current next responsibility. Source/verification map: `docs/ui/Phase2Implementation.md`; human participation procedure: `docs/ui/Phase2HumanEvaluation.md`.
- Current boundary: UI2/UI3 implementation/qualification **completed**; no more mandatory repository changes from that selected package. Fresh participant comprehension evidence remains external and **not supplied** (`HUMAN-UNVALIDATED / BETA_PASS=NO`). Continue ordinary bounded 1.0 defect repairs only when new evidence warrants them; do not restart a broad UI rewrite.
- 1.1 PR #178 and stacked #180/#182 remain independent, unqualified and must not be considered part of this merged 1.0-based UI.


## 2026-10-24 — UI3 bounded continuation
- PR #181 earlier exact head `9f535361` passed full Build Validation #40058927308; owner-requested UI3 repairs modify it and therefore **invalidate reuse of that PASS for the new head**.
- Continue from `codex/ui2-world-first-experience-20261023`. Current task: verify `UI3LayoutAndSettings.test.tsx`, `UI3WorldTruth.test.tsx`, then full exact-head Build Validation (desktop/sidebar spacing, mobile cards, theme, real Gameplay settings, NPC world vs story contacts, Trait slots, 2x2 campaign and saves). Repair failing causes; never relax gates to obtain green.
- Preserve 1.0 gameplay authority, authored source visibility, immutable `v1.0.0`, and `HUMAN-UNVALIDATED / BETA_PASS=NO`.
- For player-research prompts/evidence capture, use `docs/ui/Phase2HumanEvaluation.md`; **do not label synthetic/browser tests as actual player comprehension**.


## 2026-10-23 — Scoped UI2 continuation

Owner approved the Phase 2 player-experience program. PR #179 was qualified and merged into main at `4259e94573d189228af5ab71cf29ce7c5ab3c2d5`. Draft PR #181 at `codex/ui2-world-first-experience-20261023` implements world-first changes, controls truthfulness and tests. It is not qualified until exact-head Build Validation including the full ordinary-UI Campaign One passes. Read `docs/ui/Phase2Implementation.md` and reconcile its current head/CI failures; do not repeat the 1.0 or GC implementation work. PR #178/#180 1.1 remains separate. The original v1.0.0 tag and human validation ceiling are unchanged.


**Handoff status:** CURRENT RE-ENTRY AUTHORITY  
**Reconciled baseline before this activation package:** `fbc19da437c0cfc7b0cd6dd9078741bc8b19f9f3`  
**Current maturity:** `FEATURE_COMPLETE / HUMAN-UNVALIDATED`  
**Deterministic readiness:** `TECHNICAL_BETA_READY`  
**Release:** `1.0.0` released 2026-10-20 (personal release, not externally playtested); RC-1 qualified by Build Validation #564  
**Current strategic stage:** `RELEASED_1_0 / HUMAN-UNVALIDATED`  
**Owner decision:** `specification/Technical/OwnerPersonalReleaseDecision.md` (2026-10-20)  
**Current product responsibilities:** release-hotfix repairs on the shipped Campaign One; 1.1 scope only by owner decision  
**Current human evidence:** `0 / 5` accepted first sessions; `0 / 3` accepted external full playthroughs — floor waived as a 1.0 gate; `BETA_PASS=NO`  
**Operator procedure:** `docs/release/BetaExecutionRunbook.md`

## Current re-entry frontier — 2026-10-20 owner personal-release decision

The owner decided (`OwnerPersonalReleaseDecision.md`):

- **D1** — 1.0 is a personal release. The human Beta floor is waived as a 1.0 gate, not satisfied: `BETA_PASS=NO`, `BETA_OWNER_WAIVED / HUMAN-UNVALIDATED`. Release notes must say the game was not externally playtested.
- **D2** — draft PR #165 (universal Trait redesign) is parked until after 1.0.
- **D3** — an agent may merge its own PRs once exact-head Build Validation passes.

Progress since the decision:

1. PR #163 (keyboard/control accessibility) integrated;
2. KD-002 closed: `npm run release:campaign` plays New Game -> Epilogue through ordinary UI for two divergent histories with save/Continue and export/import checks, in Chromium and Firefox on every Build Validation run (`SYNTHETIC_FINDING`). Qualification found and fixed KD-010 through KD-015;
3. KD-004 closed: `1.0.0-rc.1` declared; `deploy-pages.yml` publishes the static build once Pages is enabled;
4. `docs/release/ReleaseNotes.md` carries the not-externally-playtested disclosure.

5. RC-1 qualified by Build Validation #564 and recorded in `ReleaseCandidateResult.md`; `1.0.0` promoted and tagged by `release-tag.yml`.

Re-entry after 1.0: fix release defects in the shipped scope (exact-head Build Validation, including `release:campaign`), keep the release records honest, and bring any new scope (1.1, PR #165) to the owner first.

## Previous frontier — feature-completion stop


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

That stop led to the human Beta/product-validation lane, which the owner waived as
a 1.0 gate on 2026-10-20. Preserve `TECHNICAL_BETA_READY` and keep `BETA_PASS=NO`
unless genuine human evidence is later recorded.

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
GC-13  genuine human Beta evidence                   OWNER-WAIVED FOR 1.0 / BETA_PASS=NO
GC-14  release-promotion guard                       QUALIFIED
GC-14  immutable RC / final 1.0 promotion            ACTIVE (KD-002, KD-004 open)
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

### Primary lane — release qualification / evidence-backed hardening

`FeatureCompleteResult.md` records the construction stop. Candidate B is bounded-converged, Candidate A is qualified/merged, and Candidate C is sufficient through existing GC08-GC10 composition. There is **no open feature-construction frontier**.

Repository-owned work may continue when a concrete finding justifies it, especially in:

- accessibility and input;
- presentation and state legibility;
- reliability, soft-lock prevention, persistence, and recovery;
- supported-browser behavior;
- pacing/balance fixes supported by an identified evidence class;
- release-readiness defects inside the locked Campaign One scope.

Do not create another gameplay-depth package merely because a system could be broader.

### Human evidence lane — optional after the owner waiver

Issue #109 remains the canonical human product-evidence backlog. A genuine `BETA_PASS` still requires at least 5 accepted first sessions and 3 accepted external full playthroughs, but the owner waived that floor as a 1.0 gate on 2026-10-20.

Automation, synthetic traversal, repository analysis, and LLM judgment may diagnose or repair the product, but they may not be relabeled as accepted human evidence.

## Scope lock, not repository freeze

Preserve the bounded Campaign One product boundary:

- no Chapters 8+ or interplanetary continuation;
- no generic Skills or Crafting;
- no generalized ChapterEngine / narrative DSL without repeated concrete need;
- no autonomous irreversible Copy planning;
- no generalized simulation or New Game+ merely to create work.

`FEATURE_COMPLETE` closes feature construction by inertia; it does **not** freeze evidence-backed repair and hardening of existing 1.0 surfaces. Reopen B/A/C only when a concrete finding demonstrates that the recorded Campaign One role is actually missing or false, or when owner authority explicitly changes scope.

Use `AGENTS.md`, `GameCompletionDefinition.md`, `FeatureScopeMatrix.md`, and the Beta/Release contracts for work selection.

## Release path under the owner waiver

```text
BETA_PASS or recorded owner waiver (current basis: waiver)
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

The GC-14 guard must continue to fail closed until these authorities are satisfied. For a waived release it also requires `docs/release/ReleaseNotes.md` to state that the game was not externally playtested.

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

> Campaign One is feature-complete at its bounded 1.0 scope and remains human-unvalidated. The owner has made 1.0 a personal release, so the active question is whether one exact candidate passes the release contract's technical gates through the ordinary UI. Repair concrete findings without inventing new feature scope, and never present the waiver as human validation.
