# M21 — Bounded Offline Progress Recon Amendment

**Status:** Recon frozen before M21 behavior implementation  
**Baseline:** `ac14d9a8804a1d23208bcbd4d3b3cdfa5a948218`  
**Preregged branch:** `feature/m21-bounded-offline-progress`  
**Preregistration commit:** `e75b62ea4f06fe366957cbc541fd407be054fa38`  

---

## 1. Recon findings

### Canonical wall-clock authority already exists

`CurrentSaveEnvelope.timestamp` is written by the canonical `saveUtils.ts` path and normalized by `saveSchema.ts`.

Current-schema loads reject non-finite envelope timestamps. Legacy payloads without a timestamp normalize to `0`.

Therefore M21 will use:

```text
savedTimestamp = loaded.envelope.timestamp
resumeTimestamp = Date.now() at the explicit load settlement boundary
```

No second persisted `lastSaveTime` clock is warranted.

### Legacy GameLoop local-storage helpers are not authority

`GameLoopThunks.ts` still contains older standalone `gameState` / `lastSaveTime` helpers. They are not the modern versioned save-envelope path used by Main Menu load.

M21 will not revive or consume them.

### Live GameLoop does not naturally replay wall-clock absence

`useGameLoop` resets its frame baseline from `performance.now()` and advances fixed live ticks only while running.

Therefore offline settlement must be explicit. M21 must not fake absence by feeding one giant delta through `App.tsx`'s whole tick pipeline.

### Narrow load hook already exists

The canonical Main Menu path is currently:

```text
loadSavedGameWithMigration
-> replaceState
-> Relationship runtime reconciliation
-> navigate into game
```

M21 will insert one bounded settlement after `replaceState` and before ordinary runtime reconciliation/navigation.

### Existing consumers are reusable

Passive Essence already owns online delta-time processing through `processPassiveGenerationThunk(deltaTime)` using persisted `essence.generationRate`.

M20 Copy tasks already own progress/completion/reward semantics through `processCopyTasksThunk(deltaTime)`.

M21 therefore does not need offline-only reward formulas or a second Copy completion path.

---

## 2. Frozen maximum interval

M21 freezes a prototype cap of:

```text
8 hours
= 28,800 seconds
= 28,800,000 milliseconds
```

This is intentionally an **evidence/balance safety cap**, not a claim that eight hours is the final production economy value.

The cap is applied below the UI.

```text
rawElapsed = resumeTimestamp - savedTimestamp
effectiveElapsed = clamp(rawElapsed, 0, 28_800_000ms)
```

Special cases:

- non-finite timestamp -> `0`;
- legacy/missing timestamp normalized as `0` -> `0` offline settlement;
- future timestamp -> `0`;
- equal timestamp -> `0`;
- elapsed above cap -> exactly the cap.

No negative progression is possible.

---

## 3. Saved pause/run semantics

Offline settlement should match the existing top-level GameLoop intent.

If the restored save says:

```text
isRunning = false
OR
isPaused = true
```

M21 applies **no offline progression**.

This avoids granting offline time for a game the player explicitly saved in a stopped/paused state.

---

## 4. Frozen allowlist and settlement order

M21 processes exactly two production consumers in this order:

```text
1. passive Essence
2. M20 Copy task progress/completion
```

No generic list of Redux actions is persisted or authored.

### Why Essence first

M21 deliberately uses the generation rate persisted at save time for the bounded interval.

If Copy completion during the interval would have changed a later derived Essence rate, M21 does **not** segment the absence into event-time subintervals. That would require a broader temporal simulation engine and is outside the current evidence ceiling.

Therefore the qualified semantics are snapshot settlement:

```text
saved generationRate * bounded elapsed
-> passive Essence
-> then Copy task settlement
```

This is deterministic and bounded but not a full causal simulation of mid-interval rate changes.

### Copy completion

M21 delegates to existing M20 completion authority.

Thus one running task may:

