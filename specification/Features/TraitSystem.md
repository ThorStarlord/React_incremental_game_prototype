# Trait System Specification

This document details the design and mechanics of the Trait system, which allows players to customize their character and influence others (**including NPCs and Copies**) with passive bonuses and unique effects.

## 1. Overview

*   **Purpose:** Traits provide passive modifications to character stats, abilities, or game mechanics. They allow for build diversity, character customization, and influencing NPCs/**Copies**.
*   **Core Loop:** Discover/Target -> Acquire (Resonate for permanent, or Equip NPC Trait for temporary) -> Equip (if not permanent) / Share (with NPCs/**Copies**).
*   **Key Mechanics:**
    *   **Resonance:** Player permanently learns a trait from an NPC at the cost of Essence.
    *   **Equip NPC Trait:** Player temporarily uses one of an NPC's innate traits by equipping it into one of their own active slots (no cost).
    *   **Player Trait Slots:** Limited active slots for non-permanent traits.
    *   **Sharing with NPCs:** Player can share their equipped (non-permanent) traits with NPCs who have available shared trait slots.

**Implementation Status**: ✅ **UI IMPLEMENTED** for core trait management, resonance, and sharing. "Equip NPC Trait" UI implemented in NPC Overview.

## 2. Trait Acquisition & Permanence

There are now two primary ways for the player to gain the benefits of traits from NPCs: Resonating for permanent acquisition, and temporarily equipping an NPC's innate trait.

### 2.1. Permanent Acquisition via Resonance ✅ IMPLEMENTED
*   **Concept:** Players can permanently learn and internalize a trait from a target (primarily NPCs) by performing a "Resonance" action. This action requires **close proximity** to the target and the expenditure of **Essence**.
*   **Proximity:** The player must be in close proximity to the target NPC to perform the Resonance action (typically via the NPC's "Traits" tab).
*   **Resonance Action:**
    *   This is the process of spending Essence to permanently learn a trait listed in an NPC's "Available Traits for Resonance."
    *   The `Trait` data model includes an `essenceCost` property for this.
    *   Upon successful Resonance:
        *   The trait ID is added to the player's list of **permanent traits** (stored in `PlayerSlice.permanentTraits`).
        *   The player gains the trait's benefits permanently **without needing to equip it** in an active player trait slot.
        *   The trait is also marked as "known" or "acquired" in a general sense (e.g., `TraitsSlice.acquiredTraits`).
*   **Implementation:** The `acquireTraitWithEssenceThunk` handles Essence cost deduction and dispatches actions to both `TraitsSlice` (to mark as acquired) and `PlayerSlice` (to add to permanent traits).
*   **Obsolete System:** The previous system of a separate "Make Permanent" action (with a high `permanenceCost`) for already acquired traits is now **deprecated and removed**. The `permanenceCost` field on traits is obsolete.

### 2.2. Temporary Use via Equipping NPC Innate Traits ✅ IMPLEMENTED
*   **Concept:** Players can temporarily benefit from certain traits an NPC innately possesses by "equipping" them into one of their own active trait slots.
*   **NPC Innate Traits:** NPCs can have a list of `innateTraits` defined in their data (e.g., `npcs.json`). These are traits the NPC inherently has.
*   **Equipping Mechanic:**
    *   The player can choose to equip one of these innate NPC traits.
    *   This action **uses one of the player's limited active trait slots.**
    *   The effect lasts as long as the player keeps it equipped in their slot. It can be unequipped like any other player-equipped trait.
    *   The NPC **continues to possess and benefit from their innate trait**; the player is essentially using a temporary instance or attuning to it.
    *   There is **no Essence cost or relationship requirement** for the player to do this.
*   **UI:** This is typically initiated from the NPC's panel (e.g., a button next to listed innate traits on the "Overview" tab), conditional on the player having a free slot and not already having the trait equipped or permanently.
*   **Implementation:** The UI dispatches `PlayerSlice.actions.equipTrait` with the NPC's innate trait ID and an available player slot index.

### 2.3. Other Acquisition Methods (Future)
*   Completing specific quests or achievements might grant certain traits directly (potentially as permanent traits).
*   (Future) Research or crafting systems could yield traits.

### 2.4. General Requirements
*   Global prerequisite traits (defined on the trait itself in `traits.json`) still apply for a trait to be effective.

## 3. Player Trait Slots ✅ IMPLEMENTED

*   **Concept:** Players have a limited number of slots to equip active, non-permanent traits. Traits made permanent via Resonance or other means do not occupy these slots.
*   **Slot Configuration:** The initial number of slots, their unlocked status, and unlock requirements (e.g., by player level or Resonance Level) are defined in the `initialState` of `PlayerSlice.ts` (e.g., `state.player.traitSlots`).
*   **Maximum Slots:** Defined in `PlayerSlice.ts` (e.g., `state.player.maxTraitSlots`).
*   **Equipping/Unequipping:** Handled by `equipTrait` and `unequipTrait` actions in `PlayerSlice.ts`. This applies to traits acquired into the general pool (if any are not immediately permanent) and traits equipped via the "Equip NPC Innate Trait" mechanic.
*   **Management Limitation:** The player can manage trait slots (equip/unequip) typically when in close proximity to an NPC from whom traits can be acquired/resonated, or potentially from their Character Page at any time. *(This proximity rule for general slot management needs review based on current implementation in `TraitSlotsContainer.tsx`)*.

### 3.1. Slot Interaction Implementation ✅ COMPLETED
(This section remains largely the same as it describes the UI for player's own slots)
**Click-Based System**: Replaced drag-and-drop with accessible click interactions
- **Empty Slot Click**: Opens trait selection dialog with available traits (for traits that are acquired but not permanent, if that category still exists, or for re-equipping temporarily borrowed NPC traits if applicable).
- **Equipped Trait Click**: Directly unequips the trait with confirmation.
- **Visual Feedback**: Clear hover states and action indicators.
- **Accessibility**: Full keyboard navigation and ARIA support.
- **Error Prevention**: Locked slots clearly indicate unlock requirements.

## 4. Trait Types & Categories
(Formerly Section 5 - Renumbered)
*   **Categorization:** (Standard RPG categories)
    *   `Combat`: Affecting damage, defense, speed, etc.
    *   `Physical`: Affecting health, stamina, physical resistance.
    *   `Social`: Affecting NPC interactions and relationships
*   **Rarity/Potency:** Classification affecting power and potentially acquisition difficulty (Essence cost for Resonance).
    *   Common, Rare, Epic, Legendary
    *   (Potentially unique/artifact tiers)

## 5. Trait List (Examples - Needs Expansion)
(Formerly Section 6 - Renumbered)
*   **Growing Affinity:** ✅ **IMPLEMENTED** - Trait example included in current trait definitions

## 6. UI/UX Implementation ✅ COMPLETED
(Formerly Section 7 - Renumbered. Content needs review for new mechanics.)

The trait system UI has been fully implemented with modern, accessible patterns. Key components include:
*   **NPC Interaction Panel ("Traits" and "Overview" tabs):**
    *   Lists NPC's "Available Traits for Resonance" (for permanent acquisition).
    *   Lists NPC's "Innate Traits" with "Equip" buttons (for temporary use by player).
    *   Manages sharing player's equipped traits to NPC's shared slots.
*   **Character Page ("Traits" tab):**
    *   Manages player's active trait slots (equipping/unequipping traits borrowed from NPCs or other non-permanent acquired traits, if any).
    *   Displays player's permanent traits (acquired via Resonance).
    *   Trait Codex for browsing all known traits.

*(Detailed subsections 7.1 to 7.6 need review and update to reflect the new mechanics, especially regarding what `TraitManagement` now handles if "Make Permanent" is gone, and how "Resonance" and "Equip NPC Trait" are presented.)*

## 7. Integration with Other Systems ✅ READY
(Formerly Section 8 - Renumbered)

### 7.1. Redux Store Integration ✅ IMPLEMENTED
- **TraitsSlice**: Manages global trait definitions, the general pool of "acquired" trait IDs (traits the player has learned/encountered), and discovered trait IDs. It **no longer** stores or manages the player's specific list of permanent traits.
- **PlayerSlice**: Manages the player's equipped trait slots and the list of **player-specific permanent traits** (e.g., `PlayerSlice.permanentTraits`). This is the source of truth for traits the player has permanently acquired.
- **Selectors**:
    *   Memoized selectors provide efficient data access.
    *   Selectors for the player's permanent traits (IDs or objects) should primarily be sourced from `PlayerSelectors.ts` or composite selectors in `TraitsSelectors.ts` that utilize `PlayerSelectors.ts` for the list of permanent trait IDs.
- **Thunks**: Async actions for Resonance (`acquireTraitWithEssenceThunk`) correctly update both `TraitsSlice` (for the general acquired pool) and `PlayerSlice` (for player's permanent traits).

### 7.2. Feature Interoperability ✅ DESIGNED
- **Essence System**: `acquireTraitWithEssenceThunk` (Resonance) integrates with the Essence system for deducting `essenceCost`. The `permanenceCost` field is obsolete.
- **Player System**: Player's permanent traits (from `PlayerSlice`) and equipped traits (from slots in `PlayerSlice`) affect player stats (handled by `PlayerSlice.recalculateStats` or similar).
- **NPC System**:
    *   Player can Resonate traits from NPCs to make them permanent (stored in `PlayerSlice`).
    *   Player can temporarily equip an NPC's `innateTraits` into their active slots (managed by `PlayerSlice`).
    *   Player can share their equipped (non-permanent) traits with NPCs.
- **Copy System**: Framework in place for trait inheritance.

*(Subsections 8.3, 8.4, 9, 9.1, 9.2, 9.3 need review in light of these major changes to trait mechanics.)*
