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
    *   This is the process of spending Essence to copy an observed trait from an NPC. This action requires a sufficient level of **Emotional Connection** (`connectionDepth`) with the NPC.
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
*   **Slot Configuration:** The initial number of slots, their unlocked status, and unlock requirements are defined in the `initialState` of `PlayerSlice.ts` via the `createInitialTraitSlots` helper function and `MAX_TRAIT_SLOTS`/`INITIAL_TRAIT_SLOTS` constants.
*   **Maximum Slots:** Defined by `MAX_TRAIT_SLOTS` constant imported from `playerConstants.ts` (stored in `PlayerSlice.maxTraitSlots`).
*   **Resonance Level Integration:** Trait slot unlocking is tied to the player's Resonance Level, which increases based on accumulated Essence.
*   **Equipping/Unequipping:** Handled by `equipTrait` and `unequipTrait` actions in `PlayerSlice.ts`. This applies to traits acquired into the general pool (if any are not immediately permanent) and traits equipped via the "Equip NPC Innate Trait" mechanic.
*   **Management Access:** Players can manage trait slots through the Character Page's Traits tab or the dedicated Traits page, with proximity requirements handled through the UI flow.

### 3.1. Slot Interaction Implementation ✅ COMPLETED
**Click-Based System**: Replaced drag-and-drop with accessible click interactions
- **Empty Slot Click**: Opens trait selection dialog with available traits (for traits that are acquired but not permanent, if that category still exists, or for re-equipping temporarily borrowed NPC traits if applicable).
- **Equipped Trait Click**: Directly unequips the trait with confirmation.
- **Visual Feedback**: Clear hover states and action indicators.
- **Accessibility**: Full keyboard navigation and ARIA support.
- **Error Prevention**: Locked slots clearly indicate unlock requirements.

## 4. Trait Types & Categories ✅ IMPLEMENTED

*   **Categorization:** Traits are organized into standard RPG categories
    *   `Combat`: Affecting damage, defense, speed, critical chance, etc.
    *   `Physical`: Affecting health, stamina, physical resistance, regeneration.
    *   `Social`: Affecting NPC interactions, relationships, and Essence generation.
*   **Rarity/Potency:** Classification affecting power and acquisition difficulty (Essence cost for Resonance).
    *   `Common`: Basic effects, low Essence cost
    *   `Rare`: Notable bonuses, moderate Essence cost
    *   `Epic`: Significant modifications, high Essence cost  
    *   `Legendary`: Powerful unique effects, very high Essence cost
    *   (Potentially unique/artifact tiers for special traits)

## 5. Trait Examples ✅ IMPLEMENTED

*   **Growing Affinity:** Increases relationship gain with NPCs over time - example trait included in current trait definitions
*   **Combat Traits:** Attack bonuses, defense improvements, speed enhancements
*   **Social Traits:** Charisma bonuses, relationship multipliers, Essence generation improvements
*   **Utility Traits:** Health/Mana regeneration, resource efficiency, special abilities

## 6. UI/UX Implementation ✅ COMPLETED

The trait system UI has been fully implemented with modern, accessible patterns. Key components include:

### 6.1. TraitsPage Integration ✅ IMPLEMENTED
*   **Location:** `src/pages/TraitsPage.tsx`
*   **Architecture:** Integrates `TraitSystemContainer` which renders `TraitSystemTabs` component
*   **Navigation:** Full integration with MainContentArea routing and VerticalNavBar navigation
*   **State Management:** Complete Redux integration with trait state management

### 6.2. Tabbed Interface ✅ COMPLETE
*   **Slots Tab:** Via `EquippedSlotsPanel` - Player's active trait slot management with visual slot representation
*   **Management Tab:** Via `TraitManagement` - Trait acquisition, Resonance mechanics, and permanence system
*   **Codex Tab:** Via `TraitCodex` - Comprehensive trait browser and discovery system

