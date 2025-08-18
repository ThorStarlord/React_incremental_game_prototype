Implementation Status: ✅ **BASIC STATE/UI + TRAIT SHARING AUTO‑SYNC IMPLEMENTED (Phase 1–7 + Phase 10–11)**

> Current Build Summary (Aug 2025):
> * Slice + thunks for growth, decay, creation, loyalty bolster, promotion (accelerated growth) implemented.
> * Constants centralized in `COPY_SYSTEM` within `gameConstants.ts`.
> * UI list (basic) + actions wired (bolster loyalty, promote) – advanced segmented UI planned.
> * Notification system added (`notifications` slice) replacing console logs for success/failure feedback.
> * JSDoc added for thunks, selectors, utilities.
> * Essence integration (bonus per qualifying Copy) present via selectors (qualifying = maturity ≥ threshold & loyalty > threshold).
> * ✅ Copy–Trait integration: Copies have trait slots with maturity/loyalty unlocks, can receive shared traits from the Player (while equipped), and auto‑sync unshares on player unequip/replace/permanence.

# Copy System Specification

This document details the mechanics for creating, managing, and utilizing "Copies" – entities created by the player through a unique process, inheriting aspects of the player and potentially a target.

**Implementation Note:** The feature slice for this system is located at `src/features/Copy/` (singular), and its state is managed under the `copy` key in the Redux store.

## 1. Overview

*   **Concept:** Copies are extensions of the player's will and essence, created through a specific interaction outcome ("Seduction"). They serve various purposes, from infiltration to specialized tasks, and grow over time.
*   **Core Loop:** Target -> Seduction Interaction -> Creation -> Growth (Normal/Accelerated) -> Management/Deployment -> Loyalty Maintenance.

## 2. Creation Method: Seduction Outcome

## 3. Traits on Copies (Inherited + Shared) ✅ IMPLEMENTED

Copies gain traits from two sources:

- Inherited Traits (read‑only): On creation, a Copy snapshots any traits that the parent NPC was receiving from the Player at that moment. These are immutable on the Copy and always count toward its effective trait list.
- Shared Traits (player‑controlled): Each Copy has a set of trait slots. Unlocked slots can receive one of the Player’s currently equipped, non‑permanent traits. Shared traits remain active on the Copy while the Player keeps that trait equipped and non‑permanent.

### 3.1 Slot Unlock Rules
- Configuration lives in `COPY_SYSTEM.TRAIT_SLOT_UNLOCKS` with per‑slot requirements (maturity or loyalty thresholds). Initial locked/unlocked count is defined by `INITIAL_TRAIT_SLOTS` and capped by `MAX_TRAIT_SLOTS`.
- Unlocks are one‑way in this prototype: once a slot unlocks, it stays unlocked even if metrics later decline.

### 3.2 Share Validation
- Trait must be equipped on the Player.
- Trait must not be permanent on the Player (permanent traits are not shareable).
- The Copy must not already have the trait (inherited or in another slot). Duplicate shares are blocked.

### 3.3 Auto‑Unshare Invariants (Listener Middleware) ✅ IMPLEMENTED
Cross‑slice listener middleware enforces these invariants automatically:
- Player unequips a trait → it is unshared from all Copy slots that had it.
- Player replaces a trait in a slot → the replaced (old) trait is unshared from all Copies.
- Player resonates a trait (makes it permanent) → that trait is unshared from all Copies and cannot be shared again.

Notifications are emitted to provide user feedback on auto‑unshare events.

### 3.4 Migration Safety & Save/Load
- Older saves may lack `copy.traitSlots`. On load/import or any share/unshare sweep, the system initializes missing slots using the current `COPY_SYSTEM` configuration.
- A minimal post‑load pass ensures all Copies have `traitSlots` before UI renders share options.

### 3.5 UI Behavior (Phase 1)
- Locked slots show a tooltip with the unlock requirement (e.g., “maturity ≥ 80”).
- Share list shows only player‑equipped, non‑permanent traits.
- Traits already present on the Copy (inherited/shared) render the Share button disabled with a tooltip explaining the reason.

