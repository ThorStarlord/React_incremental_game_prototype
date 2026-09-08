# M20 — Production Copy Task Automation Recon Amendment

**Status:** Recon complete enough to freeze the production probes before behavior implementation  
**M20 preregistration commit:** `fb5b8783a9cbe1e2c9ce6e45e2345f4a4b32be2a`  
**Baseline main:** `7adf75285898362d755c4f7fda254893a9ccedd4`  

---

## 1. Recon findings

### Existing task runtime is already substantial

The Copy runtime already contains:

- `Copy.activeTask`;
- `CopyTask` duration/progress/status data;
- one-task-at-a-time selectors;
- `startCopyTask`, `progressCopyTask`, and `clearCopyActiveTask` reducers;
- `startCopyTimedTaskThunk`;
- `processCopyTasksThunk(deltaTime)` from the main GameLoop;
- deterministic role-based duration modifiers;
- completion notifications and generic Gold/Essence payout;
- ordinary whole-`RootState` save serialization, so an active task is already structurally persistent.

M20 therefore does not need a second task store, queue, scheduler, or save subsystem.

### Current player-facing task semantics are generic

The current Copy detail UI exposes arbitrary 30/60/120-second timers. Completion pays the same generic Gold + Essence reward regardless of activity identity. This proves timing plumbing, not production delegation.

M20 should replace that player-facing arbitrary timer choice with a small authored production catalog while preserving the underlying task lifecycle.

### Copy location is only partially canonical

M18 owns canonical world location IDs and provides `resolveCanonicalLocationId(...)`.

Current demo Copy data includes:

- `Echo-1.location = "City Center"`, which resolves through M18's explicit legacy alias to `location_city_center`;
- `Shade-2.location = "Library Archives"`, which is not part of the current M18 authored graph and does not resolve canonically.

There is no qualified Copy travel/movement system in the current milestone substrate.

Therefore M20 will:

1. use the existing M18 resolver when a production task has a location requirement;
2. qualify at least one location-gated task using City Center;
3. not invent Copy travel, Copy coordinates, or a second world graph;
4. leave noncanonical legacy Copy locations ineligible for location-gated production work until a future bounded movement/content decision places them canonically.

### Save/load does not require a new persistence authority

`createCurrentSaveEnvelope` clones the entire `RootState`; `Copy.activeTask` is ordinary Copy state. Mid-task persistence can therefore be qualified using the existing `createSave -> loadSavedGameWithMigration -> replaceState` pattern. No M20-specific storage or elapsed-time settlement is required.

M21 remains responsible for offline elapsed-time progression.

---

## 2. Frozen M20 production probes

M20 will implement exactly two authored repeatable routine tasks.

### A. Forge Assistance

```text
id: forge_assistance
activity: routine workshop / equipment assistance
base duration: 60 seconds
required canonical location: location_city_center
minimum maturity: 50
allowed roles: guardian | agent
ordinary result: +15 Gold
```

Rationale:

- Gold is an existing ordinary Player economy authority;
- City Center is already canonical in M18;
- the built-in Echo-1 legacy location resolves to that canonical location;
- guardian/agent fits routine physical/field assistance;
- this creates one real world-presence requirement without inventing Copy travel.

### B. Resonance Calibration

```text
id: resonance_calibration
activity: repeatable controlled Essence calibration / analysis
base duration: 90 seconds
minimum maturity: 75
minimum loyalty: 55
allowed roles: researcher | agent
ordinary result: +8 Essence
```

Rationale:

- Essence is an existing ordinary economy authority;
- the task is routine analysis rather than social knowledge propagation;
- no new M22 fact/report model is required;
- no location gate is authored because the current substrate cannot honestly place every Copy in canonical world space without adding Copy movement.

The pair exercises two independent existing downstream effects through one task-definition/execution contract.

---

## 3. Generic production contract

A bounded data-driven definition is justified by the Rule of Two because both tasks require the same lifecycle but different requirements/rewards.

The smallest intended definition shape is:

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

Do not add a generalized condition DSL, arbitrary action list, task chain, AI priority, or effect script.

The active task only needs to persist the authored production task identity in addition to the existing lifecycle fields.

---

## 4. Completion semantics

The generic GameLoop task processor will resolve the active task's production definition at completion, apply that definition's bounded ordinary reward once, then clear `activeTask`.

The existing role completion bonus may remain as Copy-specific progression flavor, but the production reward must come from the selected task definition rather than the old global generic timer payout.

An unknown/missing production task identity must not receive a production reward.

---

## 5. Authority safety

M20 production assignment will be a positive allowlist: only IDs in the two-task production catalog can be assigned through the new production thunk/UI.

The implementation will not expose arbitrary narrative callbacks or generalized effect payloads in task definitions.

Therefore there is no catalog representation for:

- Quest endings;
- dialogue choices;
- Relationship mutations;
- alliances/faction decisions;
- source exposure/betrayal;
- other irreversible authored narrative choices.

---

## 6. Persistence boundary

Qualification will exercise:

```text
start authored task
-> progress partially
-> createSave
-> loadSavedGameWithMigration
-> replaceState
-> task identity + progress preserved
-> continue live ticks
-> reward once
-> activeTask cleared
-> save/load completed state
-> no replay payout
```

No offline elapsed time is applied during load. That remains M21.

---

## 7. Implementation scope now frozen

Expected production changes are bounded to:

- a small Copy production-task definition module;
- the Copy task type/identity representation;
- Copy assignment/completion thunks;
- Copy task UI replacing arbitrary timer buttons;
- dedicated M20 qualification tests;
- Build Validation wiring;
- M20 result/canon documentation after behavioral qualification.

No Copy movement, queueing, autonomous task choice, social knowledge, faction reputation, objective-world-state engine, or offline settlement is authorized by this amendment.
