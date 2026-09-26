# React Incremental RPG — Feature Completion / Product Depth

A React/TypeScript narrative incremental RPG where consequential relationships teach durable capabilities, remembered history changes later possibilities, and personally understood repetition can become deliberately delegated work.

> The repository name still contains `prototype` for historical/operational continuity. The current product maturity is **Content Alpha / HUMAN-UNVALIDATED**, not a throwaway technical prototype.

## Current state

```text
M25 complete chapter vertical slice: PASS
Post-M25 timing/content/chapter hardening: COMPLETE / INTEGRATED
Provisional Product Direction: SELECTED / HUMAN-UNVALIDATED
M26 learn-to-delegate provenance: COMPLETE / INTEGRATED
Current maturity: CONTENT_ALPHA / HUMAN-UNVALIDATED
Current strategic stage: FEATURE_COMPLETION / PRODUCT_DEPTH
Active program: Campaign One / 1.0 Feature Completion
Human Product Review: OPEN / UNPROVEN
Alpha: PASS / HUMAN-UNVALIDATED
Content Alpha: PASS / HUMAN-UNVALIDATED
Technical Beta readiness: PASS / HUMAN EVIDENCE BLOCKED
Beta: NOT YET — HUMAN EVIDENCE BLOCKED
RC entry: BLOCKED — promotion guard qualified
1.0: BLOCKED — promotion guard qualified
```

The application already has a real game loop, persistent save/load/import-export, Relationship/Memory progression, Traits/Essence, NPC dialogue, quests, authored travel, combat, Knowledge, Faction Reputation, World State, Copy delegation, bounded offline progression, and multiple chapter-scale compositions.

The repository has already proved that these systems can coexist and that the authored campaign spine can traverse from New Game to a state-responsive ending. The current problem is different: **integration maturity is ahead of feature maturity**. Several core systems remain bounded MVPs or first vertical slices, so the active program is Feature Completion / Product Depth before dedicated Beta/release hardening.

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
DEPTH   Candidate B — Mastery Compression / Copy       BOUNDED EXIT SATISFIED
DEPTH   Candidate A — Relationship capability buildcraft BOUNDED EXIT SATISFIED
NEXT    Candidate C — Strategic consequence composition ACTIVE
GATE    FEATURE_COMPLETE                                PENDING
GC-13   Beta                                           DOWNSTREAM / TECHNICAL READINESS ALREADY QUALIFIED
GC-14   Release Candidate / 1.0                        DOWNSTREAM / GUARD QUALIFIED
```

The structural aggregate is `npm run alpha:validate`; authored-content closure is `npm run content-alpha:validate`; deterministic Beta engineering readiness is `npm run beta:technical:validate`.
These commands do not replace the required real-human Beta evidence or an immutable release candidate.

Release evidence templates and generated-artifact locations live under
[`docs/release/`](docs/release/).

There is **no automatic M27 or GC-15**. The repository-wide breadth pass is recorded in [`FeatureCompletionGapAnalysis.md`](specification/Technical/FeatureCompletionGapAnalysis.md). Candidate B and Candidate A have reached their bounded repository-owned depth exits; the current depth frontier is **Candidate C — Strategic consequence composition**. After Candidate C, the next action is an explicit **FEATURE_COMPLETE NOW?** reconciliation rather than discovering another construction package by inertia. A qualified vertical slice is evidence that a feature can work, not evidence that the feature is finished.

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
npm run release:rc:eligibility    # expected to fail until BETA_PASS
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

Issue #109 remains the human Product Review evidence backlog. Use [`docs/release/BetaExecutionRunbook.md`](docs/release/BetaExecutionRunbook.md) to run the evidence program and [`docs/release/BetaHumanEvidenceTemplate.md`](docs/release/BetaHumanEvidenceTemplate.md) for accepted session records.

The minimum floor remains 5 accepted fresh-player first-session observations plus 3 accepted external beginning-to-ending fresh-save playthroughs. Do not relabel synthetic UI traversal, code review, automated tests or LLM analysis as human playtest evidence.

That human-evidence obligation limits human-quality claims and `BETA_PASS`; it does not freeze bounded heuristic, synthetic, deterministic, accessibility, reliability, presentation, pacing, balance, persistence, or release-hardening work on the existing Campaign One.

## Governing rule

> **Finish and harden the smallest game that fully delivers the relationship → capability → consequence → mastery → delegation promise before expanding the architecture. Evidence strength limits claim strength; it does not automatically prohibit useful bounded work.**
