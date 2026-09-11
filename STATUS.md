# Repository Status — Playable Pre-Alpha / Campaign One Completion Program

**Status date:** 2026-09-11  
**Current integrated implementation baseline:** `7f306f3b6a69a27c250c1986df976cc518119821`  
**Current maturity:** `PLAYABLE PRE-ALPHA`  
**Provisional Product Direction:** `SELECTED / HUMAN-UNVALIDATED`  
**M26:** `COMPLETE / INTEGRATED`  
**Human Product Review:** issue #109 `OPEN / UNPROVEN`  
**Final player-validated Product Direction:** `NOT YET VALIDATED`  
**Active program:** Campaign One / 1.0 Game Completion

## Role of this file

`STATUS.md` is the current-state authority for what is integrated, what is active, what remains unproven, and which work queue governs the repository.

Read in this order:

1. [`docs/CURRENT.md`](docs/CURRENT.md) — documentation classification.
2. [`specification/GameCompletionDefinition.md`](specification/GameCompletionDefinition.md) — what counts as the finished 1.0 game.
3. [`specification/Features/FeatureScopeMatrix.md`](specification/Features/FeatureScopeMatrix.md) — what is in, minimal, deferred, or cut.
4. [`specification/Progression/GameProgressionArc.md`](specification/Progression/GameProgressionArc.md) and [`specification/Narrative/CampaignArchitecture.md`](specification/Narrative/CampaignArchitecture.md) — whole-game progression and campaign spine.
5. [`specification/Technical/GameCompletionRoadmap.md`](specification/Technical/GameCompletionRoadmap.md) — active implementation queue.
6. [`RUNBOOK.md`](RUNBOOK.md) — operating and qualification procedure.
7. [`specification/README.md`](specification/README.md) — domain authority map.

## Big-picture state

The repository is no longer best understood as a throwaway technical prototype. It has a runnable game shell, persistent saves/import-export, a real deterministic GameLoop, NPC/dialogue, quests, authored travel, combat, relationship history, Traits/Essence, Knowledge, Faction Reputation, World State, Copies, bounded offline progression, three heterogeneous chapter-scale projections, and one qualified complete two-route chapter vertical slice.

The correct maturity label is now:

> **Playable Pre-Alpha** — the core game loop and a complete bounded chapter are real, but the complete Campaign One, player-facing validation, content breadth, polish, and release qualification are not yet complete.

## Current product direction

PR #113 consciously revised the no-human-evidence governance boundary and selected a provisional hierarchy:

```text
Primary promise      -> relationship-derived capability buildcraft
Supporting identity  -> causal legibility
Incremental identity -> earned delegation / mastery compression
Architecture         -> heterogeneous authored composition
```

This direction is **PROVISIONAL / HUMAN-UNVALIDATED**. It is allowed to guide bounded reversible implementation, but it does not establish that fresh players understand, enjoy, prefer, or retain around the game.

## M26 integrated result

PR #114 completed the bounded provenance milestone:

```text
first candidate: 2dcb1e68619b76dc1a8fe7a5e5df2e963b4df1ea
Build Validation #339: FAIL — historical Checkpoint C wording assertion drift

qualified candidate: 9b9b0380f0a2bb23d89036a8b0b133a7ffe133cf
Build Validation #340 / run 34624393744: PASS
merge commit: 7f306f3b6a69a27c250c1986df976cc518119821
```

M26 adds read-only player-facing provenance for relationship-derived capabilities and personally mastered routines, and distinguishes personal mastery from Copy-specific readiness while preserving existing M20 delegation authority. It adds no new canonical state, save root, autonomous Copy policy, offline authority, ChapterEngine, or narrative DSL.

M26 is the **last numbered milestone in the previous sequence**. Do not infer M27.

## 1.0 completion target

Campaign One / 1.0 is now bounded by [`specification/GameCompletionDefinition.md`](specification/GameCompletionDefinition.md).

The target game is:

> A narrative incremental RPG in which consequential relationships teach the protagonist durable capabilities, remembered history explains why later options exist, and personally understood repetitive work can be deliberately delegated so the player increasingly focuses on novel strategic and relational decisions.

The 1.0 campaign is bounded to the isolated-planet Campaign One and ends with the Telluric Echo finale plus a state-responsive epilogue. Interplanetary continuation, the larger AI-war thread, New Game+, endless progression, and generalized simulations are post-1.0 unless scope is explicitly revised.

## Campaign scope

```text
Prologue
Chapter 1 — Merchant District Crisis        [existing / integrated]
Chapter 2 — Archive Inquiry                 [existing / integrated]
Chapter 3 — Enemies in Phase                [existing / integrated]
Chapter 4 — Lattice Under Strain            [missing]
Chapter 5 — The Chrono-Crypt                [missing]
Chapter 6 — Network Under Pressure          [missing]
Chapter 7 — Counterphase                    [missing]
Finale — The Telluric Echo                  [missing]
Epilogue — Aftermath / Conditional Reprieve [missing]
```

Chapters 8+ are not on the 1.0 critical path by default.

## 1.0 scope decisions

Key decisions in [`FeatureScopeMatrix.md`](specification/Features/FeatureScopeMatrix.md):

