# GameLoop System Specification

**Implementation Status:** ✅ **LIVE FIXED-TIMESTEP LOOP + BOUNDED M21 OFFLINE SETTLEMENT QUALIFIED**

The GameLoop system owns live timing/control and now also owns the bounded orchestration boundary for M21 offline-safe catch-up.

For empirical authority, read:

- `../Technical/M21BoundedOfflineProgress.md` — preregistered M21 contract;
- `../Technical/M21BoundedOfflineProgressReconAmendment.md` — frozen time/cap/allowlist decisions;
- `../Technical/M21BoundedOfflineProgressResult.md` — qualified result and evidence ceiling.

---

## 1. Purpose

The GameLoop has two deliberately different timing modes.

### Live progression

```text
requestAnimationFrame
-> fixed timestep accumulator
-> ordinary online GameLoop consumers
```

### M21 offline settlement

```text
canonical save-envelope timestamp
+
resume wall-clock timestamp
-> bounded elapsed interval
-> explicit offline-safe allowlist only
```

M21 does **not** replay the live loop for the entire time the application was closed.

---

## 2. Live fixed-timestep architecture

`useGameLoop` uses `requestAnimationFrame` with an accumulator and a fixed timestep derived from `tickRate`.

Current defaults include:

- `isRunning = true`;
- `tickRate = 10` ticks/second;
- `gameSpeed = 1.0`;
- `autoSaveInterval = 30000` ms.

The hook resets its frame baseline from `performance.now()` when it starts. Wall-clock absence is therefore not silently converted into one giant live-frame delta.

`App.tsx` owns the ordinary online consumer sequence. It currently includes systems such as passive Essence, Copy growth/loyalty/tasks, player regeneration/status processing, and Quest timers.

That online list is **not** the offline allowlist.

---

## 3. GameLoop state

Current state includes:

```ts
GameLoopState {
  isRunning
  isPaused
  currentTick
  tickRate
  lastUpdateTime
  totalGameTime
  gameSpeed
  autoSaveInterval
  lastAutoSave
  lastOfflineSettlementSourceTimestamp?
}
```

### Replay marker

`lastOfflineSettlementSourceTimestamp` is optional/backward-compatible.

It is **not** a source of elapsed time. It records which canonical save-envelope timestamp has already been settled into the currently restored state so an accidental repeated settlement cannot duplicate progression.

Canonical elapsed time remains:

```text
loaded CurrentSaveEnvelope.timestamp
-> compared with resume Date.now()
```

---

## 4. Live controls

The live loop supports:

- start;
- pause;
- resume;
- stop;
- configurable tick rate;
- game-speed multiplier;
- tick/total-game-time tracking.

A saved state that is stopped or paused receives **no M21 offline settlement**. Offline progression does not override persisted player loop control.

---

## 5. Canonical persistence/time authority

M21 uses the versioned save envelope owned by `shared/utils/saveSchema.ts` and `saveUtils.ts`.

```ts
CurrentSaveEnvelope {
  schemaVersion
  gameVersion
  timestamp
  state
}
```

No second persistent `lastSaveTime` clock was added.

Older standalone helpers still present in `GameLoopThunks.ts` that reference separate `gameState` / `lastSaveTime` local-storage values are legacy/non-authoritative for M21. The canonical Main Menu load path uses `loadSavedGameWithMigration`.

No save-schema version bump was required for M21.

---

## 6. M21 bounded offline window

The qualified prototype cap is:

```text
MAX_OFFLINE_PROGRESS_MS
= 28,800,000 ms
= 8 hours
```

Window calculation:

```text
rawElapsed = resumeTimestamp - savedTimestamp
```

Then:

- missing/legacy-zero/non-finite saved timestamp -> zero settlement;
- future/equal timestamp -> zero settlement;
- stopped save -> zero settlement;
- paused save -> zero settlement;
- positive interval -> clamp to at most eight hours.

The cap is a bounded prototype safety/evidence choice, not a final economy balance claim or anti-cheat guarantee.

---

## 7. Explicit offline allowlist

