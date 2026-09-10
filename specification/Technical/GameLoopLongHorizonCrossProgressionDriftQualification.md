# GameLoop Long-Horizon Cross-Progression Drift Qualification

**Package:** 3 — Long-Horizon Cross-Progression Drift Qualification  
**Zone:** HERMETIC_VALIDATION  
**Base:** `main` at `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Production mechanics changed:** none  
**Product/balance authority:** none

## Purpose

The repository already proves representative cross-progression determinism over one logical second. This package extends that evidence horizon without changing gameplay formulas, tick cadence, persistence, offline authority, authored rewards/durations, or product pacing.

The bounded question is:

> When the existing online progression consumers receive a materially longer but equivalent amount of logical GameLoop time, do supported frame layouts and tick rates remain convergent, or does repeated fractional accumulation create meaningful cross-system drift?

This is a qualification package, not a tuning or mechanics package.

## Production path under qualification

The harness uses the production `useGameLoop` scheduler and reproduces the online consumer order owned by `App.tsx`:

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

No external services, credentials, deployments, migrations, production data, or subjective review are used.

## Long-horizon probe

The primary probe advances **60,000 ms / 60 logical seconds**, sixty times the original cross-progression characterization window.

Seeded representative state:

- passive Essence generation: `10 / second`;
- Copy maturity: `50`, normal growth;
- Copy loyalty: `90`;
- running Copy timer: `0 / 600 seconds`;
- Player health: `10`;
- Player mana: `5`;
- timed Quest: `0 / 600 seconds`.

The 60-second horizon is long enough to accumulate hundreds or thousands of fixed-step additions and to cross repeated Essence resonance thresholds, while remaining short enough to avoid intentionally unrelated Copy-task completion and Quest-timeout side effects.

## Qualified scheduler layouts

Equivalent 60-second logical windows are compared under:

1. regular 10 Hz delivery — 600 fixed steps;
2. irregular RAF delivery at 10 Hz — still 600 fixed steps;
3. one-frame 60-second catch-up at 10 Hz — 600 queued fixed steps;
4. regular 20 Hz delivery — 1,200 fixed steps.

Tick-count differences are expected. Progression outcome differences beyond the defined machine-scale drift budget are not.

## Drift budget

The suite uses an absolute comparison budget of:

```text
1e-8
```

for representative continuous numeric progression fields.

This tolerance is a **test observation budget**, not a new production epsilon and not an authorization to round, clamp, quantize, or rewrite state. It exists only to distinguish ordinary floating-point residue from materially different gameplay progression.

Discrete state such as resonance level and Quest status must match exactly.

## Expected 60-second state

Given the seeded current rates, every qualified schedule must converge within the drift budget on:

```text
GameLoop totalGameTime     = 60000 ms
Essence current            = 600
Essence total collected    = 600
Essence resonance level    = 6
Player resonance level     = 6
Copy maturity              = 56
Copy loyalty               = 87
Copy task progress         = 60 s
Player health              = 70
Player mana                = 35
Quest elapsed              = 60 s
Quest status               = IN_PROGRESS
```

These values qualify the current formulas only. They do not claim that those rates are balanced or desirable.

## Rejection boundaries

### Sub-step-only delivery

At 20 Hz, the fixed step is 50 ms. A sequence ending at 49 ms must produce zero logical ticks and therefore zero progression across all representative consumers.

This rejects raw RAF callback count or wall-clock fragments as progression authority before a complete fixed step exists.

### Long paused wall time

A 60-second wall-clock interval while paused must contribute zero ordinary live progression. After resume, the first ordinary 50 ms fixed step at 20 Hz must match a clean one-step baseline.

This prevents a long inactive wall-clock interval from masquerading as online progression and preserves the separate M21 offline-settlement authority.

## Scope deliberately unchanged

This package does not change or claim authority over:

- GameLoop fixed-step implementation;
- default tick rate or game speed;
- Essence, Copy, Player, or Quest progression formulas;
- authored rewards, rates, or durations;
- timed-Quest timeout comparison semantics;
- save schema, migrations, or persisted timer values;
- M21 offline allowlist or offline Quest progression;
- background-tab/browser scheduling guarantees outside the hermetic scheduler contract;
- pacing, fairness, comprehension, enjoyment, retention, or product-market fit;
- Product Direction Decision;
- M26 authorization;
- external Gemini credentials or review availability.

## Permanent qualification command

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
```

The dedicated suite is additive to the existing one-second cross-progression, timed-Quest, live/offline, M20-M25, historical, rejection-contract, TypeScript, UI-smoke, and production-build gates.

## Decision rule

Package 3 passes only if:

- all four 60-second schedules reach their expected logical tick counts;
- representative numeric state converges within `1e-8`;
- discrete progression state agrees exactly;
- the sub-step rejection case produces zero progression;
- the 60-second paused interval produces zero progression and resume matches a clean one-step baseline;
- existing repository Build Validation remains green.

A failure outside those bounds is evidence of a repository-local deterministic defect and must not be reclassified as product tuning merely to make the test pass.