```text
advance partially
OR
complete once -> authored reward -> clear activeTask
```

Elapsed time beyond completion is discarded for that Copy. It cannot select, start, queue, or repeat another task.

---

## 5. Replay guard

The load path itself calls settlement once, but M21 will also make the same restored state resistant to accidental duplicate settlement calls.

A single optional GameLoop replay marker is warranted:

```ts
lastOfflineSettlementSourceTimestamp?: number | null
```

This value is **not elapsed-time authority**. It is only a replay token identifying which save-envelope timestamp has already been settled into the currently restored state.

Rule:

```text
if lastOfflineSettlementSourceTimestamp === savedTimestamp
-> no second settlement
```

After a later ordinary save, the new envelope receives a new timestamp while the state may contain the prior marker, so the next legitimate load can settle the new interval.

Older saves may omit this optional field; no save-schema version bump is required.

---

## 6. Player-facing return summary

A positive settlement emits one bounded summary notification such as:

```text
While you were away: +12 Essence; Echo-1 completed Forge Assistance.
```

or for partial work:

```text
While you were away: +12 Essence; Echo-1 Forge Assistance 67%.
```

The summary is presentation only. Numeric gameplay effects remain owned by Essence/M20 actions.

M20 may still emit its ordinary completion notification; M21 does not weaken that existing evidence merely to deduplicate presentation.

---

## 7. Architecture to implement

Add a bounded GameLoop-domain offline settlement module/thunk that owns:

- elapsed-window calculation;
- cap/skew rules;
- replay-token check;
- explicit two-consumer orchestration;
- return summary derivation.

Reuse:

- `CurrentSaveEnvelope.timestamp` as saved-time authority;
- `processPassiveGenerationThunk` for passive Essence;
- `processCopyTasksThunk` for M20 task progression/completion;
- existing Copy task definitions for task names in summary;
- notification slice for the return message.

Modify the Main Menu load path only enough to dispatch this settlement after `replaceState`.

Do not modify `App.tsx`'s normal consumer list for offline work.

---

## 8. Explicitly untouched domains

M21 settlement will not call:

- `processQuestTimersThunk`;
- Relationship event/thunk mutation;
- dialogue thunks;
- combat thunks;
- travel/location thunks;
- Copy growth thunk;
- Copy loyalty-decay thunk;
- Trait discovery/Resonance thunks;
- player status-effect/regeneration thunks;
- generalized GameLoop `tick` replay.

This is the practical offline allowlist boundary.

---

## 9. Qualification probes

The dedicated M21 suite will prove:

1. canonical elapsed-window calculation, including zero/future/missing timestamp;
2. exact eight-hour clamp;
3. saved pause/stopped state yields no settlement;
4. positive interval gives expected passive Essence through existing generation authority;
5. one M20 task advances partially;
6. another M20 task completes offline with its authored reward exactly once;
7. excess offline interval cannot repeat/start another task;
8. replaying settlement against the same restored save timestamp is blocked by the replay marker;
9. save after settlement -> later load uses the new envelope timestamp and can legitimately settle a new interval;
10. Relationship, Quest, player location, and relevant narrative state remain unchanged except ordinary Gold produced by an explicitly safe M20 task;
11. source-level control shows the offline module does not call the forbidden broad GameLoop/narrative consumers;
12. no new save-schema version is required;
13. accumulated M4-M20/active-loop qualification remains green.

---

## 10. Evidence ceiling clarified

Even if M21 passes, it will not prove:

- anti-cheat clock security;
- accurate event-time simulation when rates change mid-absence;
- offline Copy maturity/loyalty progression except task-owned completion bonuses already qualified by M20;
- offline Quest timers;
- offline combat/status effects/regeneration;
- offline travel/world simulation;
- automatic task chaining;
- arbitrary economy settlement;
- final player-facing balance of the eight-hour cap.

The result will establish one **bounded snapshot settlement** for two independent routine systems, not a general temporal simulation engine.
