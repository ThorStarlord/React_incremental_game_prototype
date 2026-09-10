# GameLoop Live / Persistence / Offline Progression Boundary Qualification

**Package:** 3 — Live/Persistence/Offline Progression Boundary Qualification  
**Scope:** HERMETIC_VALIDATION  
**Production mechanics changed:** No  
**External credentials or services:** None  
**Balance, pacing, or human-product authority:** None

## Purpose

Packages 1 and 2 established deterministic live fixed-step delivery and repaired Player vitality regeneration so authored per-second rates are invariant across supported tick rates. Package 3 closes the remaining repository-local seam between ordinary live progression, canonical persistence, bounded M21 offline settlement, and resumed live scheduling.

The qualification asks one narrow question:

> Can a running game cross the live -> save -> wall-clock absence -> restore/offline settlement -> resumed-live boundary without duplicating progress, leaking offline time into online-only systems, or replaying the absence as a giant live tick?

This package is validation only. It does not widen M21, alter save schema, change progression formulas or rewards, repair the separately characterized Quest timer unit discrepancy, or make subjective production claims.

## Authorities exercised

The focused hermetic suite uses the production authorities rather than a parallel simulation:

```text
useGameLoop
  -> ordinary App.tsx online progression consumer order
  -> createSave
  -> CurrentSaveEnvelope.timestamp
  -> loadSavedGameWithMigration
  -> replaceState
  -> settleOfflineProgressThunk
  -> useGameLoop re-mounted at resume wall-clock time
```

The online consumer sequence used by the test remains:

```text
processPassiveGenerationThunk(deltaTime)
-> processCopyGrowthThunk(deltaTime)
-> processCopyLoyaltyDecayThunk(deltaTime)
-> processCopyTasksThunk(deltaTime)
-> processResonanceLevelThunk()
-> processStatusEffectsThunk()
-> regenerateVitalsThunk(deltaTime)
-> recalculateStatsThunk()
-> processQuestTimersThunk(deltaTime)
```

M21 offline settlement remains the existing two-consumer allowlist:

```text
processPassiveGenerationThunk(elapsedMs)
-> processCopyTasksThunk(elapsedMs)
```

No ordinary live GameLoop replay occurs during the absence.

## Qualified scenarios

### 1. Running game round trip

A seeded running game receives one second of ordinary 10 Hz live progression, is saved through the canonical save envelope, restored into a new Redux store, and receives a 20-second offline settlement.

The suite proves that the offline interval advances only:

- passive Essence; and
- the already-running authored Copy production task.

The same interval must not advance:

- GameLoop `currentTick`;
- GameLoop `totalGameTime`;
- Copy maturity;
- Copy loyalty;
- Player health or mana;
- timed Quest state; or
- any other ordinary online-only progression represented by those assertions.

### 2. Settlement replay rejection

After the restored save settles its envelope timestamp once, a second settlement request carrying the same `savedTimestamp` must return `already_settled` with zero elapsed authority and must leave the selected progression snapshot unchanged.

This verifies the persisted `lastOfflineSettlementSourceTimestamp` replay boundary at the integrated save/load seam.

### 3. Exactly-once authored Copy completion reward

A canonical save containing an almost-complete Forge Assistance task is restored and given enough bounded offline time to complete it. The authored Gold reward is applied once, the task becomes null, and a second settlement request for the same save timestamp cannot pay the reward again.

### 4. Paused and stopped saves remain inert

Canonical saves produced while the GameLoop is paused or stopped are restored and offered positive wall-clock absence. Settlement must reject with the existing M21 reasons:

```text
paused  -> game_paused
stopped -> game_not_running
```

No selected progression state or settlement lineage may change.

### 5. Resumed live scheduling rejects giant-delta replay

After a 20-second offline settlement, the production `useGameLoop` hook is mounted with `performance.now()` anchored to the resume timestamp. The next RAF callback occurs 100 ms later.

The suite proves that this callback produces exactly one ordinary 100 ms fixed step:

- `currentTick` increases by one;
- `totalGameTime` increases by 100 ms, not by the offline gap;
- passive Essence receives only the normal 100 ms live increment;
- the running Copy task receives only 0.1 seconds of live progress;
- vitality receives only the normal 100 ms per-second recovery fraction; and
- timed Quest progression advances only by its ordinary live-tick behavior, not by the 20-second absence.

The existing Quest millisecond/second field discrepancy remains deliberately characterized elsewhere and is not repaired or promoted into new authority here.

## Negative and rejection coverage

The Package 3 focused suite directly covers:

- duplicate offline settlement rejection;
- paused-save offline settlement rejection;
- stopped-save offline settlement rejection;
- no online-only progression during the offline interval; and
- no giant live-delta replay after resume.

The repository's existing Build Validation additionally retains:

- synthetic-review contract rejection tests;
- M21 invalid/future timestamp rejection and eight-hour cap tests;
- M20 task eligibility and arbitrary-task rejection tests;
- GameLoop pause/resume and async-handler rejection tests;
- TypeScript, historical milestone regressions, localhost smoke, and production build.

## Qualification command

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
```

The focused suite is a permanent Build Validation gate alongside the existing scheduler, cross-progression, M21, M20, M22-M25, historical, TypeScript, smoke, and production-build checks.

## Evidence ceiling

This package does **not** establish:

- trusted server time or anti-cheat resistance;
- correctness under deliberate local clock tampering beyond existing timestamp rejection/capping rules;
- generalized offline simulation for online-only systems;
- final offline-cap balance;
- final reward or regeneration balance;
- human pacing, comprehension, enjoyment, emotional impact, or retention;
- generalized production scalability;
- authorization for M26; or
- resolution of the separately recorded timed-Quest `elapsedSeconds` unit discrepancy.

Those remain outside this package's repository/hermetic authority.