- current Relationship/Memory, Trait/Essence, NPC/Dialogue, Quest, Travel, Combat, Knowledge, Faction, World State, Copy, persistence and bounded offline systems are `CORE_1_0` at bounded scope;
- the separate generic **Skills** page is `CUT` because Traits already own capability progression;
- generic **Crafting** is `CUT` for Campaign One;
- general **Inventory/Equipment** is `DEFER_POST_1_0` unless actual campaign content proves it necessary;
- the dedicated placeholder **Saves** route is not a second persistence system; canonical main-menu save/load/import-export remains the 1.0 authority;
- ChapterEngine, narrative DSL, autonomous Copy planning, offline narrative progression, general economy/rumor/NPC-schedule simulation, New Game+, live-service infrastructure, and interplanetary campaign content are outside 1.0.

## Completion breadth floors

Before the campaign can qualify as complete, it must support at least:

- all six anchor Relationship-authority NPCs receiving meaningful long-horizon use: Elder Willow, Lyra, Elara, Gronk, Silas, Valerius;
- four durable relationship-derived capability identities across at least three anchors;
- two capabilities with meaningful cross-domain use;
- two viable late-game build profiles;
- three personally mastered routine identities across at least two gameplay contexts;
- a finale that consumes meaningful prior Relationship/capability/Knowledge/Faction/World State rather than replacing them with one universal endgame meter;
- a state-responsive epilogue and persisted campaign-complete state.

## Active Game Completion queue

```text
[ ] GC-00 M26 closure + completion-program authority
[ ] GC-01 1.0 player-surface scope cleanup
[ ] GC-02 Prologue / onboarding
[ ] GC-03 Chapters 1–3 campaign integration
[ ] GC-04 Buildcraft breadth
[ ] GC-05 Earned-delegation breadth
[ ] GC-06 Chapter 4 — Lattice Under Strain
[ ] GC-07 Chapter 5 — The Chrono-Crypt
[ ] GC-08 Chapter 6 — Network Under Pressure
[ ] GC-09 Chapter 7 — Counterphase
[ ] GC-10 Finale + Epilogue
[ ] GC-11 Alpha qualification
[ ] GC-12 Content Alpha completion
[ ] GC-13 Beta
[ ] GC-14 Release Candidate / 1.0
```

`GC-00` becomes `[x]` only when the completion-program authority PR containing this file is itself integrated. M26 implementation is already merged.

Packages GC-04/GC-05 may be satisfied inside campaign chapter work where that creates clearer player meaning; do not manufacture standalone feature work merely to preserve package numbering.

## Maturity gates

### Alpha

A normal fresh save can progress through **New Game -> Prologue -> Chapters 1–7 -> Finale -> Epilogue** using ordinary UI, with all required 1.0 systems present at required scope and no debug-only progression path. Alpha is an implementation gate and may still be explicitly human-unvalidated.

### Content Alpha

The full campaign is authored; no required campaign unit is placeholder/diagnostic content.

### Beta

Feature/content scope is locked. Beta requires genuine human evidence and focuses on discoverability, comprehension, pacing, balance, reliability, accessibility, presentation and supported desktop browsers. Current provisional human floor is 5 fresh first-session observations plus 3 external beginning-to-ending playthroughs with provenance.

### Release Candidate / 1.0

One exact production candidate must pass the release contract, including full New Game -> Epilogue play, representative divergent history, save/import-export/recovery, browser evidence, deterministic CI and no release-blocking defects.

## Technical invariants that remain binding

### `SERIAL_BACKPRESSURE_V1`

```text
elapsed live logical time
-> accumulator
-> at most one unresolved admitted fixed step
-> retained excess logical milliseconds
-> no queued per-tick FIFO
-> no drop / skip / coalescing / concurrent consumers
```

### `FRESH_LOOP_RESET_V1`

```text
continuous live execution -> preserve sub-step remainder
pause/resume             -> preserve remainder; reject paused wall time
stop/start               -> discard remainder
unmount/remount          -> discard remainder
save/load fresh mount    -> discard remainder
```

Timed-Quest precision remains comparison-only. Raw/persisted timer values are not rounded or rewritten. M21 remains a bounded offline allowlist and timed Quests remain online-only during offline settlement.

## Human evidence boundary

Issue #109 remains open and becomes increasingly important as the project approaches Beta.

Automation can establish implementation correctness and deterministic composition. It cannot establish:

- fresh-player comprehension/discoverability;
- causal terminology comprehension;
- pacing quality;
- fairness/final balance;
- enjoyment/emotional impact;
- retention/desire to continue;
- market preference.

Do not close #109 as a PASS using tests, synthetic UI traversal, repository analysis, or LLM opinion.

## Completed work that must not be restarted by inertia

Unless a fresh regression or 1.0 requirement reopens a concrete need, do not restart:

- M4–M26 milestone implementation history;
- post-M25 timing hardening;
- content-intelligence/reachability package;
- three-chapter friction-audit R1–R3;
- chapter-definition integrity repair;
- Player Insight/provenance work;
- Rule-of-Two chapter requirement extraction;
- contextual causal dialogue package;
- cross-domain `ScholarlyInsight` qualification;
- third heterogeneous chapter package;
- Copy routine-priority/provenance package;
- provisional Product Direction selection.

## Governing implementation rule

From this point forward, every proposed 1.0 implementation package must answer:

> **Which unsatisfied requirement in the Game Completion Definition, Feature Scope Matrix, Campaign Architecture, or Alpha/Beta/Release contract does this close?**

If there is no answer, classify the work as post-1.0 or revise the completion authority explicitly before implementation.
