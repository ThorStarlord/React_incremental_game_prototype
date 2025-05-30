# Feature Specification: NPC System

## 1. Overview

The Non-Player Character (NPC) System governs the behavior, interaction, and relationships between the player and the game's inhabitants. NPCs populate the world, offer quests, provide services, and react to the player's actions.

## 1.1. Naming Conventions ✅ ESTABLISHED

**Feature Folder Structure**: The NPC system follows a specific naming pattern for consistency and clarity:

- **Feature Folder**: `src/features/NPCs/` (plural)
- **Component Files**: Use singular `NPC` prefix (e.g., `NPCPanel.tsx`, `NPCHeader.tsx`, `NPCListView.tsx`)
- **State Files**: Use singular `NPC` prefix (e.g., `NPCTypes.ts`, `NPCSlice.ts`, `NPCSelectors.ts`)
- **Interface Names**: Use singular `NPC` for types (e.g., `NPC`, `NPCState`, `NPCTraitInfo`)
- **Page Components**: Use plural for page-level components (e.g., `NPCsPage.tsx`, `NpcsPage.tsx`)

**Rationale**: 
- **Folder**: `NPCs` 
- **Files**: `NPC` prefix maintains clear semantic meaning for individual entity components
- **Types**: Singular interfaces represent individual entities consistently
- **Pages**: Plural pages indicate management of multiple NPCs

**Implementation Status**: ✅ **CONSISTENTLY APPLIED** across the entire NPC feature following Feature-Sliced Design principles.

## 2. Features

*   **Dynamic Relationships:** NPCs have complex, evolving relationships with the player, influenced by player actions, dialogue choices, and quest completions.
*   **Emotional Connections (Connection Depth):** NPCs exhibit a range of emotions and can form deep connections with the player. This connection is quantified by the `connectionDepth` stat, which affects their behavior, dialogue, and contributes to passive Essence generation.
*   **Trait Sharing and Acquisition:** Players can acquire traits from NPCs (via the Resonance action, requiring sufficient Emotional Connection/Connection Depth), which can then be used to influence other NPCs or enhance the player's abilities.
*   **Social Interactions:** NPCs can interact with each other and the player in a variety of social contexts, including trading, gifting, and collaborative activities.

## 3. Technical Specifications

*   **Engine:** Built on top of the existing player and trait systems, leveraging Redux for state management and Material-UI for the interface.
*   **Data Structure:** NPC data includes fields for relationship status, emotional state, traits, and quest information.
*   **Async Operations:** Utilizes Redux Thunks for asynchronous operations, such as fetching NPC data, updating relationships, and processing interactions.

## 4. Implementation Phases

1. **Core NPC System:** Basic NPC creation, deletion, and static interaction implementation.
2. **Dynamic Relationships:** Introduction of relationship metrics, emotional states, and their impact on interactions.
3. **Trait System Integration:** Enabling trait sharing and acquisition between players and NPCs.
4. **Quest and Activity System:** Dynamic quest generation and activity participation between NPCs and players.
5. **Polish and Optimization:** Enhancements based on testing feedback, performance optimization, and bug fixing.

## 5. Testing and Validation

*   **Unit Tests:** Comprehensive tests for all NPC-related functions, including relationship calculations, trait sharing, and async operations.
*   **Integration Tests:** Ensure NPC system works seamlessly with player, trait, and quest systems.
*   **User Acceptance Testing:** Feedback from real users to validate the system meets design goals and is fun to use.

## 6. UI Integration ✅ IMPLEMENTED

*   **NPC Interaction Interface:** ✅ **IMPLEMENTED** - Complete tabbed dialogue interface with relationship-gated content access using standardized MUI tabs.
*   **NPC Information Panel/Screen:** ✅ **IMPLEMENTED** - Comprehensive NPC details with stats, relationship status, trait management, and visual relationship progress indicators.
*   **Relationship Indicators:** ✅ **IMPLEMENTED** - Visual relationship level indicators with color-coding, progress bars, and unlock requirement displays.
*   **Quest Markers:** 📋 **PLANNED** - Icons above NPC heads or on maps indicating quest availability/status.

