# Repository Runbook — Game Completion Program

**Current maturity:** CONTENT_ALPHA / HUMAN-UNVALIDATED  
**Repository-controlled readiness:** TECHNICAL_BETA_READY  
**Active program:** Campaign One / 1.0 Feature Completion  
**Current strategic stage:** FEATURE_COMPLETION / PRODUCT_DEPTH  
**Human Product Review:** issue #109 OPEN / UNPROVEN — 0/5 first sessions, 0/3 full external runs

This file owns **operational procedure**. It does not define what the finished game is; that authority belongs to `specification/GameCompletionDefinition.md`.

## Required re-entry order

For every new coding-agent / engineering session:

```text
latest main
-> AGENTS.md
-> STATUS.md
-> docs/CURRENT.md
-> HANDOFF.md when present for the latest session
-> specification/GameCompletionDefinition.md
-> specification/Features/FeatureScopeMatrix.md
-> specification/Progression/GameProgressionArc.md
-> specification/Narrative/CampaignArchitecture.md
-> specification/Technical/GameCompletionRoadmap.md
-> relevant Alpha/Beta/Release contract
-> affected current domain contract/result
-> RUNBOOK.md commands/procedure
-> fresh current-frontier reconciliation
```

Do not start from an old milestone queue. Do not infer M27 from M26. Ask both:

> Which `CORE_1_0` feature is still below sufficient player-facing maturity for its intended role?

> What breadth/depth/progression/cross-system evidence demonstrates the gap, and what bounded feature development would close it?

GC-01 through GC-12 remain integrated and deterministic Beta readiness remains qualified as historical evidence. Current repository work is **Feature Completion / Product Depth**; Beta convergence and release hardening are downstream after required core features reach sufficient L4 maturity.

## Environment

Repository CI uses Node.js 20.

```bash
npm ci
npx tsc --noEmit
npm run build
```

## Verify current main

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

When qualifying a branch against current `main`:

```bash
git fetch origin
git merge-base --is-ancestor origin/main HEAD
```

If `main` moved, reconcile the candidate and rerun authoritative validation on the new exact head.

## Feature-completion work intake

Before creating an implementation branch, record:

```text
1. Intended player-facing role of the current CORE_1_0 feature
2. Current maturity: L0 Scaffold / L1 Vertical Slice / L2 Integrated / L3 Developed / L4 Feature Complete / L5 Hardened / L6 Release Qualified
3. Evidence class: DETERMINISTIC / HEURISTIC / SYNTHETIC / HUMAN
4. Concrete breadth/depth/progression/cross-system gap
5. Current authority owning the behavior
6. Highest-value rationale relative to other feature candidates
7. Bounded proposed intervention
8. Explicit non-goals / scope boundary
9. Positive acceptance criteria
10. Negative/rejection criteria
11. Save/persistence impact
12. Claim ceiling after the work
13. Diminishing-returns / stop condition
```

A package must trace to an already-authorized Campaign One feature and concrete evidence. It need not wait for human observation when deterministic, heuristic, or synthetic evidence demonstrates missing feature depth.

### Scope lookup

Use:

```text
specification/GameCompletionDefinition.md
specification/Features/FeatureScopeMatrix.md
```

If a requested system is `CUT` or `DEFER_POST_1_0`, do not implement it merely because a historical spec or placeholder exists. Promotion requires an explicit scope revision with concrete campaign evidence.

## Current Game Completion queue

Canonical queue: `specification/Technical/GameCompletionRoadmap.md`.

```text
[x] GC-00  M26 closure + completion-program authority
[x] GC-01  1.0 player-surface scope cleanup
[x] GC-02  Prologue / onboarding
[x] GC-03  Chapters 1–3 campaign integration
[x] GC-04  Buildcraft breadth
[x] GC-05  Earned-delegation breadth
[x] GC-06  Chapter 4 — Lattice Under Strain
[x] GC-07  Chapter 5 — The Chrono-Crypt
[x] GC-08  Chapter 6 — Network Under Pressure
[x] GC-09  Chapter 7 — Counterphase
[x] GC-10  Finale + Epilogue
[x] GC-11  Alpha qualification
[x] GC-12  Content Alpha / authored-spine integration evidence
[>] CURRENT  Feature Completion Gap Analysis across CORE_1_0 systems
[ ] NEXT     Breadth search -> depth analysis -> bounded feature-development packages
[ ] GATE     FEATURE_COMPLETE — required core features reach sufficient L4 depth
[ ] GC-13    Beta — technical readiness already qualified; convergence + human evidence after FEATURE_COMPLETE
[ ] GC-14    Release Candidate / 1.0 — promotion guard qualified; RC entry blocked until BETA_PASS
```

