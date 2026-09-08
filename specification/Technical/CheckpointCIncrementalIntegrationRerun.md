# Checkpoint C — Incremental Integration Rerun

**Status:** Preregistered; fresh evaluation not yet performed  
**Baseline:** `main` = `86f7a439afa2d821200c685eb604505a207bbde2`  
**Baseline tree:** `7d380f74f2156279c56679aca80f28962a298a81`  
**Trigger:** first Checkpoint C = `CHECKPOINT_C_WEAK`; bounded Incremental Integration Repair subsequently qualified PASS and merged  
**Scope:** documentation-only fresh product/integration evaluation after the merged repair and before any M22 implementation

---

## 1. Decision question

> Does automation/offline progression now support the RPG by removing understood routine repetition while preserving meaningful active choices and visibly returning the player to active play, or does the repaired product still behave like a detached idle layer?

This is a fresh rerun of the original Checkpoint C product question against the repaired integrated baseline. It evaluates the resulting product composition; it does not grade the repair merely by confirming that repair tests pass.

The repair result is evidence, not the verdict.

---

## 2. Frozen authority chain

The current integrated product should now support this intended chain:

```text
Relationship / active RPG context
-> player actively experiences an activity
-> player familiarity with an authored routine is earned
-> qualified Copy may be deliberately assigned that routine
-> bounded routine execution progresses online/offline
-> ordinary existing economy result occurs
-> player-visible return summary explains what changed
-> meaningful unresolved decisions remain player-owned
```

Relevant prior authority:

- Checkpoint B fresh rerun: `CHECKPOINT_B_PASS`;
- M20: bounded authored Copy task execution, ordinary rewards, deterministic live progression, narrative-decision exclusion;
- M21: bounded offline settlement for passive Essence + already-running M20 tasks only;
- first Checkpoint C: `CHECKPOINT_C_WEAK` due to two bounded integration gaps;
- Incremental Integration Repair: PASS for earned routine familiarity and shared notification rendering.

A fresh `CHECKPOINT_C_PASS` is required before M22 becomes authorized.

---

## 3. Evaluation dimensions

Evaluate the repaired product independently across the same seven dimensions as the original checkpoint.

### A. Repetition reduction

Ask whether automation now demonstrably removes routine work the player has first experienced/understood rather than presenting arbitrary income buttons.

Inspect at minimum:

- active Forge Assistance familiarity source;
- active Trait Resonance familiarity source;
- player-facing locked/unlocked delegation presentation;
- whether automation meaningfully removes repeat execution after familiarity.

### B. Meaningful-choice preservation

Required invariants:

- no automatic dialogue choice;
- no automatic Relationship-defining event;
- no automatic Quest ending;
- no autonomous task assignment/chaining;
- no offline Combat decision;
- no automatic travel/location choice;
- no faction/political/narrative commitment.

### C. Relationship/capability reinforcement

Ask whether the incremental layer now sits downstream of meaningful active progression instead of bypassing it.

Positive evidence should show active world/Trait/player actions establishing routine familiarity while Copy capability remains separately constrained.

### D. Copy identity

A strong product composition should show:

```text
understood routine
+
qualified Copy
+
explicit player assignment
-> bounded Copy execution
```

rather than:

```text
Copy exists
-> automatic income
```

### E. Economy integration

Inspect whether Gold/Essence remain ordinary active-game resources, whether the eight-hour offline cap remains bounded, and whether the architecture structurally rewards absence more strongly than participation.

Do not claim final balance without human playtesting.

### F. Player-facing legibility

Ask whether the player can understand:

- what must be learned before delegation;
- why a Copy is still ineligible after familiarity where applicable;
- what task is running;
- what reward it gives;
- what happened while away;
- that offline progress did not make narrative choices.

### G. Attention-return loop

Evaluate the actual repaired product against:

```text
active experience
-> understood routine
-> deliberate delegation
-> bounded live/offline execution
-> visible return summary
-> player attention returns to higher-order active RPG decisions
```

