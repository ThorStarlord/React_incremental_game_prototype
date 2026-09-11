# Game Completion Roadmap — Campaign One / 1.0

**Status:** CURRENT AUTHORITY — ACTIVE COMPLETION PROGRAM / PROVISIONAL HUMAN-UNVALIDATED SCOPE  
**Prepared:** 2026-09-11  
**Parent authority:** `../GameCompletionDefinition.md`  
**Scope:** `../Features/FeatureScopeMatrix.md`  
**Progression:** `../Progression/GameProgressionArc.md`  
**Campaign:** `../Narrative/CampaignArchitecture.md`  
**Alpha:** `AlphaCompletionContract.md`  
**Beta:** `BetaCompletionContract.md`  
**Release:** `ReleaseQualificationContract.md`

## 1. Purpose

This roadmap replaces open-ended milestone accumulation with a bounded program whose stop condition is **Campaign One / 1.0**.

The governing question for every package is:

> Which explicit unsatisfied Game Completion requirement does this package close?

A package that cannot answer that question is not on the 1.0 critical path unless the completion definition is explicitly revised.

## 2. Current maturity

```text
Proof of concept                     PASS
Technical systems prototype          PASS
Integrated vertical slice            PASS
Playable Pre-Alpha                   CURRENT
Alpha                                NOT YET
Content Alpha                        NOT YET
Beta                                 NOT YET
Release Candidate                    NOT YET
1.0                                  NOT YET
```

The repository already demonstrates a real playable application shell and a qualified complete chapter loop. The remaining work is increasingly campaign completion, progression breadth, player-facing comprehension, content, and release quality rather than foundational architecture.

## 3. Program invariants

1. **Completion-driven scope:** every active package traces to a completion requirement.
2. **Content-first pressure:** prefer authoring against existing authorities; introduce abstractions only after repeated concrete friction.
3. **No automatic M-number continuation:** M26 closes the old provisional milestone sequence. There is no implied M27.
4. **One large critical-path package at a time:** avoid parallel architectural expansion that makes causal diagnosis difficult.
5. **Exact-head qualification:** every merge requires the current repository validation policy on the exact candidate.
6. **Human claims stay human:** automated/synthetic evidence never becomes player comprehension, fun, pacing, fairness, or retention evidence.
7. **Cut means cut:** `CUT`/`DEFER_POST_1_0` surfaces do not remain in player-facing navigation as promises of 1.0 work.
8. **Player judgment remains manual:** Copy/offline authority cannot expand into irreversible narrative/social/world decisions by implication.
9. **Finish before expand:** Chapters 8+, interplanetary content, generalized crafting/inventory, skill trees, New Game+, live-service systems, and generic simulation are outside the 1.0 critical path.

## 4. Critical path

```text
GC-00  Close inherited M26 + authority transition
  ↓
GC-01  1.0 player-surface scope cleanup
  ↓
GC-02  Prologue / onboarding vertical path
  ↓
GC-03  Connect existing Chapters 1–3 into legal campaign spine
  ↓
GC-04  Close relationship-derived buildcraft breadth floor
  ↓
GC-05  Close earned-delegation breadth floor
  ↓
GC-06  Chapter 4 — Lattice Under Strain
  ↓
GC-07  Chapter 5 — The Chrono-Crypt
  ↓
GC-08  Chapter 6 — Network Under Pressure
  ↓
GC-09  Chapter 7 — Counterphase
  ↓
GC-10  Telluric Echo finale + state-responsive epilogue
  ↓
GC-11  Whole-game Alpha qualification
  ↓
ALPHA_PASS
  ↓
GC-12  Content Alpha completion pass
  ↓
CONTENT_ALPHA
  ↓
GC-13  Beta: human review + UX/pacing/balance/reliability
  ↓
BETA_PASS
  ↓
GC-14  Release Candidate qualification
  ↓
1.0
```

Packages GC-04 and GC-05 may be satisfied partly inside campaign chapters rather than by isolated feature work. Do not create standalone feature packages if chapter implementation naturally closes the same requirements with clearer player meaning.

## 5. Package GC-00 — Close inherited M26 and transition authority

**State:** COMPLETE once the M26 exact-head candidate is green, merged, and the completion-program documentation is integrated.

### Requirements closed

- remove inherited red/open implementation work before beginning the completion program;
- finish provisional capability/mastery/delegation provenance;
- reconcile product authority from post-M25 milestone mode to game-completion mode.

