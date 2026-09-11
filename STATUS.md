# Repository Status — Playable Pre-Alpha / Campaign One Completion

**Status date:** 2026-09-11  
**Integrated implementation baseline:** `7f306f3b6a69a27c250c1986df976cc518119821`  
**Current maturity:** `PLAYABLE PRE-ALPHA`  
**Provisional Product Direction:** `SELECTED / HUMAN-UNVALIDATED`  
**M26:** `COMPLETE / INTEGRATED`  
**Human Product Review:** issue #109 `OPEN / UNPROVEN`  
**Active program:** Campaign One / 1.0 Game Completion

## Current authority

Read in this order:

1. [`docs/CURRENT.md`](docs/CURRENT.md)
2. [`specification/GameCompletionDefinition.md`](specification/GameCompletionDefinition.md)
3. [`specification/Features/FeatureScopeMatrix.md`](specification/Features/FeatureScopeMatrix.md)
4. [`specification/Progression/GameProgressionArc.md`](specification/Progression/GameProgressionArc.md)
5. [`specification/Narrative/CampaignArchitecture.md`](specification/Narrative/CampaignArchitecture.md)
6. [`specification/Technical/GameCompletionRoadmap.md`](specification/Technical/GameCompletionRoadmap.md)
7. relevant [`Alpha`](specification/Technical/AlphaCompletionContract.md) / [`Beta`](specification/Technical/BetaCompletionContract.md) / [`Release`](specification/Technical/ReleaseQualificationContract.md) contract
8. [`RUNBOOK.md`](RUNBOOK.md) and [`specification/README.md`](specification/README.md)

`STATUS.md` owns current state. The completion records above own the path to 1.0.

## Big picture

The project has passed proof-of-concept, technical-prototype and bounded vertical-slice stages. It has a runnable game shell, persistent saves/import-export, deterministic time, NPC/dialogue, quests, authored travel, combat, Relationship/Memory progression, Traits/Essence, Knowledge, Faction Reputation, World State, Copy delegation, bounded offline progress, three heterogeneous chapter-scale projections, and a qualified complete two-route chapter.

It is therefore best described as a **Playable Pre-Alpha**: a real rudimentary game whose complete campaign, content breadth, human validation, polish and release qualification remain unfinished.

## Product direction

Current provisional hierarchy:

```text
Primary promise      -> relationship-derived capability buildcraft
Supporting identity  -> causal legibility
Incremental identity -> earned delegation / mastery compression
Architecture         -> heterogeneous authored composition
```

This may guide bounded reversible development under the provisional governance decision. It does **not** prove fresh-player comprehension, fun, pacing, fairness, retention or preference.

## M26 closure

PR #114 is integrated:

```text
first candidate: 2dcb1e68619b76dc1a8fe7a5e5df2e963b4df1ea
Build Validation #339: FAIL — stale historical Checkpoint C UI wording expectation

qualified candidate: 9b9b0380f0a2bb23d89036a8b0b133a7ffe133cf
Build Validation #340 / run 34624393744: PASS
merge commit: 7f306f3b6a69a27c250c1986df976cc518119821
```

M26 adds read-only provenance for relationship-derived capabilities and mastered routines and distinguishes personal mastery from Copy-specific readiness without adding new canonical state or autonomous authority.

M26 is the final numbered milestone in the previous sequence. **There is no automatic M27.**

## Finished-game target

Campaign One / 1.0 is now explicitly bounded by [`GameCompletionDefinition.md`](specification/GameCompletionDefinition.md):

> A narrative incremental RPG in which consequential relationships teach durable capabilities, remembered history explains why later options exist, and personally understood repetition can be deliberately delegated so the player increasingly focuses on novel strategic and relational decisions.

Campaign One ends on the isolated planet with the Telluric Echo finale and a state-responsive epilogue.

## Campaign spine

