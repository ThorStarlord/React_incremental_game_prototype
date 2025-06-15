# Essence System Specification

This document outlines the design and mechanics of the Essence system in the game. Essence is the core metaphysical resource representing potential, connection, and the capacity for influence and growth.

**Implementation Status**: ✅ **UI IMPLEMENTED + STATE MANAGEMENT + PASSIVE GENERATION** - Complete Essence management interface with integrated display components, generation tracking, statistics dashboard, Redux state management, and active passive generation based on NPC connections.

## 1. Overview

*   **Purpose:** Essence fuels the player's unique abilities related to emotional connection, trait manipulation, and the creation/enhancement of Copies. It serves as the primary currency for advanced progression and interaction mechanics.
*   **Core Loop:** Establish Emotional Connections -> Generate Essence passively -> Spend Essence on Trait Resonance, **Accelerated Copy Growth**, and potentially other upgrades.

**UI Implementation**: ✅ **COMPLETE** - `EssencePage` provides a comprehensive interface for all Essence-related functionality with integrated components, statistics tracking, and a manual generation button for testing.

## 2. Essence Sources

*   **Primary Source: Emotional Connection** ✅ **IMPLEMENTED**
    *   **Formation:** Connections are established and deepened through meaningful interactions with targets (NPCs).
    *   **Connection Depth:** The strength of the connection is tracked via `connectionDepth` and `relationshipValue` on the NPC object. These values directly influence Essence generation.
    *   **Generation:** Essence is generated passively over time based on active NPC relationships. The rate is calculated using relationship values and connection depths.
*   **Secondary Sources:**
    *   **Manual Actions:** Manual Essence gain through a dedicated button on the `EssencePage` for testing and prototyping.
    *   **Rewards:** One-time gains from quests, achievements, etc. (Planned).

## 3. Essence Generation Mechanics ✅ FULLY IMPLEMENTED

*   **Connection-Based Generation:** ✅ **ACTIVE**
    *   Passive, continuous generation from all active emotional connections with NPCs
    *   The `isGenerating` flag in the `EssenceState` defaults to `true` and is automatically managed
    *   Generation occurs every game loop tick when the game is running
*   **Rate Calculation:** ✅ **IMPLEMENTED**
    *   The total passive generation rate is calculated based on the **`connectionDepth`** of each NPC, making each level of connection a significant milestone.
    *   The formula is: `Total Rate = BASE_RATE + Σ (for each NPC: connectionDepth * NPC_CONTRIBUTION_MULTIPLIER)`
    *   Base generation rate provides minimum essence per second
*   **Game Loop Integration:** ✅ **IMPLEMENTED**
    *   `generateEssenceThunk` is called automatically during game loop ticks
    *   Generation respects game speed multipliers and pause states
    *   Smooth, consistent generation tied to actual elapsed time
*   **Real-time Updates:** ✅ **IMPLEMENTED**
    *   Generation rate recalculated when NPC relationships change
    *   UI displays current generation rate and updates in real-time
    *   Last generation timestamp tracked for accurate calculations
*   **Multipliers:**
    *   Global multipliers from player traits (e.g., social traits affecting essence generation) can be applied to the total rate
    *   NPC-specific multipliers based on relationship types or special conditions
*   **Recalculation Trigger:** The `updateEssenceGenerationRateThunk` is called automatically whenever an NPC's relationship value "levels up" their connection depth, ensuring the generation rate is always synchronized.
*   **Offline Progress:** Calculate passive generation based on connection rates and global multipliers while the game is closed (Planned for future implementation)

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
- **Manual Generation**: ✅ **IMPLEMENTED** - Integrated `ManualEssenceButton` for testing and prototyping
- **Generation Tracking**: EssenceGenerationTimer component for passive generation monitoring
- **Statistics Dashboard**: Complete overview of Essence metrics and generation rates
- **NPC Connections**: Display of active connections contributing to generation
- **Future Features Preview**: Clear indication of planned Essence system enhancements

### 5.2. Component Integration ✅ IMPLEMENTED

