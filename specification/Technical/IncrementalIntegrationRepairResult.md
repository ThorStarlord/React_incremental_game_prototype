# Incremental Integration Repair — Result

**Verdict:** `QUALIFIED — PASS`  
**Trigger:** merged `CHECKPOINT_C_WEAK`  
**Preregistration:** `IncrementalIntegrationRepair.md`  
**Recon amendment:** `IncrementalIntegrationRepairReconAmendment.md`  
**Frozen starting main:** `88e83dab50eaf7b2ca50696f2c037686dafbe2af`  
**Starting tree:** `b25b7312aae9c9f1b2a73615f3394d35cc5ecfaf`  
**First complete behavioral candidate:** `bafffb68716263ad46d40b4edc25887fc2c9298e`  
**Behavioral candidate tree:** `f31d8c28c3a9abc77c49f5854538353a5620b11a`  
**Build Validation:** #213 — run `34190965594`, job `101948771354` — **PASS**

This result qualifies the bounded repair only. It does **not** convert Checkpoint C itself to PASS and does **not** authorize M22. A fresh Checkpoint C rerun remains mandatory.

---

## 1. Scientific / product question

> Can the existing M20/M21 incremental layer become a coherent extension of active RPG play by requiring genuine player familiarity before routine delegation and by making offline results visibly return player attention to the active game, without weakening player authority or expanding into generalized idle simulation?

### Result

**Yes, within the bounded repair evidence.**

The production composition now proves:

```text
active player experience
-> persisted routine familiarity
-> deliberate Copy assignment
-> existing M20 task execution
-> existing M21 bounded offline continuation
-> exact-once ordinary consequence
-> shared player-visible return summary
-> active RPG state remains available for the next player decision
```

The Rule-of-Two is exercised by two different active systems rather than two synthetic unlock buttons.

---

## 2. Repair R1 — earned routine familiarity

### 2.1 Player-owned familiarity

The repair adds a bounded optional `PlayerState.routineFamiliarity` surface for exactly:

```text
forge_assistance
resonance_calibration
```

Each record contains an authored source and `learnedAt` timestamp.

This is player-global knowledge. It is deliberately distinct from per-Copy capability:

```text
player familiarity
+
Copy maturity / loyalty / role
+
Copy world-location requirement where authored
=
delegation eligibility
```

Absence of the optional field safely means unfamiliar, including current-schema saves created before this repair.

### 2.2 Forge Assistance active source

Forge familiarity is earned through one explicit player-driven City Center interaction:

```text
canonical player presence = location_city_center
+
Practice Forge Assistance
-> +5 Gold once
-> forge_assistance familiarity
```

The action rejects outside City Center and rejects after familiarity has already been earned, so it is not a repeatable manual Gold farm.

Travelling to City Center by itself does not teach the routine.

The +5 Gold is a bounded qualification value, not a balance claim.

### 2.3 Resonance Calibration active source

Calibration familiarity is earned only after the existing active Trait Resonance path has successfully passed its normal discovery/Connection or compatibility/Memory/prerequisite/Essence gates and committed permanent Trait acquisition:

```text
successful Trait Resonance
-> resonance_calibration familiarity
```

A failed or merely attempted Trait Resonance does not teach the routine.

### 2.4 Below-UI authority

`startCopyProductionTaskThunk(...)` now consumes the same player familiarity state used by the Copy UI.

For an unfamiliar routine, direct thunk invocation rejects before `Copy.activeTask` mutation even when every Copy maturity/loyalty/role/location requirement passes.

The existing M20 Copy requirements remain independently enforced and unchanged.

### 2.5 Player-facing delegation state

The Copy panel keeps both authored production tasks visible and distinguishes:

```text
Routine understood.
```

from an unfamiliar lock instruction such as:

```text
Practice Forge Assistance yourself in the City Center first.
```

or:

```text
Successfully Resonate a Trait yourself before delegating calibration.
```

Copy-specific maturity/loyalty/role/location reasons remain separately legible.

---

## 3. Persistence

The existing save envelope already serializes the full RootState.

Qualification proves:

```text
active routine familiarity
-> ordinary save
-> ordinary load
-> familiarity retained
```

and separately:

```text
legacy-like/current-schema Player state lacking routineFamiliarity
+
positive offline elapsed interval
-> still unfamiliar
```

No save schema bump was required. `CURRENT_SAVE_SCHEMA_VERSION` remains `1`.

Offline elapsed time itself is not a learning source.

---

## 4. Repair R2 — visible shared return feedback

### 4.1 Shared notification authority

The repair does not create an M21-specific notification store.

`GlobalNotificationHost` consumes the existing Redux `NotificationSlice` queue and renders the most recent queued notification using Material UI `Snackbar` + `Alert`.

It maps the existing notification severity and removes the rendered queue item through the existing `removeNotification` authority when dismissed.

### 4.2 Production mount

`GlobalNotificationHost` is mounted once at `GameLayout`, making shared Redux notifications visible across the production game layout rather than only existing as unrendered state.

The separate local `useMenuNotifications` mechanism remains separate; it is not repurposed as M21 authority.

### 4.3 M21 return summary

M21 already dispatches:

```text
While you were away: ...
```

through the shared Redux queue after a positive offline settlement.

The repair qualification now proves the missing production bridge:

```text
M21 settlement
-> NotificationSlice
-> GlobalNotificationHost
-> visible Alert
```

and proves dismissal removes the shared queue entry.

---

## 5. Combined active -> automation -> offline -> return proof

The dedicated repair qualification exercises one composed Forge path:

