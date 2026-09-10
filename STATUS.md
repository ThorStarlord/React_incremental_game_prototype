# Milestone Handoff — Progression Timing & Live/Offline Boundary Hardening

**Handoff date:** 2026-09-10  
**Milestone tip on `main`:** `f874672e7dcb112f06d83320b8de5b5b233c4ab9`  
**Product authority:** `M25 Complete Chapter Vertical Slice = PASS`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**M26:** `NOT AUTHORIZED`

## Purpose

This is the repository-grounded handoff for future engineers and future chat sessions after the three-package progression timing milestone that followed the deterministic GameLoop scheduler repair.

The milestone closed three repository-local questions:

1. whether representative online progression consumers are deterministic under equivalent logical time;
2. whether Player vitality regeneration respects its authored per-second contract rather than scheduler invocation count; and
3. whether canonical save/load, bounded M21 offline settlement, and resumed live scheduling compose without duplicate progress or giant-delta replay.

All three packages are complete and merged. Do not carry the old three-package queue forward as pending work.

This milestone does **not** establish player-facing pacing, balance, comprehension, enjoyment, retention, production scalability, anti-cheat resistance, or authorization for M26.

## Current repository state

The automated implementation program through M25 remains qualified. The live GameLoop scheduler is deterministic across the previously characterized fixed-step edge cases, representative progression is frame-layout invariant for equivalent logical time, Player vitality now uses elapsed logical time correctly, and the live/save/offline/resume seam has permanent hermetic regression coverage.

The known repository-local timing discrepancy intentionally left unresolved is the timed-Quest unit contract:

- `TickData.deltaTime` is milliseconds;
- timed Quest fields are named `elapsedSeconds`, `timeLimitSeconds`, and `deltaSeconds`;
- `processQuestTimersThunk` currently consumes the millisecond delta directly;
- therefore one second of logical live time currently records `elapsedSeconds = 1000`.

That discrepancy is characterized and guarded by a `test.todo`, but it was **not authorized or repaired** in this milestone.

Key references:

- `specification/Technical/GameLoopTimingCharacterization.md`
- `specification/Technical/GameLoopDeterministicLiveSchedulerRepair.md`
- `specification/Technical/GameLoopProgressionDeterminismCharacterization.md`
- `specification/Technical/GameLoopDeltaTimeVitalRegenerationRepair.md`
- `specification/Technical/GameLoopLiveOfflineProgressionBoundaryQualification.md`
- `src/features/GameLoop/hooks/useGameLoop.ts`
- `src/features/GameLoop/GameLoopProgressionDeterminism.test.tsx`
- `src/features/GameLoop/GameLoopLiveOfflineBoundary.test.tsx`
- `.github/workflows/build-validation.yml`

## Work-package outcomes

### Package 1 — Cross-Progression Tick Determinism Characterization

**Terminal state:** `COMPLETE / MERGED`  
**PR:** #73 — `Test cross-progression tick determinism`  
**Candidate head:** `a65ad33f88bd601c44c7ccf68b2ea192af398f69`  
**Merge commit:** `6d236cb19e2c2c19f8a62dbb1aa37870ee1e7112`  
**Build Validation:** #271 — `PASS`

Delivered:

- a production-`useGameLoop`-backed hermetic progression harness;
- the ordinary online progression consumer order used by `App.tsx`;
- equivalent one-second logical-time scenarios at regular 10 Hz delivery, irregular RAF chunking, and same-frame catch-up;
- supported 10 Hz vs 20 Hz comparison;
- pause/resume rejection of paused wall time;
- representative Essence, Copy, Player, and timed-Quest progression snapshots;
- a permanent Build Validation entrypoint.

Characterization result:

- representative delta-time consumers were frame-layout deterministic;
- Player vitality regeneration was demonstrated to be tick-count dependent even though `healthRegen` and `manaRegen` are per-second values;
- timed Quest progression was deterministic but exposed a separate milliseconds-vs-seconds contract mismatch.

