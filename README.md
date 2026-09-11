# React Incremental RPG — Playable Pre-Alpha

A React/TypeScript narrative incremental RPG where consequential relationships teach durable capabilities, remembered history changes later possibilities, and personally understood repetition can become deliberately delegated work.

> The repository name still contains `prototype` for historical/operational continuity. The current product maturity is **Playable Pre-Alpha**, not a throwaway technical prototype.

## Current state

```text
M25 complete chapter vertical slice: PASS
Post-M25 timing/content/chapter hardening: COMPLETE / INTEGRATED
Provisional Product Direction: SELECTED / HUMAN-UNVALIDATED
M26 learn-to-delegate provenance: COMPLETE / INTEGRATED
Current maturity: PLAYABLE PRE-ALPHA
Active program: Campaign One / 1.0 Game Completion
Human Product Review: OPEN / UNPROVEN
Alpha: NOT YET
1.0: NOT YET
```

The application already has a real game loop, persistent save/load/import-export, Relationship/Memory progression, Traits/Essence, NPC dialogue, quests, authored travel, combat, Knowledge, Faction Reputation, World State, Copy delegation, bounded offline progression, and multiple chapter-scale compositions.

What is missing is no longer mainly “prove that these systems can coexist.” The repository is now governed by a bounded **Game Completion Program** whose goal is to finish Campaign One from New Game to a state-responsive ending.

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
Prologue
Chapter 1 — Merchant District Crisis        [integrated]
Chapter 2 — Archive Inquiry                 [integrated]
Chapter 3 — Enemies in Phase                [integrated]
Chapter 4 — Lattice Under Strain            [planned 1.0]
Chapter 5 — The Chrono-Crypt                [planned 1.0]
Chapter 6 — Network Under Pressure          [planned 1.0]
Chapter 7 — Counterphase                    [planned 1.0]
Finale — The Telluric Echo                  [planned 1.0]
Epilogue — Aftermath / Conditional Reprieve [planned 1.0]
```

Campaign One ends on the isolated planet. Interplanetary continuation, the larger AI-war thread, New Game+, endless progression, generic crafting/inventory economies, autonomous Copy planning, and generalized simulations are post-1.0 unless the completion authority is explicitly revised.

## Read the repository in this order

1. [`STATUS.md`](STATUS.md) — current repository state and active queue.
2. [`docs/CURRENT.md`](docs/CURRENT.md) — documentation classification and conflict resolution.
3. [`specification/GameCompletionDefinition.md`](specification/GameCompletionDefinition.md) — authoritative 1.0 definition and stop condition.
4. [`specification/Features/FeatureScopeMatrix.md`](specification/Features/FeatureScopeMatrix.md) — what is core, supporting, minimal, deferred or cut.
5. [`specification/Progression/GameProgressionArc.md`](specification/Progression/GameProgressionArc.md) — whole-game player transformation.
6. [`specification/Narrative/CampaignArchitecture.md`](specification/Narrative/CampaignArchitecture.md) — bounded Campaign One spine.
7. [`specification/Technical/GameCompletionRoadmap.md`](specification/Technical/GameCompletionRoadmap.md) — active GC-00→GC-14 implementation program.
8. [`specification/Technical/AlphaCompletionContract.md`](specification/Technical/AlphaCompletionContract.md), [`BetaCompletionContract.md`](specification/Technical/BetaCompletionContract.md), and [`ReleaseQualificationContract.md`](specification/Technical/ReleaseQualificationContract.md) — maturity gates.
9. [`RUNBOOK.md`](RUNBOOK.md) — commands, qualification and exact-head merge procedure.
10. [`specification/README.md`](specification/README.md) — domain authority map.

`README.md` is orientation. For disputed current state, follow the authority chain above.

## Current completion queue

```text
GC-00  M26 closure + completion-program authority
GC-01  1.0 player-surface scope cleanup
GC-02  Prologue / onboarding
GC-03  Chapters 1–3 campaign integration
GC-04  Relationship-derived buildcraft breadth
GC-05  Earned-delegation breadth
GC-06  Chapter 4 — Lattice Under Strain
GC-07  Chapter 5 — The Chrono-Crypt
GC-08  Chapter 6 — Network Under Pressure
GC-09  Chapter 7 — Counterphase
GC-10  Finale + Epilogue
GC-11  Alpha qualification
GC-12  Content Alpha
GC-13  Beta
GC-14  Release Candidate / 1.0
```

There is **no automatic M27**. Future implementation must close an explicit 1.0 requirement or a demonstrated blocker to one.

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

Issue #109 remains the human Product Review evidence backlog. It will become a formal Beta input for first-session comprehension and beginning-to-ending external playthrough evidence.

Do not relabel synthetic UI traversal, code review, automated tests or LLM analysis as human playtest evidence.

## Governing rule

> **Finish the smallest game that fully delivers the relationship → capability → consequence → mastery → delegation promise before expanding the architecture.**