*   **Trigger:** Successfully completing a "Seduction" interaction path with a suitable target (likely an NPC, potentially other entities based on game design). This is a high-level social/interaction challenge outcome, not necessarily literal seduction.
*   **Result:** Instead of typical relationship gains, a successful Seduction outcome results in the creation of a nascent Copy.
*   **Essence Cost:** The initial creation might have a base Essence cost, or the cost might be front-loaded into the Seduction interaction itself. (TBD - Initial cost or interaction cost?)
*   **Target Influence:** The target NPC involved in the Seduction might have their relationship significantly altered, potentially becoming highly loyal, confused, or even hostile depending on their personality and the context. The Copy is linked to this "parent" target in some way (flavor, potential unique interactions).

## 3. Growth Options

| Mode | Mechanic | Current Constant(s) | Notes |
|------|----------|---------------------|-------|
| Normal | Base per‑second maturity increase | `GROWTH_RATE_PER_SECOND = 0.1` | Applied every game loop tick (delta‑time scaled). |
| Accelerated | Normal * multiplier | `ACCELERATED_GROWTH_MULTIPLIER = 2` | Set via promotion action (one‑time essence spend). |

**Normal Growth**  
* Scales with real time via game loop delta; no essence upkeep.  
* Suited for background progression; cheaper but slower.

**Accelerated Growth**  
* Activated by spending Essence (`PROMOTE_ACCELERATED_COST = 150`).  
* Doubles effective maturity gain rate (current multiplier = 2).  
* Strategic for rushing a Copy to maturity threshold.

## 4. Inheritance

*   **Base Abilities:** Copies automatically inherit the player's core "Emotional Resonance" ability.
    *   **Emotional Resonance (Player Ability):** This is a planned player characteristic that allows Copies to potentially form connections and interact with the Trait system (perhaps in a limited way initially). Its specific mechanics are currently undefined and planned for future implementation with the Copy system. **Note: This is distinct from the sidelined "Soul Resonance" concept found in `soulResonanceUtils.ts`.**
*   **Shared Traits:** Copies inherit *snapshots* of any traits the player had actively shared with the *target parent* via Trait Slots *at the moment of creation*.
    *   These inherited traits become the Copy's initial base traits.
    *   They do *not* automatically update if the player later changes the traits shared with the parent.
*   **Player Traits:** Do Copies inherit traits the player has permanently active or equipped for themselves? (TBD - Probably not by default, to differentiate them from the player).

## 5. Stats, Abilities, and Progression

*   **Independent Stats:** Copies possess their own set of stats (Health, Mana, Attributes) and a Power Level, distinct from the player and the parent target.
    *   Initial stats might be influenced by the player's stats, the parent target's stats, and the growth method (Normal vs. Accelerated).
*   **Trait Gain:** Can Copies acquire new traits independently?
    *   *Option 1:* Yes, through their own interactions or tasks, potentially consuming their own generated Essence (if they generate any).
    *   *Option 2:* No, they can only gain traits shared with them by the player via dedicated Copy Trait Slots (see below).
    *   *Decision:* Option 2 seems more aligned with the "extension of the player" theme initially. Player shares traits to customize Copies.
*   **Skill Progression:** Can Copies learn/improve skills? (TBD - If a skill system exists, how do Copies interact with it?).

## 6. Control, Management, and Limits

*   **Interface:** A dedicated UI panel/screen is needed to view, manage, and potentially issue commands to Copies. (Link to `UI_UX/UserFlows.md`, `UI_UX/LayoutDesign.md`).
    *   Displays Copy status, location, current task, loyalty, stats, inherited/shared traits.
*   **Commands:** What level of control does the player have?
    *   Assigning tasks (e.g., gather resources, scout area, assist in combat, influence target).
    *   Setting general behavior (passive, defensive, aggressive).
    *   Moving to specific locations.
