# M21 — Bounded Offline Progress Result

**Verdict:** QUALIFIED — PASS  
**Baseline main:** `ac14d9a8804a1d23208bcbd4d3b3cdfa5a948218`  
**Baseline tree:** `45ef6987018f1eca3381c5d9398c3b29c61116e6`  
**Prerequisite:** M20 = `M20_PASS`  

## Scientific question

> Can elapsed wall-clock time between a persisted save and resume advance only explicitly offline-safe deterministic systems, producing bounded ordinary progression while leaving narrative, Relationship, Quest, Combat, travel, and player-choice authority untouched?

## Result

Yes, within the bounded M21 evidence ceiling.

M21 qualifies one explicit load-time settlement path:

```text
canonical save-envelope timestamp
+
resume timestamp
-> clamp elapsed interval to [0, 8 hours]
-> if saved game was running and not paused
-> settle persisted passive Essence snapshot
-> settle already-running M20 Copy task progress/completion
-> mark this save timestamp settled in the restored state
-> emit bounded "While you were away" summary
-> resume ordinary runtime reconciliation/play
```

It does **not** replay `App.tsx`'s full live GameLoop pipeline.

---

## Canonical time authority

M21 reuses the existing versioned save envelope:

```ts
CurrentSaveEnvelope {
  schemaVersion
  gameVersion
  timestamp
  state
}
```

The saved timestamp comes from the canonical `createSave` / `persistCurrentSaveEnvelope` path. Current-schema load already validates the envelope timestamp as finite.

No second persisted offline clock is introduced.

Legacy standalone `GameLoopThunks.ts` helpers using `lastSaveTime` remain non-authoritative and are not consumed by M21.

### Frozen interval rule

```text
MAX_OFFLINE_PROGRESS_MS
= 8 hours
= 28,800,000 ms
```

The effective interval is:

```text
rawElapsed = resumeTimestamp - savedTimestamp

effectiveElapsed =
  0                              if saved timestamp is missing/legacy-zero
  0                              if rawElapsed <= 0
  0                              if saved GameLoop was stopped
  0                              if saved GameLoop was paused
  min(rawElapsed, 28,800,000ms)  otherwise
```

The eight-hour value is a prototype safety/evidence cap, not a final economy/balance claim.

---

## Explicit offline allowlist

M21 settles exactly two production consumers in this order:

```text
1. passive Essence
2. M20 Copy production tasks already running at save time
```

The orchestration delegates to existing runtime authorities:

```text
processPassiveGenerationThunk(elapsedMs)
processCopyTasksThunk(elapsedMs)
```

It does not persist generic Redux actions or replay the normal GameLoop consumer list.

### Explicitly not processed offline

M21 does not invoke:

- Quest timer processing;
- Relationship mutation/evidence generation;
- dialogue decisions;
- Combat actions;
- travel/location actions;
- Copy maturity growth;
- Copy loyalty decay;
- Trait discovery/Resonance;
- player status effects;
- player vitality regeneration;
- generalized GameLoop `tick` replay.

---

## Passive Essence probe

With a restored persisted generation rate of:

```text
2 Essence / second
```

and a qualified offline interval of:

```text
20 seconds
```

M21 produces:

```text
2 x 20 = +40 Essence
```

through the existing passive-generation thunk.

M21 deliberately uses the generation-rate snapshot present in the restored save for the whole bounded interval.

It does **not** simulate mid-absence rate changes event-by-event.

This means the qualified model is:

```text
saved generationRate snapshot
x bounded elapsed time
```

rather than a generalized temporal economy simulator.

---

## M20 Copy task — partial progression

A running Agent Copy on qualified **Forge Assistance** has the existing M20 duration:

```text
60 seconds
```

After a 20-second offline interval:

```text
Forge Assistance
0 / 60
-> offline settle 20s
-> 20 / 60
-> still running
```

The authored `productionTaskId`, duration, and M20 completion authority remain intact.

The return summary reports the bounded task state rather than assigning a new task.

---

## M20 Copy task — offline completion

A separate control allows an already-running Forge Assistance task to receive an offline interval longer than its remaining duration.

Qualified result:

```text
running Forge Assistance
+ 120 seconds bounded offline interval
-> reaches completion
-> M20 authored +15 Gold reward applies once
-> activeTask clears
-> excess elapsed time is discarded for that Copy
```

There is no automatic task restart, chaining, queueing, or autonomous new assignment.

A repeated settlement attempt for the same restored save timestamp produces no second Gold reward.

This preserves M20's core authority:

```text
player chooses task
-> Copy may execute routine work
-> completion effect exactly once
```

M21 changes only when already-authorized progress may advance.

---

## Replay safety

The restored GameLoop state now has one optional replay token:

```ts
lastOfflineSettlementSourceTimestamp?: number | null
```

This is **not a clock authority**. It identifies which save-envelope timestamp has already been settled into the current restored state.

Rule:

```text
lastOfflineSettlementSourceTimestamp === loaded envelope timestamp
-> skip duplicate settlement
```

The dedicated test proves that a repeated call against the same saved timestamp does not duplicate passive Essence or Copy task progress/reward.

### Legitimate later interval

M21 also proves the replay guard does not permanently disable offline progress:

