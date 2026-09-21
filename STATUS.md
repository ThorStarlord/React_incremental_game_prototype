# Repository Status — Content Alpha / Campaign One Completion

**Status date:** 2026-09-20  
**Reconciled base before GC-12 merge:** `02f06426e05c345380e51ae19a1061b5ed5e1bb2`  
**Current maturity:** `CONTENT_ALPHA / HUMAN-UNVALIDATED`  
**Provisional Product Direction:** `SELECTED / HUMAN-UNVALIDATED`  
**M26:** `COMPLETE / INTEGRATED`  
**GC-01:** `COMPLETE / INTEGRATED`  
**GC-02:** `COMPLETE / INTEGRATED`  
**GC-03:** `COMPLETE / INTEGRATED`  
**GC-04/05:** `COMPLETE / INTEGRATED`  
**GC-06:** `COMPLETE / INTEGRATED`  
**GC-07:** `COMPLETE / INTEGRATED`  
**GC-08:** `COMPLETE / INTEGRATED`  
**GC-09:** `COMPLETE / INTEGRATED`  
**GC-10:** `COMPLETE / INTEGRATED`  
**GC-11 Alpha:** `ALPHA_PASS / HUMAN_UNVALIDATED`  
**GC-12 Content Alpha:** `CONTENT_ALPHA / HUMAN_UNVALIDATED`  
**GC-13 deterministic readiness:** `TECHNICAL_BETA_READY / HUMAN_EVIDENCE_BLOCKED / BETA_PASS=NO`  
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

The project has passed proof-of-concept, technical-prototype, bounded vertical-slice, whole-game Alpha, and authored-content completion stages. Campaign One now has a qualified production-equivalent New Game -> Prologue -> Chapters 1-7 -> Telluric Echo finale -> state-responsive Epilogue path, with canonical persistence checkpoints and complete authored route variants.

It is therefore best described as **Content Alpha / HUMAN-UNVALIDATED** with **TECHNICAL_BETA_READY** deterministic engineering evidence. Structural and authored campaign completion are integrated; Chromium and Firefox visible-UI smoke now pass in CI. Fresh-player comprehension, pacing, balance, human accessibility review, full external playthrough evidence, immutable RC/deployment identity, and final release qualification remain intentionally unclaimed.

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

## GC-01 closure

PR #117 is integrated:

```text
qualified candidate: caabc1581316dab33f7eeb98dac9b32072ec57df
Build Validation #343 / run 34629859287: PASS
merge commit: ff829ce6ee4da8a693adfb783fe843775403326d
```

GC-01 removes the cut/deferred Skills, Crafting, general Inventory and duplicate-save placeholders from primary Campaign One player navigation while preserving compatibility IDs and the existing Main Menu persistence authority. It adds focused positive/rejection qualification through `npm run gc01:validate` and does not add any new progression system or persistence model.

GC-04 through GC-12 are closed by integrated implementation plus exact-head qualification. GC-13 repository-controlled technical preparation is qualified by Build Validation #394, including Chromium + Firefox CI smoke. The active Beta responsibility is now the **genuine human evidence required by issue #109**; automation must not expand scope merely because that external gate remains open.

## Finished-game target

Campaign One / 1.0 is now explicitly bounded by [`GameCompletionDefinition.md`](specification/GameCompletionDefinition.md):

> A narrative incremental RPG in which consequential relationships teach durable capabilities, remembered history explains why later options exist, and personally understood repetition can be deliberately delegated so the player increasingly focuses on novel strategic and relational decisions.

Campaign One ends on the isolated planet with the Telluric Echo finale and a state-responsive epilogue.

## Campaign spine

```text
Prologue                                      [integrated]
Chapter 1 — Merchant District Crisis          [integrated / connected]
Chapter 2 — Archive Inquiry                   [integrated / connected]
Chapter 3 — Enemies in Phase                  [integrated / connected]
Chapter 4 — Lattice Under Strain              [integrated]
Chapter 5 — The Chrono-Crypt                  [integrated]
Chapter 6 — Network Under Pressure            [integrated]
Chapter 7 — Counterphase                      [integrated]
Finale — The Telluric Echo                    [integrated]
Epilogue — state-responsive aftermath         [integrated]
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
[x] GC-01 1.0 player-surface scope cleanup
[x] GC-02 Prologue / onboarding
[x] GC-03 Chapters 1–3 campaign integration
[x] GC-04 Buildcraft breadth
[x] GC-05 Earned-delegation breadth
[x] GC-06 Chapter 4 — Lattice Under Strain
[x] GC-07 Chapter 5 — The Chrono-Crypt
[x] GC-08 Chapter 6 — Network Under Pressure
[x] GC-09 Chapter 7 — Counterphase
[x] GC-10 Finale + Epilogue
[x] GC-11 Alpha qualification
[x] GC-12 Content Alpha completion
[ ] GC-13 Beta
[ ] GC-14 Release Candidate / 1.0
```

GC-04/GC-05 may be satisfied within chapter packages where that is the natural content-driven implementation; package numbering must not force redundant feature work.

## Maturity gates

**Alpha:** ordinary fresh save can traverse New Game -> Prologue -> Chapters 1–7 -> Finale -> Epilogue, all required systems exist at required scope, no debug-only progression. Alpha may still be explicitly human-unvalidated.

**Content Alpha:** **PASS / HUMAN-UNVALIDATED**. The complete bounded campaign is fully authored; no required content placeholder remains.

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

M4–M26, GC-01 through GC-12, post-M25 timing/content intelligence, the three-chapter friction repair, Player Insight/provenance, contextual causal dialogue, cross-domain Trait qualification and Copy routine/provenance packages are closed unless a new 1.0 blocker demonstrates a real need.

## Governing implementation rule

> **Every future 1.0 package must close a named completion requirement or a demonstrated blocker to one. Technical possibility alone is not authorization.**


## Concurrent release-hardening reconciliation

The 2026-09-20 release-hardening merge contributed useful persistence, browser, security, architecture, and release-evidence tooling. A parallel `campaign-one-content` implementation from its older baseline was removed during GC-12 reconciliation because GC-06 through GC-10 already own the campaign and the parallel layer was not wired into production runtime authority.

Release-hardening records under `docs/release/` are preparation/reference until GC-13/GC-14 entry conditions are actually met. They do not supersede issue #109 or create `BETA_PASS` / RC authority.
