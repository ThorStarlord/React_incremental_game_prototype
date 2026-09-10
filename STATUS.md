# Milestone Handoff — GameLoop Determinism Hardening

**Handoff date:** 2026-09-10  
**Branch cut from `main`:** `3446549f91c28a2eb915683b0df8e23ba29e11b3`  
**Product authority:** `M25 Complete Chapter Vertical Slice = PASS`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**M26:** `NOT AUTHORIZED`

## Purpose

This document is the repository-grounded handoff for future engineers and future chat sessions after the GameLoop determinism work-package cycle.

The key distinction is between **engineering scheduler hardening** and **product authority**:

- Packages 1 and 2 of the scheduler-hardening queue were implemented, qualified, and merged.
- Package 3 — progression determinism and tick-boundary regression coverage — was not implemented in this cycle and remains the next repository-only work package.
- The scheduler work does not authorize new mechanics, pacing changes, balance changes, progression redesign, or M26.
- Human comprehension, pacing, enjoyment, retention, and product-direction claims remain unproven.

Do not convert administrative milestone closure into evidence that Package 3 or M26 work already exists.

## Current repository state

The automated implementation program through M25 remains qualified. The live GameLoop has now also been hardened against three repository-demonstrated scheduler defects:

1. fractional fixed-step accumulator remainder loss across Redux-driven rerenders;
2. duplicate `TickData.currentTick` identities during same-frame catch-up; and
3. overlapping asynchronous `onTick` processing.

The live loop still preserves the established boundary that wall-clock absence is **not** replayed by feeding a giant delta through ordinary live ticks. M21 bounded offline settlement remains separate authority.

Key scheduler references:

- `specification/Technical/GameLoopTimingCharacterization.md`
- `specification/Technical/GameLoopDeterministicLiveSchedulerRepair.md`
- `src/features/GameLoop/hooks/useGameLoop.ts`
- `src/features/GameLoop/hooks/useGameLoop.timing-characterization.test.tsx`
- `.github/workflows/build-validation.yml`

## Work-package outcomes

### Package 1 — GameLoop Timing Characterization & Determinism Gate

**Terminal state:** `COMPLETE / MERGED`

**PR:** #70 — `Test GameLoop timing characterization and determinism boundary`  
**Merge commit:** `97807e9c0f759a6d8632f9d0d7f92bc10e6a8101`

Delivered:

- deterministic fake-`requestAnimationFrame` / controlled-`performance.now()` test harness;
- exact default 10 Hz fixed-step characterization;
- approximately 60 Hz RAF chunking and irregular-substep accumulation coverage;
- pause/resume rejection boundary coverage;
- game-speed and tick-rate transition coverage;
- deterministic reproduction of fractional accumulator remainder loss;
- deterministic reproduction of duplicate same-frame callback tick identities;
- deterministic reproduction of async `onTick` overlap;
- explicit CI qualification entrypoint for the timing suite.

Package 1 changed no production mechanics or progression values. Its purpose was to establish evidence before repair.

Qualification:

- exact candidate head: `56273c177e641d4ed386a17c8be189fbe522f416`;
- Build Validation #267: `PASS`;
- TypeScript, timing characterization, negative/rejection contract, localhost smoke, M20-M25 qualification, historical regression stack, and production build passed.

### Package 2 — Deterministic Live Tick Scheduler Repair

**Terminal state:** `COMPLETE / MERGED`

**PR:** #71 — `Fix deterministic live GameLoop scheduling`  
**Merge commit:** `3446549f91c28a2eb915683b0df8e23ba29e11b3`

Delivered:

- RAF scheduler lifetime decoupled from changing render-captured GameLoop state;
- fractional accumulator continuity preserved across ordinary Redux tick rerenders;
- same-frame fixed steps assigned monotonic local tick identities before Redux rerender;
- `onTick` explicitly supports synchronous or Promise-returning handlers;
- emitted tick callbacks are serialized in logical order;
- rejected async handlers are contained and do not deadlock subsequent queued work;
- pause/resume wall-clock re-anchoring continues to reject paused wall time from live progression;
- Package 1 defect characterizations promoted into desired regression invariants.

The repair deliberately did **not** alter:

- the default 10 Hz tick rate;
- game-speed bounds;
- progression formulas;
- reward curves;
- economy or unlock thresholds;
- bounded offline-settlement authority;
- M26 scope.

Qualification:

- first candidate correctly failed TypeScript because two new test callbacks returned `Array.push(...)` values instead of `void`; that test-only typing defect was repaired and the candidate was requalified from a new exact head;
- final exact candidate head: `84b89ad1703830c6e6a4d81fb37ba0a18079122d`;
- Build Validation #269: `PASS`;
- synthetic-review contract: `PASS`;
- V2 stale/mismatched-action negative/rejection qualification: `PASS`;
- localhost UI-only smoke: `PASS`;
- TypeScript: `PASS`;
- GameLoop deterministic timing suite: `PASS`;
- M20-M25 qualification stack: `PASS`;
- active-loop repair qualification: `PASS`;
- modified historical qualification: `PASS`;
- accumulated M4-M19 baseline: `PASS`;
- production build: `PASS`.

