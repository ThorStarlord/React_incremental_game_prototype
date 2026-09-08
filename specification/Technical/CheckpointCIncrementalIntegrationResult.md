# Checkpoint C — Incremental Integration Result

**Verdict:** `CHECKPOINT_C_WEAK`  
**Baseline:** `main` = `716a7563b12afbaa5d94ae0908f2373b81d0d71c`  
**Baseline tree:** `651f1b00f0102b79543b155661675ceaca381873`  
**Preregistration commit:** `f8b5822fc8cd2f4a67141eff953e0c0bcd78025f`  
**Scope:** Documentation-only integration evaluation after M20 + M21; no M22 behavior is authorized by this result.  
**Build Validation:** pending exact-head qualification at time of this result commit.

---

## 1. Decision

```text
CHECKPOINT_C_WEAK
bounded incremental-integration repair required
M22 not authorized
```

M20 and M21 remain individually qualified. Their authority boundaries are structurally compatible with the active RPG loop: automation is deliberate rather than autonomous, offline settlement is explicitly allowlisted, existing Gold/Essence currencies are reused, and narrative/world decisions remain player-owned.

However, the current player-facing composition does **not yet prove the intended product doctrine**:

```text
player experiences / understands an activity
-> activity becomes routine
-> Copy may automate the routine portion
-> bounded offline progress may continue that already-running routine
-> player sees what happened
-> attention returns to higher-order active RPG decisions
```

Two concrete bounded gaps prevent a fresh PASS.

---

## 2. Finding C1 — production tasks are safe, but not yet earned through active-play familiarity

### Observed implementation

The M20 production catalog currently exposes two authored tasks:

```text
Forge Assistance
60s
maturity >= 50
role guardian | agent
Copy at City Center
-> +15 Gold

Resonance Calibration
90s
maturity >= 75
loyalty >= 55
role researcher | agent
-> +8 Essence
```

`CopyProductionTaskDefinition` contains duration, maturity, loyalty, role, canonical location and reward requirements. `evaluateCopyProductionTaskEligibility` enforces those facts.

The player-facing Copy detail panel then maps the complete production-task catalog and displays an Assign button for each task. The UI correctly explains:

> Delegate repeatable execution only. Narrative and irreversible decisions remain under player authority.

### Missing bridge

No task-definition field, selector, eligibility rule, or discovered runtime hook establishes:

```text
player has first experienced / learned / understood this routine
```

as a prerequisite for delegation.

Repository inspection found the exact production task identities primarily in the M20/M21 task runtime, UI, tests and qualification documentation; it did not reveal a production active-play step that first establishes Forge Assistance or Resonance Calibration as a learned routine before those tasks appear in the Copy catalog.

Therefore the current implementation demonstrates:

```text
qualified Copy
-> menu task
-> bounded routine reward
```

but not yet the stronger intended loop:

```text
active RPG experience
-> understood routine
-> delegation unlock
-> Copy execution
```

### Why this matters

This is not merely cosmetic. Checkpoint C explicitly asks whether automation removes understood repetition or becomes a detached idle surface. Without an active-play familiarity/unlock bridge, the current two production tasks can function as authored income buttons whose routine status is asserted by description rather than established by play.

### Why this is not FAIL

The missing authority can be repaired without redesigning M20:

- the task catalog is already small and authored;
- task eligibility is already centralized below the UI;
- the active RPG already has Quest/NPC/Trait/Essence/world events that could supply bounded prerequisite facts after recon;
- no autonomous task selection or generalized task DSL exists.

The repair should reuse real active-play facts and avoid inventing M22 social knowledge or a generalized skill tree solely for task unlocking.

---

## 3. Finding C2 — M21 return-summary state is generated, but player-visible rendering is not demonstrated

### Observed implementation

M21 constructs a bounded summary such as:

```text
While you were away: +40 Essence; Copy completed Forge Assistance.
```

and dispatches it through the shared Redux `addNotification` action after settlement.

`NotificationSlice.ts` provides:

- `notifications.items`;
- `addNotification`;
- `removeNotification`;
- `clearNotifications`;
- `selectNotifications`.

### Missing bridge

Repository inspection did not find a production component that consumes `selectNotifications` / `notifications.items` and renders that shared queue.

The existing `useMenuNotifications` hook is a separate local React-state notification mechanism; it does not consume the shared Redux queue used by M21. `App.tsx` mounts the router and live GameLoop, while `GameLayout.tsx` mounts navigation/content/intro surfaces; neither mounts a shared notification renderer.

Thus the M21 result is mechanically retained in state, but current production composition does not demonstrate that the player actually sees the promised return summary.

This also affects the wider shared-notification write path used by several systems, but Checkpoint C makes no broad notification-system qualification claim. The bounded finding is simply that M21's required return legibility is not proven player-facing.

### Why this matters

Offline progression is safe only if it is also legible enough that the player understands what changed while absent. A write-only summary weakens the attention-return loop:

```text
resume
-> resources/tasks mutate
-> player receives no proven visible explanation
```

### Why this is not FAIL

The settlement authority itself remains correct and bounded. A small presentation bridge can render the existing queue without changing M21 timing, replay, save, economy or narrative semantics.

---

## 4. Areas that PASS structurally

### 4.1 Meaningful-choice preservation — PASS

M20/M21 preserve the important authority boundary:

```text
routine execution / accumulation -> automatable / offline-safe when explicitly allowlisted
meaningful irreversible decision -> active player authority
```