### 6.3. NPC Integration ✅ IMPLEMENTED
*   **NPC Traits Tab:** Interface for Resonance (permanently acquiring traits from NPC's `availableTraits`) and managing traits shared by player to NPC's `sharedTraitSlots`
*   **NPC Overview Tab:** Lists NPC's "Innate Traits" with "Equip" buttons for temporary use by player
*   **Trait Sharing:** Player can share equipped (non-permanent) traits with NPCs who have available shared trait slots

### 6.4. Character Page Integration ✅ IMPLEMENTED
*   **Character Traits Tab:** Manages player's active trait slots through `PlayerTraitsContainer`
*   **Permanent Traits Display:** Shows player's permanent traits acquired via Resonance
*   **Quick Actions:** Direct equip/unequip capabilities with visual feedback

### 6.5. Component Architecture ✅ COMPLETE

#### TraitSystemTabs ✅ IMPLEMENTED
**Location:** `src/features/Traits/components/layout/TraitSystemTabs.tsx`
- **Tabbed Navigation:** Material-UI tabs with Slots, Management, and Codex sections
- **Icon Integration:** Semantic icons (Inventory2, Psychology, MenuBook) for visual identification
- **Responsive Design:** Adaptive layout for different screen sizes
- **State Management:** Local tab state with smooth transitions

#### EquippedSlotsPanel ✅ IMPLEMENTED  
**Location:** `src/features/Traits/components/ui/EquippedSlotsPanel.tsx`
- **Slot Visualization:** Integration with `TraitSlotsContainer` for slot management
- **User Guidance:** Clear instructions and tips for trait slot usage
- **Status Indicators:** Visual feedback for empty, equipped, and locked slots

#### TraitManagement ✅ IMPLEMENTED
**Location:** `src/features/Traits/components/ui/TraitManagement.tsx`
- **Resonance Interface:** Clear explanation of trait acquisition through NPC interaction
- **Status Dashboard:** Current Essence display and trait system status
- **Development Communication:** Clear indication of implemented vs. planned features
- **Educational Content:** Step-by-step guidance for trait acquisition process

## 7. Integration with Other Systems ✅ READY

### 7.1. Redux Store Integration ✅ IMPLEMENTED
- **TraitsSlice**: Manages global trait definitions, discovered traits (`discoveredTraits`), and the general pool of acquired trait IDs (`acquiredTraits`). No longer manages player-specific permanent traits.
- **PlayerSlice**: Manages player's equipped trait slots (`traitSlots`) and list of player-specific permanent traits (`permanentTraits`). This is the authoritative source for traits the player has permanently acquired.
- **Selectors**:
    *   Memoized selectors provide efficient data access across both slices
    *   Player permanent trait selectors primarily sourced from `PlayerSelectors.ts`
    *   Composite selectors in `TraitsSelectors.ts` combine data from both slices
- **Thunks**: `acquireTraitWithEssenceThunk` correctly updates both `TraitsSlice` (general acquired pool) and `PlayerSlice` (player permanent traits).

### 7.2. Feature Interoperability ✅ DESIGNED
- **Essence System**: `acquireTraitWithEssenceThunk` (Resonance) integrates with Essence system for deducting `essenceCost`. The obsolete `permanenceCost` field is no longer used.
- **Player System**: Player's permanent traits and equipped traits affect player stats through `PlayerSlice.recalculateStats` reducer.
- **NPC System**:
    *   Player can Resonate traits from NPCs to make them permanent (stored in `PlayerSlice.permanentTraits`)
    *   Player can temporarily equip NPC's `innateTraits` into their active slots (managed by `PlayerSlice.traitSlots`)
    *   Player can share equipped (non-permanent) traits with NPCs through `sharedTraitSlots`
- **Copy System**: Framework prepared for trait inheritance mechanics.

### 7.3. Constants Integration ✅ IMPLEMENTED
- **Player Constants**: `MAX_TRAIT_SLOTS` and `INITIAL_TRAIT_SLOTS` imported from `src/constants/playerConstants.ts`
- **Slot Management**: `createInitialTraitSlots` helper function creates properly configured trait slots
- **Unlock Requirements**: Trait slot unlocking tied to Resonance Level progression

### 7.4. Cross-System State Coordination ✅ READY
- **Trait Effects**: Player trait effects (permanent and equipped) integrated into stat calculations
- **NPC Interactions**: Trait sharing and acquisition mechanics coordinate between Player, Traits, and NPC systems
- **Essence Coordination**: Resonance costs properly validated and deducted through async thunk operations

## 8. Technical Implementation ✅ MATURE

### 8.1. Architecture Compliance ✅ VERIFIED
- **Feature-Sliced Design**: Proper organization within `src/features/Traits/` following established patterns
- **Component Separation**: Clear distinction between containers, UI components, and layout components
- **Redux Integration**: Modern Redux Toolkit patterns with typed actions and selectors
- **TypeScript Safety**: Comprehensive type definitions throughout trait system

### 8.2. Performance Optimization ✅ IMPLEMENTED
- **Memoized Components**: React.memo applied throughout component hierarchy
- **Efficient Selectors**: createSelector used for complex data derivations
- **Conditional Rendering**: Tab content loaded only when needed
- **State Subscriptions**: Components subscribe only to relevant state slices

### 8.3. Accessibility Standards ✅ WCAG 2.1 AA COMPLIANCE
- **Keyboard Navigation**: Full keyboard support throughout trait interfaces
- **Screen Reader Support**: Comprehensive ARIA labeling and semantic HTML
- **Visual Accessibility**: Color-independent information presentation
- **Touch Accessibility**: Proper touch target sizing for mobile devices

## 9. Development Status ✅ CURRENT IMPLEMENTATION

### 9.1. Implemented Features ✅ COMPLETE
- **Core Trait Management**: Complete slot-based trait system with visual interface
- **Resonance Mechanics**: Permanent trait acquisition from NPCs using Essence
- **Temporary Equipping**: Player can equip NPC innate traits into active slots
- **Trait Sharing**: Player can share traits with NPCs through dedicated slots
- **UI Integration**: Complete tabbed interface with responsive design
- **Redux Architecture**: Full state management with cross-system coordination

### 9.2. Architecture Readiness ✅ PREPARED
- **Copy System Integration**: Framework prepared for Copy trait inheritance
- **Advanced Mechanics**: Architecture ready for trait combinations and synergies
- **Progression Systems**: Integration points established for attribute and skill systems
- **Future Enhancements**: Extensible design supporting planned trait features

### 9.3. Migration Notes ✅ COMPLETED
- **Deprecated Systems**: Old "Make Permanent" mechanics removed from specification
- **State Consolidation**: Player permanent traits moved to PlayerSlice for better organization
- **Cost Structure**: Simplified to single `essenceCost` for Resonance, removing obsolete `permanenceCost`

## 10. Future Enhancements 📋 PLANNED

### 10.1. Advanced Trait Mechanics
- **Trait Combinations**: Synergy bonuses for specific trait combinations
- **Trait Evolution**: Upgrading traits through usage or special conditions
- **Trait Crafting**: Creating custom traits through resource investment
- **Trait Sets**: Equipment-style set bonuses for related traits

### 10.2. System Expansions
- **Copy Trait Inheritance**: Complete Copy system integration with trait inheritance
- **Dynamic Trait Effects**: Context-sensitive trait bonuses based on game state
- **Trait Mastery**: Progression system for individual traits through usage
- **Social Trait Networks**: Trait effects that influence NPC relationship networks

The Trait System provides a comprehensive foundation for character customization and progression through trait acquisition, management, and sharing. The implementation demonstrates mature React development practices while supporting complex game mechanics through the Resonance system and cross-feature integration.