This synthesis is decisive. A technically correct set of reducers is insufficient if the player-facing composition still functions as a detached idle destination.

---

## 4. Explicit anti-idle falsification tests

Actively look for evidence that would falsify PASS:

1. manual gameplay has become economically irrelevant;
2. the dominant strategy is simply leaving the game;
3. Copy tasks remain arbitrary income buttons with no active-play provenance;
4. offline progression advances domains the player expected to control actively;
5. automation introduces disconnected currencies or duplicate progression authorities;
6. the player still cannot tell what happened while away;
7. automation can bypass active familiarity or existing Copy requirements;
8. task completion can automatically chain into more work;
9. offline settlement replays the full GameLoop/world simulation;
10. M22/M23/M24 social/faction/world semantics have been smuggled into the incremental layer.

A clean failure on any material falsifier is evidence against PASS and must not be normalized away.

---

## 5. Evidence sources

Inspect current repaired repository state at this exact baseline. At minimum:

- `Technical/CheckpointCIncrementalIntegration.md`;
- `Technical/CheckpointCIncrementalIntegrationResult.md`;
- `Technical/IncrementalIntegrationRepair.md`;
- `Technical/IncrementalIntegrationRepairReconAmendment.md`;
- `Technical/IncrementalIntegrationRepairResult.md`;
- `Features/CopySystem.md`;
- `Features/GameLoopSystem.md`;
- `Features/NotificationSystem.md`;
- `Features/EssenceSystem.md`;
- relevant Exploration and Trait active-play surfaces;
- `CopyTaskDefinitions.ts`;
- Copy assignment thunk/UI;
- Player routine-familiarity state;
- active Forge practice implementation;
- successful Trait Resonance integration;
- `OfflineProgress.ts`;
- `GlobalNotificationHost` and production mount;
- dedicated repair qualification and preserved M20/M21 qualification tests;
- active consumers of Gold/Essence.

Runtime + qualified result records override stale prose where they conflict.

---

## 6. Verdict rubric

### `CHECKPOINT_C_PASS`

Use only if the repaired product now demonstrates a coherent bounded integration:

- automation is earned downstream of understood active routine work;
- existing RPG resources/authorities are reused;
- Copy assignment remains deliberate and capability-constrained;
- offline progress extends only explicit safe routine progression;
- meaningful choices remain active/player-owned;
- offline results are visibly communicated;
- the attention-return loop is coherent enough for the current prototype;
- no structural idle-game contradiction requires another repair before M22.

### `CHECKPOINT_C_WEAK`

Use if the architecture is still compatible but one or more bounded player-facing/runtime seams materially weaken the intended active-RPG -> automation -> return composition.

WEAK blocks M22 until another independently qualified repair and fresh rerun.

### `CHECKPOINT_C_FAIL`

Use if automation/offline progression structurally displaces meaningful active play or fixing the integration would require redesigning M20/M21/the active RPG loop rather than another bounded seam repair.

FAIL blocks M22 and requires product/architecture reconsideration.

---

## 7. Evidence ceiling

This rerun may qualify only whether the current bounded M20/M21 automation layer, including the merged repair, composes coherently with the already-qualified active RPG loop.

It cannot establish:

- final economy balance;
- long-term retention/fun;
- final notification UX/pacing;
- generalized idle-game design;
- arbitrary offline simulation;
- M22 social knowledge;
- M23 faction reputation;
- M24 objective world state;
- M25 complete-chapter integration;
- campaign-scale product quality.

---

## 8. Stop rule

Do not implement M22 during this checkpoint.

Record exactly one fresh verdict:

```text
CHECKPOINT_C_PASS
or
CHECKPOINT_C_WEAK
or
CHECKPOINT_C_FAIL
```

If PASS, merge the documentation-complete rerun and only then treat M22 as the next authorized candidate.

If WEAK/FAIL, preserve the finding and stop M22.