The roadmap may merge/split packages where content proves that clearer, but requirement traceability must remain explicit.

## Branch / PR procedure

Default bounded workflow:

```text
1. sync latest main
2. read current completion/domain authority
3. create one bounded work/<name> or docs/<name> branch
4. implement only the current package
5. run focused positive + rejection qualification
6. run native checks
7. push/open PR
8. require exact-head Build Validation
9. verify PR head and main have not moved
10. merge only green exact candidate
11. reconcile STATUS / docs/CURRENT / specification authority when state changes
12. stop or move to the next explicitly authorized package
```

Do not combine unrelated architecture cleanup into a content package.

## Documentation authority qualification

Run whenever current authority, completion scope, handoff state, CI governance, or entrypoints change:

```bash
npm run docs:authority:validate
```

The validator must represent the current game-completion authority chain and continue rejecting silent restoration of retired Gemini review authority.

## GC-01 integrated qualification

GC-01 is integrated on `main`.

Focused command:

```bash
npm run gc01:validate
```

Integrated evidence:

```text
PR:                  #117
branch:              work/gc01-player-surface-scope-cleanup
qualified candidate: caabc1581316dab33f7eeb98dac9b32072ec57df
Build Validation:    #343 / run 34629859287 / PASS
merge commit:        ff829ce6ee4da8a693adfb783fe843775403326d
```

The focused qualification includes positive and rejection coverage for cut/deferred/duplicate-save navigation, required current surfaces, fail-closed legacy game routes, and preservation of Main Menu persistence authority.

Do not recreate Skills, generic Crafting, general Inventory, or a duplicate save model as follow-up work unless current 1.0 scope authority is explicitly revised from new campaign evidence.

## Authoritative CI and exact-head merge rule

Executable authority:

```text
.github/workflows/build-validation.yml
```

For a PR:

```bash
gh pr checks <PR_NUMBER> --watch
gh pr view <PR_NUMBER> --json headRefOid,baseRefOid
```

Merge authority applies only to the exact candidate that passed.

Current general merge rule:

```text
Build Validation
+ current package acceptance criteria
+ any separately declared authoritative external/human gate for the claimed maturity state
```

A queued check is not a passing check. A green CI run is never permission to claim human comprehension, fun, pacing, fairness or retention.

## Core local validation

```bash
npm ci
npm run docs:authority:validate
npm run gc01:validate
npm run gc02:validate
npm run gc03:validate
npm run alpha:validate
npm run content-alpha:validate
npm run beta:technical:validate
npm run release:browser -- --browser all
npm run gc14:validate
npm run release:rc:eligibility
npm run release:promotion:eligibility
npm run content:intelligence:validate
npm run chapter:validate
npm run m26:validate
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

`chapter:validate` already runs at the tail of `content:intelligence:validate`; the standalone command is useful for focused diagnosis.

Build Validation remains final executable authority because it also runs live UI smoke and the accumulated technical/milestone gates.

## M26 integrated qualification

Focused command:

```bash
npm run m26:validate
```

M26 exact candidate:

```text
9b9b0380f0a2bb23d89036a8b0b133a7ffe133cf
Build Validation #340 / run 34624393744: PASS
PR #114 merge: 7f306f3b6a69a27c250c1986df976cc518119821
```

M26 qualifies only read-only capability/mastery/delegation provenance and preserves existing authority. It is not authorization for M27 or autonomous Copy expansion.

## Content intelligence and chapter-definition integrity

```bash
npm run content:intelligence:validate
npm run chapter:validate
```

Current chapter integrity rejects:

- duplicate chapter IDs;
- duplicate route IDs within a chapter;
- empty route requirements;
- duplicate route requirements;
- dangling Relationship Experience requirements;
- dangling completed-dialogue requirements.

Completed-dialogue validation mirrors the bounded runtime content sources:

```text
public/data/dialogues.json
public/data/m24-world-state-content.json -> dialogues
public/data/m25-chapter-content.json -> dialogues
```

Do not simplify back to base `dialogues.json`; Build Validation #335 demonstrated the false-dangling failure that creates.

### Completion-program expansion rule

As GC-02→GC-10 add production campaign content, content-intelligence qualification must grow to cover the actual complete production spine. Do not add a new validator framework merely for naming consistency; extend the existing content/requirement checks until repeated evidence proves a different abstraction necessary.

## Existing post-M25 focused qualification

### Second heterogeneous chapter

```bash
CI=true npm test -- --watchAll=false --runInBand PostM25SecondChapterQualification.test.ts
```

### Player Insight

```bash
CI=true npm test -- --watchAll=false --runInBand PostM25PlayerInsightsQualification.test.ts
```

### Product-depth package set

```bash
CI=true npm test -- --watchAll=false --runInBand \
  PostM25RuleOfTwoChapterArchitecture.test.ts \
  PostM25ContextualCausalLegibility.test.ts \
  PostM25CrossDomainTraitBuildcraft.test.ts \
  PostM25ThirdHeterogeneousChapterQualification.test.ts \
  PostM25CopyRoutineStrategy.test.ts