```text
1. player actively practices Forge Assistance in City Center
2. +5 active Gold reward applies once
3. forge familiarity is persisted on Player state
4. qualified agent Copy is deliberately assigned Forge Assistance
5. task begins under existing M20 authority
6. game is saved while task is running
7. save is loaded with familiarity + active task intact
8. M21 settles a bounded 60-second offline interval
9. Forge task completes through existing M20 completion authority
10. +15 authored Gold reward applies exactly once
11. Copy active task clears
12. M21 queues a While you were away summary
13. GlobalNotificationHost visibly renders the summary
14. replaying the same saved timestamp is rejected by the existing M21 replay guard
```

The combined probe also holds Relationship state, Quest state and canonical player location constant across the offline settlement.

This is the first bounded executable proof in the repository of the intended composition:

```text
ACTIVE RPG
-> UNDERSTOOD ROUTINE
-> COPY AUTOMATION
-> OFFLINE CONTINUATION
-> VISIBLE RETURN
-> ACTIVE RPG
```

---

## 6. Rule-of-Two qualification

The same familiarity contract is not special-cased to Forge.

### Forge

```text
eligible Copy + unfamiliar player
-> rejected

City Center active Forge practice
-> familiarity

same eligible Copy
-> assignment succeeds
```

### Resonance Calibration

```text
eligible Copy + unfamiliar player
-> rejected

failed Trait Resonance
-> still unfamiliar

successful Trait Resonance
-> familiarity

same eligible Copy
-> assignment succeeds
```

The two learning sources are deliberately different active systems:

```text
Exploration / City Center interaction
Trait / Essence Resonance
```

That provides stronger integration evidence than two task-specific buttons inside the Copy screen.

---

## 7. Historical contract preservation

The existing M20 and M21 qualification suites were updated only to establish familiarity when they are testing their original, previously qualified concerns.

This preserves their scopes:

- M20 continues to test authored task identity, role/location legality, deterministic duration, rewards, save/load continuity, replay safety and narrative non-mutation;
- M21 continues to test timestamp authority, eight-hour cap, pause/stop controls, passive Essence, partial/completed Copy task settlement, replay safety and offline allowlist boundaries.

The new repair suite, not the historical suites, owns the new familiarity proposition.

Build Validation #213 passed:

- dependency installation ✅
- TypeScript ✅
- Checkpoint C incremental integration repair qualification ✅
- M21 bounded offline progress qualification ✅
- M20 Copy production automation qualification ✅
- Active-loop repair qualification ✅
- modified historical qualification ✅
- accumulated M4-M19 baseline qualification ✅
- production build ✅

---

## 8. Diagnostic history

### Build Validation #211 — diagnostic failure

Candidate head:

```text
92eaea0d6e66d63162ff69ce1f084df250958efa
```

Run/job:

```text
run 34190791639
job 101948260035
```

TypeScript passed.

The repair qualification then reported 4/6 passing tests and two failures confined to the same test-query mismatch: this repository's Testing Library configuration resolves `getByTestId` through `data-test-id`, while `GlobalNotificationHost` used the standard `data-testid` attribute. The failure DOM visibly contained both the intended shared notification and the M21 `While you were away` summary.

No runtime/product semantic failed.

The test was repaired to assert the rendered alert through its accessibility role instead of a project-specific test-id convention.

A subsequent cleanup also restored the historical Copy loyalty-decay expression verbatim after an identity helper was noticed during file reconstruction; that cleanup did not alter the preregistered repair behavior.

### Build Validation #213 — first complete behavioral candidate

```text
head bafffb68716263ad46d40b4edc25887fc2c9298e
tree f31d8c28c3a9abc77c49f5854538353a5620b11a
run 34190965594
job 101948771354
PASS
```

This is the first complete behavioral repair authority.

---

## 9. Qualified claim

> The bounded Incremental Integration Repair establishes player-owned persisted familiarity for both existing M20 production routines, requires that familiarity below the Copy UI before delegation, derives Forge familiarity from a one-time active City Center practice and Resonance Calibration familiarity from successful active Trait Resonance, preserves existing Copy capability/world constraints, and renders the existing shared notification queue through the production GameLayout. In the qualified composed path, active Forge experience leads to deliberate Copy delegation, ordinary save/load, bounded M21 offline task completion, an exact-once authored Gold reward, and a visible `While you were away` return summary without replaying Relationship, Quest, travel, Combat or other player-owned narrative/world decisions offline.

---

## 10. Evidence ceiling / explicit non-claims

This result does **not** prove or authorize:

- `CHECKPOINT_C_PASS` by itself;
- M22 Social Knowledge Propagation;
- generalized routine-learning or activity-discovery frameworks;
- more than the two existing M20 production task identities;
- repeatable manual Forge gameplay or a generalized crafting system;
- autonomous Copy task choice, planners, queues, priorities or chaining;
- Copy travel/pathfinding/schedules;
- new offline consumers;
- offline Relationships, Memories, Connection, dialogue, Quests, Combat or travel;
- generalized offline economy/world simulation;
- event-time segmented offline simulation;
- anti-cheat/server-authoritative time;
- final value/balance of +5 Forge practice Gold, +15 Forge Copy Gold, +8 Resonance Calibration Essence, or the eight-hour offline cap;
- player comprehension, enjoyment, retention or pacing without human play evidence;
- notification history/center, channels, mute settings, deep links, rich actions or analytics;
- that every active game activity should eventually become automatable.

---

## 11. Required next boundary

The correct sequence is now:

```text
Checkpoint C first evaluation: WEAK
-> Incremental Integration Repair: PASS
-> merge exact qualified repair
-> fresh Checkpoint C rerun
-> only fresh CHECKPOINT_C_PASS may authorize M22
```

A repair PASS is necessary evidence for the rerun; it is not a substitute for the rerun.
