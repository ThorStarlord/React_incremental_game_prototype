# Repository Status — Feature Completion / Campaign One Product Depth

**Status date:** 2026-09-24  
**Pre-activation main baseline:** `4b725286eadaf6b2c61076e532b0f48513a3687e`  
**Current maturity:** `CONTENT_ALPHA / HUMAN-UNVALIDATED`  
**Current strategic stage:** `FEATURE_COMPLETION / PRODUCT_DEPTH`  
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
**GC-14 promotion guard:** `QUALIFIED / RC_ENTRY_BLOCKED / 1.0_PROMOTION_BLOCKED`  
**Human Product Review:** issue #109 `OPEN / UNPROVEN`  
**Human evidence floor:** `0 / 5` accepted fresh-player first sessions; `0 / 3` accepted external full playthroughs  
**Active program:** Campaign One / 1.0 Feature Completion  
**Feature Completion Gap Analysis:** `COMPLETE / CURRENT`  
**Candidate B depth specification:** `IMPLEMENTED / BOUNDED L3 EXIT SATISFIED`  
**Candidate A depth:** `BOUNDED L3 EXIT SATISFIED / HUMAN-UNVALIDATED`  
**Current implementation frontier:** `Candidate C — Strategic consequence composition`

## Current authority

Read in this order:

1. [`AGENTS.md`](AGENTS.md) — coding-agent behavior and evidence-to-authority rules.
2. [`docs/CURRENT.md`](docs/CURRENT.md)
3. [`specification/GameCompletionDefinition.md`](specification/GameCompletionDefinition.md)
4. [`specification/Features/FeatureScopeMatrix.md`](specification/Features/FeatureScopeMatrix.md)
5. [`specification/Progression/GameProgressionArc.md`](specification/Progression/GameProgressionArc.md)
6. [`specification/Narrative/CampaignArchitecture.md`](specification/Narrative/CampaignArchitecture.md)
7. [`specification/Technical/GameCompletionRoadmap.md`](specification/Technical/GameCompletionRoadmap.md)
8. relevant [`Alpha`](specification/Technical/AlphaCompletionContract.md) / [`Beta`](specification/Technical/BetaCompletionContract.md) / [`Release`](specification/Technical/ReleaseQualificationContract.md) contract
9. [`RUNBOOK.md`](RUNBOOK.md) and [`specification/README.md`](specification/README.md)

`STATUS.md` owns current state. The completion records above own the path to 1.0.

## Big picture

The project has passed proof-of-concept, technical-prototype, bounded vertical-slice, whole-game traversal, authored-campaign integration, and deterministic Beta-readiness qualification. Campaign One has a production-equivalent New Game -> Prologue -> Chapters 1-7 -> Telluric Echo finale -> state-responsive Epilogue path, with canonical persistence checkpoints and authored route variants.

Those results establish **integration maturity**, not automatic **feature maturity**. Several core gameplay systems remain deliberately narrow: Combat is a bounded MVP; Doctrine specialization has two established profiles with its first major production consumer in GC06; and Standing Orders / exception escalation currently have one Archive Verification vertical slice. The historical `CONTENT_ALPHA / HUMAN-UNVALIDATED` and `TECHNICAL_BETA_READY` records remain valid evidence about what was qualified, but they no longer imply that repository-owned feature construction is finished.

## Current goal — feature completion / product depth

The active optimization target is:

> **Develop the existing core game systems from bounded or vertical-slice implementations into sufficiently deep, interconnected, player-facing features before dedicated Beta/release hardening becomes the repository-wide frontier.**

Current work should:

1. use [`FeatureCompletionGapAnalysis.md`](specification/Technical/FeatureCompletionGapAnalysis.md) as the completed breadth pass across `CORE_1_0` systems;
2. deepen the selected candidates in order of current expected value: **B Mastery Compression / Copy organization**, **A relationship-derived capability buildcraft**, then **C strategic consequence composition**;
3. perform depth analysis before each implementation package rather than expanding by subsystem symmetry;
4. build depth primarily inside existing authorities and Campaign One scope rather than inventing generalized engines;
5. preserve all historical qualification evidence while refusing to treat a passed bounded milestone as proof that its associated feature is finished.

The **scope boundary remains bounded**: Chapters 8+, interplanetary continuation, generic Crafting/Skills, autonomous irreversible Copy planning, generalized simulation, New Game+, and other post-1.0 expansion remain outside current authority. What is reopened is **depth within the existing core product**, not arbitrary scope growth.

Dedicated Beta convergence, release hardening, immutable RC qualification, and 1.0 promotion remain downstream gates. Human evidence under issue #109 remains valid and useful, but it does not own the current repository work queue while core features remain below feature-complete maturity.

