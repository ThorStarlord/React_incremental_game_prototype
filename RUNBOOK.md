# Repository Runbook — Game Completion Program

**Current maturity:** PLAYABLE PRE-ALPHA  
**Integrated implementation baseline:** `ff829ce6ee4da8a693adfb783fe843775403326d`  
**Active program:** Campaign One / 1.0 Game Completion  
**Human Product Review:** issue #109 OPEN / UNPROVEN

This file owns **operational procedure**. It does not define what the finished game is; that authority belongs to `specification/GameCompletionDefinition.md`.

## Required re-entry order

For every new coding-agent / engineering session:

```text
latest main
-> STATUS.md
-> HANDOFF.md when present for the latest completed milestone/session
-> docs/CURRENT.md
-> specification/GameCompletionDefinition.md
-> specification/Features/FeatureScopeMatrix.md
-> specification/Progression/GameProgressionArc.md
-> specification/Narrative/CampaignArchitecture.md
-> specification/Technical/GameCompletionRoadmap.md
-> relevant Alpha/Beta/Release contract
-> affected current domain contract/result
-> RUNBOOK.md commands/procedure
-> fresh current-bottleneck reconciliation
```

Do not start from an old milestone queue. Do not infer M27 from M26. The active question is always:

> Which unsatisfied 1.0 requirement is the current blocker?

GC-01 is integrated. The next unsatisfied completion-program responsibility is GC-02 Prologue / onboarding.

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

## Game-completion work intake

Before creating an implementation branch, record:

```text
1. Completion requirement being closed
2. Current concrete blocker
3. Current authority owning the behavior
4. Smallest proposed intervention
5. Explicit non-goals
6. Positive acceptance criteria
7. Negative/rejection criteria
8. Save/persistence impact
9. Human-evidence ceiling
10. Stop condition
```

A package without a traceable completion requirement is not authorized for the 1.0 critical path unless the completion authority is revised first.

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
[ ] GC-02  Prologue / onboarding
[ ] GC-03  Chapters 1–3 campaign integration
[ ] GC-04  Buildcraft breadth
[ ] GC-05  Earned-delegation breadth
[ ] GC-06  Chapter 4 — Lattice Under Strain
[ ] GC-07  Chapter 5 — The Chrono-Crypt
[ ] GC-08  Chapter 6 — Network Under Pressure
[ ] GC-09  Chapter 7 — Counterphase
[ ] GC-10  Finale + Epilogue
[ ] GC-11  Alpha qualification
[ ] GC-12  Content Alpha
[ ] GC-13  Beta
[ ] GC-14  Release Candidate / 1.0
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

Alpha is **not currently achieved**.

Before declaring Alpha, GC-11 must implement an executable aggregate command expected to be named:

```bash
npm run alpha:validate
```

Do **not** run or document that command as currently available until GC-11 implements it.

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

After Alpha, GC-12 replaces temporary/diagnostic campaign prose and closes every required content placeholder.

At `CONTENT_ALPHA`:

- the entire bounded campaign is authored;
- no required campaign unit is a placeholder;
- feature expansion freezes by default;
- system work becomes responsive to demonstrated content/player blockers.

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

Do not use test count as a substitute for resolving repeated severe player failures.

## Release Candidate / 1.0 operating gate

Authority: `specification/Technical/ReleaseQualificationContract.md`.

Before creating an RC, GC-14 must implement the automatable aggregate command expected to be named:

```bash
npm run release:validate
```

Do **not** claim this command exists until implemented.

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

Issue #109 remains open.

Under provisional governance it is not a blanket freeze on all pre-Alpha development. It is the human-evidence backlog and becomes mandatory for Beta/final player-quality claims.

Repository automation may prepare builds, prompts, provenance templates and deterministic evidence. It may not invent participant observations or close the issue as a human PASS.

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
1.0 requirement
-> current blocker
-> smallest existing-authority solution
-> focused positive + rejection tests
-> exact-head qualification
-> update completion status
```

> **Finish Campaign One before expanding the architecture.**