### Evidence

Record in the M26 result:

- exact candidate SHA;
- Build Validation run;
- PR and merge SHA;
- the first failed candidate and narrow historical-test-contract repair.

### Exit

`main` contains qualified M26 plus this completion authority set.

## 6. Package GC-01 — 1.0 player-surface scope cleanup

**Zone:** REPOSITORY_ONLY  
**Priority:** first post-transition implementation package

### Completion requirements closed

- Alpha has no player-facing required-placeholder dependency;
- cut/deferred systems no longer appear as promised primary navigation;
- persistence is presented as one canonical save authority.

### Scope

- remove/disable primary navigation and routes for the separate `Skills` placeholder;
- remove/disable primary navigation and routes for generic `Crafting`;
- remove/disable general `Inventory` from primary 1.0 navigation while it is deferred;
- remove the duplicate/in-progress `Saves` placeholder or replace it only with a thin route to existing canonical save-management UI if that is genuinely simpler than removing it;
- correct stale navigation comments such as “future implementation” for systems already real;
- ensure Dashboard/quick navigation does not advertise cut/deferred systems as required progression;
- add focused routing/navigation rejection tests.

### Non-goals

- no new Inventory implementation;
- no skill tree;
- no crafting economy;
- no second persistence model;
- no visual redesign.

### Exit

A normal player sees only actual 1.0 gameplay surfaces or intentionally implemented support surfaces.

## 7. Package GC-02 — Prologue / onboarding vertical path

**Zone:** REPOSITORY_ONLY + authored content

### Completion requirements closed

- New Game -> first actionable problem;
- ordinary UI -> first meaningful Relationship interaction;
- early `action -> remembered consequence` grammar;
- no debug-only setup.

### Scope

Author the smallest production opening that:

1. starts from canonical fresh-game state;
2. gives one clear objective;
3. introduces one anchor Relationship naturally;
4. requires at least one active player action;
5. produces visible persistent Relationship evidence;
6. points naturally into Chapter 1;
7. survives save/load.

### Preferred anchor

Use Elder Willow if current content makes the route economical, because existing relationship/capability history already provides substantial production material. Do not force Willow if a fresh repository recon shows another anchor gives a cleaner legal opening.

### Non-goals

- no large tutorial framework;
- no universal quest pointer engine;
- no new onboarding slice unless a concrete state requirement cannot be represented otherwise.

### Exit

A fresh save can reach Chapter 1 through ordinary UI while experiencing the first causal relationship loop.

## 8. Package GC-03 — Campaign spine integration for Chapters 1–3

### Completion requirements closed

- existing qualified content becomes a legal beginning-to-midgame campaign sequence;
- Alpha campaign reachability no longer treats Chapters 1–3 as isolated projections.

### Scope

- define production entry/exit links for Merchant District Crisis, Archive Inquiry, and Enemies in Phase;
- use existing canonical evidence as prerequisites;
- keep chapter progress read-only/derived where possible;
- ensure route completion leaves legal evidence for the next campaign unit;
- preserve heterogeneous chapter shapes;
- add reachability qualification for Prologue -> Ch1 -> Ch2 -> Ch3.

### Non-goals

- no `ChapterEngine`;
- no chapter reducer/save root;
- no generalized narrative condition DSL;
- no requirement that all three chapters use identical route structures.

### Exit

The first three chapters form one legal production campaign spine from a fresh-game opening.

## 9. Package GC-04 — Relationship-derived buildcraft breadth

### Completion requirements closed

- 4 durable relationship-derived capability identities;
- at least 3 source anchor relationships;
- at least 2 cross-domain capabilities;
- at least 2 viable late-game build profiles.

### Execution policy

Before implementing, perform a **capability gap audit** against actual current production Traits and Chapters 1–3. Count what already satisfies the floor. Create only the smallest missing capabilities/applications.

Prefer:

```text
existing Relationship evidence
-> existing/new bounded Trait identity
-> explicit semantic use in campaign context
```

over generic skill trees or capability graphs.

### Exit

The required buildcraft floor is reachable through normal campaign play and materially changes legal solution space.

## 10. Package GC-05 — Earned-delegation breadth

### Completion requirements closed

- 3 personally mastered routine identities;
- at least 2 learning contexts;
- meaningful explicit delegation choice;
- whole-campaign persistence/offline compatibility for allowed work.