No evidence was found that M20/M21 automatically choose dialogue, alter Relationship meaning, resolve Quest endings, make Combat/travel decisions, select new tasks, chain tasks, or perform generalized offline world simulation.

### 4.2 Copy identity — PASS with the C1 integration caveat

Copies are not passive automatic income sources. The player deliberately selects a Copy, configures a role, satisfies maturity/loyalty/location requirements where authored, and explicitly assigns one task. A busy Copy cannot silently receive another task, and completion does not auto-chain.

The weakness is not Copy execution authority; it is how the routine becomes available to delegate.

### 4.3 Economy integration — PASS structurally, balance unqualified

M20/M21 reuse existing currencies:

- Forge Assistance produces Gold, already consumed by ordinary NPC trade;
- Resonance Calibration and passive generation produce Essence, already consumed by Trait/Copy progression surfaces;
- M21 clamps one settlement interval to eight hours.

No disconnected M20/M21-only currency was introduced.

Checkpoint C does **not** claim that +15 Gold, +8 Essence, passive rates or the eight-hour cap are final balanced values. Human pacing/economy playtesting remains outside this repository-only checkpoint.

### 4.4 Offline authority — PASS

M21 remains snapshot settlement rather than full tick replay. The checkpoint found no reason to reopen the qualified M21 safety conclusion.

---

## 5. Dimension summary

| Dimension | Result | Reason |
|---|---|---|
| Repetition reduction | **WEAK** | Tasks are described as repeatable, but prior player experience/familiarity is not established as a delegation prerequisite. |
| Meaningful-choice preservation | **PASS** | Narrative, Relationship, Quest ending, Combat, travel and autonomous task-choice authority remain excluded. |
| Relationship/capability reinforcement | **MIXED / WEAK** | Copy role/maturity/loyalty/location matter, but automation availability is not yet clearly downstream of active-play understanding. |
| Copy identity | **PASS with caveat** | Deliberate bounded assignment exists; Copies are not automatic income, but task availability is menu-first. |
| Economy integration | **PASS structurally** | Gold/Essence are existing active-game currencies; balance is not qualified. |
| Player-facing legibility | **WEAK** | Copy task UI is legible, but M21 return-summary rendering is not demonstrated in the production component tree. |
| Attention-return loop | **WEAK** | The intended experience->routine->delegate->return sequence is missing both an earned familiarity bridge and proven return-summary presentation. |

---

## 6. Why the overall verdict is WEAK

A PASS would overclaim what the current product actually proves.

The repository has strong evidence for safe mechanics:

```text
bounded delegation
+
bounded offline settlement
+
preserved player narrative authority
+
existing economy currencies
```

But Checkpoint C is specifically an **integration** checkpoint. The two observed gaps sit exactly at the seams between those mechanics and the player experience:

```text
ACTIVE PLAY -> AUTOMATION
missing explicit learned-routine/familiarity bridge

OFFLINE AUTOMATION -> RETURN TO ACTIVE PLAY
missing proven visible return-summary bridge
```

Those are bounded repairable seams rather than architectural contradictions. Therefore:

```text
CHECKPOINT_C_WEAK
```

is more accurate than either PASS or FAIL.

---

## 7. Required repair before a fresh Checkpoint C rerun

A separate bounded **Incremental Integration Repair** should reconcile exactly the observed gaps.

### Repair target R1 — active-play familiarity / delegation unlock

Recon existing active-play event authorities and choose the smallest production facts that can establish each task as understood before delegation.

Constraints:

- use at least the two existing M20 tasks (Rule of Two);
- enforce the prerequisite below the UI as well as in presentation;
- do not introduce generalized task scripting, skill trees or autonomous task discovery;
- do not misuse M22 social-knowledge propagation as the unlock model;
- preserve existing M20 role/maturity/loyalty/location eligibility;
- preferably reuse existing NPC/Quest/Trait/Essence/world event facts rather than add parallel history flags.

Expected proof shape:

```text
before relevant active experience
-> production task unavailable / assignment rejected

after relevant active experience
-> task becomes available
-> existing M20 eligibility still applies
-> player may deliberately delegate it
```

### Repair target R2 — shared notification / return-summary presentation

Render the existing shared notification queue in a production player-facing surface, or provide an equally bounded return-summary presentation that consumes the M21 result.

Constraints:

- do not change offline timing/replay semantics;
- avoid an M21-specific duplicate notification store if the shared queue can be rendered directly;
- support dismissal/lifecycle consistently;
- prove the `While you were away` summary appears after a qualifying load;
- preserve zero-settlement behavior without misleading payout messages.

### Fresh evaluation requirement

Repair completion is not itself Checkpoint-C PASS.

Required sequence:

```text
Checkpoint C WEAK
-> bounded Incremental Integration Repair
-> qualify repair independently
-> merge repair
-> fresh Checkpoint C rerun from repaired main
-> only fresh CHECKPOINT_C_PASS may authorize M22
```

---

## 8. M22 authorization

```text
M22 Social Knowledge Propagation: NOT AUTHORIZED
```

Do not begin M22 from this checkpoint result.

---

## 9. Evidence ceiling

This checkpoint establishes only:

> The qualified M20/M21 mechanics are architecturally compatible with the active RPG and preserve meaningful player authority, but the current production composition has two bounded integration gaps—earned routine familiarity before delegation and proven player-visible offline return feedback—so the incremental layer is not yet qualified as a coherent player-facing extension of active play.

It does not establish final economy balance, retention, fun, pacing, generalized offline simulation, social knowledge, faction reputation, generalized world state, or complete-chapter integration.
