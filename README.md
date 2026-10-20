# React Incremental RPG — Campaign One

> **1.1 development branch:** The owner has authorized a bounded universal Trait assimilation/expression revision. It is being integrated on PR #178 using `specification/Technical/Version11ScopeContract.md`. **1.1 has not passed final qualification or been released.** The latest released personal build remains **1.0.0**, human-unvalidated.


A React/TypeScript narrative incremental RPG where consequential relationships teach durable capabilities, remembered history changes later possibilities, and personally understood repetition can become deliberately delegated work.

> The repository name still contains `prototype` for historical/operational continuity. The current product maturity is **FEATURE_COMPLETE / HUMAN-UNVALIDATED**, released as **1.0.0**: a personal release that has not been externally playtested.

## Current state

```text
M25 complete chapter vertical slice: PASS
Post-M25 timing/content/chapter hardening: COMPLETE / INTEGRATED
Provisional Product Direction: SELECTED / HUMAN-UNVALIDATED
M26 learn-to-delegate provenance: COMPLETE / INTEGRATED
Current maturity: FEATURE_COMPLETE / HUMAN-UNVALIDATED
Current strategic stage: RELEASED_1_0 / HUMAN-UNVALIDATED
Active program: Campaign One / post-1.0 maintenance
Human Product Review: OPEN / UNPROVEN (optional post-1.0)
Alpha: PASS / HUMAN-UNVALIDATED
Content Alpha: PASS / HUMAN-UNVALIDATED
Technical Beta readiness: PASS
Beta: BETA_PASS=NO — human floor OWNER-WAIVED for 1.0 (2026-10-20)
Release candidate: 1.0.0-rc.1 QUALIFIED — Build Validation #564
1.0: RELEASED 1.0.0 — personal release, not externally playtested
```

The application already has a real game loop, persistent save/load/import-export, Relationship/Memory progression, Traits/Essence, NPC dialogue, quests, authored travel, combat, Knowledge, Faction Reputation, World State, Copy delegation, bounded offline progression, and multiple chapter-scale compositions.

The repository has already proved that these systems can coexist, that the authored campaign spine can traverse from New Game to a state-responsive ending, and that the bounded B/A/C depth program has reached its Campaign One feature-completion stop. On 2026-10-20 the owner made 1.0 a personal release ([`OwnerPersonalReleaseDecision.md`](specification/Technical/OwnerPersonalReleaseDecision.md)): the human playtest floor is waived as a release gate, not satisfied. The 1.0 release was subsequently qualified and promoted. The active program on this development branch is the separately authorized 1.1 universal Trait integration; ordinary released-main work remains 1.0 maintenance.

## Play

The production build is published from `main` to GitHub Pages by `.github/workflows/deploy-pages.yml`:

**https://thorstarlord.github.io/React_incremental_game_prototype/**

The site goes live once a repository admin sets **Settings → Pages → Source: GitHub Actions**; until then the workflow skips the deploy with a notice. Progress is saved in the browser's local storage. Use **Save Game** in the game, and **Export** on the main menu to keep a copy.

## 1.0 product promise

> **A narrative incremental RPG in which consequential relationships teach the protagonist durable capabilities, remembered history explains why later options exist, and personally understood repetitive work can be deliberately delegated so the player increasingly focuses on novel strategic and relational decisions.**

Provisional hierarchy:

```text
Primary promise      -> relationship-derived capability buildcraft
Supporting identity  -> causal legibility
Incremental identity -> earned delegation / mastery compression
Architecture         -> heterogeneous authored composition
```

This direction remains **human-unvalidated**. Repository tests establish deterministic implementation behavior, not comprehension, pacing, fun, fairness or retention.

## Campaign One / 1.0 scope

The 1.0 campaign is deliberately bounded:

```text
Prologue                                    [integrated]
Chapter 1 — Merchant District Crisis        [integrated / connected]
Chapter 2 — Archive Inquiry                 [integrated / connected]
Chapter 3 — Enemies in Phase                [integrated / connected]
Chapter 4 — Lattice Under Strain            [integrated]
Chapter 5 — The Chrono-Crypt                [integrated]
Chapter 6 — Network Under Pressure          [integrated]
Chapter 7 — Counterphase                    [integrated]
Finale — The Telluric Echo                  [integrated]
Epilogue — state-responsive aftermath       [integrated]
```

Campaign One ends on the isolated planet. Interplanetary continuation, the larger AI-war thread, New Game+, endless progression, generic crafting/inventory economies, autonomous Copy planning, and generalized simulations are post-1.0 unless the completion authority is explicitly revised.

## Read the repository in this order

1. [`AGENTS.md`](AGENTS.md) — coding-agent operating policy and evidence-to-authority rules.
2. [`STATUS.md`](STATUS.md) — current repository state and active lanes.
3. [`docs/CURRENT.md`](docs/CURRENT.md) — documentation classification and conflict resolution.
4. [`HANDOFF.md`](HANDOFF.md) — current re-entry summary.
5. [`specification/GameCompletionDefinition.md`](specification/GameCompletionDefinition.md) — authoritative 1.0 definition and stop condition.
6. [`specification/Features/FeatureScopeMatrix.md`](specification/Features/FeatureScopeMatrix.md) — what is core, supporting, minimal, deferred or cut.
7. [`specification/Progression/GameProgressionArc.md`](specification/Progression/GameProgressionArc.md) — whole-game player transformation.
8. [`specification/Narrative/CampaignArchitecture.md`](specification/Narrative/CampaignArchitecture.md) — bounded Campaign One spine.
9. [`specification/Technical/GameCompletionRoadmap.md`](specification/Technical/GameCompletionRoadmap.md) — active GC-00→GC-14 implementation program.
10. [`specification/Technical/AlphaCompletionContract.md`](specification/Technical/AlphaCompletionContract.md), [`BetaCompletionContract.md`](specification/Technical/BetaCompletionContract.md), and [`ReleaseQualificationContract.md`](specification/Technical/ReleaseQualificationContract.md) — maturity gates.
11. [`RUNBOOK.md`](RUNBOOK.md) — commands, qualification and exact-head merge procedure.
12. [`specification/README.md`](specification/README.md) — domain authority map.