### Execution policy

First audit current routine familiarity/task definitions. Existing Forge Assistance and Trait Resonance calibration count only if they meet the completion definition in production play. Add the smallest missing third routine and/or second context through campaign content.

### Non-goals

- no automatic task chaining;
- no Copy planner;
- no narrative/offline decisions;
- no generic job/economy system.

### Exit

The player can progress from doing repeatable work personally to selectively delegating at least three understood routines, while Copy-specific readiness remains separate.

## 11. Package GC-06 — Chapter 4: Lattice Under Strain

### Completion requirements closed

- transition into networked mastery;
- multi-anchor historical consumption;
- Knowledge/Faction/World State begin converging on the campaign threat.

### Required package preregistration

Use the chapter acceptance template from `Narrative/CampaignArchitecture.md` before writing production behavior.

### Minimum chapter evidence

- prior Relationship histories from multiple anchors consumed;
- one Archive/Knowledge consequence consumed;
- NPC awareness divergence matters;
- institutional reaction remains independent from Relationship;
- at least one World State consequence;
- two legal response strategies;
- legal exit to the Chrono-Crypt problem.

### Exit

Chapter 4 is reachable, completable, save-compatible, and leaves canonical evidence required by Chapter 5.

## 12. Package GC-07 — Chapter 5: The Chrono-Crypt

### Completion requirements closed

- Lyra adversarial/cooperative history pays off;
- capability/build expression deepens;
- counterphase knowledge becomes a legal campaign result.

### Minimum chapter evidence

- authored location/travel access;
- Lyra callbacks;
- capability-sensitive active problem;
- at least two viable approaches including baseline where contract requires;
- durable Relationship/Memory consequence;
- counterphase principle recorded through existing Knowledge/Relationship/world authorities as appropriate;
- no generalized time-dilation narrative engine.

### Exit

A legal player can leave the crypt with the knowledge/relationship state needed for network preparation.

## 13. Package GC-08 — Chapter 6: Network Under Pressure

### Completion requirements closed

- multiple anchor histories matter simultaneously;
- information asymmetry and institutional consequence become strategic;
- delegation reduces preparation repetition.

### Minimum chapter evidence

- at least three anchor histories consumed;
- Knowledge asymmetry constrains one real choice;
- institutional standing matters;
- World State matters;
- build profiles expose different options;
- personally mastered preparation work exists;
- safe preparation can be delegated;
- major social/strategic decisions remain manual.

### Exit

The player has shaped which parts of the local network will enter the final preparation stage in what condition.

## 14. Package GC-09 — Chapter 7: Counterphase

### Completion requirements closed

- strategic synthesis;
- multiple legal preparation profiles;
- explicit player-owned final commitment.

### Minimum chapter evidence

- no universal “finale readiness” currency replacing canonical state;
- prior relationships/capabilities/Knowledge/Faction/World State expose preparation options;
- Copies execute only mastered safe work;
- player-facing causal explanation tells the player why major available options exist;
- irreversible commitment remains manual.

### Exit

At least two viable preparation profiles can legally enter the finale.

## 15. Package GC-10 — Telluric Echo finale + epilogue

### Completion requirements closed

- campaign has an end condition;
- finale consumes accumulated state;
- epilogue preserves causal history;
- campaign-complete state persists.

### Finale requirements

- legal reachability from ordinary campaign state;
- prior Relationship and capability state matter;
- Knowledge/Faction/World conditions influence support, tactics, costs, or aftermath where authored;
- at least two viable preparation/tactical profiles;
- no requirement to collect every optional capability;
- no offline/Copy auto-resolution of the final commitment.

### Epilogue requirements

Reflect at minimum:

- Lyra relationship outcome/interpretation;
- two other anchor callbacks;
- important institutional standing;
- at least one objective world consequence;
- capability/build contribution;
- network/delegation state where relevant.

### Exit

Normal UI produces a clear persisted Campaign One completion state and state-responsive epilogue.

## 16. Package GC-11 — Alpha qualification

### Completion requirements closed

Every checklist item in `AlphaCompletionContract.md`.

### Scope

- create `npm run alpha:validate`;
- expand content reachability/intelligence to the full Campaign One production spine;
- qualify fresh New Game -> campaign completion through production-equivalent actions;
- qualify representative divergent history;
- verify capability/delegation floors;
- verify save/load at early, mid, pre-finale, and completed boundaries;
- prove prohibited offline authorities remain unchanged;
- prove no debug-only progression dependency.

