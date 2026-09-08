# GameLoop System Specification

**Implementation Status:** ✅ **LIVE FIXED-TIMESTEP LOOP + BOUNDED M21 OFFLINE SETTLEMENT + VISIBLE RETURN PRESENTATION QUALIFIED**

The GameLoop system owns live timing/control and the bounded orchestration boundary for M21 offline-safe catch-up. The Checkpoint-C Incremental Integration Repair does not broaden that allowlist; it closes the presentation seam by making the existing M21 summary visible through the shared production notification host.

For empirical authority, read:

- `../Technical/M21BoundedOfflineProgress.md` — preregistered M21 contract;
- `../Technical/M21BoundedOfflineProgressReconAmendment.md` — frozen time/cap/allowlist decisions;
- `../Technical/M21BoundedOfflineProgressResult.md` — qualified M21 result/evidence ceiling;
- `../Technical/CheckpointCIncrementalIntegrationResult.md` — historical first Checkpoint-C finding;
- `../Technical/IncrementalIntegrationRepairResult.md` — qualified visible-return repair.

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

`App.tsx` owns the ordinary online consumer sequence. It includes systems such as passive Essence, Copy growth/loyalty/tasks, player regeneration/status processing, and Quest timers.

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

It is **not** elapsed-time authority. It records which canonical save-envelope timestamp has already been settled into the restored state so an accidental repeat cannot duplicate progression.

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

No save-schema version bump was required for M21 or for the later optional player routine-familiarity repair.

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

The Checkpoint-C repair does not add routine familiarity as an offline consumer. Familiarity must already have been earned through active play before the task could have been assigned.

### Snapshot semantics

If a Copy task completion could change a later derived Essence rate, M21 does not segment the interval around that event and recalculate subperiods.

Qualified semantics remain:

```text
persisted Essence generationRate x bounded elapsed
-> then Copy task progress/completion
```

---

## 8. Copy task offline behavior

M21 reuses M20's existing task authority.

An already-running task may advance partially or reach one completion:

```text
reach completion
-> apply authored M20 reward exactly once
-> apply existing task-owned role completion bonus where applicable
-> clear activeTask
```

Excess offline time after completion is discarded for that Copy.

M21 does not:

- teach an unfamiliar routine;
- select another task;
- queue tasks;
- repeat the completed task;
- make strategic/autonomous assignments.

The later Checkpoint-C repair adds familiarity at **assignment time**, not inside offline settlement.

---

## 9. Replay safety

After one positive settlement:

```text
markOfflineSettlementSource(savedTimestamp)
```

A repeated call against the same restored save timestamp is skipped.

A later ordinary save creates a new canonical envelope timestamp, so a genuinely later load can settle a new interval normally.

---

## 10. Player-facing return summary

A positive M21 settlement emits an informational shared notification beginning:

```text
While you were away:
```

It may summarize:

- bounded Essence gain;
- Copy task percentage;
- Copy task completion.

The summary remains presentation only; resource/task truth stays with Essence and Copy authorities.

### 10.1 Historical presentation gap

The first Checkpoint C evaluation found that the summary was correctly dispatched into `NotificationSlice` but the mounted production component tree did not demonstrate a renderer for the shared queue.

### 10.2 Qualified repaired presentation

The Incremental Integration Repair adds `GlobalNotificationHost`, mounted once in `GameLayout`:

```text
M21 settleOfflineProgressThunk
-> addNotification("While you were away: ...")
-> NotificationSlice.notifications.items
-> GlobalNotificationHost
-> MUI Alert visible to player
-> removeNotification on dismissal
```

The combined repair qualification proves this with a running Forge Assistance task that is saved, loaded, completed during a 60-second offline interval, rewarded exactly once, and then summarized visibly.

---

## 11. Explicitly online-only / not processed by M21

M21 does not invoke offline:

- Quest timer processing;
- Relationship mutation/evidence/Memory creation;
- dialogue decisions;
- Combat actions;
- player travel/location changes;
- player routine-learning actions;
- Copy general maturity growth;
- Copy loyalty decay;
- Trait discovery/Resonance decisions;
- player status-effect processing;
- player vitality regeneration;
- generalized GameLoop `tick` replay.

This positive allowlist is intentional.

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
- Relationship and Quest state remain unchanged in the positive probe;
- Player location remains unchanged;
- unsafe broad GameLoop consumers are absent from offline orchestration;
- save schema remains v1.

The later Incremental Integration Repair qualification additionally proves:

- missing/legacy-like routine familiarity remains missing across positive offline time;
- already-earned familiarity survives ordinary save/load;
- a familiar running Forge task may complete through the unchanged M21 authority;
- the M21 summary is rendered through the mounted shared notification host;
- replay of the same saved timestamp still does not duplicate the reward.

Build Validation #213 passed the repair gate, M21, M20, active-loop, historical M4-M19, TypeScript and production build on the first complete behavioral repair candidate.

---

## 14. Evidence ceiling / next boundary

Not qualified by M21 or the bounded presentation repair:

- trusted server time;
- device-clock tamper resistance / anti-cheat;
- final eight-hour balance;
- event-time segmented offline simulation;
- offline Copy growth/loyalty decay beyond task-owned completion bonuses;
- offline routine learning;
- offline Quest/Relationship/dialogue/Combat/travel;
- automatic task chains;
- generalized offline economy/world simulation;
- background simulation merely because a browser tab is unfocused;
- final notification UX/timeout policy at scale;
- human pacing/enjoyment.

The current sequence is:

```text
M21 PASS
-> first Checkpoint C: WEAK
-> Incremental Integration Repair: PASS
-> fresh Checkpoint C rerun required
-> only a fresh CHECKPOINT_C_PASS may authorize M22
```

The repair result is evidence for the rerun, not a substitute for it.