[`CLAUDE.md`](CLAUDE.md) is a thin adapter to `AGENTS.md`, not a separate policy source.

`README.md` is orientation. For disputed current state, follow the authority chain above.

## Current completion queue

```text
GC-00  M26 closure + completion-program authority     COMPLETE
GC-01  1.0 player-surface scope cleanup                COMPLETE
GC-02  Prologue / onboarding                           COMPLETE
GC-03  Chapters 1–3 campaign integration               COMPLETE
GC-04  Relationship-derived buildcraft breadth        COMPLETE
GC-05  Earned-delegation breadth                      COMPLETE
GC-06  Chapter 4 — Lattice Under Strain               COMPLETE
GC-07  Chapter 5 — The Chrono-Crypt                   COMPLETE
GC-08  Chapter 6 — Network Under Pressure             COMPLETE
GC-09  Chapter 7 — Counterphase                       COMPLETE
GC-10  Finale + Epilogue                              COMPLETE
GC-11  Alpha qualification                            COMPLETE
GC-12  Content Alpha / authored integration evidence COMPLETE
CURRENT Feature Completion Gap Analysis                COMPLETE
DEPTH   Candidate B — Mastery Compression / Copy       BOUNDED-CONVERGED
DEPTH   Candidate A — relationship capability build    QUALIFIED / MERGED
DEPTH   Candidate C — strategic consequence composition SUFFICIENT
GATE    FEATURE_COMPLETE                               RECORDED / HUMAN-UNVALIDATED
GC-13   Beta                                           ACTIVE / HUMAN EVIDENCE REQUIRED
GC-14   Release Candidate / 1.0                        DOWNSTREAM / GUARD QUALIFIED
```

The structural aggregate is `npm run alpha:validate`; authored-content closure is `npm run content-alpha:validate`; deterministic Beta engineering readiness is `npm run beta:technical:validate`.
These commands do not replace the required real-human Beta evidence or an immutable release candidate.

Release evidence templates and generated-artifact locations live under
[`docs/release/`](docs/release/).

There is **no automatic M27 or GC-15**. The repository-wide breadth/depth pass is recorded in [`FeatureCompletionGapAnalysis.md`](specification/Technical/FeatureCompletionGapAnalysis.md), and [`FeatureCompleteResult.md`](specification/Technical/FeatureCompleteResult.md) records the construction stop. Candidate B is bounded-converged, Candidate A is qualified/merged, and Candidate C is sufficient without a new subsystem. The active lane is 1.0 release qualification under the 2026-10-20 owner waiver; `BETA_PASS=NO` remains true because no genuine sessions have been recorded.

## Important 1.0 scope decisions

The feature-scope matrix intentionally keeps Campaign One small enough to finish:

- **Traits are the capability/skill system**; the separate generic Skills placeholder is cut from 1.0.
- **Generic Crafting is cut** for Campaign One; authored forge interactions/routines can exist without a crafting economy.
- **General Inventory/Equipment is deferred** unless campaign implementation proves it necessary.
- **Save/load/import-export remain one canonical persistence authority**; a second save system is not required.
- A generic `ChapterEngine`, narrative DSL, automatic Copy task chaining, offline narrative progression, open-world NPC schedules, generalized rumor/economy simulation and live-service infrastructure are outside 1.0.

## Stack

- React 18 + Create React App
- TypeScript
- Redux Toolkit / React Redux
- Material UI
- React Router
- data-driven content and versioned persistence
- Jest / React Testing Library
- Playwright UI-only synthetic review tooling
- Node.js 20 in repository CI

## Run locally

```bash
npm ci
npm start
```

The development app is served at `http://localhost:3000` by default.

## Core validation

```bash
npm run docs:authority:validate
npm run content:intelligence:validate
npm run chapter:validate
npm run m26:validate
npm run alpha:validate
npm run content-alpha:validate
npm run beta:technical:validate
npm run release:browser -- --browser all
npm run gc14:validate
npm run release:rc:eligibility    # fails until 1.0.0-rc.N metadata is set and no release blocker remains
npm run release:promotion:eligibility # expected to fail until final release gates pass
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

The authoritative workflow is:

```text
.github/workflows/build-validation.yml
```

Exact-head Build Validation is required before merge. A green automated run establishes only the claims owned by its deterministic tests; it does not establish human product quality.

## Human evidence

Issue #109 remains the human Product Review evidence backlog. Use [`docs/release/BetaExecutionRunbook.md`](docs/release/BetaExecutionRunbook.md) to run sessions and [`docs/release/BetaHumanEvidenceTemplate.md`](docs/release/BetaHumanEvidenceTemplate.md) for accepted session records.

A genuine `BETA_PASS` still needs 5 accepted fresh-player first-session observations plus 3 accepted external beginning-to-ending fresh-save playthroughs. The owner waived that floor as a 1.0 gate on 2026-10-20, so 1.0 ships disclosed as **not externally playtested**. Do not relabel synthetic UI traversal, code review, automated tests or LLM analysis as human playtest evidence.

## Governing rule

> **Finish and harden the smallest game that fully delivers the relationship → capability → consequence → mastery → delegation promise before expanding the architecture. Evidence strength limits claim strength; it does not automatically prohibit useful bounded work.**
