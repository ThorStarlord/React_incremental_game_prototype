# Unified Timing-Hardening Integration Qualification

**Package:** Unified Timing-Hardening Integration Candidate  
**Zone:** `REPOSITORY_ONLY + HERMETIC_VALIDATION`  
**Base `main`:** `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Source package candidates:** PR #85 (`b5f6b38c65a34a7426cd9b6e499e5951c37a7f51`), PR #86 (`e501e4a5e2569cb7804e555316d67fe5442ba01a`), PR #87 (`a088d15165dba188733e790a88d0208e1d21a9d2`)

## Purpose

This package proves that the already repository-qualified post-M25 timing-hardening work can exist on one candidate tree without silently widening timing policy, persistence authority, offline authority, balancing, or product claims.

The candidate deliberately composes:

1. PR #85's timed-Quest comparison-time precision repair and long-horizon cross-progression drift qualification;
2. PR #86's large-frame / background-stall characterization and rejection boundaries; and
3. PR #87's mid-session cadence-transition qualification and rejection boundaries.

The source branches were independently based on the same `main`, so their independent green runs did not prove the combined state. This package creates that combined state and makes its validation workflow authoritative for the integration candidate.

## Integrated contract

### Timed Quest precision and drift

The candidate preserves the bounded comparison-only precision authority from PR #85:

- Quest live deltas remain normalized from GameLoop milliseconds to seconds exactly once at the established boundary;
- raw `elapsedSeconds` accumulation and persisted timer values remain unchanged;
- timeout state and notification prediction share the precision-aware comparison authority;
- materially early timeout values remain rejected;
- invalid / non-positive live deltas remain no-ops;
- long-horizon progression remains compared across regular, irregular, catch-up, and supported 10 Hz / 20 Hz schedules.

### Large live frames / background-like stalls

The candidate includes PR #86's characterization only. It records current behavior without authorizing a repair:

- an unpaused large RAF delta is replayed through ordinary fixed steps;
- fractional accumulator remainder is retained;
- explicit pause excludes paused wall-clock time and resume re-anchors live time;
- unmount/remount re-anchors rather than replaying absence;
- async tick handlers remain serialized while scheduler state may advance ahead during catch-up.

No max-frame clamp, visibility cutoff, background policy, elapsed-time discard, or M21 handoff is introduced.

### Mid-session cadence transitions

The candidate includes PR #87's qualification only:

- runtime cadence transitions retain the live accumulator remainder;
- retained remainder is evaluated against the newly selected fixed-step width;
- pause/resume rejection boundaries remain intact;
- the existing finite 1..60 Hz reducer clamp remains unchanged;
- queued async `onTick` payloads remain ordered and serialized across cadence changes.

No accumulator reset, repartitioning, wall-clock re-anchor-on-cadence-change, or new cadence policy is introduced.

## Combined validation gate

`.github/workflows/build-validation.yml` on this candidate is the integration authority. It unions the focused checks from PRs #85, #86, and #87 and retains the repository baseline gates.

Focused timing checks include:

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLargeFrameBackgroundStallPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopMidSessionCadenceTransitionQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
```

The gate also retains repository rejection/action-binding checks, localhost synthetic UI smoke, TypeScript, M20-M25 qualification, active-loop and historical regressions, accumulated M4-M19 baseline coverage, and the production build.

## Negative / rejection boundaries

This package must fail qualification if integration requires any of the following:

- changing the default tick rate or game speed;
- rounding, clamping, rewriting, or migrating stored Quest timer values;
- advancing timed Quests through M21 offline settlement;
- widening M21's offline-safe consumer authority;
- adding a max-frame catch-up cap or browser visibility/focus policy;
- resetting or repartitioning accumulator remainder on cadence change;
- exposing, fabricating, replacing, or bypassing production credentials;
- calling a live external service to establish repository correctness;
- making human pacing, balance, comprehension, enjoyment, retention, device-performance, Product Direction, or M26 claims.

## External authority boundary

The separate Gemini AI Code Review workflow is not repository-local evidence. Its configured credential has been failing with `API_KEY_INVALID` on the source package PRs. This package does not repair, replace, expose, or bypass that credential.

Repository qualification and merge authority remain separate:

- the candidate may be repository-qualified if the hermetic Build Validation passes on its exact head;
- if any required CI workflow fails, the PR remains open under the standing merge rule;
- external credential repair or a merge-policy change requires separate authority.

## Product authority ceiling

This integration can establish deterministic technical composition only. It does not establish pacing, fairness, responsiveness on real devices, comprehension, enjoyment, retention, balance, Product Direction, or M26 authorization.

M25 remains the current product implementation authority. Human Integrated Playability / Product Review remains separate evidence.
