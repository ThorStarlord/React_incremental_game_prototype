# Checkpoint C — Incremental Integration

**Status:** Preregistered; evaluation not yet performed  
**Baseline:** `main` = `716a7563b12afbaa5d94ae0908f2373b81d0d71c`  
**Baseline tree:** `651f1b00f0102b79543b155661675ceaca381873`  
**Scope:** Documentation-only product/integration evaluation after qualified M20 + M21 and before any M22 implementation.

---

## 1. Decision question

> Does automation/offline progression support the RPG by removing routine repetition while preserving meaningful active choices, or is it becoming a detached idle game?

Checkpoint C evaluates the composition of the already-qualified active RPG loop, M20 Copy production automation, and M21 bounded offline settlement. It does not add a new gameplay system and it does not authorize M22 merely because M20/M21 passed individually.

---

## 2. Frozen authority chain

The evaluation starts from the current integrated product authority:

```text
Relationship evidence
-> Trait capability
-> Quest / Combat consequence
-> Exploration / canonical presence
-> Tether / Essence consequence
-> active RPG loop
-> player recognizes routine work
-> qualified Copy delegation
-> bounded routine progress online/offline
-> player attention returns to higher-order active decisions
```

Relevant existing authority includes:

- Checkpoint B fresh rerun: active RPG loop PASS;
- M20: two bounded authored routine Copy tasks, below-UI eligibility, deterministic progress, one-shot ordinary rewards, irreversible narrative decisions excluded;
- M21: bounded load-time snapshot settlement for passive Essence + already-running M20 tasks, with explicit allowlisting and narrative/world decisions excluded.

The checkpoint must judge the composition of those authorities, not re-litigate already-qualified isolated mechanics unless their interaction exposes a new contradiction.

---

## 3. Evaluation dimensions

### A. Repetition reduction

Ask whether M20 delegation genuinely removes an activity the player can understand as routine rather than creating a detached menu-only number generator.

Evidence to inspect:

- how production tasks are discovered/presented;
- whether task descriptions and requirements connect them to existing world/gameplay concepts;
- whether task completion produces ordinary resources already used by the active RPG;
- whether repeated manual micromanagement is actually reduced.

### B. Meaningful-choice preservation

Ask whether automation/offline settlement preserves active authority over meaningful decisions.

Required invariants:

- no automatic dialogue choice;
- no automatic Relationship-defining event;
- no automatic Quest ending;
- no autonomous task assignment/chaining;
- no offline Combat decision;
- no automatic travel/location choice;
- no faction/political/narrative commitment.

### C. Relationship/capability reinforcement

Ask whether the incremental layer makes previously earned relationships/capabilities/Copies more useful without bypassing their meaning.

Positive evidence may include:

- Copy role/maturity/loyalty requirements matter to delegation;
- active-play systems produce or contextualize the resources automation returns;
- M20/M21 free attention for active Relationship/Quest/Combat/Exploration choices rather than replacing them.

### D. Copy identity

Ask whether Copies have a coherent gameplay reason to exist beyond passive number generation.

A strong result should show:

```text
qualified Copy
-> player deliberately assigns understood routine work
-> Copy performs bounded execution over time
-> ordinary world/economy result
```

rather than:

```text
Copy exists
-> automatic income
```

### E. Economy integration

Ask whether M20/M21 use currencies/results already meaningful in active play and whether offline settlement remains bounded enough not to dominate active acquisition.

Inspect at minimum:

- Gold from Forge Assistance;
- Essence from passive generation and Resonance Calibration;
- the eight-hour M21 cap;
- whether current task/reward magnitudes make leaving the game more valuable than active participation in any obvious structural way.

Checkpoint C does **not** claim final economy balance without human playtesting. It should distinguish structural integration from unproven tuning.

### F. Player-facing legibility

Ask whether a player can reasonably understand:

- what a Copy is doing;
- why the task is allowed or blocked;
- what reward it produces;
- whether the task is still running or complete;
- what progressed while away;
- that offline settlement did not silently make narrative choices.

### G. Attention-return loop

The intended product doctrine is:

```text
player experiences / understands activity
-> activity becomes routine
-> Copy may automate routine execution
-> bounded offline progress may continue that already-running routine
-> player returns to higher-order RPG decisions
```

