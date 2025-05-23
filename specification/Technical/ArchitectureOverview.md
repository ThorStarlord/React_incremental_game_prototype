# Technical Architecture Overview

This document provides a high-level overview of the technical architecture, technology stack, and project structure for the React Incremental RPG Prototype.

**Architecture Status**: ✅ **MATURE** - Core architecture implemented with Feature-Sliced Design, Redux Toolkit state management, and comprehensive UI framework.

## 1. Technology Stack ✅ IMPLEMENTED

*   **Frontend Framework:** React (v18+) using functional components and Hooks.
*   **Language:** TypeScript for static typing and improved code quality.
*   **State Management:** Redux Toolkit (RTK) for centralized, predictable state management, leveraging slices, thunks, and selectors. Immer is used internally by RTK for immutable updates. ✅ **SINGLE SOURCE OF TRUTH**
*   **UI Library:** Material UI (MUI) v5+ for pre-built components, styling utilities (`sx` prop, `styled`), and theming.
*   **Navigation:** 
    *   React Router v6+ for client-side routing and navigation.
    *   **MUI Tabs** for universal tab-based navigation within features. ✅ **IMPLEMENTED**
*   **Styling:**
    *   MUI's styling solutions (`sx`, `styled`, Theme).
    *   CSS Modules (`.module.css`) for component-specific styles where needed.
    *   Global styles (`index.css`) for base resets and body styles.
*   **Build Tool:** Create React App (CRA) or Vite. Provides development server, build optimization, and testing setup.
*   **Testing:** Jest and React Testing Library for unit and integration/component testing.

## 2. Project Structure (Feature-Sliced Design) ✅ IMPLEMENTED

The project follows a Feature-Sliced Design approach to promote modularity, scalability, and maintainability.

*   **`src/`**
    *   **`app/`**: ✅ **IMPLEMENTED** - Core application setup (Redux store, global types, hooks like `useAppDispatch`).
    *   **`constants/`**: Global game constants (gameplay values, relationship tiers, etc.).
    *   **`features/`**: ✅ **IMPLEMENTED** - Contains self-contained feature modules following consistent internal structure.
        *   **`GameLoop/`**: ✅ **IMPLEMENTED** - Core timing and game state management
        *   **`Player/`**: ✅ **STATE IMPLEMENTED** - Player character data with comprehensive types and selectors
        *   **`Traits/`**: ✅ **UI IMPLEMENTED** - Complete trait management system with click-based interactions
        *   **`Essence/`**: ✅ **STATE IMPLEMENTED** - Core metaphysical resource management
        *   **`Settings/`**: ✅ **IMPLEMENTED** - User configuration management
        *   **`Meta/`**: ✅ **IMPLEMENTED** - Application metadata and save/load functionality
        *   **`Npcs/`**: ✅ **STATE IMPLEMENTED** - NPC relationship and state management
        *   **Future Features**: `Copy/`, `Quest/` (planned)
    *   **`gameLogic/`**: Core game logic, systems, and calculations not tied to a specific UI feature.
    *   **`hooks/`**: Global/shared custom React hooks.
    *   **`layout/`**: ✅ **IMPLEMENTED** - Global layout components and column structures.
        *   **`columns/`**: ✅ **IMPLEMENTED** - Column-specific layout components
            *   `LeftColumnLayout.tsx`: Persistent status displays and character controls
            *   `MiddleColumnLayout.tsx`: Primary feature content via routing
            *   `RightColumnLayout.tsx`: System feedback and contextual information
            *   `ContextualRightContent.tsx`: State-aware conditional rendering
        *   `GameContainer.tsx`: ✅ **REFACTORED** - Simplified layout structure focus
    *   **`pages/`**: Top-level page components assembling features and layouts for specific routes.
    *   **`routes/`**: ✅ **IMPLEMENTED** - Routing configuration with layout routes.
        *   **`components/`**: Layout route components
            *   `GameLayout.tsx`: ✅ **IMPLEMENTED** - Three-column layout implementation
    *   **`shared/`**: ✅ **IMPLEMENTED** - Reusable components, utilities, hooks, or types used across multiple features.
        *   `components/`
            *   **`Tabs/`**: ✅ **IMPLEMENTED** - Standardized MUI-based tab component system
                *   `StandardTabs.tsx`: Core MUI tabs wrapper
                *   `TabPanel.tsx`: Accessible content panels
                *   `TabContainer.tsx`: Combined tabs + content layout
                *   `index.ts`: Public API exports
        *   `hooks/`
            *   **`useTabs.ts`**: ✅ **IMPLEMENTED** - Custom hook for tab state management
        *   `utils/`
        *   `styles/`
    *   **`theme/`**: MUI theme configuration and custom theme context/provider.
    *   **`types/`**: Global or shared type definitions (though prefer co-location within features).
    *   **`index.tsx`**: Application entry point.
    *   **`index.css`**: Global CSS styles.
    *   **`react-app-env.d.ts` / `vite-env.d.ts`**: TypeScript environment definitions.
    *   **`css.d.ts`**: Type definitions for CSS Modules.

