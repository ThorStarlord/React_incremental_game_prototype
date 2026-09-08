# M20 — Production Copy Task Automation Result

**Verdict:** QUALIFIED — PASS  
**Baseline main:** `7adf75285898362d755c4f7fda254893a9ccedd4`  
**Baseline tree:** `068f84b6885108cb0b9c50cb04a98da65000ed92`  
**Prerequisite:** Checkpoint B = `CHECKPOINT_B_PASS`

## Scientific question

> Can a Copy perform bounded repeatable world activity on the player's behalf, produce a real ordinary gameplay/world result, and remain prohibited from resolving meaningful irreversible narrative decisions?

## Result

Yes, within the bounded M20 evidence ceiling.

M20 qualifies this production delegation path:

```text
player chooses an authored routine task
-> Copy/task requirements are validated below the UI
-> one existing Copy.activeTask stores authored task identity + progress
-> existing GameLoop advances deterministic progress
-> authored routine reward applies exactly once at completion
-> Copy becomes available again
```

while preserving the authority rule:

```text
ROUTINE EXECUTION -> Copy may automate
IRREVERSIBLE / MEANINGFUL DECISION -> player authority
```

M20 does not introduce autonomous task choice, narrative callbacks, arbitrary effect scripts, Copy travel simulation, or offline elapsed-time settlement.

---

## Production Rule-of-Two probes

### Forge Assistance

```text
id: forge_assistance
base duration: 60 seconds
requirements:
  maturity >= 50
  role = guardian | agent
  canonical Copy presence = location_city_center
ordinary result:
  +15 Gold
```

The built-in `Echo-1` fixture stores legacy human-readable `"City Center"`. M20 deliberately resolves that through the existing M18 `resolveCanonicalLocationId(...)` authority, so the task accepts the legacy alias without adding a second Copy-world coordinate or presence store.

A noncanonical location such as `"Library Archives"` fails the authored Forge location requirement before task mutation.

Guardian role applies the already-existing `1.05x` task-duration modifier:

```text
60s base -> 63s qualified duration
```

Completion adds 15 Gold once and clears `activeTask`. A later task tick cannot replay the reward.

### Resonance Calibration

```text
id: resonance_calibration
base duration: 90 seconds
requirements:
  maturity >= 75
  loyalty >= 55
  role = researcher | agent
ordinary result:
  +8 Essence
```

Researcher role reuses the existing `0.95x` duration modifier:

```text
90s base -> 86s rounded qualified duration
```

Completion adds 8 Essence through the existing Essence authority, applies the existing Copy role-completion bonus, then clears `activeTask`.

This second probe deliberately avoids a social-intelligence/report result. A real merchant-surveillance knowledge consequence belongs naturally to the later M22 social-knowledge milestone and was not pulled forward merely to satisfy an example from the roadmap.

---

## Generic production contract

M20 adds a bounded authored catalog in `CopyTaskDefinitions.ts` with only the fields required by the two real probes:

```ts
CopyProductionTaskDefinition {
  id
  name
  description
  baseDurationSeconds
  minimumMaturity?
  minimumLoyalty?
  allowedRoles?
  requiredLocationId?
  reward: {
    gold?
    essence?
  }
}
```

There is no generalized condition DSL, arbitrary callback/effect list, task chain, task priority, AI planner, or autonomous scheduler.

The Rule of Two is satisfied because Forge Assistance and Resonance Calibration use the same definition, eligibility, assignment, progress, completion, persistence, and UI contracts while exercising distinct requirements and downstream economy authorities.

---

## Assignment authority

`startCopyProductionTaskThunk(...)` is the production entrypoint.

It rejects before task mutation when:

- the task ID is not in the authored production catalog;
- the Copy does not exist;
- the Copy is already busy;
- maturity is below an authored threshold;
- loyalty is below an authored threshold;
- the current role is not allowed;
- a canonical location requirement is not satisfied.

The previous arbitrary-duration `startCopyTimedTaskThunk(...)` no longer creates a production task. It rejects with guidance to choose an authored production task.

This prevents a direct thunk caller from bypassing the same rules that disable assignment in the UI.

---

## Completion and exact-once behavior

The existing `processCopyTasksThunk(deltaTime)` remains the GameLoop consumer.

At completion it now resolves the active task's `productionTaskId` against the authored catalog.

For a valid production task:

```text
progress reaches duration
-> resolve authored task definition
-> apply existing role-completion bonus
-> apply task-specific ordinary Gold/Essence reward
-> emit completion notification
-> clear activeTask
```

For legacy/unknown task state:

```text
timer may finish
-> no production reward
-> warning notification
-> clear activeTask
```

Because reward application and `clearCopyActiveTask` occur in the same completion handling pass, subsequent live ticks see no active task and cannot replay the reward. M20 additionally qualifies save/load after completion followed by another task-processing tick with no duplicate reward.

---

## Persistence

M20 does not add a task-specific save format.

