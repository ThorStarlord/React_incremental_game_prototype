# GameLoop Quest Timing Integration Qualification

**Package:** 3 — Quest Timing Integration Qualification  
**Zone:** HERMETIC_VALIDATION  
**Base:** `main` at `379d3612f4c575e7617aa8129e8e1fef333ce97d`  
**Production mechanics changed by this package:** none  
**Precision semantics note:** the raw `>=` timeout-boundary characterization below was later superseded by the bounded comparison-only repair defined in `GameLoopTimedQuestPrecisionResolution.md`.

## Purpose

Packages 1 and 2 established and repaired the timed-Quest unit boundary:

```text
GameLoop fixed-step delta (milliseconds)
-> processQuestTimersThunk
-> positive finite validation
-> milliseconds / 1000
-> Quest elapsedSeconds / timeLimitSeconds (seconds)
```

This qualification composes that unit repair across the production scheduler, persistence, pause/resume, timeout, notification, and bounded offline-progression seams. The later precision-resolution package changes only how a timeout boundary is compared; it does not change the unit, accumulation, or persistence contracts qualified here.

## Authoritative integrated invariant

For timed Quests, elapsed time is **online logical GameLoop time expressed in seconds**.

Therefore:

- equivalent logical time must produce equivalent `elapsedSeconds` regardless of RAF frame layout;
- supported tick rates must produce the same Quest elapsed time for the same logical duration;
- paused wall-clock time must not advance Quest timers;
- save/load must preserve the stored Quest timer value without reinterpretation;
- M21 offline settlement must not advance Quest timers or trigger Quest timeout failure;
- after resume, only new live fixed-step ticks advance the Quest timer;
- timeout failure occurs on the nominal fixed step when accumulated Quest time reaches the authored threshold, allowing only machine-scale representation noise through the shared comparison helper;
- raw `elapsedSeconds` remains unrounded and may therefore be infinitesimally below the authored limit when timeout is declared;
- once failure occurs, the Quest is removed from active timer processing, emits exactly one failure notification, and queued catch-up ticks must not continue advancing or duplicate failure.

## Permanent qualification suite

`src/features/GameLoop/GameLoopQuestTimingIntegrationQualification.test.tsx` exercises the real production seams rather than a detached timer model.

### Scheduler-layout and tick-rate equivalence

The suite compares one second of logical Quest time under:

- regular 10 Hz RAF delivery;
- irregular 10 Hz RAF delivery;
- one-frame 10 Hz catch-up;
- regular 20 Hz delivery.

All scenarios must end with exactly one elapsed Quest second, within normal floating-point assertion tolerance, and no failure for a non-expiring probe.

### Catch-up timeout semantics

A 1.5 second same-frame catch-up at 10 Hz runs fifteen queued logical ticks against a Quest with a one-second limit.

The required result after the precision-resolution repair is:

- fifteen GameLoop ticks are recorded;
- failure occurs on the nominal tenth 100 ms fixed step when accumulated time is within machine-scale comparison tolerance of `1.0`;
- the raw stored `elapsedSeconds` remains unrounded and may equal `0.9999999999999999`;
- status becomes `FAILED`;
- the Quest leaves `activeQuestIds`;
- exactly one `Quest Failed` notification exists;
- later queued ticks do not mutate the failed Quest or emit another failure notification.

The precision repair is comparison-only. It does not round, clamp, quantize, or rewrite the timer value.

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

A Quest saved at `0.4 / 0.6` seconds must remain at `0.4` seconds across a 20-second M21 offline settlement. The first resumed 100 ms live tick advances it to `0.5`; the second advances it to the nominal `0.6` boundary, fails it exactly once under the comparison contract, and later live ticks leave the failed timer frozen.

This composes the timer with the real save envelope and the real two-consumer offline settlement authority without adding an artificial migration or replay path.

## Relationship to existing authorities

This suite is additive rather than substitutive:

- `useGameLoop.timing-characterization.test.tsx` remains the fixed-step scheduler characterization authority;
- `GameLoopProgressionDeterminism.test.tsx` remains the cross-progression frame-layout/tick-rate authority;
- `QuestTimerUnitCompatibilityPreflight.test.ts` remains the focused timer unit, malformed-delta, persistence-value, and reducer/display authority;
- `GameLoopTimedQuestPrecisionResolution.test.tsx` is the later timeout-comparison precision authority;
- `GameLoopLiveOfflineBoundary.test.tsx` remains the broader live/save/offline/resume progression-boundary authority;
- `GameLoopM21OfflineProgress.test.ts` remains the explicit M21 two-consumer allowlist/rejection authority.

This package provides the composed timing proof; the precision-resolution package narrows and supersedes only its original raw-comparison boundary behavior.

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
- timed-Quest precision-resolution qualification when present on the candidate;
- live/offline and M21 qualification;
- M20–M25 milestone regressions;
- historical M4–M19 regressions;
- production bundling.

## Scope deliberately unchanged

Neither this integration qualification nor the later precision-resolution repair changes or claims authority over:

- GameLoop tick rate or game speed;
- Quest duration/reward authoring;
- timer storage, clamping, quantization, or persistence normalization;
- save-schema version or stored Quest timer migration;
- M21 offline allowlist;
- offline Quest progression;
- player-facing pacing, comprehension, balance, enjoyment, or retention;
- Product Direction Decision;
- M26 authorization;
- external Gemini review credentials.

Human/product judgments and external credentials remain separate `EXTERNAL_AUTHORITY` concerns.
