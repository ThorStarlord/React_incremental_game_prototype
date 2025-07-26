# To-Do List: Copy System - Basic Implementation

This document outlines the development plan to implement a basic, functional version of the Copy System. The goal is to move the system from a static data entry to a dynamic and interactive game mechanic.

The implementation is broken down into three phases:
1.  **Core Mechanics:** Implement the backend logic that makes Copies grow and function.
2.  **UI & Integration:** Connect the new mechanics to the user interface.
3.  **Polish & Balancing:** Refine the system and tune its values.

---

## Phase 1: Core Mechanics (Backend Logic)

*Objective: Make Copies dynamic entities that live and change within the game's state according to the rules.*

- [ ] **1. Implement Growth System (Maturity)**
    - The `maturity` of a Copy should increase from 0 to 100 over time.
    - [ ] **Create Thunk:** In `src/features/Copy/state/CopyThunks.ts`, create a `processCopyGrowthThunk` that accepts `deltaTime` from the game tick.
    - [ ] **Thunk Logic:** The thunk will loop through all active copies and calculate maturity gain. It should stop increasing maturity at 100.
    - [ ] **Create Reducer:** In `src/features/Copy/state/CopySlice.ts`, add an `updateCopy` reducer that can update any part of a Copy object, including maturity.
    - [ ] **Game Loop Integration:** In `src/App.tsx`, import and dispatch `processCopyGrowthThunk` inside the `handleGameTick` function.

- [ ] **2. Implement Core Function (Essence Generation)**
    - Mature and loyal Copies should provide a tangible benefit to the player.
    - [ ] **Modify Essence Thunk:** In `src/features/Essence/state/EssenceThunks.ts`, update the `updateEssenceGenerationRateThunk`.
    - [ ] **Thunk Logic:** After calculating the rate from NPCs, get all Copies. Filter for those with `maturity >= 100` and `loyalty > 50`. Add a fixed bonus to the total essence generation rate for each qualifying Copy.

- [ ] **3. Implement Loyalty System (Decay)**
    - A Copy's `loyalty` should decrease slowly over time, requiring player intervention.
    - [ ] **Create Thunk:** In `src/features/Copy/state/CopyThunks.ts`, create a `processCopyLoyaltyDecayThunk`.
    - [ ] **Thunk Logic:** This thunk will loop through all copies and slightly decrease their loyalty based on `deltaTime`. Loyalty should not drop below 0.
    - [ ] **Game Loop Integration:** Dispatch `processCopyLoyaltyDecayThunk` from `handleGameTick` in `App.tsx`.

- [ ] **4. Implement Management Action (Bolster Loyalty)**
    - The player must have a way to counteract loyalty decay.
    - [ ] **Create Thunk:** In `src/features/Copy/state/CopyThunks.ts`, create a `bolsterCopyLoyaltyThunk` that accepts a `copyId`.
    - [ ] **Thunk Logic:** The thunk should:
        - Define a fixed `essenceCost` (e.g., 25) and `loyaltyGain` (e.g., 10).
        - Check if the player has enough essence using `getState()`.
        - If affordable, dispatch `spendEssence` from `EssenceSlice`.
        - Dispatch an action to update the target copy's loyalty (not to exceed 100).
        - Return success or failure.

---

## Phase 2: UI Implementation & Integration

*Objective: Expose the new mechanics to the player through a clear and interactive user interface.*

- [ ] **1. Update `CopiesPage.tsx` UI**
    - [ ] **Visualize Growth:** Replace the static text for `maturity` and `loyalty` with Material-UI `LinearProgress` components to show progress visually.
    - [ ] **Add Management Action:** For each Copy, add a "Bolster Loyalty" `Button`.
    - [ ] **Button Logic:** The button's `onClick` should dispatch the `bolsterCopyLoyaltyThunk`.
    - [ ] **Button State:** The button should be disabled if the player cannot afford the essence cost or if the Copy's loyalty is already at 100. Show the cost in a tooltip.
    - [ ] **Display Function:** Add a small text element to each Copy's card indicating its current function (e.g., "Status: Generating Essence" or "Status: Maturing").

- [ ] **2. Provide User Feedback for Creation**
    - [ ] **Update `NPCPanelContainer.tsx`:** Modify the `handleCreateCopy` function.
    - [ ] **Feedback Logic:** When the `createCopyThunk` is dispatched, show a notification/toast to the user indicating whether the "Seduction" was successful or failed.

---

## Phase 3: Polish & Balancing

*Objective: Refine the feature, ensure it's balanced, and add finishing touches.*

- [ ] **1. Verify Trait Inheritance**
    - [ ] Review the `createCopyThunk`. Ensure the logic for inheriting traits from the player's shared slots with the "parent" NPC is correctly implemented as per the specification.

- [ ] **2. Add UI Notifications**
    - [ ] Implement a system (or use an existing one) to show notifications for key events:
        - "Copy [Name] has reached full maturity!"
        - "Loyalty for [Name] is critically low!"
        - "You spent [X] Essence to bolster [Name]'s loyalty."

- [ ] **3. Balance Numerical Values**
    - [ ] Review and adjust all new values for game balance:
        - How long should "Normal Growth" take? Adjust maturity gain per tick.
        - How much Essence should a mature Copy generate?
        - How quickly should loyalty decay?
        - What is a fair Essence cost and loyalty gain for the "Bolster Loyalty" action?