**Existing Component Integration**: Seamless integration of established Essence UI components
```typescript
// ✅ Integrated components
<EssenceDisplay />           // Current Essence amount and visual representation
<ManualEssenceButton />      // ✅ IMPLEMENTED - Manual Essence generation button added to EssencePage.tsx
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
*   **Manual Generation**: ✅ **IMPLEMENTED** - Testing interface with `ManualEssenceButton` on EssencePage for development and prototyping
*   **Statistics Tracking**: ✅ **NEWLY IMPLEMENTED** - Comprehensive metrics dashboard with current amount, total collected, generation rate, and per-click values
*   **Cost Indication**: 📋 **READY FOR INTEGRATION** - Architecture prepared for clear indication of Essence costs for actions (tooltips, confirmation dialogs)
*   **Visual Feedback**: ✅ **IMPLEMENTED** - Visual feedback for gaining/spending Essence through UI updates and number formatting
*   **Future Integration**: 📋 **PLANNED** - Interface prepared for advanced Essence features including emotional connections and trait acquisition

## 7. Game Loop Integration ✅ IMPLEMENTED

### 7.1. Passive Generation System ✅ ACTIVE

**Automatic Generation**: Essence generation is now fully automated and integrated with the game loop
- **Tick-Based Generation**: `generateEssenceThunk` called during game loop ticks
- **Time-Based Calculation**: Generation based on actual elapsed time since last update
- **Game Speed Integration**: Respects game speed multipliers and pause states
- **Performance Optimized**: Efficient generation calculations with minimal overhead

**State Management**: Complete integration with Redux state
- **Generation Rate Tracking**: Current generation rate stored and updated automatically
- **Last Generation Time**: Timestamp tracking for accurate time-based calculations
- **Generation Status**: `isGenerating` flag indicates active/inactive generation state
- **Error Handling**: Robust error handling for generation failures

### 7.2. NPC Relationship Integration ✅ IMPLEMENTED

**Dynamic Rate Calculation**: Generation rate updates based on NPC relationships
- **Relationship Tracking**: Monitors all NPC relationship values and connection depths
- **Automatic Recalculation**: Rate recalculated when relationships change
- **Multi-Source Generation**: Combines base generation with NPC-based generation
- **Real-time Feedback**: UI updates immediately when generation rate changes

## 8. Technical Implementation ✅ COMPLETE

### 8.1. Component Architecture
- **Location**: `src/pages/EssencePage.tsx`
- **Integration**: Complete integration with existing Essence UI components
- **State Management**: Redux Toolkit integration with selectEssence selector
- **Performance**: Memoized component with efficient rendering patterns

### 8.2. Feature Integration
- **Navigation**: Full integration with VerticalNavBar and MainContentArea
- **Routing**: Proper route handling in page shell architecture
- **State Synchronization**: Real-time updates from Essence Redux state
- **Error Handling**: Robust error boundaries and graceful degradation
- **Game Loop**: Seamless integration with GameLoop system for passive generation

### 8.3. Development Status
- **Current Functionality**: Complete UI for existing Essence features with active passive generation
- **Testing Interface**: ✅ **IMPLEMENTED** - Manual generation button (`ManualEssenceButton`) added to EssencePage for development and testing
- **Future Readiness**: Architecture prepared for advanced Essence mechanics including offline progress
- **Documentation**: Clear indication of implemented vs. planned features

## 9. Future Enhancements 📋 PLANNED

### 9.1. Advanced Generation Features
- **Offline Progress**: Calculate passive generation during game closure
- **Generation Multipliers**: Trait-based and achievement-based generation bonuses
- **Connection Quality**: Different types of relationships providing varied generation rates
- **Generation Events**: Special events or milestones that boost generation temporarily

### 9.2. Enhanced UI Features
- **Generation History**: Charts and graphs showing generation over time
- **Connection Details**: Detailed breakdown of each NPC's contribution to generation
- **Generation Predictions**: Forecasting future essence based on current connections
- **Efficiency Metrics**: Analysis of essence generation vs. spending patterns

The Essence System now provides a complete, actively generating resource system that forms the core of the game's progression mechanics. The implementation demonstrates the successful integration of passive generation, NPC relationships, and game loop systems while maintaining excellent performance and user experience standards.