### 6.1. UI Context ✅ IMPLEMENTED

Information about known NPCs and management of relationships is primarily handled within the dedicated **"NPCs" tab** in the main game interface, located in the left navigation column. This tab utilizes the `NPCsPage` component, which contains the `NPCListView` for browsing NPCs and the `NPCPanel` for viewing details of a selected NPC with comprehensive tabbed interaction interface.

### 6.2. Tab-Based Interaction System ✅ IMPLEMENTED

The NPC interaction system uses the standardized MUI tabs pattern established in the Trait System for consistent navigation and accessibility:

#### Tab Structure ✅ IMPLEMENTED
*   **Overview Tab:** ✅ **IMPLEMENTED** - Always available, displays basic NPC information, relationship status, available traits, and clear unlock requirements for other tabs
*   **Dialogue Tab:** ✅ **IMPLEMENTED** - Conversation interface with simulated NPC responses (unlocked at relationship level 1+)
*   **Trade Tab:** ✅ **IMPLEMENTED** - Commerce interface with relationship-based pricing discounts (unlocked at relationship level 2+)
*   **Quests Tab:** ✅ **IMPLEMENTED** - Quest management with progress tracking and reward display (unlocked at relationship level 3+)
*   **Traits Tab:** ✅ **IMPLEMENTED** - Trait acquisition and sharing interface with comprehensive slot management (unlocked at relationship level 4+)

#### Accessibility Features ✅ IMPLEMENTED
*   **Keyboard Navigation:** Full arrow key and tab navigation support
*   **Screen Reader Support:** Comprehensive ARIA labels and announcements
*   **Conditional Access:** Clear visual and textual indication of tab availability based on relationship levels
*   **Tooltip Guidance:** Helpful tooltips explaining unlock requirements for disabled tabs

#### Integration with Universal Tab System ✅ IMPLEMENTED
*   **Standardized Components:** Uses `TabContainer`, `StandardTabs`, and `TabPanel` from the shared tab system
*   **State Management:** Consistent tab state management via `useTabs` hook with persistence
*   **Performance Optimized:** Memoized components and efficient conditional rendering
*   **Theme Integration:** Proper Material-UI theming and responsive design

### 6.3. Component Architecture ✅ IMPLEMENTED

#### NPCPanel ✅ IMPLEMENTED
Main container component with relationship-aware tab system:
- **Relationship Gating:** Tabs unlock progressively based on relationship levels
- **Visual Progress:** Relationship progress indicators with color-coded states
- **Efficient Rendering:** Conditional tab content loading for performance
- **Accessibility Compliant:** Full WCAG 2.1 AA compliance

#### NPCHeader ✅ IMPLEMENTED
Comprehensive NPC information display:
- **Avatar System:** Character representation with fallback initials
- **Status Display:** Location, current status, and relationship metrics
- **Progress Visualization:** Linear progress bars for relationship advancement
- **Responsive Design:** Adapts to different screen sizes

#### Tab Content Components ✅ IMPLEMENTED

**NPCOverviewTab:** ✅ **IMPLEMENTED**
- Basic NPC information and statistics
- Trait discovery tracking with visibility indicators
- Clear unlock requirement displays for all interaction types
- Relationship progress visualization

**NPCDialogueTab:** ✅ **IMPLEMENTED**
- Interactive conversation interface with message history
- Simulated NPC responses based on relationship level
- Real-time message composition and sending
- Conversation history with timestamps

**NPCTradeTab:** ✅ **IMPLEMENTED**
- Commerce interface with item browsing
- Relationship-based discount system (up to 20% discount)
- Stock management and availability tracking
- Purchase confirmation and affordability checking

**NPCQuestsTab:** ✅ **IMPLEMENTED**
- Quest discovery and management interface
- Progress tracking with visual progress bars
- Reward preview and requirement validation
- Quest status management (available, accepted, completed)