### Package 3 — Progression Determinism & Tick-Boundary Regression Harness

**Terminal state:** `CARRIED FORWARD / NOT IMPLEMENTED`

No Package 3 branch, implementation PR, or merge exists at this handoff.

The intended bounded scope remains repository-only / hermetic validation:

- connect the repaired scheduler to existing progression authorities without introducing new progression design;
- exercise equivalent logical tick streams under different RAF chunking;
- cover pause/resume boundaries;
- cover persistence and the live/offline boundary where current contracts require equivalence;
- verify existing passive/progression flows do not duplicate rewards, advancement, or side effects solely because frame layout differs;
- preserve existing M20-M25 behavior rather than inventing new balance targets.

Package 3 must **not** become a vehicle for reward tuning, pacing changes, progression restructuring, new unlock rules, or M26 design.

## Evidence ledger

### Verified

- M25 Complete Chapter Vertical Slice remains `PASS`.
- Package 1 characterization harness is merged and CI-qualified.
- The three scheduler failure modes identified by Package 1 were reproducible before repair.
- Package 2 repairs those demonstrated failure modes and is merged.
- The exact Package 2 candidate passed the deterministic GameLoop regression suite.
- Existing M20-M25, active-loop, historical, synthetic-review rejection, localhost smoke, TypeScript, and production-build gates passed on the Package 2 candidate.
- The default 10 Hz cadence and M21 bounded-offline authority were preserved.

### Still unproven / pending

- Package 3 cross-progression/tick-boundary equivalence coverage;
- human comprehension;
- human pacing;
- emotional impact and enjoyment;
- retention / desire to continue;
- final balance;
- campaign scalability;
- generalized chapter authoring;
- a valid V2 synthetic-panel verdict;
- the post-M25 Product Direction Decision;
- M26 authorization.

## Open operational artifacts

At this handoff snapshot:

- **PR #66 — `Experiment: collect SIR-V2 participant evidence`** remains an evidence-only draft/open collection surface from the separate post-M25 product-evidence track.
- **PR #68 — `Experiment: freeze V2 prelaunch participant-isolation stop`** remains open from that separate evidence track.

These PRs are not part of the GameLoop scheduler repair. Future sessions must re-read their current state rather than relying on this snapshot.

## Recommended next priorities

1. **Implement Package 3 — Progression Determinism & Tick-Boundary Regression Harness.** Start from current `main`, add synthetic/hermetic equivalence scenarios only, and do not change progression design unless a current contract is demonstrably violated and a later repair package is separately authorized.
2. **Exercise representative existing progression authorities across equivalent logical tick streams.** Prioritize passive generation and selected M20-M25 flows whose outcomes should be independent of RAF chunking.
3. **Strengthen live/offline boundary rejection coverage.** Ensure bounded offline settlement stays separate from the live fixed-step scheduler and that no future test encourages giant-delta live replay.
4. **After Package 3, reassess the engineering bottleneck.** If deterministic progression behavior is qualified, stop inventing scheduler work and return to the repository's actual remaining product-evidence boundary.
5. **Keep human/product claims gated.** Fresh-player evidence and an explicit Product Direction Decision remain prerequisites for pacing, balance, tutorial, retention, or M26 claims.

## Fast re-entry checklist for the next engineer/session

```text
1. Read STATUS.md.
2. Confirm latest main and recent PRs/commits.
3. Read GameLoopTimingCharacterization.md.
4. Read GameLoopDeterministicLiveSchedulerRepair.md.
5. Run the focused GameLoop deterministic timing suite.
6. Treat Package 3 as the next pending repository-only package unless main already contains later work.
7. Preserve the live-tick vs bounded-offline boundary.
8. Do not infer player-facing pacing/balance conclusions from scheduler correctness.
```

## Validation / tooling entrypoints

Focused GameLoop qualification:

```bash
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
```

Broader candidate qualification should use `.github/workflows/build-validation.yml`, which includes the synthetic-review contract and negative/rejection checks, localhost smoke, TypeScript, GameLoop timing suite, M20-M25 milestones, active-loop checks, historical regressions, and production build.

Useful local commands:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx playwright install --with-deps chromium
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand M25CompleteChapterVerticalSlice.test.tsx
npm run build
```

For the live synthetic-review smoke, start the app on `127.0.0.1:3000` and run:

```bash
npm run simulated-review:smoke
```

## Governing stop conditions

- Scheduler correctness is not evidence that the game is well paced or fun.
- Fixed-step live execution is not the authority for arbitrary wall-clock absence.
- Package 3 is pending until repository evidence shows it was implemented and qualified.
- M26 remains unauthorized until the separate product-evidence and Product Direction Decision gates are satisfied.