The existing canonical save system serializes the whole `RootState`, and `Copy.activeTask` is ordinary Copy state. The qualification exercises:

```text
start Forge Assistance as agent
-> progress 20 / 60 seconds
-> createSave
-> loadSavedGameWithMigration
-> replaceState
-> productionTaskId + duration + progress + running status preserved
-> process remaining 40 seconds
-> +15 Gold once
-> activeTask cleared
-> save/load completed state
-> extra 60-second task tick
-> no second reward
```

No elapsed real-world time is applied during load. That remains M21.

No save-schema version bump was required for the bounded M20 representation.

---

## Player-facing integration

The Copy detail UI no longer asks the player to choose an arbitrary 30/60/120-second timer.

It now exposes the two authored routine jobs with:

- activity identity and description;
- base duration;
- ordinary reward;
- eligibility reasons;
- disabled assignment when requirements are unmet or the Copy is busy;
- authored active-task name and current progress.

The UI explicitly states:

> Delegate repeatable execution only. Narrative and irreversible decisions remain under player authority.

The same eligibility authority is enforced in the production thunk, so the player-facing explanation is not the sole safety boundary.

---

## Narrative / Relationship authority control

The dedicated M20 qualification snapshots the complete Relationship and Quest slices before completing Resonance Calibration and verifies byte-equivalent Redux state afterward.

The production catalog contains no representation for:

- quest endings;
- dialogue choices;
- Relationship mutation or reinterpretation;
- alliance/faction alignment;
- betrayal/source exposure;
- arbitrary authored narrative callbacks.

An attempted arbitrary task identity such as `choose_quest_ending` is rejected as an unknown production task before mutation.

This qualifies the bounded claim that the M20 automation path does not implicitly resolve existing Relationship/Quest narrative authority.

---

## Architecture finding

The pre-M20 task substrate was sufficient. M20 needed only to give it production meaning and bounded authority.

The resulting ownership boundary is:

```text
Copy task catalog -> authored delegable routine activities + requirements + bounded rewards
Copy state        -> one active task identity/progress
Copy thunk        -> assignment legality + deterministic completion orchestration
GameLoop          -> supplies live deltaTime
Exploration       -> canonical location resolver where a task requires world presence
Player / Essence  -> own ordinary Gold / Essence results
Relationship/Quest-> unchanged unless future explicitly player-owned content says otherwise
Save system       -> persists ordinary RootState including active task
```

No new task reducer, world reducer, scheduler, narrative decision engine, or save subsystem was warranted.

---

## First complete behavioral candidate

- SHA: `b691f852b5f5cdfa39b992e6d46c9b1a181662ff`
- tree: `05dd3f90251f470e969b1261014e1fb3898bbf47`

Build Validation #200:

- run: `34184409461`
- job: `101929755608`
- dependency installation: PASS
- TypeScript: PASS
- dedicated M20 Copy production automation qualification: PASS
- active-loop repair qualification: PASS
- modified historical qualification: PASS
- accumulated M4-M19 baseline qualification: PASS
- production build: PASS

No CI repair cycle was required after the first complete behavioral candidate entered Build Validation.

The documentation-complete final head is intentionally qualified separately after this result/canon update.

---

## Qualified claim

> Existing Copy task infrastructure can automate two bounded repeatable production activities through one authored task contract: Forge Assistance produces Gold under role/maturity/canonical-location requirements, and Resonance Calibration produces Essence under role/maturity/loyalty requirements. Assignment is validated below the UI, live progress is deterministic, active task state survives ordinary save/load, completion rewards apply once without replay, and the qualified path does not implicitly mutate Relationship or Quest narrative authority.

---

## Evidence ceiling

M20 does **not** qualify:

- autonomous agents or self-directed task selection;
- strategic delegation;
- behavior trees, planners, or generalized AI;
- Copy travel, pathfinding, schedules, or autonomous movement;
- continuous coordinates or a general Copy presence model;
- generalized task-condition/effect scripting;
- arbitrary resource/economy automation;
- task failure/risk simulation;
- team/multi-Copy tasks;
- social knowledge propagation or report truth (M22);
- faction reputation (M23);
- generalized objective world state (M24);
- offline task progress or elapsed-time settlement (M21);
- automation of quest endings, dialogue decisions, Relationship meaning, alliances, or other irreversible narrative decisions;
- human balance, pacing, comprehension, or enjoyment.

The current location evidence is intentionally asymmetric: M20 qualifies reuse of M18 canonical location resolution for one City-Center-gated task, not a general Copy travel/presence system.

---

## Next boundary

M20 completes the planned first production automation proof.

If the documentation-complete exact head also passes Build Validation and merges without integration drift, the next candidate is **M21 — Offline Progress**.

M21 should use already-qualified offline-safe consumers rather than inventing arbitrary background simulation:

```text
passive Essence
+
M20 Copy task progress
```

M21 is **not started by M20**. It becomes the next authorized milestone only after the exact qualified M20 head is integrated into `main`.