**NPCTraitsTab:** ✅ **IMPLEMENTED**
- Trait acquisition interface with cost display
- Shared trait slot management system
- Player trait sharing capabilities
- Acquisition validation and cost transparency

### 6.4. Performance and User Experience ✅ IMPLEMENTED

#### Performance Optimizations
*   **React.memo:** Applied to all major components to prevent unnecessary re-renders
*   **useCallback:** Memoized event handlers for stable references
*   **Conditional Rendering:** Tab content loaded only when tabs are active and unlocked
*   **Efficient Selectors:** Memoized Redux selectors for optimal state access

#### User Experience Features
*   **Progressive Disclosure:** Content reveals as relationships deepen
*   **Clear Feedback:** Immediate visual response to all user interactions
*   **Error Prevention:** Validation and confirmation for important actions
*   **Intuitive Navigation:** Consistent interaction patterns across all tabs

#### Integration Points
*   **Redux State:** Full integration with NPC state management
*   **Player System:** Relationship progression affects player capabilities
*   **Trait System:** Seamless trait acquisition and sharing workflows
*   **Essence System:** Integrated cost calculations and affordability checks

## 7. State Management

### 7.1. NPCSlice.ts

The NPC slice manages the state of NPCs in the game, including their relationships with the player, their emotional states, and the quests they are involved in.

#### State Structure
```typescript
interface NPCState {
  npcs: Record<string, NPC>; // Includes connectionDepth for each NPC
  discoveredNPCs: string[];
  currentInteraction: NPCInteraction | null;
  dialogueHistory: DialogueEntry[];
  relationshipChanges: RelationshipChangeEntry[];
  loading: boolean;
  error: string | null;
}
```

#### Reducers
*   **initializeNPCs:** Sets up the NPCs in the game, either from provided data or mock data.
*   **updateNPCRelationship:** Updates the relationship value between the player and an NPC.
*   **updateNpcConnectionDepth:** Updates the connectionDepth stat for an NPC based on interactions.
*   **addDialogueEntry:** Adds a dialogue entry to the history.
*   **startInteraction / endInteraction:** Manage the current interaction session.
*   **clearError:** Clears error states.

#### Selectors
*   **selectNPCById:** Retrieves an NPC by their ID.
*   **selectAllNPCs:** Gets all NPCs, optionally filtered by online status or other criteria.
*   **selectNPCRelationships:** Selects relationship data for NPCs.
*   **selectNPCInteractions:** Selects interaction logs for NPCs.

### 7.2. NPCThunks.ts

The NPCThunks file contains asynchronous thunk actions for complex NPC interactions, such as initializing NPCs, updating relationships, and processing interactions.

#### Core Thunks
```typescript
// ✅ Core async operations implemented
export const initializeNPCsThunk = createAsyncThunk<
  Record<string, NPC>,
  Record<string, NPC> | undefined,
  { state: RootState }
>('npcs/initialize', async (npcData, { rejectWithValue }) => {
  // Initialize NPCs with mock or loaded data
  // Handles data loading and error management
});

export const updateNPCRelationshipThunk = createAsyncThunk<
  { npcId: string; relationshipChange: number; newValue: number },
  { npcId: string; relationshipChange: number; reason?: string },
  { state: RootState }
>('npcs/updateRelationship', async ({ npcId, relationshipChange, reason }, { getState, rejectWithValue }) => {
  // Handles relationship updates with validation and side effects
  // Includes boundary checking and error handling
});

export const processNPCInteractionThunk = createAsyncThunk<
  InteractionResult,
  { npcId: string; interactionType: string; options?: Record<string, any> },
  { state: RootState }
>('npcs/processInteraction', async ({ npcId, interactionType, options }, { getState, dispatch, rejectWithValue }) => {
  // Complex interaction processing with relationship effects
  // Handles dialogue, gifts, quest completion, trading
  // Includes unlock rewards and essence generation
});
```