```text
settle save timestamp A
-> ordinary later save creates new envelope timestamp B
-> load B
-> marker still records A
-> B is a new settlement identity
-> a later positive B -> C interval can settle normally
```

No save-schema version bump is required because the replay marker is optional/backward-compatible ordinary RootState.

---

## Saved pause/stop control

If the restored save says:

```text
isPaused = true
```

or:

```text
isRunning = false
```

M21 settles zero offline Essence and zero Copy task progress.

This prevents offline progression from silently overriding the player's persisted GameLoop state.

---

## Narrative / active-RPG authority control

Across the positive offline-settlement probe, the dedicated qualification snapshots and verifies:

```text
Relationship state -> unchanged
Quest state        -> unchanged
Player.location    -> unchanged
```

The source-level control also proves the offline module does not import/call the broader unsafe runtime consumers listed above.

Therefore M21's qualified boundary is:

```text
continuous routine accumulation
-> may settle offline

meaningful active decision / eventful world action
-> remains online and player-driven
```

---

## Player-facing feedback

A positive settlement emits one summary notification beginning:

```text
While you were away:
```

Examples exercised by the qualified contract include ordinary Essence gain and Copy task percentage/completion.

The summary is presentation only. Gameplay effects remain owned by the existing Essence/M20 reducers/thunks.

M20's own completion notification is preserved; M21 does not weaken earlier task evidence merely to consolidate UI presentation.

---

## Architecture finding

The existing architecture was sufficient with a bounded addition.

The significant authority separation is now:

```text
Save envelope -> authoritative persisted wall-clock timestamp
GameLoop M21  -> bounded elapsed-window + replay guard + allowlist orchestration
Essence       -> existing passive generation effect
Copy M20      -> existing task progress/completion/reward effect
Relationship  -> no offline mutation
Quest         -> no offline mutation
Combat        -> no offline mutation
Exploration   -> no offline movement
```

The repository did **not** require:

- a new save schema version;
- a second offline-time database field;
- GameLoop catch-up replay;
- generalized event scheduling;
- arbitrary offline action scripts;
- a pending-decision engine;
- background world simulation.

---

## Diagnostic history

### Initial behavioral candidate — diagnostic FAIL

Initial head:

```text
1f336e5fb1401c9eff911c161c6453bb510411d8
```

Build Validation #204:

- run: `34187172547`
- job: `101937743567`
- dependency installation: PASS
- TypeScript: **FAIL**
- M21 and later behavioral gates: not run

The failure was confined to the new qualification test fixture:

- two parameterized callbacks needed explicit `void` return annotations;
- the notification slice field was referenced as `notifications` instead of its real `items` field.

No runtime contract or preregistered M21 semantic was changed by the repair.

### First complete behavioral candidate

SHA:

```text
adf2d3b5f4119f49599801636c53fcd8dee94f79
```

Tree:

```text
e4fca14d1714533f9b2a85fc37ba58d79f5f61c6
```

Build Validation #205:

- run: `34187272876`
- job: `101938025067`
- dependency installation: PASS
- TypeScript: PASS
- dedicated M21 bounded offline progress qualification: PASS
- M20 Copy production automation qualification: PASS
- Active-loop repair qualification: PASS
- modified historical qualification: PASS
- accumulated M4-M19 baseline qualification: PASS
- production build: PASS

Thus the first runtime-complete M21 candidate required one diagnostic repair cycle, and that repair was test-only.

---

## Qualified claim

> Using the canonical versioned save-envelope timestamp and an eight-hour prototype cap, a restored running/unpaused game can settle exactly two offline-safe systems—persisted passive Essence generation and already-running M20 Copy production tasks—once per restored save timestamp. Copy tasks may advance or complete with their authored reward exactly once, while excess task time is discarded and Relationship, Quest, location, Combat, travel, and other active-choice domains are not replayed offline.

---

## Evidence ceiling

M21 does **not** qualify:

- server-authoritative or tamper-resistant time;
- anti-cheat protection against device clock manipulation;
- final balance of the eight-hour cap;
- event-time segmented simulation when generation rates change mid-absence;
- offline Copy maturity growth;
- offline Copy loyalty decay;
- automatic task chains/queues/priorities;
- autonomous Copy task choice;
- offline travel;
- offline Combat;
- offline Quest timers/objectives/endings;
- offline Relationship growth/decay/evidence/Memories;
- offline dialogue;
- offline Trait discovery/Resonance choices;
- player status-effect/regeneration catch-up;
- generalized offline economy/world simulation;
- background simulation while the application remains open but merely unfocused;
- human pacing, enjoyment, or exploit resistance beyond the explicit cap.

---

## Next boundary

M21 completes the planned initial incremental/automation sequence:

```text
M20 routine Copy automation
-> M21 bounded offline settlement
```

The next step is **Checkpoint C — Incremental Integration**.

Checkpoint C should evaluate whether automation and offline progression actually support the active RPG by removing routine repetition while preserving meaningful active choices, rather than becoming a detached idle layer.

M21 does **not** start Checkpoint C and does not authorize M22 by itself.

The repository should stop at this boundary until the documentation-complete M21 head is independently qualified and merged.