The checkpoint must look for evidence that the actual UI/runtime supports this loop. If automation exists only as a detached destination with no useful connection back to active play, that is a weakness even if the underlying reducers are correct.

---

## 4. Explicit anti-idle tests

The evaluation should look for evidence against the following failure modes:

1. manual gameplay becomes economically irrelevant;
2. the dominant strategy is simply leaving the game;
3. Copy tasks are arbitrary income buttons with no world/role semantics;
4. offline progression advances domains the player expected to control actively;
5. automation introduces disconnected currencies or duplicate progression authorities;
6. the player cannot tell what happened while away;
7. automation bypasses Relationship/Trait/world prerequisites rather than building on them;
8. task completion automatically chains into more work;
9. offline settlement replays full GameLoop/world simulation;
10. future social/faction/world systems are implicitly smuggled into M20/M21 rather than waiting for M22+.

---

## 5. Evidence sources

Use repository state at this branch baseline as authority. Inspect at minimum:

- `specification/Technical/CheckpointBActiveRpgLoopRerunResult.md`;
- `specification/Technical/M20ProductionCopyTaskAutomationResult.md`;
- `specification/Technical/M21BoundedOfflineProgressResult.md`;
- `specification/Features/CopySystem.md`;
- `specification/Features/GameLoopSystem.md`;
- `specification/Features/EssenceSystem.md`;
- `src/features/Copy/CopyTaskDefinitions.ts`;
- player-facing Copy task UI;
- M21 load/return-summary integration;
- active RPG surfaces that consume Gold/Essence and player attention;
- relevant qualification tests as evidence of actual runtime authority.

Repository docs may be stale. Runtime + qualified result records override older prose where they conflict.

---

## 6. Verdict rubric

### `CHECKPOINT_C_PASS`

Use only if the current product demonstrates a coherent bounded integration:

- automation removes understood routine work rather than replacing meaningful play;
- existing active-RPG resources and authorities are reused;
- Copies have deliberate assignment/eligibility semantics;
- offline progress extends only already-safe routine progression;
- important choices remain active/player-owned;
- the return-to-active-play loop is legible enough for the current prototype;
- no structural idle-game contradiction requires repair before M22.

Presentation/balance polish may remain unqualified, but it must not undermine the integration claim.

### `CHECKPOINT_C_WEAK`

Use if the architecture is compatible but the current player-facing composition has a bounded integration gap that should be repaired before M22, for example:

- automation is technically safe but detached from active-play context;
- return-summary or task-state legibility is materially insufficient;
- task rewards/requirements do not meaningfully connect back to existing RPG decisions;
- a small bounded UX/runtime bridge is missing;
- the current product makes the automation layer feel like an unrelated idle menu even though no authority redesign is required.

A WEAK verdict blocks M22 until the observed gap is repaired and freshly re-evaluated.

### `CHECKPOINT_C_FAIL`

Use if the intended hybrid model is structurally contradicted, for example:

- automation/offline progression bypasses meaningful player authority;
- detached idle accumulation substantially replaces active play;
- duplicate currencies/authorities are required to make the systems compose;
- fixing the issue would require redesign of M20/M21 or the active RPG loop rather than a bounded repair.

FAIL blocks M22 and requires product/architecture reconsideration.

---

## 7. Evidence ceiling

Checkpoint C can qualify only whether the **current bounded M20/M21 automation layer composes coherently with the already-qualified active RPG loop**.

It cannot establish:

- final economy balance;
- long-term retention/fun;
- human pacing quality without playtesting;
- generalized idle-game design;
- arbitrary offline simulation;
- M22 social knowledge;
- M23 faction reputation;
- M24 generalized world state;
- M25 complete-chapter integration.

---

## 8. Stop rule

Do not implement M22 during this checkpoint.

After inspection, record exactly one verdict:

```text
CHECKPOINT_C_PASS
or
CHECKPOINT_C_WEAK
or
CHECKPOINT_C_FAIL
```

If PASS, M22 becomes the next authorized candidate but is not started by the checkpoint merge.

If WEAK/FAIL, preserve the finding, repair/reconsider separately, then rerun Checkpoint C from the corrected integrated baseline.