```

These are regression authorities for already integrated behavior. Do not reinterpret them as open work queues.

## Synthetic player-facing review tooling

Static/rejection contracts:

```bash
npm run simulated-review:validate
npm run simulated-review:action-contract
```

UI-only live smoke prerequisites:

```bash
npx playwright install --with-deps chromium
```

Terminal 1:

```bash
HOST=127.0.0.1 PORT=3000 BROWSER=none npm start
```

Terminal 2:

```bash
npm run simulated-review:smoke
```

Synthetic observation must not use Redux/local-storage/debug state as a player oracle when it claims UI-only observation.

Synthetic observation is **not human Product Review evidence**.

## GameLoop timing qualification

The full exact commands live in `.github/workflows/build-validation.yml`; use that file rather than copying an old milestone list.

Key focused categories that remain mandatory regression authority:

```text
scheduler characterization
async backpressure contract
bounded backlog repair
lifecycle remainder
large-frame/background-stall behavior
mid-session cadence transition
backpressure x cadence stress
cross-progression determinism/drift
timed Quest unit/integration/precision
live/offline boundary
```

### `SERIAL_BACKPRESSURE_V1`

At most one unresolved admitted fixed step; retain logical milliseconds; no per-tick FIFO; no drop/skip/coalescing/concurrent async consumers.

### `FRESH_LOOP_RESET_V1`

Continuous execution and pause/resume preserve sub-step remainder; paused wall time is rejected. Stop/start, unmount/remount and save/load into a fresh mount discard remainder.

Timed-Quest precision remains comparison-only. Do not rewrite raw/persisted timer values to hide floating-point comparison noise.

## Offline authority

M21 remains the bounded allowlist.

Offline settlement may advance only explicitly authorized safe work/passive progression. It must not infer or perform:

- Relationship decisions;
- Knowledge transfer;
- Faction decisions;
- World-State decisions;
- travel;
- combat;
- narrative conclusions;
- timed-Quest progress under current authority;
- new Copy task choice.

## Save/persistence qualification

Every package that changes campaign progression must state whether it changes:

- canonical state shape;
- serialization;
- migration;
- save/load reachability;
- offline snapshot meaning;
- one-time idempotency.

Prefer no new save root unless a current completion requirement truly introduces new canonical state.

Campaign work should progressively add representative save/load qualification at early, mid, pre-finale and completed boundaries, culminating in Alpha/RC contracts.

## Alpha operating gate

Authority: `specification/Technical/AlphaCompletionContract.md`.

Alpha is **PASS / HUMAN-UNVALIDATED** and GC-11 is integrated.

The aggregate qualification command exists:

```bash
npm run alpha:validate
```

Use it as regression authority when changes can affect whole-game structural completion.

`ALPHA_PASS` requires a legal normal-player path:

```text
New Game
-> Prologue
-> Chapters 1–7
-> Telluric Echo finale
-> state-responsive Epilogue
-> persisted campaign-complete state
```

with no required debug-only progression.

Alpha may remain explicitly HUMAN-UNVALIDATED; it is an implementation-completeness gate.

## Content Alpha operating gate

GC-12 is **PASS / HUMAN-UNVALIDATED**. The entire bounded campaign is authored and no required campaign unit is a placeholder.

At `CONTENT_ALPHA`:

- feature/content scope remains locked by default;
- new generalized systems and post-1.0 expansion remain prohibited without explicit scope revision;
- bounded hardening of existing 1.0 surfaces may continue from deterministic, heuristic, synthetic, accessibility, reliability, presentation, pacing, balance, persistence, release-readiness, or human findings.

## Beta operating gate

Authority: `specification/Technical/BetaCompletionContract.md`.

`BETA_PASS` **requires genuine human evidence**. Current provisional minimum:

- 5 fresh-player first-session observations;
- 3 external beginning-to-ending playthroughs from fresh saves without developer intervention;
- exact build/browser/fresh-save/intervention provenance.

Beta work is primarily:

```text
discoverability / comprehension
pacing / balance
bugs / soft locks
save and recovery robustness
performance
accessibility
visual/terminology consistency
desktop browser support
```

These concerns may be investigated through deterministic, heuristic, synthetic, and human evidence. Only genuine human evidence satisfies the current human-session floor or supports actual player-experience claims.

Do not use test count as a substitute for resolving repeated severe player failures.

## Release Candidate / 1.0 operating gate

Authority: `specification/Technical/ReleaseQualificationContract.md`.

The automatable release aggregate exists:

```bash
npm run release:validate
```

The GC-14 promotion guard is qualified, but current policy still blocks immutable RC entry until a real `BETA_PASS`. Repository hardening before that point should improve the existing release surface without pretending the RC gate is open.

RC must identify one exact:

```text
commit SHA
version
Build Validation run
production build/deployment identity where applicable
browser matrix
full-run evidence
known-defect set
```

Final 1.0 promotion requires the exact release candidate to remain unchanged since qualification.

## Primary 1.0 environment

```text
desktop web
current stable Chromium-class browser
current stable Firefox
minimum viewport 1280x720
reference viewport 1920x1080
```

Full mobile product qualification is deferred from the 1.0 critical path unless scope authority changes.

## Human Product Review issue #109

Issue #109 remains open and is the human-evidence backlog required by the current Beta/final promotion policy.

It is **not** the sole source of engineering work. Deterministic, heuristic, synthetic, accessibility, reliability, presentation, pacing, balance, persistence, and release-readiness findings may independently justify bounded improvements to the already-authorized Campaign One.

Repository automation may prepare builds, run synthetic journeys, perform heuristic review, diagnose findings, implement bounded repairs, and produce deterministic evidence. It may not invent participant observations or close the issue as a human PASS.

## Documentation change procedure

When a package changes current completion/product/technical authority:

```text
1. Update/create affected domain or completion contract.
2. Update docs/CURRENT.md classification.
3. Update STATUS.md queue/current state.
4. Update RUNBOOK.md if procedure/commands changed.
5. Keep README.md concise and navigational.
6. Update specification/README.md authority routing.
7. Preserve historical evidence; classify instead of rewriting history.
8. Run npm run docs:authority:validate.
9. Open PR and require exact-head Build Validation.
10. Reconcile if main moves.
11. Merge only green current-base candidate.
```

For post-milestone handoffs, use `HANDOFF.md` as a concise re-entry record when a separate handoff materially helps future sessions. `STATUS.md` remains the current-state authority; the handoff must not contradict it.

## Permanent anti-expansion boundaries for Campaign One

Do not implement from historical placeholders/ideas alone:

- separate generic Skills/skill tree;
- generic Crafting;
- general Inventory/Equipment economy unless explicitly promoted by campaign evidence;
- duplicate save system;
- generalized ChapterEngine;
- generalized narrative condition DSL;
- autonomous Copy planning/automatic irreversible task chains;
- offline narrative/social/world decisions;
- open-world NPC schedules;
- generalized rumor/belief/economy simulation;
- interplanetary campaign;
- New Game+ / endless endgame;
- live-service infrastructure.

## Final operating principle

```text
authorized 1.0 surface
-> concrete evidence-classified finding
-> smallest existing-authority solution
-> focused positive + rejection qualification
-> exact-head validation
-> preserve claim ceiling
-> continue until diminishing returns / owner / external boundary
```

> **Finish and harden Campaign One before expanding the architecture. Missing human evidence limits claims, not all useful action.**