Package 1 changed no production mechanics or balance values.

### Package 2 — Delta-Time-Normalized Vital Regeneration Repair

**Terminal state:** `COMPLETE / MERGED`  
**PR:** #74 — `Fix delta-time normalized vital regeneration`  
**Candidate head:** `c7fc89ed7def3691c7f01ec35362460e91e23fcb`  
**Merge commit:** `e5f5584ee874cb1de48750c8962620650942b9a3`  
**Build Validation:** #272 — `PASS`

Delivered:

- `App.tsx` now passes `TickData.deltaTime` to `regenerateVitalsThunk(deltaTime)`;
- vitality regeneration interprets GameLoop delta in milliseconds and converts it to seconds;
- health and mana recovery now apply the existing authored per-second rates proportionally to elapsed logical time;
- existing max-health/max-mana clamping remains authoritative;
- non-finite, zero, negative, and dead-player inputs remain no-ops;
- the Package 1 vitality `test.todo` was promoted into enforced 10 Hz vs 20 Hz equivalence;
- fractional elapsed-time and clamping/rejection coverage were added without retuning authored regeneration values.

Expected repaired invariant for the Package 1 seed is now:

```text
1 second at 10 Hz -> health 51, mana 10.5
1 second at 20 Hz -> health 51, mana 10.5
```

Package 2 deliberately did **not** change Quest timer units, Copy semantics, passive Essence generation, default tick rate, game speed, M21 offline authority, save schema, reward curves, or M26 scope.

### Package 3 — Live/Persistence/Offline Progression Boundary Qualification

**Terminal state:** `COMPLETE / MERGED`  
**PR:** #75 — `Test live offline progression boundary`  
**Candidate head:** `629bd54e1bf8482d188a5579c3e8017cfc8686eb`  
**Merge commit:** `f874672e7dcb112f06d83320b8de5b5b233c4ab9`  
**Build Validation:** #273 — `PASS`

Delivered a hermetic seam qualification using production authorities:

```text
useGameLoop
-> ordinary online progression
-> createSave
-> CurrentSaveEnvelope.timestamp
-> loadSavedGameWithMigration
-> replaceState
-> settleOfflineProgressThunk
-> resumed useGameLoop
```

The new suite verifies:

- ordinary live progression before save;
- canonical envelope timestamp persistence and restore;
- bounded M21 settlement after a synthetic absence;
- M21 advances only passive Essence plus an already-running M20 Copy task;
- online-only GameLoop tick/time, Copy maturity/loyalty, Player vitals, and timed Quest state remain frozen during the offline interval;
- duplicate settlement of the same `savedTimestamp` rejects with `already_settled` and produces no duplicate progress;
- paused and stopped saved games reject offline settlement;
- an offline-completed authored Copy task pays its reward exactly once;
- resumed live scheduling re-anchors to the new wall-clock baseline and emits an ordinary fixed step rather than replaying the absence as a giant delta.

Package 3 changed no production mechanics, save schema, progression values, rewards, offline allowlist, or Quest timing behavior.

## Evidence ledger

### Verified repository/hermetic evidence

- M25 Complete Chapter Vertical Slice remains `PASS`.
- The deterministic live scheduler repair remains green.
- Package 1 cross-progression characterization is merged and CI-qualified.
- Equivalent logical time is stable across regular, irregular, and same-frame RAF layouts for the representative progression consumers exercised.
- Package 2 repairs Player vitality cadence dependence while preserving authored per-second values.
- 10 Hz and 20 Hz produce equivalent one-second Player vitality recovery.
- malformed/non-positive vitality deltas are rejected as no-ops and existing max clamping remains intact.
- Package 3 qualifies the canonical live -> save -> bounded offline settlement -> restore/resume boundary.
- M21 remains an explicit two-consumer offline allowlist: passive Essence plus already-running M20 Copy production tasks.
- same-source offline settlement is replay-protected.
- paused/stopped saved states remain ineligible for offline progression.
- resumed live scheduling does not replay the offline wall-clock interval.
- Build Validation #271, #272, and #273 passed on their exact package candidate heads.
- The final Package 3 candidate passed repository rejection checks, localhost smoke, TypeScript, scheduler/cross-progression suites, M20-M25 qualification, active-loop and historical regressions, and production build.