```text
Prologue                                      [missing]
Chapter 1 — Merchant District Crisis          [integrated]
Chapter 2 — Archive Inquiry                   [integrated]
Chapter 3 — Enemies in Phase                  [integrated]
Chapter 4 — Lattice Under Strain              [missing]
Chapter 5 — The Chrono-Crypt                  [missing]
Chapter 6 — Network Under Pressure            [missing]
Chapter 7 — Counterphase                      [missing]
Finale — The Telluric Echo                    [missing]
Epilogue — Aftermath / Conditional Reprieve   [missing]
```

Chapters 8+, interplanetary continuation and New Game+ are outside the 1.0 critical path unless authority is explicitly revised.

## Key 1.0 scope decisions

[`FeatureScopeMatrix.md`](specification/Features/FeatureScopeMatrix.md) currently establishes:

- existing Relationship, Trait/Essence, NPC/Dialogue, Quest, Travel, Combat, Knowledge, Faction, World State, Copy, persistence and bounded offline authorities are `CORE_1_0` at bounded scope;
- separate generic **Skills** are `CUT` because Traits already own capability progression;
- generic **Crafting** is `CUT` for Campaign One;
- general **Inventory/Equipment** is `DEFER_POST_1_0` unless actual campaign evidence promotes it;
- a duplicate **Saves** system is `CUT`; existing save/load/import-export remains canonical;
- generic ChapterEngine/DSL, autonomous Copy planning, offline narrative progression and generalized simulations are outside 1.0.

## Completion breadth floor

Before 1.0, the campaign must support at least:

- all six anchor Relationship NPCs receiving meaningful long-horizon use: Elder Willow, Lyra, Elara, Gronk, Silas and Valerius;
- four durable relationship-derived capability identities across at least three anchors;
- two capabilities with meaningful cross-domain use;
- two viable late-game build profiles;
- three personally mastered routine identities across at least two contexts;
- a finale that consumes meaningful prior Relationship/capability/Knowledge/Faction/World State;
- a state-responsive epilogue and persisted campaign-complete state.

## Active Game Completion queue

```text
[x] GC-00 M26 closure + completion-program authority
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

GC-04/GC-05 may be satisfied within chapter packages where that is the natural content-driven implementation; package numbering must not force redundant feature work.

## Maturity gates

**Alpha:** ordinary fresh save can traverse New Game -> Prologue -> Chapters 1–7 -> Finale -> Epilogue, all required systems exist at required scope, no debug-only progression. Alpha may still be explicitly human-unvalidated.

**Content Alpha:** the complete bounded campaign is fully authored; no required content placeholder remains.

**Beta:** feature/content scope locked; genuine human evidence required; focus on comprehension, pacing, balance, reliability, accessibility, presentation and supported desktop browsers.

**Release Candidate / 1.0:** one exact production candidate passes the release contract, full New Game -> Epilogue play, representative divergence, save/recovery/browser qualification and has no release-blocking defects.

## Binding technical invariants

`SERIAL_BACKPRESSURE_V1`: at most one unresolved admitted fixed step; retain logical milliseconds; no per-tick FIFO, drop, skip, coalescing or concurrent async consumers.

`FRESH_LOOP_RESET_V1`: continuous and pause/resume preserve sub-step remainder while paused wall time is rejected; stop/start, unmount/remount and save/load fresh mount discard remainder.

Timed-Quest precision remains comparison-only. M21 offline authority remains bounded and timed Quests remain online-only during offline settlement.

## Human evidence boundary

Issue #109 remains open. Automation can prove implementation correctness and deterministic composition, but cannot prove fresh-player comprehension, pacing, fairness, enjoyment, emotional impact, retention or market preference.

Under the completion program this is not a blanket pre-Alpha development freeze. It becomes required evidence for Beta and final player-quality claims.

## Do not restart by inertia

M4–M26, post-M25 timing/content intelligence, the three-chapter friction repair, Player Insight/provenance, contextual causal dialogue, cross-domain Trait qualification and Copy routine/provenance packages are closed unless a new 1.0 blocker demonstrates a real need.

## Governing implementation rule

> **Every future 1.0 package must close a named completion requirement or a demonstrated blocker to one. Technical possibility alone is not authorization.**
