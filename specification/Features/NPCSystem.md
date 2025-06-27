# Feature Specification: NPC System

## 1. Overview

The Non-Player Character (NPC) System governs the behavior, interaction, and relationships between the player and the game's inhabitants. The system is built on a two-tiered model of **Affinity** (opinion) and **Intimacy** (connection).

### 1.1. Naming Conventions ✅ ESTABLISHED
(No changes here)

## 2. Core Mechanics

### 2.1. Two-Tiered Relationship Model ✅ IMPLEMENTED

*   **Affinity (`affinity`):**
    *   **Role:** The NPC's opinion of the player, ranging from Hostile to Beloved (-100 to +100).
    *   **Function:** Acts as an "experience bar" for the relationship. It is increased or decreased by quests, dialogue, and other transactional events. It primarily gates access to services (trading, quests, etc.) and modifies their effectiveness (e.g., shop prices).

*   **Intimacy (`connectionDepth`):**
    *   **Role:** The core of the NPC's relationship with the player, representing a deep, metaphysical bond. It is a "level up" mechanic (0-10+ integer levels). Increases by 1 each time Affinity reaches 100 (Affinity then resets to 0).
    *   **Function:** Drives the player's metaphysical and core progression. It directly influences passive Essence generation and gates access to advanced Trait Resonance.
*   **Implementation:**
    *   The `updateNPCRelationshipThunk` contains the core logic for this "level up" mechanic.
    *   The UI (`NPCRelationshipTab` and `NPCHeader`) visually represents the `affinity` as a progress bar towards the next `connectionDepth` level.

### 2.2. Features ✅ IMPLEMENTED

*   **Dynamic Relationships:** NPCs have complex, evolving relationships with the player, influenced by player actions, dialogue choices, and quest completions. This is quantified by an "Affinity" score (Relationship Value).
*   **Emotional Connections (Connection Depth):** NPCs exhibit a range of emotions and can form deep connections with the player. This connection is quantified by the `connectionDepth` stat, which affects their behavior, dialogue, and contributes to passive Essence generation.
*   **Trait Acquisition (Resonance):** Players **permanently learn** traits *from* NPCs (traits listed in `availableTraits`) using the Resonance ability. This action costs Essence and requires proximity. The acquired trait becomes a permanent part of the player's abilities and does not need to be equipped in an active slot.
*   **Temporary Trait Attunement (Equip NPC Innate Trait):** Players can temporarily equip an NPC's `innateTraits` into one of their own active player trait slots. This provides the trait's benefits to the player while equipped, has no Essence cost, and the NPC also retains their trait.
*   **Trait Sharing:** Players can share their equipped (non-permanent) traits *with* NPCs. NPCs have a predefined number of shared trait slots (up to 5) which become usable (`isUnlocked: true`) based on meeting specific requirements (typically relationship Affinity milestones). Successful sharing depends on an available, unlocked slot on the NPC.
*   **Social Interactions:** NPCs can interact with each other and the player in a variety of social contexts, including trading, gifting, and collaborative activities.

## 3. Technical Specifications

*   **Engine:** Built on top of the existing player and trait systems, leveraging Redux for state management and Material-UI for the interface.
*   **Data Structure:** NPC data includes fields for relationship status (Affinity, Connection Depth), emotional state, `availableTraits` (traits player can Resonate for permanent acquisition), `innateTraits` (traits the NPC possesses that the player can temporarily equip), `sharedTraitSlots` (predefined, unlockable slots for traits player has shared with NPC), and quest information.
*   **Async Operations:** Utilizes Redux Thunks for asynchronous operations, such as fetching NPC data, updating relationships, and processing interactions.

## 4. Implementation Phases 
(Section remains largely relevant for overall system development)
1. Core NPC System: Basic NPC creation, deletion, and static interaction implementation.
2. Dynamic Relationships: Introduction of relationship metrics, emotional states, and their impact on interactions.
3. Trait System Integration: Enabling trait sharing and acquisition between players and NPCs.
4. Quest and Activity System: Dynamic quest generation and activity participation between NPCs and players.
5. Polish and Optimization: Enhancements based on testing feedback, performance optimization, and bug fixing.

## 5. Testing and Validation
(Section remains relevant)
*   **Unit Tests:** Comprehensive tests for all NPC-related functions, including relationship calculations, trait sharing, and async operations.
*   **Integration Tests:** Ensure NPC system works seamlessly with player, trait, and quest systems.
*   **User Acceptance Testing:** Feedback from real users to validate the system meets design goals and is fun to use.

