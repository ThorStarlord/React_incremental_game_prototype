# M20 — Production Copy Task Automation Qualification

**Status:** Preregistered before M20 behavior changes  
**Baseline main:** `7adf75285898362d755c4f7fda254893a9ccedd4`  
**Baseline tree:** `068f84b6885108cb0b9c50cb04a98da65000ed92`  
**Branch:** `feature/m20-production-copy-task-automation`  
**Prerequisite:** Checkpoint B = `CHECKPOINT_B_PASS`; M20 authorized  

---

## 1. Scientific question

> Can a Copy perform bounded repeatable world activity on the player's behalf, produce a real ordinary gameplay/world result, and remain prohibited from resolving meaningful irreversible narrative decisions?

M20 is not a greenfield task-system milestone. The repository already contains Copy task state, task start/progress/completion reducers/thunks, GameLoop task ticking, role-based duration modifiers, busy-Copy rejection, and generic completion rewards. M20 must qualify production automation on top of that substrate rather than replace it.

---

## 2. Product doctrine under test

```text
player experiences / understands an activity
-> activity becomes routine
-> player may delegate the routine execution layer to a Copy
-> Copy produces a bounded ordinary consequence

meaningful / irreversible decision
-> remains player authority
```

The intended value of Copy automation is to remove routine execution burden while preserving active RPG agency. Automation must not become a shortcut around authored choice, Relationship authority, Quest endings, alliances, or other irreversible narrative decisions.

---

## 3. Preregistered production requirement

M20 must use **at least two independent authored routine tasks** that share one generic production task contract.

The exact two tasks are intentionally **not frozen before recon**. They must be selected from current production authorities after inspecting the repository so M20 does not accidentally implement future milestone domains solely to satisfy examples in the roadmap.

Selection rules:

1. Each task must represent a plausible routine activity rather than an arbitrary timer.
2. Each task must produce a real ordinary gameplay/world consequence owned by an existing authority where possible.
3. The pair must exercise the same task-definition/execution contract rather than task-specific orchestration.
4. At least one meaningful requirement (for example role, maturity, loyalty, or canonical location) should be enforced if the selected production cases naturally require it.
5. A task must not require M22 social-knowledge propagation, M23 faction reputation, M24 generalized world state, or M21 offline settlement merely to exist.

Candidate examples from the roadmap, not preregistered commitments:

- Forge Assistance;
- Merchant Surveillance.

Recon may replace either example when its effect would improperly pull a later milestone forward.

---

## 4. Existing substrate to preserve

M20 should reuse rather than duplicate the current Copy task machinery, including the current concepts of:

- one active task per Copy;
- task status;
- deterministic progress by `deltaTime`;
- role-based task-duration modifiers;
- task completion handling;
- current Copy management UI;
- Copy persistence through the ordinary save/load state;
- GameLoop-driven task progression.

The implementation may refine the generic task model where required by two real production cases, but must not introduce a parallel task store or second Copy runtime.

---

## 5. World-location gate

Recon must determine whether existing `Copy.location` is canonical M18/M19 world location authority or legacy/descriptive data.

If production task requirements use location, M20 must reuse the canonical world location IDs already established by M18 and preserved through the Checkpoint B repair. It must not introduce:

- Copy-specific coordinates;
- duplicate `copyAtX` flags;
- a second world graph;
- implicit comparison between descriptive NPC location strings and canonical player/world location IDs.

If canonical Copy location cannot be established in a bounded way, location gating is not mandatory merely to make M20 pass; record the finding and use other legitimate requirements instead.

---

## 6. Authority boundary

### Delegable in M20

Only bounded routine execution such as:

- gathering;
- routine production/repair;
- patrol/guard duty;
- routine training/research;
- routine observation whose effect can be represented without a new social-knowledge system.

### Non-delegable in M20

A Copy must not implicitly resolve:

- a Quest ending;
- a major dialogue choice;
- betrayal/exposure of a person or source;
- alliance or faction alignment;
- Relationship definition or reinterpretation;
- irreversible political/social choice;
- any other authored decision whose meaning is supposed to belong to the player.

M20 should prefer a small positive production-task catalog/allowlist to a generalized classifier for narrative importance.

---

## 7. Required qualification controls

The final production implementation must directly qualify all applicable controls below.

### Assignment

1. Valid Copy + Task A starts.
2. Valid Copy + Task B starts.
3. A Copy already running a task rejects a conflicting assignment before mutation.
4. An unmet authored task requirement rejects before mutation.
5. Unknown/non-production task identity cannot bypass the production task catalog.

### Progress and completion

6. Task progress is deterministic under known `deltaTime`.
7. Role-based duration behavior remains deterministic when relevant.
8. Completion applies the task's ordinary effect exactly once.
9. Completion releases the Copy for a later assignment.
10. Extra task ticks after completion cannot replay the effect.

### Persistence

11. Save/load during an active task preserves enough state to resume correctly.
12. Reload/replay after completion cannot duplicate the completed task's effect.

### Authority safety

13. Production Copy automation does not implicitly mutate Relationship history, Connection, Bond dimensions, Memories, dialogue choices, or irreversible Quest decisions.
14. No general autonomous-agent decision system is introduced.

### World integration

15. If task location requirements are authored, they use canonical world-location authority and reject mismatches below the UI.

---

## 8. Falsification / stop conditions

Stop and record M20 as blocked or weak rather than expanding scope if:

- two routine production tasks require two unrelated bespoke execution paths;
- task completion cannot be made exact-once without inventing M21 offline-time architecture;
- Copy location requires a duplicate world/presence model;
- a chosen task requires implementing M22 social knowledge, M23 factions, or M24 objective world state;
- the only convincing automation case resolves player-owned narrative meaning;
- the generic task substrate is too inconsistent to qualify without a prerequisite repair;
- task legality exists only in UI presentation;
- save/load cannot preserve an in-progress task through the ordinary persistence substrate.

If a prerequisite defect is found, preserve the evidence, repair/qualify that prerequisite separately, then restart M20 from the corrected baseline.

---

## 9. Explicit non-goals

M20 does **not** qualify or require:

- offline progress (M21);
- autonomous agents;
- strategic self-directed delegation;
- behavior trees or AI planners;
- generalized task scripting/effect DSLs;
- Copy schedules;
- autonomous Copy travel simulation;
- pathfinding;
- continuous coordinates;
- whole-economy automation;
- social knowledge propagation (M22);
- faction reputation (M23);
- generalized objective world state (M24);
- automation of irreversible narrative decisions.

---

## 10. Evidence ceiling

A PASS may establish only:

> Existing Copy task infrastructure can automate at least two bounded routine production activities with deterministic persistent progress and safe one-shot completion, while meaningful irreversible narrative authority remains player-owned.

A PASS does not establish autonomous-agent gameplay, strategic delegation, generalized AI, offline simulation, or broad economic automation.

---

## 11. Execution discipline

1. Freeze baseline SHA/tree. **Done above.**
2. Commit this preregistration before M20 behavior changes.
3. Recon current Copy task/world/persistence/UI authorities.
4. Select the two smallest valid production tasks.
5. Apply Rule-of-Two before introducing any generic abstraction.
6. Implement the smallest production path and explicit controls.
7. Add a dedicated M20 qualification suite.
8. Add M20 qualification to accumulated Build Validation without weakening earlier M4–M19/Checkpoint-B evidence.
9. Freeze first complete behavioral SHA/tree.
10. Run exact-head Build Validation.
11. Record actual result and evidence ceiling.
12. Freeze documentation-complete final SHA/tree and re-run exact-head Build Validation.
13. Merge only the exact qualified head.
14. Verify integrated tree equality.
15. Stop before M21.