## 3. Layout Architecture ✅ IMPLEMENTED

### Three-Column Layout System
The application uses a responsive three-column layout structure implemented through dedicated layout components:

#### Column Responsibilities ✅ IMPLEMENTED
- **Left Column (`LeftColumnLayout`)**: Status displays and persistent controls
  - Static Components: CompactCharacterPanel, EssenceDisplay, GameControlPanel
  - Dynamic Content: Route-based character management features
  - Outlet: Supports nested routing for character-specific functionality

- **Middle Column (`MiddleColumnLayout`)**: Primary feature content
  - Route-Based Content: All major features loaded via React Router
  - Full Height: Optimized for feature-rich interfaces
  - Outlet: Main content area for routed features

- **Right Column (`RightColumnLayout`)**: System feedback and contextual information
  - Static Components: NotificationLog, SystemMessages
  - Contextual Content: State-based conditional rendering (combat logs, debug panels)
  - Outlet: Additional space for feature-specific information panels

#### GameContainer Refactoring ✅ COMPLETED
**Problem Solved:** Eliminated over-responsibility by delegating content rendering to:
- **Column Layout Components**: Handle static/persistent UI elements
- **Route-Based Loading**: Dynamic feature content via `<Outlet />`
- **Contextual Components**: State-aware conditional rendering
- **Simplified Structure**: GameContainer focuses only on global layout concerns

#### Route-Based Content System ✅ IMPLEMENTED
```typescript
// Route structure for three-column layout
/game (GameLayout)
├── traits (TraitSystemWrapper) // Middle column
├── npcs (NPCInteractionPanel)  // Middle column  
├── quests (QuestLogPanel)      // Middle column
├── copies (CopyManagementPanel) // Middle column
└── character/                   // Left column outlet
    ├── stats (PlayerStatsPanel)
    └── attributes (AttributeAllocationPanel)
```

## 4. State Management Strategy ✅ SINGLE SOURCE OF TRUTH

### 4.1. Redux Toolkit Implementation ✅ IMPLEMENTED
*   **Redux Toolkit:** Used as the single source of truth for global application state.
*   **Slices:** State is divided into logical domains managed by individual slices (e.g., `player`, `traits`, `essence`, `meta`, `settings`, `copies`). Each slice contains its reducer, actions, and potentially related selectors and thunks.
*   **Selectors:** Reselect (`createSelector` via RTK) is used to efficiently derive data from the state and memoize results, preventing unnecessary computations and re-renders. Typed selectors (`useAppSelector`) ensure type safety.
*   **Thunks:** `createAsyncThunk` is used for asynchronous logic, such as saving/loading data, fetching initial game data (if applicable), and complex multi-step actions involving state access.
*   **Immutability:** Enforced via Immer within RTK's `createSlice`. Direct state mutation is avoided.

### 4.2. Context System Resolution ✅ COMPLETED
**Problem Resolved**: Eliminated competing context-based state management
- **Removed**: `context/GameStateExports` dependencies that violated Feature-Sliced Design
- **Implemented**: Direct feature-based type imports following proper patterns
- **Result**: Single source of truth maintained exclusively through Redux Toolkit

**Specific Fixes Applied**:
```typescript
// ❌ Problematic pattern (ELIMINATED)
import { PlayerState } from '../../../context/GameStateExports';

// ✅ Proper Feature-Sliced pattern (IMPLEMENTED)
import type { PlayerState } from '../state/PlayerTypes';
import type { RootState } from '../../../app/store';
```

### 4.3. Type Safety Implementation ✅ COMPLETED
**Feature-Level Type Organization**:
```typescript
// ✅ Implemented pattern
src/features/Player/
├── state/
│   ├── PlayerTypes.ts      // Primary type definitions
│   ├── PlayerSlice.ts      // Slice implementation  
│   └── PlayerSelectors.ts  // Memoized selectors
└── index.ts               // Barrel exports with types
```

**Import Patterns Standardized**:
```typescript
// ✅ Feature-internal imports
import type { PlayerState } from '../state/PlayerTypes';

// ✅ Cross-feature imports via barrel
import type { PlayerState } from '../../Player';

// ✅ Store-level imports
import type { RootState } from '../../../app/store';
```

## 5. Navigation and UI Architecture ✅ IMPLEMENTED

### Tab-Based Navigation Strategy
**Decision:** Universal adoption of MUI `<Tabs>` and `<Tab>` components across all features.

