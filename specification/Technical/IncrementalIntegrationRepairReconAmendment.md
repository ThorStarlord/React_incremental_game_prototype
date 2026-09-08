# Incremental Integration Repair — Recon Amendment

**Status:** FROZEN before repair behavior implementation  
**Preregistration:** `IncrementalIntegrationRepair.md`  
**Preregistration commit:** `098d65ec7ed7b08ccfd1d4dc5099bfaaf5b4d4f8`  
**Baseline:** `88e83dab50eaf7b2ca50696f2c037686dafbe2af` / tree `b25b7312aae9c9f1b2a73615f3394d35cc5ecfaf`

---

## 1. Recon conclusions

### 1.1 Player state is the existing persisted owner for routine familiarity

`Copy` state is per-Copy execution/capability state (maturity, loyalty, role, active task, location). Routine familiarity answers a different question: whether the **player** has personally established enough understanding to delegate a routine at all.

`Meta` is application/session/save metadata and is not the correct gameplay-knowledge owner.

`PlayerState` already owns durable player progression such as permanent Traits, Resonance level and canonical location, and the save envelope clones the complete `RootState` without a per-field persistence adapter.

Therefore the bounded repair will add an **optional player-owned routine-familiarity map** for exactly the two current production routines.

The field remains optional so pre-repair/current-schema saves that lack it load safely as **unfamiliar** rather than requiring a save-schema bump solely for a backward-compatible additive gameplay field. New ordinary saves persist the map automatically through the existing full-RootState envelope.

### 1.2 Familiarity IDs and sources are bounded, not generalized

The repair freezes exactly:

```text
forge_assistance
source = city_center_forge_assistance

resonance_calibration
source = trait_resonance
```

No generalized activity-learning registry or dynamic task discovery is introduced.

### 1.3 Forge familiarity requires a new bounded active City Center interaction

Recon found no existing production player action that honestly means the player has performed **Forge Assistance**. Merely being/travelling in City Center, trading, or opening the Copy menu is insufficient evidence.

The smallest production bridge will therefore be one explicit player-driven **City Center forge-assistance practice** exposed from the existing `TravelPanel` / active Exploration surface.

Frozen semantics:

- requires canonical player presence at `location_city_center`;
- succeeds only if Forge familiarity has not already been recorded;
- grants a one-time bounded ordinary active reward of **+5 Gold**;
- records `forge_assistance` familiarity after the active action succeeds;
- repeated direct thunk calls reject and cannot farm the one-time reward;
- travelling to City Center alone does not teach the routine.

The +5 Gold value is a bounded proof value only; this repair makes no balance claim.

### 1.4 Successful Trait Resonance is the existing active source for Resonance Calibration familiarity

`acquireTraitWithEssenceThunk` already validates discovery, Relationship/legacy connection authority, assimilation/compatibility/Memory evidence where applicable, prerequisites and Essence before committing permanent Trait acquisition.

Therefore the repair will record `resonance_calibration` familiarity **only after a successful Trait Resonance has committed**. Failed or merely attempted Resonance must not grant familiarity.

This reuses a real active progression action rather than adding a second synthetic learning button.

### 1.5 Copy assignment remains the below-UI authority

`startCopyProductionTaskThunk` is the existing M20 assignment authority. It already validates task identity, Copy existence, busy state and authored Copy eligibility.

The repair will add player familiarity to that same below-UI assignment path. Existing maturity/loyalty/role/location checks remain independent and unchanged.

The player-facing `CopyDetailPanel` will consume the same familiarity state and display unfamiliar tasks as locked with an active-play instruction rather than hiding them.

### 1.6 Current save schema remains v1

`CurrentSaveEnvelope` clones the full `RootState`. The save schema currently validates envelope identity/timestamp and recognizes root-like state; it does not enumerate every Player field.

Because the new Player field is optional and safe-defaults to unfamiliar when absent, no schema-version bump is required for this bounded additive repair.

Qualification must prove:

```text
learn familiarity -> save -> load -> familiarity retained
old/absent familiarity -> unfamiliar
```

### 1.7 Shared Redux notification queue is the sole repair presentation authority

Checkpoint C already established that `NotificationSlice` owns a shared queue while `useMenuNotifications` is a separate local-state mechanism.

The repair will add one mounted production `GlobalNotificationHost` that:

- consumes `selectNotifications`;
- renders the oldest queued shared notification through MUI `Snackbar` + `Alert`;
- maps the existing notification `type` directly to Alert severity;
- dismisses through existing `removeNotification`;
- mounts once in `GameLayout`;
- does not introduce a duplicate M21 notification store.

The repair qualifies visibility/lifecycle only; it does not attempt notification history, channels, settings, rich actions or analytics.

### 1.8 Build Validation receives one additive repair gate

The current workflow already gates TypeScript, M21, M20, the active-loop repair, modified historical suites, accumulated M4-M19 suites and production build.

The repair will add one focused **Checkpoint C incremental integration repair qualification** step without removing any existing gate.

---

## 2. Frozen implementation shape

```text
PlayerState.routineFamiliarity?  (exactly two bounded routine IDs)
       ^                         ^
       |                         |
City Center active forge    successful Trait Resonance
practice (+5 Gold once)          |
       |                         |
       +-----------+-------------+
                   |
                   v
        Copy task familiarity check
        (UI + startCopyProductionTaskThunk)
                   |
                   v
             existing M20 task
                   |
                   v
             existing M21 settlement
                   |
                   v
          NotificationSlice queue
                   |
                   v
         GlobalNotificationHost
                   |
                   v
                 player
```

---

## 3. Required Rule-of-Two qualification

### Forge probe

```text
qualified City Center Copy + unfamiliar player
-> forge assignment rejected

player outside City Center
-> active forge practice rejected

player in City Center
-> active forge practice succeeds once
-> +5 Gold exactly once
-> forge familiarity recorded
-> subsequent active practice rejected

qualified Copy + familiar player
-> forge assignment succeeds
```

### Resonance probe

```text
qualified researcher/agent Copy + unfamiliar player
-> calibration assignment rejected

failed Trait Resonance
-> familiarity remains absent

successful Trait Resonance
-> resonance_calibration familiarity recorded

qualified Copy + familiar player
-> calibration assignment succeeds
```

### Persistence / offline control

```text
familiarity -> save/load -> familiarity retained
unfamiliar + elapsed offline time -> still unfamiliar
```

### Return-summary probe

```text
M21 settlement -> shared While you were away notification
-> mounted GlobalNotificationHost visibly renders it
-> dismiss -> shared queue item removed
```

At least one combined test must span active familiarity -> task assignment -> save/load/offline settlement -> visible shared summary.

---

## 4. Non-expansion constraints

This amendment does not authorize:

- additional production task IDs;
- automatic task assignment/chaining;
- generalized manual crafting;
- new Copy movement;
- M22 knowledge propagation;
- new offline consumers;
- narrative/Relationship/Quest/Combat/travel automation;
- balance claims for +5/+15 Gold, +8 Essence or the eight-hour cap.

If implementation requires any such expansion, stop and amend the experiment rather than silently broadening it.
