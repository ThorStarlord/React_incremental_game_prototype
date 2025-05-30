# Essence System Specification

This document outlines the design and mechanics of the Essence system in the game. Essence is the core metaphysical resource representing potential, connection, and the capacity for influence and growth.

**Implementation Status**: ✅ **UI IMPLEMENTED + STATE MANAGEMENT** - Complete Essence management interface with integrated display components, generation tracking, statistics dashboard, and Redux state management.

## 1. Overview

*   **Purpose:** Essence fuels the player's unique abilities related to emotional connection, trait manipulation, and the creation/enhancement of Copies. It serves as the primary currency for advanced progression and interaction mechanics.
*   **Core Loop:** Establish Emotional Connections -> Generate Essence passively -> Spend Essence on Influence, Trait Acquisition/Permanence, **Accelerated Copy Growth**, and potentially other upgrades.

**UI Implementation**: ✅ **COMPLETE** - EssencePage provides comprehensive interface for all Essence-related functionality with integrated components and statistics tracking.

## 2. Essence Sources

*   **Primary Source: Emotional Connection** ✅ **IMPLEMENTED**
    *   **Formation:** Connections are established and deepened through meaningful interactions with targets (NPCs, potentially other entities). Key actions include:
        *   Dialogue choices that resonate with the target.
        *   Completing quests or tasks for the target.
        *   Sharing beneficial traits with the target (see Trait System).
        *   Demonstrating understanding or empathy towards the target's goals or state.
    *   **Connection Depth:** The strength of the connection is tracked (details likely in `NPCSystem.md` or `RelationshipSystem.md`). This depth directly influences Essence generation.
    *   **Generation:** Once a connection is formed, Essence is generated passively over time. The rate depends on:
        *   **Target Complexity/Power Level:** More significant or powerful targets generate more base Essence.
        *   **Connection Depth:** Deeper connections yield a higher generation rate.
        *   *(Formula TBD: e.g., `Rate = BaseTargetValue * ConnectionDepthMultiplier * GlobalModifiers`)*
*   **Secondary Sources:**
    *   **Manual Actions:** Potential for minor Essence gain through specific, focused actions (e.g., "Resonate" click action, minimal base gain).
    *   **Rewards:** One-time gains from completing significant quests, achievements, or overcoming major challenges.
    *   **Combat/Defeat:** Minor Essence gain from defeating enemies, representing absorbed potential (less significant than connections).

## 3. Essence Generation Mechanics

*   **Connection-Based Generation:** ✅ **IMPLEMENTED**
    *   Passive, continuous generation from all active emotional connections.
    *   The total passive generation rate is the sum of rates from all individual connections.
*   **Multipliers:**
    *   Global multipliers affecting all Essence generation (e.g., from player traits, temporary buffs, game progression milestones).
    *   Source-specific multipliers (less common, maybe a trait enhancing generation from specific connection types).
    *   Stacking: Define how multipliers combine (likely multiplicative).
*   **Offline Progress:** Calculate passive generation based on connection rates and global multipliers while the game is closed (standard offline progress calculation).

## 4. Essence Costs & Spending (Sinks)

*   **Emotional Influence:** *(Planned for Future Implementation)*
    *   Spending Essence to perform actions that directly (but subtly) influence a target's emotional state or favorability towards the player (e.g., accelerating relationship gain, calming hostility). Cost scales with desired effect intensity and target resistance.
*   **Trait Acquisition:** ✅ **IMPLEMENTED**
    *   **Design Intent:** The primary cost for resonating with and acquiring a trait blueprint from a target. Cost determined by trait rarity/complexity and potentially reduced by connection depth.
    *   **Current Implementation:** The `acquireTraitWithEssenceThunk` implements this, checking for sufficient essence and deducting the `trait.essenceCost`.
*   **Trait Permanence:** ✅ **IMPLEMENTED**
    *   Significant Essence cost to make an acquired trait permanently active for the player without requiring an equip slot.
    *   **Current Implementation:** The `makeTraitPermanentThunk` in `TraitThunks.ts` implements this, using a flat cost (`MAKE_PERMANENT_COST`).
*   **Accelerated Copy Growth:** *(Planned for Future Implementation)*
    *   Spending Essence to speed up the development, training, or task performance of player-created Copies. A significant upfront cost is required to choose the accelerated path upon creation. (See `CopySystem.md`).
*   **Standard Upgrades (Optional):**
    *   If applicable, costs for upgrading secondary mechanics (e.g., manual click power, base offline progress multiplier if not solely connection-driven). These should be less central than the core sinks.
*   **Other Potential Sinks:**
    *   High-level crafting or research.
    *   Unlocking unique abilities or game features tied to Essence manipulation.

## 5. UI/UX Implementation ✅ COMPLETE

### 5.1. EssencePage Component ✅ NEWLY IMPLEMENTED

**Comprehensive Essence Interface**: Complete page implementation integrating all Essence functionality
- **Main Essence Display**: Current amount with visual representation using EssenceDisplay component
- **Manual Generation**: Integrated BasicEssenceButton for testing and prototyping
- **Generation Tracking**: EssenceGenerationTimer component for passive generation monitoring
- **Statistics Dashboard**: Complete overview of Essence metrics and generation rates
- **NPC Connections**: Display of active connections contributing to generation
- **Future Features Preview**: Clear indication of planned Essence system enhancements