## 6. UI Integration ✅ IMPLEMENTED

*   **NPC Interaction Interface:** ✅ **IMPLEMENTED** - Complete tabbed dialogue interface with relationship-gated content access using standardized MUI tabs.
*   **NPC Information Panel/Screen:** ✅ **IMPLEMENTED** - Comprehensive NPC details with stats, relationship status, trait management, and visual relationship progress indicators.
*   **Relationship Indicators:** ✅ **IMPLEMENTED** - Visual relationship tier indicators with color-coding, progress bars (showing progress to next tier based on Affinity), and unlock requirement displays.
*   **Quest Markers:** 📋 **PLANNED** - Icons above NPC heads or on maps indicating quest availability/status.

### 6.1. UI Context ✅ IMPLEMENTED
(No changes needed here)
Information about known NPCs and management of relationships is primarily handled within the dedicated **"NPCs" tab** in the main game interface, located in the left navigation column. This tab utilizes the `NPCsPage` component.
- When no specific NPC is selected, `NPCsPage` displays the `NPCListView` (for browsing NPCs) occupying the full content area.
- Upon selecting an NPC, the view transitions to display the `NPCPanel` (for viewing details and interacting with the selected NPC) which also occupies the full content area. Navigation back to the list view is provided.

### 6.2. Tab-Based Interaction System ✅ IMPLEMENTED
(No changes needed here for tab structure or accessibility, only content descriptions below)