Use explicit evidence provenance throughout feature development:

```text
DETERMINISTIC_FINDING -> implementation behavior within exercised evidence
HEURISTIC_FINDING     -> plausible design/UX/depth risk
SYNTHETIC_FINDING     -> reproducible automated/simulated player-facing risk
HUMAN_FINDING         -> actual recorded participant experience
```

A green vertical slice is evidence that a feature **can work**. It is not, by itself, evidence that the feature is **complete**.

## Product direction

Current provisional hierarchy:

```text
Primary promise      -> relationship-derived capability buildcraft
Supporting identity  -> causal legibility
Incremental identity -> earned delegation / mastery compression
Architecture         -> heterogeneous authored composition
```

This may guide bounded reversible development under the provisional governance decision. It does **not** prove fresh-player comprehension, fun, pacing, fairness, retention or preference.

### Bounded Mastery Compression feature development — Standing Orders

Explicit owner direction extends the existing earned-delegation identity with one
bounded Archive Verification standing responsibility.

The current authority is
[`CopyStandingOrdersAndExceptionEscalationResult.md`](specification/Technical/CopyStandingOrdersAndExceptionEscalationResult.md).

The scope revision is deliberately narrow:

```text
personally mastered Archive Verification
+ player-enabled Standing Order
+ authored verification backlog
+ eligible idle Copy
-> one bounded unit may start on a later live fixed tick

source contradiction
-> no ordinary reward
-> persistent Copy Exception
-> notification + Player Insight
-> player-owned authored resolution required
```

The existing `routinePriority`, one-active-task, production eligibility, fixed-step
GameLoop, and M21 offline boundaries remain authoritative. Normal standing work is
quiet; exceptions preserve player attention.

This does **not** authorize generic task queues, arbitrary repeat loops, autonomous
Copy strategy, offline standing selection/chaining, or irreversible
narrative/social/world decisions. Those remain outside Campaign One scope.

Dedicated deterministic qualification:

```bash
npm run copy-standing-orders:validate
```

This vertical slice is repository-implemented but remains an **initial bounded feature slice / HUMAN-UNVALIDATED**. It does
not establish that fresh players understand, prefer, or enjoy the standing-order
UX or its exception frequency.

### Mastery Compression organizational-legibility foundation

A bounded read-only projection now makes the existing delegation ladder legible
without creating a new reducer, save authority, planner, or task identity.

Current bounded feature record:
[`MasteryCompressionProcedureFamiliesResult.md`](specification/Technical/MasteryCompressionProcedureFamiliesResult.md).

```text
Resonance Calibration + Archive Verification
-> Network Assurance

Network Assurance + Forge Assistance personal mastery
-> Known-State Stewardship READY

READY + active authored Archive standing responsibility
-> OPERATING

OPERATING + unresolved exception
-> ATTENTION REQUIRED
```

Player Insight exposes the procedure-family/domain distinction, standing
responsibility ownership, and the reason an exception crossed the automation
boundary. The state-responsive epilogue can report which mastered work has
become quiet standing responsibility while preserving player judgment for
unknown conditions.

Candidate B's selected second standing responsibility is now integrated. Archive Verification and Forge Assistance jointly demonstrate two operational contexts, role/location differentiation, contradiction versus structural-deviation exceptions, and a small multi-Copy responsibility network. PR #154 exact head `70c24d5a11c4238c60e1fdee9f83eb9164dd35f0` passed Build Validation #468 / run `36120244452` and merged as `fbc19da437c0cfc7b0cd6dd9078741bc8b19f9f3`.

This satisfies the bounded Candidate B L3 exit test. Do not add Resonance Calibration or another standing responsibility by symmetry; reopen Candidate B only for a materially different player responsibility or a later concrete completion defect.

Campaign One's organizational ceiling remains:

```text
player
-> specialized Copies
-> player-authored routine priorities
-> authored standing responsibilities
-> exception escalation back to player
```

Managers-of-managers, Copy-authored strategy, generic behavior planners,
irreversible delegated decisions, and offline standing-order selection/chaining
remain outside scope.

### Bounded capability-specialization feature development

The current Trait/Player authority distinguishes durable learned capability from current specialization without adding a second skill tree:

```text
player.permanentTraits -> durable learned capability
player.doctrineFocus   -> currently foregrounded permanent principles
derived doctrine       -> emergent active build profile
```