#### Key Thunk Features Implemented
- **Data Initialization:** NPCs initialization with mock data loading and error handling
- **Relationship Management:** Validated relationship updates with boundary checking (0-100 range)
- **Complex Interactions:** Multi-step interaction processing with side effects and reward calculations
- **Discovery System:** NPC discovery with validation and duplicate prevention
- **Session Management:** Interaction session start/end with availability checking
- **Dialogue Processing:** Dynamic dialogue choice handling with relationship consequences
- **Trait Sharing:** NPC trait sharing with relationship level validation
- **Error Handling:** Comprehensive error management with rejectWithValue patterns
- **State Coordination:** Cross-system integration with essence and trait systems

### 7.3. NPCSelectors.ts

Selectors for retrieving and computing NPC-related state data, optimized for performance with memoization.

#### Example Selectors
```typescript
// ✅ New interaction types for thunk operations
export interface InteractionResult {
  success: boolean;
  relationshipChange?: number;
  essenceGained?: number;
  unlockRewards?: string[];
  message: string;
}

export interface NPCInteraction {
  npcId: string;
  startTime: number;
  interactionType: 'dialogue' | 'trade' | 'quest' | 'trait_sharing';
}

export interface RelationshipChangeEntry {
  id: string;
  npcId: string;
  timestamp: number;
  change: number;
  reason: string;
  newValue: number;
}
```

## 8. Integration Points ✅ **THUNK-ENHANCED**

### 8.1. Cross-Feature Integration ✅ **ASYNC-READY**

**Essence System Integration**: ✅ **THUNK-COORDINATED**
- **Generation Calculation:** Thunks coordinate essence generation from NPC relationships
- **Spending Integration:** Trait acquisition costs handled through thunk operations
- **Reward Distribution:** Interaction rewards properly distribute essence

**Trait System Integration**: ✅ **THUNK-ENABLED**
- **Sharing Validation:** Thunks validate trait sharing prerequisites
- **Relationship Gating:** Trait access gated through relationship thresholds
- **Cross-System Actions:** Thunks coordinate trait operations between systems

**Player System Integration**: ✅ **STATE-COORDINATED**
- **Stat Modifications:** Player stats affected by NPC relationships through thunks
- **Progress Tracking:** Player interaction history managed via thunk operations
- **Achievement Integration:** Player achievements triggered through NPC interactions

### 8.2. Future Thunk Extensions 📋 **ARCHITECTURALLY PREPARED**

**Planned Thunk Operations**:
- **Quest Integration:** questCompletionThunk for quest rewards and relationship effects
- **Copy Creation:** createCopyFromNPCThunk for seduction and copy creation mechanics
- **Advanced Dialogue:** dialogueTreeProgressionThunk for complex conversation systems
- **Trade Operations:** npcTradeTransactionThunk for commerce with relationship pricing
- **Faction Management:** factionRelationshipThunk for group relationship dynamics

**Scalability Architecture**:
- **Plugin Pattern:** Thunk system ready for additional interaction types
- **Event System:** Architecture supports event-driven NPC behavior
- **AI Integration:** Prepared for advanced NPC decision-making systems
- **Persistence:** Thunk operations ready for backend API integration

## 9. Implementation Excellence ✅ **THUNK-COMPLETE**

The NPC system now demonstrates mature async operation patterns with NPCThunks.ts providing:

**Professional Error Handling:** Comprehensive error management with graceful degradation
**State Coordination:** Sophisticated cross-system state management
**Type Safety:** Full TypeScript integration throughout async operations
**Performance:** Optimized thunk operations with minimal overhead
**Maintainability:** Clean, testable async code following Redux Toolkit best practices
**Scalability:** Architecture ready for advanced NPC mechanics and backend integration

The implementation showcases modern React development practices with Redux Toolkit async patterns, providing a solid foundation for complex NPC interactions while maintaining code quality and user experience excellence.
