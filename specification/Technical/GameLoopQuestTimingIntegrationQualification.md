# GameLoop Quest Timing Integration Qualification

**Package:** 3 — Quest Timing Integration Qualification  
**Zone:** HERMETIC_VALIDATION  
**Base:** `main` at `379d3612f4c575e7617aa8129e8e1fef333ce97d`  
**Production mechanics changed by this package:** none

## Purpose

Packages 1 and 2 established and repaired the timed-Quest unit boundary:

```text
GameLoop fixed-step delta (milliseconds)
-> processQuestTimersThunk
-> positive finite validation
-> milliseconds / 1000
-> Quest elapsedSeconds / timeLimitSeconds (seconds)
```

This package does not change that implementation. It qualifies the repaired contract across the production scheduler, persistence, pause/resume, timeout, notification, and bounded offline-progression seams.

## Authoritative integrated invariant

For timed Quests, elapsed time is **online logical GameLoop time expressed in seconds**.

Therefore:

- equivalent logical time must produce equivalent `elapsedSeconds` regardless of RAF frame layout;
- supported tick rates must produce the same Quest elapsed time for the same logical duration;
- paused wall-clock time must not advance Quest timers;
- save/load must preserve the stored Quest timer value without reinterpretation;
- M21 offline settlement must not advance Quest timers or trigger Quest timeout failure;
- after resume, only new live fixed-step ticks advance the Quest timer;
- crossing a timeout boundary must fail the Quest once, remove it from active timer processing, and emit exactly one failure notification;
- queued catch-up ticks after failure must not duplicate failure or continue advancing the failed Quest.

## Permanent qualification suite

`src/features/GameLoop/GameLoopQuestTimingIntegrationQualification.test.tsx` exercises the real production seams rather than a detached timer model.

### Scheduler-layout and tick-rate equivalence

The suite compares one second of logical Quest time under:

- regular 10 Hz RAF delivery;
- irregular 10 Hz RAF delivery;
- one-frame 10 Hz catch-up;
- regular 20 Hz delivery.

All scenarios must end with exactly one elapsed Quest second and no failure for a non-expiring probe.

### Catch-up timeout semantics

A 1.5 second same-frame catch-up at 10 Hz runs fifteen queued logical ticks against a Quest with a one-second limit.

The required result is:

- fifteen GameLoop ticks are recorded;
- the Quest stops at one elapsed second;
- status becomes `FAILED`;
- the Quest leaves `activeQuestIds`;
- exactly one `Quest Failed` notification exists;
- later queued ticks do not mutate the failed Quest or emit another failure notification.

### Pause/resume boundary

The suite pauses before the first fixed step, advances wall-clock time while paused, resumes, and delivers one ordinary 100 ms live step.

The required result is that the paused wall-clock interval contributes zero Quest time and the resumed step contributes exactly `0.1` seconds.

### Save -> offline -> resume -> timeout

The suite uses the canonical repository persistence path:

```text
createSave
-> loadSavedGameWithMigration
-> replaceState
-> settleOfflineProgressThunk
-> useGameLoop
-> processQuestTimersThunk
```

A Quest saved at `0.4 / 0.6` seconds must remain at `0.4` seconds across a 20-second M21 offline settlement. The first resumed 100 ms live tick advances it to `0.5`; the second advances it to `0.6`, fails it exactly once, and later live ticks leave the failed timer frozen.

This composes the repaired timer with the real save envelope and the real two-consumer offline settlement authority without adding an artificial migration or replay path.

## Relationship to existing authorities

This suite is additive rather than substitutive:

- `useGameLoop.timing-characterization.test.tsx` remains the fixed-step scheduler characterization authority;
- `GameLoopProgressionDeterminism.test.tsx` remains the cross-progression frame-layout/tick-rate authority;
- `QuestTimerUnitCompatibilityPreflight.test.ts` remains the focused timer unit, malformed-delta, persistence-value, and reducer/display authority;
- `GameLoopLiveOfflineBoundary.test.tsx` remains the broader live/save/offline/resume progression-boundary authority;
- `GameLoopM21OfflineProgress.test.ts` remains the explicit M21 two-consumer allowlist/rejection authority.

Package 3 adds the missing composed proof that those boundaries agree specifically for timed Quests.

## Build Validation authority

The dedicated integration suite is wired into `.github/workflows/build-validation.yml` as:

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
```

Merge qualification still requires the rest of Build Validation, including:

- synthetic review contract and action-binding rejection checks;
- hermetic UI smoke;
- TypeScript;
- scheduler and cross-progression suites;
- focused Quest timer preflight;
- live/offline and M21 qualification;
- M20–M25 milestone regressions;
- historical M4–M19 regressions;
- production bundling.

## Scope deliberately unchanged

This package does not change or claim authority over:

- GameLoop tick rate or game speed;
- Quest duration/reward authoring;
- save-schema version or stored Quest timer migration;
- M21 offline allowlist;
- offline Quest progression;
- player-facing pacing, comprehension, balance, enjoyment, or retention;
- Product Direction Decision;
- M26 authorization;
- external Gemini review credentials.

Human/product judgments and external credentials remain separate `EXTERNAL_AUTHORITY` concerns.