#### Benefits Achieved:
- **Consistency:** Uniform behavior and styling across the application
- **Accessibility:** Built-in keyboard navigation and ARIA support
- **Performance:** Optimized rendering with memoization
- **Maintainability:** Single source of truth for tab behavior

#### Implementation Status: ✅ COMPLETE
- **`StandardTabs`**: Base component wrapping MUI Tabs with enhanced features
- **`TabPanel`**: Content container with accessibility and transition support
- **`TabContainer`**: Complete solution combining tabs with content layout
- **`useTabs`**: Custom hook for consistent state management and persistence

#### Layout Integration ✅ IMPLEMENTED
The column layout system seamlessly integrates with the tab navigation strategy:
- **Feature-Level Tabs**: Each major feature (Traits, NPCs, Quests) uses standardized tabs
- **Column-Aware Routing**: Routes respect column boundaries and content allocation
- **Consistent UX**: Tab behavior remains uniform across different layout contexts

#### Usage Pattern (Implemented):
```typescript
// Feature-level tab implementation within column layout
const TraitSystemWrapper = () => {
  const { activeTab, setActiveTab } = useTabs({
    defaultTab: 'slots',
    tabs: traitTabs,
    persistKey: 'trait_system_tabs'
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <StandardTabs
        tabs={traitTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        aria-label="Trait System Navigation"
      />
      <TabPanel tabId="slots" activeTab={activeTab}>
        <TraitSlots />
      </TabPanel>
      {/* Additional tab panels */}
    </Box>
  );
};
```

#### Interaction Improvements: ✅ IMPLEMENTED
- **Removed Drag & Drop**: Replaced with accessible click-based interactions
- **TraitSlots Enhancement**: Click empty slot → opens selection dialog, click equipped trait → unequips
- **Component Cleanup**: Removed `TraitSlotsFallback` component (no longer needed)
- **Performance Optimization**: Added React.memo, useCallback, and memoized selectors

## 6. Data Flow ✅ OPTIMIZED

1.  **User Interaction:** User interacts with a UI component (e.g., clicks a tab, button, trait slot).
2.  **Event Handler:** Component's event handler triggers.
3.  **Dispatch Action/Thunk:**
    *   For synchronous state changes: Dispatches a Redux action (e.g., `dispatch(acquireTrait('trait_id'))`).
    *   For asynchronous operations or complex logic: Dispatches a thunk (e.g., `dispatch(saveGameThunk())`).
    *   For tab navigation: Updates local tab state via `useTabs` hook.
4.  **Reducer (Synchronous):** Action reaches the corresponding slice reducer, which calculates the new state immutably via Immer.
5.  **Thunk Logic (Asynchronous):** Thunk executes its async logic (e.g., interacts with `localStorage`, performs calculations). It may dispatch other actions during or after its execution (e.g., `updateLastSaved`, `replaceState`).
6.  **State Update:** Redux store updates with the new state returned by the reducer(s).
7.  **Component Re-render:** Components subscribed to the relevant parts of the state via `useAppSelector` re-render with the updated data. Selectors ensure only necessary re-renders occur.
8.  **Layout Rendering:** ✅ **IMPLEMENTED** - Column layout components handle their respective content areas independently, with routing determining middle column content.

## 7. Key Architectural Decisions & Rationale ✅ IMPLEMENTED

*   **TypeScript:** Chosen for improved maintainability, scalability, and reduced runtime errors in a complex application.
*   **Redux Toolkit:** Provides a standardized, efficient, and less boilerplate-heavy way to manage complex global state compared to plain Redux or context API alone. Essential for a game with interconnected systems.
*   **Feature-Sliced Design:** Enforces modularity, making the codebase easier to navigate, test, and refactor. Reduces coupling between different parts of the game.
*   **Material UI:** Offers a comprehensive set of well-tested UI components, accelerating development and ensuring a consistent look and feel. Theming capabilities allow for customization.
*   **MUI Tabs Universal Strategy:** ✅ **IMPLEMENTED** - Ensures consistent navigation behavior, accessibility compliance, and maintainable code by standardizing tab implementation across all features.
*   **React Router:** Standard library for handling client-side navigation between different game screens/pages.
*   **Click-Based Interactions:** ✅ **IMPLEMENTED** - Chosen over drag & drop for better accessibility, mobile compatibility, and simpler maintenance.
*   **Column Layout Architecture:** ✅ **IMPLEMENTED** - Separates layout concerns from feature logic, improving maintainability and scalability while preserving the established three-column design.
*   **Context System Elimination:** ✅ **COMPLETED** - Removed competing state management approach to maintain single source of truth through Redux only.

## 8. Performance Considerations ✅ IMPLEMENTED

### Layout Optimizations:
- **Column Independence:** Each column renders independently, reducing re-render cascades
- **Route-Based Loading:** Features loaded on-demand via React Router
- **Static Component Caching:** Persistent UI elements use React.memo for efficiency
- **Contextual Rendering:** Right column content appears only when relevant (combat logs, debug panels)