### Exit

`ALPHA_PASS` on one exact candidate head.

## 17. Package GC-12 — Content Alpha completion pass

### Goal

Turn structural Alpha into a fully authored beginning-to-ending game.

### Scope

- replace temporary/diagnostic prose in campaign content;
- finish all required dialogue/quest/encounter/consequence text;
- ensure all anchor arcs receive required callbacks;
- ensure finale/epilogue variants are authored;
- remove every required campaign placeholder;
- preserve scope lock.

### Rule

Content may expose a real system deficiency. If so, classify the deficiency and repair the smallest layer. Do not reopen speculative architecture merely because content volume increased.

### Exit

`CONTENT_ALPHA`: fresh save -> fully authored ending with no required placeholder content.

## 18. Package GC-13 — Beta

### Goal

Make the complete game player-usable and release-worthy.

### Required workstreams

- fresh-player comprehension/discoverability;
- human end-to-end runs;
- pacing and balance;
- save/recovery robustness;
- bug triage;
- accessibility baseline;
- visual/terminology consistency;
- desktop browser qualification;
- performance on representative late-game state.

### Human floor

Use `BetaCompletionContract.md`: minimum 5 fresh first-session observations and 3 beginning-to-ending external playthroughs, with provenance, unless a later explicit authority revises the evidence policy.

### Exit

`BETA_PASS` with no blocker/critical defect and all required human/technical evidence.

## 19. Package GC-14 — Release Candidate / 1.0

### Goal

Qualify one exact production candidate.

### Scope

- create/execute `npm run release:validate` for automatable gates;
- qualify current stable Chromium-class and Firefox desktop targets;
- run clean-storage New Game -> Epilogue release scenario;
- run representative divergent campaign history;
- qualify save/import-export/recovery/offline boundaries;
- set intentional `1.0.0` release metadata;
- remove prototype/pre-alpha wording from player-facing/current release docs;
- create exact RC result and release notes;
- fix only release blockers after RC creation, requalifying every changed candidate.

### Exit

Promote exact candidate to `1.0` only when `ReleaseQualificationContract.md` passes and no release-blocking defect remains.

## 20. Requirement-to-package matrix

| Completion requirement | Primary package(s) |
| --- | --- |
| clean current baseline / M26 closure | GC-00 |
| remove misleading cut/deferred placeholders | GC-01 |
| New Game / onboarding / first consequence | GC-02 |
| legal Ch1–3 campaign spine | GC-03 |
| capability breadth/build profiles | GC-04 and campaign chapters |
| routine/delegation breadth | GC-05 and campaign chapters |
| network threat escalation | GC-06 |
| Lyra/crypt/counterphase discovery | GC-07 |
| whole-network strategic pressure | GC-08 |
| finale preparation | GC-09 |
| campaign ending + epilogue | GC-10 |
| entire structural game / deterministic Alpha | GC-11 |
| complete authored content | GC-12 |
| human comprehension / pacing / balance / polish | GC-13 |
| production release evidence | GC-14 |

## 21. Package ordering and dependency policy

The roadmap is dependency-ordered, not calendar-estimated.

Allowed deviations:

- merge GC-04/GC-05 work into a chapter package when the chapter is the natural source of the missing capability/routine;
- split a chapter package when it becomes too large to qualify causally;
- execute a small blocker repair before its owning package if it is required for safe progress.

Not allowed without explicit roadmap revision:

- starting the finale before required preparation state is defined;
- building post-1.0 systems while critical-path campaign units are missing;
- using human-validation absence as justification for declaring Beta/RC;
- reintroducing a generic milestone series detached from the completion definition.

## 22. Status notation

Use this queue in `STATUS.md`:

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

Mark GC-00 `[x]` only after M26 and the completion-program authority PR are both integrated.

## 23. Program stop condition

The completion program stops at 1.0 when:

```text
GameCompletionDefinition satisfied
AND FeatureScopeMatrix has no critical-path uncertainty
AND Campaign One is playable and authored New Game -> Epilogue
AND ALPHA_PASS
AND CONTENT_ALPHA
AND BETA_PASS
AND ReleaseQualificationContract PASS on exact RC
AND no release-blocking defects remain
```

Everything beyond that becomes 1.1, expansion, sequel/campaign work, or a separately authorized program.
