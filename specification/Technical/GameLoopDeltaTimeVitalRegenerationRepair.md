# GameLoop Delta-Time Vital Regeneration Repair

**Package:** 2 — Delta-Time-Normalized Vital Regeneration Repair  
**Scope:** REPOSITORY_ONLY / HERMETIC_VALIDATION  
**Balance changes:** None  
**Quest timing repair:** Explicitly out of scope

## Problem demonstrated by Package 1

The cross-progression characterization proved that Player vitality regeneration depended on logical tick count rather than elapsed logical time.

The Player contract defines `healthRegen` and `manaRegen` as per-second rates, but production `regenerateVitalsThunk()` previously accepted no elapsed-time input and applied the entire rate once per invocation. Equivalent one-second runs therefore produced different recovery at 10 Hz and 20 Hz.

## Repair

The live `App.tsx` progression pipeline now forwards `TickData.deltaTime` to `regenerateVitalsThunk(deltaTime)`.

`regenerateVitalsThunk` treats that input as milliseconds, matching the GameLoop `TickData` contract, converts it to seconds, and applies:

```text
health gain = healthRegen * (deltaTime / 1000)
mana gain   = manaRegen   * (deltaTime / 1000)
```

Existing Player reducers remain authoritative for maximum-health and maximum-mana clamping.

No authored regeneration rate is changed. The default GameLoop tick rate is unchanged.

## Safety behavior

Vital regeneration is a no-op when:

- the player is not alive;
- `deltaTime` is non-finite; or
- `deltaTime <= 0`.

This prevents malformed elapsed-time input from creating negative or non-finite vitality mutation.

## Qualification invariants

The existing cross-progression hermetic suite is promoted from characterization to repair qualification for vitality behavior.

It must prove:

1. one second at 10 Hz and one second at 20 Hz produce equivalent health and mana recovery;
2. regular, irregular, and same-frame catch-up RAF layouts remain equivalent for the same logical elapsed time;
3. fractional elapsed intervals scale regeneration proportionally;
4. health and mana remain clamped at their existing maxima;
5. zero, negative, and non-finite elapsed input are no-ops;
6. paused wall-clock time remains excluded from live progression; and
7. the existing Essence, Copy, Quest, scheduler, M20-M25, historical, synthetic-review rejection, TypeScript, smoke, and production-build gates remain green.

With the Package 1 hermetic seed (`health=50`, `mana=10`, `healthRegen=1`, `manaRegen=0.5`), one second of logical time is expected to converge on:

```text
health = 51
mana   = 10.5
```

at both 10 Hz and 20 Hz.

## Explicit non-scope

This repair does not change:

- Quest timer units or `processQuestTimersThunk`;
- Copy growth, loyalty, or production-task semantics;
- passive Essence generation;
- status-effect duration behavior;
- authored Player stat values;
- default tick rate or game speed;
- M21 offline settlement or its allowlist;
- save schema or migrations;
- product pacing/balance authority;
- M26 authorization.

The Package 1-discovered Quest discrepancy remains intentionally visible in the focused suite as a separate `test.todo` for later bounded authorization.

## Focused qualification command

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
```

The suite is already part of `.github/workflows/build-validation.yml`, so the exact pull-request candidate must pass it together with the repository's existing qualification stack before merge.