### Tab System Optimizations:
- **Lazy Loading:** Tab content loaded on demand via conditional rendering
- **Memoization:** `React.memo` and `useCallback` prevent unnecessary re-renders
- **State Persistence:** Efficient localStorage integration for tab state
- **Transition Management:** Smooth interactions without blocking

### State Management Optimizations:
- **Memoized Selectors:** `createSelector` used throughout for efficient state derivation
- **Targeted Updates:** Slices update only relevant state portions
- **Import Optimization:** ✅ **RESOLVED** - Eliminated duplicate type definitions and context dependencies
- **Bundle Efficiency:** Proper tree-shaking with Feature-Sliced imports

### General Optimizations:
- **Code Splitting:** Feature-based bundle separation via routing
- **Component Optimization:** Strategic use of React optimization techniques
- **Type Safety Performance:** Full TypeScript integration without performance penalties

## 9. Accessibility Standards ✅ IMPLEMENTED

### Layout Accessibility:
- **Landmark Regions:** Clear column structure with proper ARIA landmarks
- **Focus Management:** Logical focus order across column boundaries
- **Screen Reader Support:** Column content properly announced and navigable
- **Responsive Design:** Layout adapts to different screen sizes and orientations

### Tab Navigation:
- **Keyboard Support:** Full arrow key and tab navigation
- **Screen Reader Support:** Proper ARIA labels and announcements
- **Focus Management:** Logical focus order and visible indicators
- **Standards Compliance:** WCAG 2.1 AA guidelines

### Interaction Accessibility:
- **Click-Based Actions:** All trait slot interactions accessible via keyboard and screen readers
- **Visual Feedback:** Clear hover states and action indicators
- **Error Prevention:** Locked slots clearly indicate unlock requirements
- **Confirmation Dialogs:** Important actions require explicit confirmation

### General Accessibility:
- **Semantic HTML:** Proper element usage throughout
- **Color Contrast:** High contrast theme support
- **Motion Preferences:** Respectful of user motion settings
- **Alternative Navigation:** Multiple ways to access content

## 10. Future Extensibility ✅ READY

### Scalable Architecture:
- **Feature Addition:** Easy integration of new game systems following established patterns
- **Column Content:** Flexible allocation of features across column layouts
- **Tab System Extension:** Support for new navigation patterns and nested tabs
- **Theme Customization:** Flexible theming system ready for expansion
- **Platform Expansion:** Mobile and tablet support architecture ready

### Layout Flexibility:
- **Dynamic Column Content:** State-based rendering allows for contextual interfaces
- **Route-Based Growth:** New features integrate via routing patterns without layout changes
- **Responsive Adaptation:** Column system ready for mobile-specific layouts
- **Performance Scaling:** Architecture supports efficient rendering of complex feature sets

### Type Safety Expansion:
- **Feature Integration:** New features can easily adopt established type patterns
- **Cross-Feature Sharing:** Barrel exports support clean inter-feature dependencies
- **Maintenance Efficiency:** Single source of truth for types reduces maintenance overhead

### Planned Enhancements:
- **Advanced Tab Features:** Nested tabs, dynamic tab generation, badges
- **Performance Monitoring:** Real-time performance metrics
- **Advanced Accessibility:** Enhanced screen reader support and voice navigation
- **Cross-Platform:** PWA capabilities for mobile deployment

## 11. Implementation Status Summary

### ✅ Completed Architecture Features:
- Three-column layout system with dedicated layout components
- GameContainer refactoring to eliminate over-responsibility
- Route-based content loading with React Router integration
- Column-specific content management (static, dynamic, contextual)
- Universal MUI tabs system with StandardTabs, TabPanel, TabContainer
- useTabs hook for consistent state management
- Click-based trait slot interactions (removed drag & drop)
- TraitSystemWrapper with tabbed navigation
- Performance optimizations with React.memo and useCallback
- Full accessibility implementation with ARIA support
- Component cleanup (removed TraitSlotsFallback)
- **Context system resolution** - Eliminated competing state management
- **Type safety improvements** - Feature-Sliced type organization
- **Import pattern standardization** - Consistent, maintainable imports

### 🔄 In Progress:
- Feature integration with new routing structure
- Advanced contextual content rendering
- Mobile responsive enhancements

### 📋 Planned:
- Advanced column content management
- Nested routing for complex feature hierarchies
- Advanced tab features (badges, icons, nested tabs)
- Cross-platform PWA capabilities

This architecture provides a solid foundation for scalable game development while maintaining excellent user experience and accessibility standards. The elimination of context-based state management and implementation of proper Feature-Sliced Design patterns ensures long-term maintainability and consistent development practices.