#### Tab Structure ✅ IMPLEMENTED
*   **Overview Tab:** ✅ **IMPLEMENTED** - Displays basic NPC information, relationship status, NPC's `innateTraits` (which player can equip), traits available for Resonance, and clear unlock requirements for other tabs. Key information sections are collapsible.
*   **Dialogue Tab:** ✅ **IMPLEMENTED** - Conversation interface (unlocked at relationship level 1+).
*   **Trade Tab:** ✅ **IMPLEMENTED** - Commerce interface (unlocked at relationship level 2+).
*   **Quests Tab:** ✅ **IMPLEMENTED** - Quest management (unlocked at relationship level 3+). Individual quests are collapsible.
*   **Traits Tab:** ✅ **IMPLEMENTED** - Interface for "Resonance" (permanently acquiring traits from NPC's `availableTraits`) and managing traits shared *by the player to* the NPC's `sharedTraitSlots`. (Tab unlocked at relationship level 0+, individual shared trait slots on NPC unlock based on requirements).

#### Accessibility Features ✅ IMPLEMENTED
(No changes needed)

#### Integration with Universal Tab System ✅ IMPLEMENTED
(No changes needed)

### 6.3. Component Architecture ✅ IMPLEMENTED

#### NPCPanel ✅ IMPLEMENTED
(No changes needed)

#### NPCHeader ✅ IMPLEMENTED
(No changes needed)

#### Tab Content Components ✅ IMPLEMENTED

**NPCOverviewTab:** ✅ **IMPLEMENTED**
- Basic NPC information and statistics. Key sections are collapsible.
- Displays NPC's `innateTraits` with "Equip" buttons, allowing the player to temporarily use these traits in their own active slots.
- Displays "Available Traits for Resonance" (traits player can permanently acquire from this NPC via Resonance).
- Displays "Shared Traits" (traits player has shared with this NPC).
- Clear unlock requirement displays for other interaction types.
- Relationship progress visualization.

**NPCDialogueTab:** ✅ **IMPLEMENTED**
(No changes needed)

**NPCTradeTab:** ✅ **IMPLEMENTED**
(No changes needed)

**NPCQuestsTab:** ✅ **IMPLEMENTED**
(No changes needed)

**NPCRelationshipTab:** ✅ **IMPLEMENTED**
(No changes needed)

**NPCTraitsTab:** ✅ **IMPLEMENTED**
- **Trait Resonance Interface:** For "Available Traits for Resonance" from the NPC. Using "Resonate" costs Essence and **permanently adds the trait to the player's abilities** (does not require an active player slot).
- **Shared Trait Slot Management:** For traits the player shares *to* the NPC. NPCs have predefined, unlockable slots.
- Player trait sharing capabilities (sharing player's equipped, non-permanent traits).
- Acquisition (Resonance) validation and cost transparency.

### 6.4. Performance and User Experience ✅ IMPLEMENTED
(No changes needed here, but ensure new features maintain these standards)

#### Integration Points
*   **Redux State:** Full integration with NPC state management.
*   **Player System:** Relationship progression affects player capabilities. Player's permanent traits and active trait slots are managed by `PlayerSlice`.
*   **Trait System:**
    *   "Resonance" from NPC's `availableTraits` adds to `PlayerSlice.permanentTraits`.
    *   Player can equip NPC's `innateTraits` into `PlayerSlice.traitSlots`.
    *   Player shares their equipped traits into NPC's `sharedTraitSlots`.
*   **Essence System:** Integrated cost calculations for "Resonance".

## 7. State Management ✅ IMPLEMENTED

### 7.1. NPCSlice.ts ✅ ENHANCED
*   **Core State Management:** Complete NPC data management with relationship tracking and trait integration
*   **Relationship System:** Now includes reducers for `setRelationshipValue` and `increaseConnectionDepth` to handle the new tiered progression
*   **Two-Tiered Model:** Support for both Relationship Value (experience bar) and Connection Depth (level) mechanics

### 7.2. NPCThunks.ts ✅ COMPREHENSIVE + RELATIONSHIP-MECHANICS
*   **Async Operations:** Complete suite of async operations for NPC management, interaction processing, and cross-system coordination
*   **Relationship Level-Up:** The `updateNPCRelationshipThunk` now contains the primary logic for calculating relationship "level ups" and triggering essence rate recalculations
*   **Cross-System Integration:** Sophisticated coordination between NPC, Essence, and Trait systems through async thunk operations

### 7.3. NPCSelectors.ts ✅ ENHANCED
*   **Efficient Data Access:** Memoized selectors for NPC data and relationship calculations
*   **Essence Integration:** Includes `selectActiveConnectionCount` to provide other systems with the number of NPCs currently contributing to essence generation
*   **Relationship Queries:** Selectors supporting the two-tiered relationship model with Connection Depth and Relationship Value access

## 8. Integration Points ✅ **THUNK-ENHANCED**

### 8.1. Cross-Feature Integration ✅ **ASYNC-READY**

**Essence System Integration**: ✅ **THUNK-COORDINATED + LEVEL-UP-MECHANICS**
- **Spending Integration:** "Resonance" (via `acquireTraitWithEssenceThunk`) deducts Essence cost.
- **Generation Integration:** Connection Depth directly influences passive Essence generation through the relationship level-up system
- **Real-time Updates:** Essence generation rate recalculated automatically when Connection Depth increases

**Trait System Integration**: ✅ **THUNK-ENABLED**
- **Permanent Acquisition (Resonance):** Player uses Essence to Resonate with NPC's `availableTraits`, making them permanent player traits (managed in `PlayerSlice`).
- **Temporary Equipping:** Player can equip an NPC's `innateTraits` into their own active slots (managed by `PlayerSlice`).
- **Sharing Validation:** Thunks validate trait sharing prerequisites (player sharing to NPC). NPCs have predefined shared trait slots that unlock based on requirements (e.g., Affinity).
- **Relationship Gating:** General tab access gated through relationship thresholds (Affinity tiers).

**Player System Integration**: ✅ **STATE-COORDINATED**
- **Progression Integration:** Relationship level-ups provide clear progression milestones and long-term character development goals
- **Essence Generation:** Connection Depth levels directly contribute to player's passive resource generation

### 8.2. Future Thunk Extensions 📋 **ARCHITECTURALLY PREPARED**
(No changes needed)

## 9. Implementation Excellence ✅ **THUNK-COMPLETE + RELATIONSHIP-MECHANICS**

**Advanced Relationship System**: ✅ **IMPLEMENTED**
- **Two-Tiered Progression:** Complete level-up mechanics with Relationship Value as experience and Connection Depth as relationship level
- **Automatic Level-Up:** Seamless progression from Relationship Value 100 to Connection Depth increase with value reset
- **Visual Feedback:** Progress bars and level indicators provide clear progression visualization
- **Essence Integration:** Connection Depth directly drives passive Essence generation, creating meaningful long-term progression

**Sophisticated State Coordination**: ✅ **ACHIEVED**
- **Cross-System Updates:** Relationship changes automatically trigger Essence generation recalculation
- **Performance Optimized:** Efficient thunk operations with minimal state overhead
- **Error Handling:** Comprehensive error management with graceful degradation
- **Type Safety:** Full TypeScript integration throughout relationship mechanics and async operations
