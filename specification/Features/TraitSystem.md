# Trait System Specification

This document details the design and mechanics of the Trait system, which allows players to customize their character and influence others (**including NPCs and Copies**) with passive bonuses and unique effects.

## 1. Overview

*   **Purpose:** Traits provide passive modifications to character stats, abilities, or game mechanics. They allow for build diversity, character customization, and influencing NPCs/**Copies**.
*   **Core Loop:** Discover -> Equip (for temporary use) / Resonate (for permanent acquisition).
*   **Key Mechanics:**
    *   **Discovery:** The player learns that a trait exists, typically by interacting with an NPC who possesses it. Discovered traits can be equipped.
    *   **Equipping:** The player places a discovered (but not permanent) trait into one of their limited active slots to gain its benefits. This is a temporary, strategic choice with no Essence cost.
    *   **Resonance (Permanent Acquisition):** The player spends a significant amount of Essence to make a discovered trait a permanent part of their character, freeing up the slot it occupied (if any) and making its effects always active. This action is gated by the **Intimacy (`connectionDepth`) level** with the source NPC.

**Implementation Status**: ✅ **UI IMPLEMENTED** for core trait management, equipping, and the new Resonance flow via the NPC panel.

## 2. Trait Lifecycle: Discover, Equip, Resonate

The player's journey with a trait now follows a clear three-stage path.

### 2.1. Discovery ✅ IMPLEMENTED
*   **Concept:** This is the first step where a player becomes aware of a trait.
*   **Trigger:** Typically occurs when interacting with an NPC. All of the NPC's `availableTraits` are automatically added to the player's `discoveredTraits` list in the Redux store.
*   **Implementation:** The `discoverTraitThunk` is dispatched from `NPCPanelContainer` when an NPC is viewed, ensuring their traits are added to the `traits.discoveredTraits` array if not already present.
*   **Result:** A discovered trait appears in the Trait Codex and becomes available to be equipped into an active slot.

### 2.2. Equipping ✅ IMPLEMENTED
*   **Concept:** The player actively uses a discovered trait by placing it into one of their limited `traitSlots`. This is the primary way to get temporary benefits from a wide range of discovered abilities.
*   **Trigger:** The player clicks on an empty trait slot, which opens a dialog listing all discovered traits that are not already permanent or equipped.
*   **Implementation:** The `equipTrait` action in `PlayerSlice.ts` handles placing a `traitId` into a specific slot in the `player.traitSlots` array.
*   **Result:** The trait's effects are applied to the player's stats. The trait occupies a slot. It can be unequipped at any time to free up the slot for another trait.

### 2.3. Resonance (Permanent Acquisition) ✅ IMPLEMENTED
*   **Concept:** This is the mastery step. The player spends Essence to make a discovered trait a permanent, innate part of their character. This is the "Resonance" mechanic.
*   **Trigger:** The player interacts with an NPC who can teach a specific trait. On the NPC's "Traits" tab, the player clicks a "Resonate" button.
*   **Implementation:** The button dispatches the `acquireTraitWithEssenceThunk`. This thunk:
    1.  Validates the player has enough essence.
    2.  Dispatches `spendEssence`.
    3.  Dispatches `discoverTrait` (to ensure it's marked as known, if not already).
    4.  Dispatches `addPermanentTrait`, which adds the trait's ID to the `player.permanentTraits` array.
*   **Result:** The trait is now always active and **does not require a slot**. If it was previously equipped, that slot is now free.

### 2.4. NPC Innate Trait Equipping ✅ IMPLEMENTED
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

### 2.5. General Requirements
*   Global prerequisite traits (defined on the trait itself in `traits.json`) still apply for a trait to be effective.

## 3. Player Trait Slots ✅ IMPLEMENTED

*   **Concept:** Players have a limited number of slots to equip active, non-permanent traits. Traits made permanent via Resonance do not occupy these slots.
*   **Slot Configuration:** The initial number of slots and their unlock requirements are defined in the `initialState` of `PlayerSlice.ts` via the `createInitialTraitSlots` helper function and `MAX_TRAIT_SLOTS`/`INITIAL_TRAIT_SLOTS` constants.
*   **Maximum Slots:** Defined by `MAX_TRAIT_SLOTS` constant imported from `playerConstants.ts` (stored in `PlayerSlice.maxTraitSlots`).
*   **Resonance Level Integration:** Trait slot unlocking is tied to the player's Resonance Level, which increases based on accumulated Essence.
*   **Equipping/Unequipping:** Handled by `equipTrait` and `unequipTrait` actions in `PlayerSlice.ts`. This applies to discovered traits and traits equipped via the "Equip NPC Innate Trait" mechanic.
*   **Management Access:** Players can manage trait slots through the Character Page's Traits tab or the dedicated Traits page.

### 3.1. Slot Interaction Implementation ✅ COMPLETED
**Click-Based System**: Replaced drag-and-drop with accessible click interactions
- **Empty Slot Click**: Opens trait selection dialog with available discovered traits that are not already permanent or equipped.
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
*   **Management Tab:** Via `TraitManagement` - Trait system overview and explanation of mechanics
*   **Codex Tab:** Via `TraitCodex` - Comprehensive trait browser and discovery system for all discovered traits

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
- **System Overview:** Clear explanation of trait discovery, equipping, and Resonance mechanics
- **Status Dashboard:** Current Essence display and trait system status
- **Development Communication:** Clear indication of implemented vs. planned features
- **Educational Content:** Step-by-step guidance for trait lifecycle process

## 7. Integration with Other Systems ✅ READY

### 7.1. Redux Store Integration ✅ IMPLEMENTED
- **TraitsSlice**: Manages global trait definitions and discovered traits (`discoveredTraits`). No longer manages player-specific permanent traits or a general acquired traits list.
- **PlayerSlice**: Manages player's equipped trait slots (`traitSlots`) and list of player-specific permanent traits (`permanentTraits`). This is the authoritative source for traits the player has permanently acquired.
- **Selectors**:
    *   Memoized selectors provide efficient data access across both slices
    *   Player permanent trait selectors primarily sourced from `PlayerSelectors.ts`
    *   Composite selectors in `TraitsSelectors.ts` combine data from both slices
- **Thunks**: `discoverTraitThunk` adds to discovered traits. `acquireTraitWithEssenceThunk` handles Resonance, updating both `TraitsSlice` (discovery) and `PlayerSlice` (permanent traits).

### 7.2. Feature Interoperability ✅ DESIGNED
- **Essence System**: `acquireTraitWithEssenceThunk` (Resonance) integrates with Essence system for deducting `essenceCost`.
- **Player System**: Player's permanent traits and equipped traits affect player stats through `PlayerSlice.recalculateStats` reducer.
- **NPC System**:
    *   Player can discover traits by viewing NPCs with `availableTraits`
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
- **Discovery Mechanics**: Trait discovery through NPC interactions
- **Equipping System**: Temporary trait usage through limited active slots
- **Resonance Mechanics**: Permanent trait acquisition from NPCs using Essence
- **Temporary NPC Trait Equipping**: Player can equip NPC innate traits into active slots
- **Trait Sharing**: Player can share traits with NPCs through dedicated slots
- **UI Integration**: Complete tabbed interface with responsive design
- **Redux Architecture**: Full state management with cross-system coordination

### 9.2. Architecture Readiness ✅ PREPARED
- **Copy System Integration**: Framework prepared for Copy trait inheritance
- **Advanced Mechanics**: Architecture ready for trait combinations and synergies
- **Progression Systems**: Integration points established for attribute and skill systems
- **Future Enhancements**: Extensible design supporting planned trait features

### 9.3. Migration Notes ✅ COMPLETED
- **Simplified Lifecycle**: Moved from complex acquisition/permanence system to streamlined Discover -> Equip -> Resonate flow
- **State Consolidation**: Player permanent traits moved to PlayerSlice for better organization
- **Removed Deprecated Systems**: Eliminated separate "Make Permanent" actions and obsolete `permanenceCost` field
- **Discovery Integration**: Automatic trait discovery through NPC interactions

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

The Trait System provides a comprehensive foundation for character customization and progression through the streamlined Discover -> Equip -> Resonate lifecycle. The implementation demonstrates mature React development practices while supporting complex game mechanics through the simplified trait acquisition flow and cross-feature integration.