### Still unproven / pending authority

- timed Quest seconds-vs-milliseconds contract repair;
- human comprehension and discoverability;
- human pacing;
- emotional impact and enjoyment;
- retention / desire to continue;
- final progression, reward, regeneration, and offline-cap balance;
- generalized campaign/chapter scalability;
- trusted server time / anti-cheat authority;
- a valid completed product-review evidence cycle where required;
- explicit post-M25 Product Direction Decision;
- M26 authorization.

### External diagnostic note

The separate Gemini code-review workflow failed on the recent package PRs before producing a review because its configured Gemini API key was invalid. The repository's hermetic Build Validation passed independently. Fixing or replacing that external credential is an **EXTERNAL_AUTHORITY** concern and was intentionally not attempted by these packages.

## Recommended next priorities

1. **Run a fresh reconciliation before defining another queue.** The three-package milestone is complete; do not assume an old pending package remains authoritative.
2. **Treat the timed-Quest unit mismatch as the leading bounded repository-local candidate.** Before repair, map every producer/consumer/persistence dependency of `elapsedSeconds`, `timeLimitSeconds`, `deltaSeconds`, and `processQuestTimersThunk` so the change cannot silently corrupt save compatibility or authored quest limits.
3. **If separately authorized, repair Quest elapsed-time units narrowly.** Convert GameLoop milliseconds to the Quest contract's seconds at one clear boundary, then add 10 Hz/20 Hz, irregular/catch-up, pause/resume, save/load, and live/offline rejection regressions without changing authored time limits.
4. **Do not widen M21 while fixing Quest timing.** Timed Quests remain online-only unless a future product decision explicitly changes offline authority.
5. **Return to product evidence after the repository-local timing defect is resolved or deprioritized.** Fresh-player comprehension, pacing, fun, retention, and the explicit Product Direction Decision remain separate gates before new product claims or M26.
6. **Optionally restore the Gemini diagnostic separately.** Credential repair should not be mixed into progression or GameLoop packages.

## Fast re-entry checklist

```text
1. Read STATUS.md and confirm current main.
2. Read the three package technical documents listed above.
3. Run the scheduler, cross-progression, and live/offline focused suites.
4. Reconcile current repository state before creating a new work-package queue.
5. Preserve M21 as separate bounded offline authority.
6. Keep the timed-Quest unit discrepancy visible until explicitly repaired.
7. Do not infer pacing, balance, fun, retention, or M26 authority from deterministic execution.
```

## Validation / tooling entrypoints

Focused GameLoop and progression qualification:

```bash
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
CI=true npm test -- --watchAll=false --runInBand CopyM20ProductionTaskAutomation.test.tsx
```

Repository rejection / synthetic-review contract checks:

```bash
npm run simulated-review:validate
npm run simulated-review:action-contract
```

Broader candidate qualification is defined by `.github/workflows/build-validation.yml` and includes localhost smoke, TypeScript, GameLoop timing and progression suites, M20-M25 qualification, active-loop and historical regressions, and production build.

## Governing stop conditions

- This three-package milestone is complete; do not restart Package 1, 2, or 3.
- Deterministic execution is not evidence that the game is well paced, balanced, understandable, or fun.
- Fixed-step live execution is not authority for arbitrary wall-clock absence.
- M21 offline authority must remain explicit and bounded unless separately changed by product authority.
- The Quest timing discrepancy is a known candidate defect, not an implicitly authorized repair.
- M26 remains unauthorized until the separate product-evidence and Product Direction Decision gates are satisfied.