*   **Limit:** Is there a maximum number of active Copies the player can maintain simultaneously?
    *   *Decision:* Yes, likely limited by a player stat (e.g., Charisma, Intelligence) or a specific upgrade/trait related to control or Essence capacity. Start with a low limit (e.g., 1-3) that can be increased.
*   **Trait Slots for Copies:** Does the player grant trait slots *to* Copies similar to NPCs?
    *   *Decision:* Yes, this seems the primary way to customize and empower Copies. The number of slots a Copy can receive could scale with its age, loyalty, or player upgrades.

## 7. Loyalty

*   **Concept:** A measure of the Copy's alignment with the player's goals and resistance to external influence or deviation. Crucial for reliable function.
*   **Maintenance:**
    *   **Trait Sharing:** Planned – not yet implemented. (Hooks into Trait system later.)
    *   **Task Completion:** Planned – tasks presently stored as `currentTask` only.
    *   **Player Interaction:** Planned future enhancement.
    *   **Essence Investment:** Promotion + bolster actions.
    *   **Bolster Action (Implemented):** Spend Essence to raise loyalty: cost `BOLSTER_LOYALTY_COST = 25`, gain `BOLSTER_LOYALTY_GAIN = 10` (clamped at 100).
*   **Decay/Loss:**
    *   Neglect (lack of tasks or interaction).
    *   Failure on critical tasks.
    *   Removing beneficial shared traits.
    *   Exposure to strong opposing influences.
    *   (Potential) A natural slow decay over time if not maintained.
*   **Consequences of Low Loyalty:**
    *   Reduced task efficiency.
    *   Ignoring commands.
    *   Potential to act independently or even turn against the player.
    *   Increased vulnerability to being "poached" or influenced by rivals.

## 8. UI/UX Considerations

*   Clear indication of Copy creation possibility during Seduction interactions.
*   Management screen listing all Copies, their status, and key info.
*   Interface for assigning tasks and managing shared traits for each Copy.
*   Visual representation of Copies in the game world (if applicable) or on maps.
*   Notifications for Copy creation, promotion, bolster success/failure (implemented through notifications slice). Low loyalty warnings: TODO (selector + threshold trigger to dispatch notification when crossing below X%).

## 9. Balancing Notes

*   Cost of Seduction interaction vs. Copy benefits.
*   Essence cost of Accelerated Growth vs. time saved.
*   Impact of inherited traits vs. traits shared later.
*   Scaling of Copy stats/power relative to player and enemies.
*   Loyalty gain/loss rates need careful tuning. Current passive decay: `DECAY_RATE_PER_SECOND = 0.05` (evaluated each tick, delta scaled). Bolster provides discrete recovery.
*   The limit on the number of Copies needs to be balanced against their utility.

---

## 10. Implemented Constants (COPY_SYSTEM)

| Constant | Value | Purpose |
|----------|-------|---------|
| `GROWTH_RATE_PER_SECOND` | 0.1 | Base maturity gain per second. |
| `ACCELERATED_GROWTH_MULTIPLIER` | 2 | Multiplies base growth when accelerated. |
| `DECAY_RATE_PER_SECOND` | 0.05 | Base loyalty decay per second. |
| `BOLSTER_LOYALTY_COST` | 25 | Essence cost to bolster loyalty. |
| `BOLSTER_LOYALTY_GAIN` | 10 | Loyalty restored per bolster action. |
| `ESSENCE_GENERATION_BONUS` | 0.2 | Flat essence/sec per qualifying Copy. |
| `MATURITY_THRESHOLD` | 100 | Maturity threshold for bonus qualification. |
| `LOYALTY_THRESHOLD` | 50 | Loyalty must be strictly greater than this for bonus. |
| `MATURITY_MIN/MAX` | 0 / 100 | Clamp boundaries for maturity. |
| `LOYALTY_MIN/MAX` | 0 / 100 | Clamp boundaries for loyalty. |
| `PROMOTE_ACCELERATED_COST` | 150 | Essence cost to enable accelerated growth. |