### 5.2. Component Integration ✅ IMPLEMENTED

**Existing Component Integration**: Seamless integration of established Essence UI components
```typescript
// ✅ Integrated components
<EssenceDisplay />           // Current Essence amount and visual representation
<ManualEssenceButton />      // Manual Essence generation for testing (referred to as "BasicEssenceButton" in some specs)
<EssenceGenerationTimer />   // Passive generation rate tracking
```

**Redux State Integration**: Complete connection to Essence state management
- **State Selection**: useAppSelector with selectEssence for efficient state access
- **Real-time Updates**: Automatic updates when Essence state changes
- **Performance Optimized**: Memoized component to prevent unnecessary re-renders

### 5.3. User Interface Features ✅ IMPLEMENTED

**Statistics Overview**: Comprehensive metrics display
- **Current Amount**: Real-time display with localized number formatting
- **Total Collected**: Lifetime Essence accumulation tracking
- **Generation Rate**: Per-second passive generation with decimal precision
- **Per Click Value**: Manual generation amount display
- **Active Connections**: NPC connection count affecting generation

**Visual Design**: Material-UI integration with consistent theming
- **Card Layout**: Organized information display with proper spacing
- **Icon Integration**: Semantic icons for different Essence aspects
- **Color Coding**: Primary, secondary, success, and warning colors for different metrics
- **Responsive Grid**: Adaptive layout for different screen sizes

**Development Communication**: Clear indication of current and future functionality
- **Implemented Features**: Current Essence management capabilities clearly displayed
- **Future Features**: Alert section with planned enhancements and timeline
- **Status Indication**: Clear differentiation between implemented and planned functionality

### 5.4. Navigation Integration ✅ COMPLETE

**MainContentArea Integration**: Complete routing integration with page shell architecture
- **Route Handler**: 'essence' TabId properly handled in switch statement
- **Navigation Compatibility**: Full integration with VerticalNavBar navigation system
- **State Management**: Consistent with layout state management patterns
- **Performance**: Efficient rendering with conditional content loading

### 5.5. Architecture Compliance ✅ VERIFIED

**Feature-Sliced Design**: Proper organization following established patterns
- **Page Location**: EssencePage in `src/pages/` following page shell architecture
- **Component Imports**: Clean imports from Essence feature barrel exports
- **Type Safety**: Full TypeScript integration with proper type definitions
- **Error Handling**: Robust error boundaries and fallback states

**Accessibility Standards**: WCAG 2.1 AA compliance
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure
- **Color Independence**: Information conveyed through multiple visual cues
- **Touch Targets**: Minimum target sizes for mobile accessibility

## 6. UI/UX Considerations ✅ IMPLEMENTED

*   **Current Essence Display**: ✅ **IMPLEMENTED** - Clear, prominent display of current Essence total with visual representation
*   **Generation Rate Breakdown**: ✅ **IMPLEMENTED** - Detailed breakdown of current Essence generation rate with timer component
*   **Connection Management**: ✅ **IMPLEMENTED** - Interface for viewing NPC connections and their contribution to generation
*   **Manual Generation**: ✅ **IMPLEMENTED** - Testing interface with BasicEssenceButton for development and prototyping
*   **Statistics Tracking**: ✅ **NEWLY IMPLEMENTED** - Comprehensive metrics dashboard with current amount, total collected, generation rate, and per-click values
*   **Cost Indication**: 📋 **READY FOR INTEGRATION** - Architecture prepared for clear indication of Essence costs for actions (tooltips, confirmation dialogs)
*   **Visual Feedback**: ✅ **IMPLEMENTED** - Visual feedback for gaining/spending Essence through UI updates and number formatting
*   **Future Integration**: 📋 **PLANNED** - Interface prepared for advanced Essence features including emotional connections and trait acquisition

## 9. Technical Implementation ✅ COMPLETE

### 9.1. Component Architecture
- **Location**: `src/pages/EssencePage.tsx`
- **Integration**: Complete integration with existing Essence UI components
- **State Management**: Redux Toolkit integration with selectEssence selector
- **Performance**: Memoized component with efficient rendering patterns

### 9.2. Feature Integration
- **Navigation**: Full integration with VerticalNavBar and MainContentArea
- **Routing**: Proper route handling in page shell architecture
- **State Synchronization**: Real-time updates from Essence Redux state
- **Error Handling**: Robust error boundaries and graceful degradation

### 9.3. Development Status
- **Current Functionality**: Complete UI for existing Essence features
- **Testing Interface**: Manual generation button for development and testing
- **Future Readiness**: Architecture prepared for advanced Essence mechanics
- **Documentation**: Clear indication of implemented vs. planned features

The Essence System UI implementation is complete and provides a comprehensive interface for all current Essence functionality while maintaining readiness for future enhancements including emotional connections, trait acquisition costs, and Copy system integration.
