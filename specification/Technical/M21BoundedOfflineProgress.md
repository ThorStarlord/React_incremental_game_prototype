# M21 — Bounded Offline Progress Qualification

**Status:** Preregistered before M21 behavior changes  
**Baseline main:** `ac14d9a8804a1d23208bcbd4d3b3cdfa5a948218`  
**Baseline tree:** `45ef6987018f1eca3381c5d9398c3b29c61116e6`  
**Branch:** `feature/m21-bounded-offline-progress`  
**Prerequisite:** M20 = `M20_PASS`; bounded production Copy automation qualified  

---

## Scientific question

> Can elapsed wall-clock time between a persisted save and resume advance only explicitly offline-safe deterministic systems, producing bounded ordinary progression while leaving narrative, Relationship, Quest, Combat, travel, and player-choice authority untouched?

M21 is a qualification of **bounded settlement of already-authorized routine progression**. It is not a general simulation of everything that might have happened while the application was closed.

---

## Product boundary

The intended authority is:

```text
saved deterministic routine state
+
trusted resume timestamp
-> bounded elapsed time
-> explicit offline-safe consumers only
-> one resume settlement
```

not:

```text
elapsed time
-> replay the whole GameLoop
-> simulate story / world / combat / choices
```

The core rule is:

```text
continuous routine accumulation may settle offline
meaningful decisions and eventful world changes do not
```

---

## Required independent production probes

M21 must qualify at least two already-real systems through one bounded offline-settlement contract.

### Probe A — passive Essence

A persisted save with a positive ordinary passive Essence generation rate should, after a positive bounded offline interval, resume with the corresponding bounded Essence gain.

The probe must use existing Essence authority rather than inventing a second offline-only resource formula.

### Probe B — M20 Copy production task

A persisted M20 production Copy task that is still running should advance by the same bounded offline interval.

If the interval reaches completion:

```text
remaining task time
-> completion
-> authored M20 reward exactly once
-> active task cleared
```

Time beyond completion must not create repeated automatic task assignments, loops, queues, or duplicate rewards.

---

## Acceptance criteria

M21 passes only if all of the following hold.

1. The elapsed interval comes from persisted save/resume metadata or another existing canonical persistence timestamp; no separate duplicate offline clock is added without evidence that it is necessary.
2. Negative or invalid elapsed time settles as zero rather than reversing progression.
3. A finite maximum offline interval is enforced below the UI. The numeric cap and exact timestamp source may be frozen in a recon amendment after inspecting the current save envelope.
4. Offline settlement is explicit and allowlisted. At M21 scope, the only required production consumers are passive Essence and M20 Copy task progress.
5. Passive Essence uses the existing runtime generation authority available from the restored state; M21 does not create a parallel Relationship/Essence model.
6. A running M20 production task preserves its authored `productionTaskId`, existing role-adjusted duration, current progress, and ordinary completion effect.
7. Copy task completion after offline settlement pays the authored task reward exactly once and clears the task.
8. Elapsed time beyond one task's completion does not auto-select or repeat another task.
9. A partial offline interval advances a Copy task without completing it and persists the new progress normally on the next save.
10. Resume settlement is idempotent for the same load event: repeated ordinary rendering/ticks without another persisted-away interval do not award the same offline interval twice.
11. Relationship state is byte-equivalent across offline settlement except for changes already implied by an explicitly offline-safe authority; M21 itself must not author Relationship evidence, Memories, Bond changes, Connection changes, or Tether history.
12. Quest state is unchanged by offline settlement.
13. Player location and Exploration topology/state are unchanged by offline settlement.
14. Combat state is unchanged by offline settlement.
15. No dialogue response, quest resolution, Relationship choice, combat action, travel action, Copy assignment choice, or other meaningful irreversible decision is made offline.
16. No generalized event-replay engine, task scripting DSL, behavior tree, autonomous agent controller, world simulator, or arbitrary Redux-action settlement payload is introduced.
17. Existing M20 exact-once task semantics remain green under ordinary online progression.
18. Accumulated active-RPG / M4-M20 qualification remains green.
19. TypeScript passes.
20. Production build passes.
21. The documentation-complete final head passes exact-head Build Validation before merge.
22. Merge uses an expected-head guard and integrated tree equality is verified before M21 is declared merged.

---

## Falsification / fail conditions

M21 is **not** qualified if any of these occur:

- the implementation replays the full GameLoop for offline elapsed time;
- offline settlement can trigger narrative decisions or mutate Relationship/Quest/Combat/travel authority;
- an unbounded wall-clock interval can generate arbitrary progression;
- save/load can apply the same offline interval twice;
- a completed Copy task can pay twice;
- excess elapsed time automatically repeats or chooses a new Copy task;
- offline task processing bypasses M20 authored task identity/reward authority;
- Essence settlement uses a divergent offline-only rate model;
- a second persistent world-time/offline-time authority is added without necessity;
- tests require weakening M20 or earlier milestone guarantees;
- the implementation pulls Checkpoint C or M22+ scope into M21.

---

## Evidence ceiling / explicit non-goals

M21 does **not** qualify or require:

- server-authoritative time or anti-cheat hardening;
- trusted remote clocks;
- device clock tamper resistance;
- calendar/event simulation;
- offline NPC movement or schedules;
- offline travel;
- offline combat;
- offline Quest objective progression;
- offline Relationship decay/growth or Memory creation;
- offline dialogue;
- offline Trait discovery or Resonance decisions;
- autonomous Copy task selection;
- Copy task queues or priorities;
- generalized production/economy simulation;
- faction or social-knowledge propagation;
- objective world-state simulation;
- human balance, pacing, enjoyment, or exploit-resistance beyond the bounded cap.

A local-clock-based prototype may be sufficient for M21 if the repository currently has no stronger timestamp authority. Such a result must be documented as a prototype evidence ceiling, not as anti-cheat security.

---

## Required qualification shape

The focused M21 suite should include at minimum:

1. zero/negative elapsed interval produces no offline progress;
2. elapsed interval is capped at the frozen maximum;
3. passive Essence gains the expected bounded amount;
4. partial M20 task resumes with bounded progress;
5. completing M20 task settles the correct authored reward once;
6. excess elapsed time after completion does not repeat a task/reward;
7. save -> offline settlement -> save -> reload does not replay the same first interval;
8. Relationship/Quest/Combat/location snapshots remain unchanged;
9. the settlement path contains an explicit allowlist rather than generic action replay;
10. accumulated earlier qualification remains green.

---

## Execution discipline

1. Freeze baseline SHA/tree. **Done above.**
2. Commit this preregistration before M21 behavior changes.
3. Recon save-envelope timestamp authority, load/replace flow, GameLoop timing, Essence rate authority, and M20 task completion semantics.
4. Freeze a recon amendment with the timestamp source, cap, settlement hook, and exact two-consumer contract.
5. Implement the smallest bounded settlement path.
6. Add a dedicated M21 qualification suite.
7. Add M21 qualification to Build Validation without weakening M20 or earlier gates.
8. Freeze the first complete behavioral SHA/tree and run exact-head Build Validation.
9. Record the M21 result and evidence ceiling.
10. Reconcile only status/canon made stale by the qualified result.
11. Freeze the documentation-complete final SHA/tree and re-run exact-head Build Validation.
12. Merge only the exact qualified head with an expected-head guard.
13. Verify integrated tree equality and current `main`.
14. Stop before Checkpoint C.
