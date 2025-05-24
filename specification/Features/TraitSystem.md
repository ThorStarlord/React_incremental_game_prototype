# Trait System Specification

This document details the design and mechanics of the Trait system, which allows players to customize their character and influence others (**including NPCs and Copies**) with passive bonuses and unique effects.

## 1. Overview

*   **Purpose:** Traits provide passive modifications to character stats, abilities, or game mechanics. They allow for build diversity, character customization, and influencing NPCs/**Copies**.
*   **Core Loop:** Discover/Target -> Acquire -> Equip / Make Permanent / Share (with NPCs/**Copies**).

**Implementation Status**: ✅ **UI IMPLEMENTED** - Complete trait management interface with click-based interactions, tabbed navigation, and accessibility features.

## 2. Trait Acquisition

*   **Primary Method: Emotional Connection & Resonance**
    *   The player can acquire traits observed in targets (NPCs, potentially enemies, or even abstract concepts) by establishing an "Emotional Connection" and spending Essence to resonate with and copy the trait's underlying pattern.
*   **Other Acquisition Methods:**
    *   Completing specific quests or achievements might grant certain traits directly.
    *   (Future) Research or crafting systems could yield traits.
*   **Requirements:** Conditions needed before a trait can be acquired (applies mostly to non-resonance methods or specific resonance targets).
    *   Minimum player level.
    *   NPC relationship level (for traits offered by NPCs).

## 3. Trait Slots ✅ IMPLEMENTED

*   **Concept:** Players have a limited number of slots to equip active traits for themselves. Shared slots for targets (**NPCs and Copies**) are handled separately (See Section 7).
*   **Base Slots:** Player starts with a base number of slots (e.g., 1-2, defined in `PlayerInitialState`).
*   **Leveling Slots:** Additional slots are unlocked upon reaching specific player levels (Defined in `PlayerSystem.md` / `gameConstants.ts`).
*   **Free Trait Slots (Essence-Based):**
    *   Additional slots are unlocked passively as the player reaches certain thresholds of **Total Essence Earned** or perhaps **Current Essence Level** (TBD - Total Earned feels more permanent).
    *   **Thresholds/Curve:** Define the specific Essence amounts needed for each free slot (e.g., Slot 1 at 1k Essence, Slot 2 at 10k, Slot 3 at 100k - needs balancing).
*   **Maximum Slots:** Define the total maximum number of equippable trait slots for the player (e.g., 10-15).
*   **Equipping/Unequipping:** ✅ **IMPLEMENTED** - Assigning acquired traits to player slots uses click-based interactions and can be done at any time outside of combat.

### 3.1. Slot Interaction Implementation ✅ COMPLETED

**Click-Based System**: Replaced drag-and-drop with accessible click interactions
- **Empty Slot Click**: Opens trait selection dialog with available traits
- **Equipped Trait Click**: Directly unequips the trait with confirmation
- **Visual Feedback**: Clear hover states and action indicators
- **Accessibility**: Full keyboard navigation and ARIA support
- **Error Prevention**: Locked slots clearly indicate unlock requirements

## 4. Trait Permanence

*   **Concept:** The player can use a special ability, likely unlocked via progression, called "Make Permanent" or similar. This ability targets an acquired trait.
*   **Mechanics:**
    *   Consumes a significant amount of Essence.
    *   The original acquired trait remains available to be equipped or shared if desired (TBD - or is the "template" consumed/marked as permanent?). *Decision:* Keep the template available.
*   **Essence Cost Scaling:** The cost to make a trait permanent scales based on:
    *   **Trait Power/Rarity:** More potent traits cost significantly more to make permanent.
    *   **Target Power Level (Optional):** The power level of the original source target *might* influence the permanence cost (TBD - adds complexity, maybe omit initially).
*   **Target Scope:**
    *   Can primarily target traits the player possesses for self-permanence.
    *   *Question:* Can this ability be used on NPCs or **Copies** directly to make one of *their* traits permanent for *them*? (Potentially very powerful, needs careful consideration. Maybe a high-tier upgrade or separate ability). *Decision:* Initially, only for player self-permanence.

## 5. Trait Types & Categories

*   **Categorization:** (Standard RPG categories)
    *   `Combat`: Affecting damage, defense, speed, etc.
    *   `Physical`: Affecting health, stamina, physical resistance.
    *   `Social`: Affecting NPC interactions and relationships
*   **Rarity/Potency:** Classification affecting power, cost (acquisition/permanence), and potentially acquisition difficulty.
    *   Common, Rare, Epic, Legendary
    *   (Potentially unique/artifact tiers)

## 6. Trait List (Examples - Needs Expansion)

*   **Growing Affinity:** ✅ **IMPLEMENTED** - Trait example included in current trait definitions

## 7. UI/UX Implementation ✅ COMPLETED

The trait system UI has been fully implemented with modern, accessible patterns:

### 7.1. Component Architecture ✅ IMPLEMENTED

**TraitSystemWrapper**: ✅ **IMPLEMENTED** - Main container with standardized MUI tabbed navigation
- **Tab Navigation**: Uses the universal MUI tabs strategy
- **Content Organization**: Clear separation of trait management functions
- **Performance Optimized**: Memoized components and selectors

**TraitSlots**: ✅ **IMPLEMENTED** - Click-based slot management system
- **Interaction Pattern**: Click empty slot → trait selection dialog, click equipped trait → unequip
- **Visual Design**: Clear slot states (empty, equipped, locked)
- **Accessibility**: Full keyboard navigation and screen reader support
- **Error Prevention**: Locked slots show unlock requirements

**TraitManagement**: ✅ **IMPLEMENTED** - Trait acquisition and permanence interface
- **Acquisition Interface**: Browse and acquire available traits
- **Permanence System**: Make traits permanent with Essence cost display
- **Cost Transparency**: Clear indication of affordability and requirements

**TraitCodex**: ✅ **IMPLEMENTED** - Comprehensive trait reference
- **Discovery Tracking**: Shows discovered vs. unknown traits
- **Detailed Information**: Complete trait descriptions and effects
- **Search/Filter**: Easy navigation through trait collection

### 7.2. Tabbed Navigation System ✅ IMPLEMENTED

The trait system uses the standardized MUI tabs approach for consistent navigation:

```typescript
// ✅ Implemented tab structure
const traitTabs = [
  { id: 'slots', label: 'Equipped Traits', icon: AssignmentIcon },
  { id: 'manage', label: 'Manage Traits', icon: BuildIcon },
  { id: 'codex', label: 'Trait Codex', icon: BookIcon }
];
```

**Benefits Achieved**:
- **Consistent UX**: Uniform behavior across all features
- **Accessibility**: Built-in keyboard navigation and ARIA support  
- **Performance**: Optimized rendering with conditional content loading
- **Maintainability**: Reusable components and patterns

### 7.3. Interaction Improvements ✅ IMPLEMENTED

**Removed Drag & Drop**: Eliminated complex drag-and-drop interactions in favor of:
- **Click-Based Actions**: Simple, intuitive click interactions
- **Modal Dialogs**: Clear selection and confirmation interfaces
- **Visual Feedback**: Immediate response to user actions
- **Mobile Compatibility**: Touch-friendly interaction patterns

**Enhanced Accessibility**:
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Focus Management**: Logical focus order and visible indicators
- **High Contrast**: Support for high contrast themes

### 7.4. State Management Integration ✅ IMPLEMENTED

**Redux Integration**: Proper state management following established patterns
- **Typed Hooks**: useAppSelector and useAppDispatch with full type safety
- **Memoized Selectors**: Efficient state access with createSelector
- **Action Creators**: Clean action dispatching for trait operations
- **Error Handling**: Proper error states and user feedback

**Performance Optimizations**:
- **React.memo**: Applied to prevent unnecessary re-renders
- **useCallback**: Memoized event handlers for stable references
- **Conditional Rendering**: Tab content loaded only when active
- **Selector Optimization**: Memoized derived state calculations

### 7.5. User Experience Features ✅ IMPLEMENTED

**Confirmation Dialogs**: For important actions like trait acquisition and permanence
- **Cost Display**: Clear indication of Essence costs and current affordability
- **Requirements Check**: Validation of prerequisites before actions
- **Cancellation Options**: Easy way to abort operations

**Visual Indicators**: Comprehensive status display
- **Permanent Traits**: Special styling for permanent trait status
- **Cost Affordability**: Color-coded cost display (green/red)
- **Slot Status**: Clear indication of empty, equipped, and locked slots
- **Loading States**: Proper loading indicators during operations

**Error Prevention**: User-friendly constraint handling
- **Locked Slots**: Clear messaging about unlock requirements
- **Insufficient Resources**: Prevention of actions that can't be completed
- **Validation**: Client-side validation before state changes

### 7.6. Component Cleanup ✅ COMPLETED

**Removed Obsolete Components**: Eliminated unnecessary fallback components
- **TraitSlotsFallback**: Removed as no longer needed with stable click interactions
- **Legacy Drag Handlers**: Cleaned up unused drag-and-drop event handlers
- **Unused Imports**: Removed dependencies on drag-and-drop libraries

**Code Organization**: Improved structure and maintainability
- **Feature-Sliced**: All components properly organized within feature structure
- **Barrel Exports**: Clean public API through index.ts
- **Type Safety**: Comprehensive TypeScript integration
- **Documentation**: JSDoc comments for complex functions

## 8. Integration with Other Systems ✅ READY

### 8.1. Redux Store Integration ✅ IMPLEMENTED
- **TraitsSlice**: Complete Redux slice with actions and reducers
- **Selectors**: Memoized selectors for efficient data access
- **Thunks**: Async actions for complex trait operations
- **Type Safety**: Full TypeScript integration throughout

### 8.2. Feature Interoperability ✅ DESIGNED
- **Essence System**: Integration ready for trait acquisition costs
- **Player System**: Ready to apply trait effects to player stats
- **NPC System**: Architecture prepared for trait sharing mechanics
- **Copy System**: Framework in place for trait inheritance

### 8.3. Navigation Integration ✅ PHASE 1 READY
- **Navigation Compatibility**: Trait system fully compatible with DesktopNavBar navigation
- **TabId Integration**: 'traits' TabId properly configured in navigation system
- **Implementation Status**: Marked as implemented in navigation configuration
- **Route Coordination**: Trait routes coordinate seamlessly with navigation primitives
- **Section Organization**: Properly categorized in 'character-management' section

### 8.4. Future Enhancements 📋 PLANNED
- **Advanced Filtering**: Enhanced search and categorization in Codex
- **Trait Combinations**: System for trait synergies and combinations
- **Visual Effects**: Particle effects and animations for trait activation
- **Sound Integration**: Audio feedback for trait-related actions
- **Global Navigation**: Enhanced integration with Phase 2 navigation components

## 9. Technical Implementation Status ✅ COMPLETED

### 9.1. Architecture Compliance ✅ VERIFIED
- **Feature-Sliced Design**: Proper organization within src/features/Traits/
- **Material-UI Integration**: Consistent use of MUI components and theming
- **TypeScript Safety**: Comprehensive type definitions and usage
- **Accessibility Standards**: WCAG 2.1 AA compliance achieved

### 9.2. Performance Characteristics ✅ OPTIMIZED
- **Rendering Efficiency**: Memoized components prevent unnecessary updates
- **State Management**: Efficient Redux patterns with minimal overhead
- **User Interactions**: Responsive feedback within 200ms performance target
- **Memory Usage**: Proper cleanup and efficient component lifecycle

### 9.3. Testing Readiness ✅ STRUCTURED
- **Component Structure**: Testable component architecture
- **State Management**: Predictable Redux patterns for testing
- **User Interactions**: Clear event handling for integration tests
- **Accessibility**: Structure ready for a11y testing

The Trait System UI implementation is complete and provides a solid foundation for the trait mechanics, offering an intuitive, accessible, and performant user experience that aligns with the overall game architecture.