M21 qualifies exactly two consumers:

```text
1. passive Essence
2. already-running M20 Copy production tasks
```

Settlement order is frozen as:

```text
saved passive generation-rate snapshot
-> processPassiveGenerationThunk(elapsedMs)
-> processCopyTasksThunk(elapsedMs)
```

### Why this is snapshot settlement

If a Copy task completion could change a later derived Essence rate, M21 does not divide the offline interval around that event and recalculate rate subperiods.

That would be a wider temporal simulation engine.

Qualified semantics are therefore:

```text
persisted Essence generationRate x bounded elapsed
-> then Copy task progress/completion
```

---

## 8. Copy task offline behavior

M21 reuses M20's existing task authority.

An already-running task may:

```text
advance partially
```

or:

```text
reach completion
-> apply authored M20 reward exactly once
-> apply existing task-owned role completion bonus where applicable
-> clear activeTask
```

Excess offline time after completion is discarded for that Copy.

M21 does not:

- select another task;
- queue tasks;
- repeat the completed task;
- make strategic/autonomous assignments.

---

## 9. Replay safety

After one positive settlement:

```text
markOfflineSettlementSource(savedTimestamp)
```

A repeated call against the same restored save timestamp is skipped.

A later ordinary save creates a new canonical envelope timestamp, so a genuinely later load can settle a new interval normally.

This gives exact-once settlement identity without creating a competing clock authority.

---

## 10. Player-facing return summary

A positive M21 settlement emits an informational notification beginning:

```text
While you were away:
```

It may summarize:

- bounded Essence gain;
- Copy task percentage;
- Copy task completion.

The summary is presentation only. Actual resource/task state remains owned by the existing Essence and Copy contracts.

---

## 11. Explicitly online-only / not processed by M21

M21 does not invoke offline:

- Quest timer processing;
- Relationship mutation/evidence/Memory creation;
- dialogue decisions;
- Combat actions;
- player travel/location changes;
- Copy general maturity growth;
- Copy loyalty decay;
- Trait discovery/Resonance decisions;
- player status-effect processing;
- player vitality regeneration;
- generalized GameLoop `tick` replay.

This allowlist boundary is intentional. The implementation prefers *not processing unsafe domains* over inventing a pending-decision or background-world simulator.

---

## 12. Auto-save

The application has a settings-driven autosave system and canonical versioned save/load helpers.

M21's time authority comes from the timestamp in the canonical persisted save envelope. The offline module does not create its own storage channel.

Legacy GameLoop-local save helper code is not the current product persistence authority and should not be expanded as if it were.

---

## 13. Qualification

Dedicated M21 qualification proves:

- missing/future/equal timestamp produces no progress;
- interval clamps exactly to eight hours;
- paused/stopped saves do not settle;
- passive Essence settles through existing authority;
- an M20 task can advance partially offline;
- an M20 task can complete offline with authored reward exactly once;
- excess time does not restart/queue work;
- duplicate settlement of the same save timestamp is blocked;
- a later save timestamp can legitimately produce another interval;
- Relationship and Quest state remain unchanged in the qualified positive probe;
- Player location remains unchanged;
- unsafe broad GameLoop consumers are absent from offline orchestration;
- save schema remains v1;
- M20 and accumulated earlier qualification remain green.

See `../Technical/M21BoundedOfflineProgressResult.md` for exact CI/SHA evidence.

---

## 14. Evidence ceiling / future work

Not qualified by M21:

- trusted server time;
- device-clock tamper resistance or anti-cheat;
- final eight-hour balance;
- event-time segmented offline simulation;
- offline Copy growth/loyalty decay beyond existing task-owned completion bonuses;
- offline Quest/Relationship/dialogue/Combat/travel;
- automatic task chains;
- generalized offline economy/world simulation;
- background simulation merely because a browser tab is unfocused;
- human pacing/enjoyment.

The next planned evaluation is **Checkpoint C — Incremental Integration**, which asks whether M20/M21 automation supports the active RPG rather than becoming a detached idle layer.