Campaign One doctrine derivation is intentionally limited to the two already-established profiles, **Structural Steward** and **Countermodeler**. The normal Traits surface exposes eligible doctrine adoption/switching/clearing with permanent-Trait provenance, and Player Insight reports the active doctrine read-only. GC06 establishes the first current-specialization decision; GC08 preparation and GC10 finale routes now consume active doctrine where the player is explicitly selecting or carrying a strategic posture. GC07 and GC09 intentionally remain permanent-Trait-pair gates, preserving learned capability value without requiring repetitive doctrine switching. Save schema v2 persists doctrine focus while old saves migrate to neutral empty focus rather than receiving invented specialization.

This is bounded feature development of the primary relationship-derived capability-buildcraft promise. Its successful implementation proves the specialization interaction exists; it does not establish that capability buildcraft has reached sufficient finished-game depth. Deterministic/UI qualification now proves the interaction path exists and changes GC06 availability; fresh-player comprehension, usability, balance, enjoyment, and preference remain unproven.

Candidate A's bounded depth sequence now closes the repository-owned L3 gap without adding a third doctrine or a larger Trait catalogue. Player Trait slots, permanent Resonance pricing, temporary/share staging, doctrine focus, and Player Insight remain distinct authorities. Structural Steward and Countermodeler are repeatedly consumed at GC06, GC08 preparation, and GC10, while GC07/GC09 intentionally remain permanent-capability pair gates.

All four canonical source capabilities now have independent cross-domain use. Willow/Elara already span Quest + Combat; `ConstraintSense` and `AdversarialCalibration` now each span GC08 Quest + permanent-Trait-gated Dialogue, with authored Relationship Experience consequences. Selector presentation and direct thunk execution enforce the same permanent Player Trait authority. Focused validation remains `npm run trait-depth:validate`.

This is a bounded repository-depth exit, not a human product claim. Comprehension, switching value, temporary-attunement prominence, balance, enjoyment and preference remain HUMAN-UNVALIDATED. The active feature-completion frontier is now Candidate C — strategic consequence composition.

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

GC-04 through GC-12 are closed by integrated implementation plus exact-head qualification. GC-13 repository-controlled technical preparation is qualified by Build Validation #394, including Chromium + Firefox CI smoke. The **human-evidence lane** remains open under issue #109 while bounded repository-answerable hardening may continue concurrently. GC-14's promotion guard remains qualified and correctly blocks RC/1.0 entry until the current Beta contract produces a real BETA_PASS. Automation must neither expand scope merely because the external gate remains open nor treat that external gate as a universal stop signal.

## Pre-Beta player-surface hygiene

A bounded repository-only audit found release-facing residue that did not justify new systems: prototype/debug controls embedded in normal NPC/Essence pages, deferred Equipment wording, internal tick terminology, no-op Settings import/export actions, and an unreachable legacy `GamePage` with origin-wide reset behavior. PR #139 removed those affordances and extended GC-01 regression coverage. Exact head `4a64d8d53aea1a9c3385894ac89af570dec778d7` passed Build Validation #419 / run `35680087869` before merge as `4b725286eadaf6b2c61076e532b0f48513a3687e`. This does **not** create human product evidence or change the Campaign One feature/content scope.

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

Issue #109 remains open. Automation and repository analysis cannot prove fresh-player comprehension, fairness, enjoyment, emotional impact, retention or market preference, and synthetic/model-assisted review must never be relabeled as human observation.

That epistemic boundary is **not** an execution freeze. Deterministic, heuristic and synthetic evidence may still expose concrete risks and justify bounded repairs to the already-authorized Campaign One. Human evidence remains required for the human-experience claims and promotion conditions owned by the current Beta contract.

## Do not restart by inertia

M4–M26, GC-01 through GC-12, post-M25 timing/content intelligence, the three-chapter friction repair, Player Insight/provenance, contextual causal dialogue, cross-domain Trait qualification and Copy routine/provenance packages are closed unless a new 1.0 blocker demonstrates a real need.

## Governing implementation rule

> **Every future 1.0 package must improve an already-authorized Campaign One / release surface through a named requirement or a concrete deterministic, heuristic, synthetic, or human finding. Technical possibility alone is not authorization; missing human evidence alone is not a universal stop condition.**

Continue bounded repository-answerable hardening until no remaining intervention has material expected value, the next change would expand unauthorized scope, or a genuine owner/external boundary is reached.


## Concurrent release-hardening reconciliation

The 2026-09-20 release-hardening merge contributed useful persistence, browser, security, architecture, and release-evidence tooling. A parallel `campaign-one-content` implementation from its older baseline was removed during GC-12 reconciliation because GC-06 through GC-10 already own the campaign and the parallel layer was not wired into production runtime authority.

Release-hardening records under `docs/release/` are preparation/reference until GC-13/GC-14 entry conditions are actually met. They do not supersede issue #109 or create `BETA_PASS` / RC authority.
