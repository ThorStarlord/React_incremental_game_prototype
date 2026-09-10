# Precision / Drift Combined Integration Qualification

**Package:** Work Package 1 — Precision/Drift Combined Integration Qualification  
**Zone:** REPOSITORY_ONLY + HERMETIC_VALIDATION  
**Integration base:** `main` at `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Production scope:** only the already-qualified timed-Quest comparison repair from prior Package 2  
**New gameplay mechanics introduced by this package:** none

## Purpose

The precision/drift follow-up milestone was previously implemented in three independently based pull requests:

1. PR #81 — timed-Quest precision preflight;
2. PR #82 — comparison-only timeout precision resolution;
3. PR #83 — long-horizon cross-progression drift qualification.

Each candidate passed repository Build Validation independently, but all three were based on the same `main` commit and therefore did not prove that their changes composed on one tree. Their separate Gemini review workflows also failed before producing review output because of the known invalid external API credential.

This integration package answers only the repository-local question:

> Do the preflight decision authority, the bounded comparison repair, and the long-horizon drift qualification compose together on one candidate without weakening existing rejection boundaries or product-authority limits?

## Composition rule

The integrated authority order is:

```text
historical preflight evidence (#81)
-> bounded comparison repair (#82)
-> long-horizon drift qualification (#83)
-> combined exact-head Build Validation
```

The historical preflight document remains unchanged because it records the defect as observed before the repair. Its executable test file is intentionally converted into a **post-resolution decision regression**: the same scenarios that originally demonstrated tick-rate and persisted-history divergence must now remain resolved on the integrated tree.

This prevents a contradictory CI state in which the repository would simultaneously require the old defect to reproduce and require the repair to eliminate it.

## Integrated artifacts

The candidate contains:

- `TimedQuestPrecisionContractPreflight.md` as the historical decision/evidence authority;
- `GameLoopTimedQuestPrecisionPreflight.test.tsx` as the post-resolution regression of the original preflight cases;
- `QuestTimerPrecision.ts`, `QuestSlice.ts`, and `QuestThunks.ts` from the bounded comparison repair;
- `GameLoopTimedQuestPrecisionResolution.test.tsx` and its technical contract;
- the precision-aware update to the existing Quest timing integration suite and document;
- `GameLoopLongHorizonCrossProgressionDrift.test.tsx` and its technical qualification document;
- one Build Validation workflow that runs all of those suites together with the existing native, rejection, milestone, historical, UI-smoke, TypeScript, and production-build gates.

## Integrated precision invariant

The combined candidate must preserve all of the following:

- GameLoop deltas remain milliseconds at the scheduler boundary;
- Quest public timer fields remain seconds;
- live deltas are converted exactly once with `/ 1000`;
- non-finite and non-positive live deltas remain no-ops;
- machine-scale floating-point undershoot may count as threshold equality only at comparison time;
- raw accumulated and persisted `elapsedSeconds` values remain unrounded and unchanged;
- supported 10 Hz and 20 Hz schedules agree on an authored `1.0s` timeout boundary;
- equivalent RAF layouts agree;
- exact and accumulated persisted histories resolve on the same next nominal step;
- timeout notification remains exact-once and failed timers remain frozen;
- M21 offline authority remains unchanged and timed Quests remain online-only there.

## Integrated drift invariant

The long-horizon suite remains a hermetic observation contract only. Over the qualified 60-second horizon, representative Essence, Copy, Player, Quest, and GameLoop state must converge within the existing `1e-8` test-only numeric drift budget across:

- regular 10 Hz;
- irregular 10 Hz;
- one-frame 10 Hz catch-up;
- regular 20 Hz.

Discrete state must match exactly. A 49 ms sub-step-only window at 20 Hz must produce zero progression, and 60 seconds of paused wall time must produce zero live progression before an ordinary resumed step.

The `1e-8` drift budget is not a production epsilon and does not authorize rounding, clamping, quantization, retuning, or migration.

## Verification

The integrated candidate is qualified by the exact branch `.github/workflows/build-validation.yml`, including:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx playwright install --with-deps chromium
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
npm run build
```

Build Validation also retains the localhost UI-only smoke, M20-M25 qualifications, active-loop qualification, modified historical qualification, and accumulated M4-M19 baseline.

## External authority deferred

This package does not repair, replace, bypass, expose, or otherwise use the Gemini credential. It also does not perform human product validation.

Still external or product-authority gated:

- Gemini credential maintenance and successful external AI review;
- human integrated playability evidence;
- pacing, fairness, comprehension, discoverability, enjoyment, retention, or final balance claims;
- trusted server time / anti-cheat authority;
- Product Direction Decision;
- M26 authorization.

## Stop boundary

This package is complete only when the combined candidate is committed, pushed, opened as a PR, and all repository/hermetic qualification available to the candidate has run.

Merge is permitted only if every required CI workflow on the exact candidate head passes. If an external-authority workflow remains failed, the PR must stay open.

Do not begin the next work package from this branch.