Qualification rule for essence bonus: maturity ≥ `MATURITY_THRESHOLD` AND loyalty > `LOYALTY_THRESHOLD`.

## 11. Current Implementation Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Slice (CRUD + batch update) | Implemented | Batch reducer `updateMultipleCopies`. |
| Growth Thunk | Implemented | Uses delta time & accelerated multiplier. |
| Loyalty Decay Thunk | Implemented | Flat decay; batched updates. |
| Creation Thunk | Implemented | Charisma-based success chance formula; inherits player trait slot IDs snapshot. |
| Bolster Loyalty Thunk | Implemented | Essence spend + clamp. |
| Promotion Thunk | Implemented | Adds accelerated growth state + notification. |
| Selectors (basic) | Implemented | Advanced segmentation (mature/loyal, etc.) pending merge in later phase. |
| Essence Bonus Integration | Partial | Bonus constant defined; recalculation logic lives in Essence selectors/thunks (qualifying count). |
| Notifications | Implemented | Replaces console logs for Copy actions. |
| UI List Page | Basic | Detailed card & segmentation in roadmap. |
| Task System | Minimal | `currentTask` string only; task mechanics TBD. |
| Low Loyalty Alerts | TODO | Needs threshold watcher + notification dispatch. |

## 12. Player-Facing UI Actions (Implemented)

| Action | Trigger | Cost | Effect | Source Code |
|--------|---------|------|--------|------------|
| Create Copy | `createCopyThunk` success (Seduction roll) | None (roll only) | Adds new Copy at 0 maturity / 50 loyalty | `CopyThunks.ts` |
| Bolster Loyalty | User action (UI button) | 25 Essence | +10 loyalty (clamped) | `bolsterCopyLoyaltyThunk` |
| Promote to Accelerated | User action (UI button) | 150 Essence | Sets `growthType = accelerated` | `promoteCopyToAcceleratedThunk` |

Planned actions: Assign Task (task catalog), Share Trait, Revoke Trait, Recall / Release Copy, Suspend Growth.

## 13. Lifecycle & Game Loop Integration

1. Game loop tick computes `deltaTime` (ms).  
2. Dispatch order (current):
    * `processCopyGrowthThunk(deltaTime)` – batches maturity changes.
    * `processCopyLoyaltyDecayThunk(deltaTime)` – batches loyalty decay.
3. Essence system periodically recalculates generation rate using selector counting qualifying Copies.  
4. UI re-renders only on batch reducer invocation (single state change for many Copies).  

Edge Cases Considered:
* Idle: No maturity update if already at max.
* Loyalty floor at 0 prevents negative accumulation.
* Accelerated promotion is idempotent (rejects if already accelerated).

## 14. Notifications & Feedback

Added lightweight `notifications` slice (array queue) with `addNotification` for:  
* Copy creation success / failure (chance shown on failure).  
* Promotion success.  
* Bolster success / rejection reasons (handled via thunk reject values).  

Upcoming: automatic notifications for low loyalty (< configurable threshold), maturity completion, task completion.

## 15. Future / TODO Roadmap

| Area | Planned Work |
|------|--------------|
| Advanced Selectors | Segment Copies (growing, mature, low loyalty) and memoized essence bonus recalculation. |
| Task System | Define task schema, execution loop, reward hooks (loyalty/essence/traits). |
| Low Loyalty Alerts | Threshold crossing detection + debounce to avoid spam. |
| Trait Integration | Copy trait slots & sharing UI. |
| Essence Scaling | Non-linear bonuses / diminishing returns for many Copies. |
| Save/Load | Ensure backward-compatible migrations when adding new Copy fields. |
| Testing | Unit tests for thunks (growth/decay/promotion), selector coverage. |
| Performance | Potential Web Worker for large Copy counts; virtualization in UI. |
| Security | Validate NPC existence & uniqueness before creation (prevent duplicates). |

---

Revision: Updated for Phase 10 documentation (final constants & implemented actions).
