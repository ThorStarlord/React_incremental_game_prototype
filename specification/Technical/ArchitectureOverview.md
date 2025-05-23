# Technical Architecture Overview

This document provides a high-level overview of the technical architecture, technology stack, and project structure for the React Incremental RPG Prototype.

## 1. Technology Stack

*   **Frontend Framework:** React (v18+) using functional components and Hooks.
*   **Language:** TypeScript for static typing and improved code quality.
*   **State Management:** Redux Toolkit (RTK) for centralized, predictable state management, leveraging slices, thunks, and selectors. Immer is used internally by RTK for immutable updates.
*   **UI Library:** Material UI (MUI) v5+ for pre-built components, styling utilities (`sx` prop, `styled`), and theming.
*   **Navigation:** 
    *   React Router v6+ for client-side routing and navigation.
    *   **MUI Tabs** for universal tab-based navigation within features.
*   **Styling:**
    *   MUI's styling solutions (`sx`, `styled`, Theme).
    *   CSS Modules (`.module.css`) for component-specific styles where needed.
    *   Global styles (`index.css`) for base resets and body styles.
*   **Build Tool:** Create React App (CRA) or Vite (TBD - currently seems CRA-based). Provides development server, build optimization, and testing setup.
*   **Testing:** Jest (via CRA/Vite) and React Testing Library for unit and integration/component testing.

## 2. Project Structure (Feature-Sliced Design)

The project follows a Feature-Sliced Design approach to promote modularity, scalability, and maintainability.

*   **`src/`**
    *   **`app/`**: Core application setup (Redux store, global types, hooks like `useAppDispatch`).
    *   **`constants/`**: Global game constants (gameplay values, relationship tiers, etc.).
    *   **`features/`**: Contains self-contained feature modules (e.g., `Player`, `Traits`, `Essence`, `Settings`, `Copy`).
        *   **`FeatureName/`**
            *   `components/`: React components specific to the feature.
                *   `containers/`: Smart components connected to Redux.
                *   `ui/`: Presentational/dumb components.
                *   `layout/`: Feature-specific layout components.
            *   `state/`: Redux Toolkit slice, selectors, thunks, types for the feature.
            *   `hooks/`: Custom React hooks specific to the feature.
            *   `utils/`: Utility functions specific to the feature.
            *   `index.ts`: Barrel file exporting the feature's public API.
    *   **`gameLogic/`**: Core game logic, systems, and calculations not tied to a specific UI feature (e.g., `tickSystem`, `autosaveSystem`, `combatEngine`).
    *   **`hooks/`**: Global/shared custom React hooks.
    *   **`layout/`**: Global layout components (e.g., `GameLayout`, `Header`, column structures).
    *   **`pages/`**: Top-level page components assembling features and layouts for specific routes.
    *   **`routes/`**: Routing configuration (`AppRouter.tsx`, layout routes).
    *   **`shared/`**: Reusable components, utilities, hooks, or types used across multiple features.
        *   `components/`
            *   **`Tabs/`**: **Standardized MUI-based tab component system**
                *   `StandardTabs.tsx`: Core MUI tabs wrapper
                *   `TabPanel.tsx`: Accessible content panels
                *   `TabContainer.tsx`: Combined tabs + content layout
                *   `index.ts`: Public API exports
        *   `hooks/`
            *   **`useTabs.ts`**: Custom hook for tab state management
        *   `utils/`
        *   `styles/`
    *   **`theme/`**: MUI theme configuration and custom theme context/provider.
    *   **`types/`**: Global or shared type definitions (though prefer co-location within features).
    *   **`index.tsx`**: Application entry point.
    *   **`index.css`**: Global CSS styles.
    *   **`react-app-env.d.ts` / `vite-env.d.ts`**: TypeScript environment definitions.
    *   **`css.d.ts`**: Type definitions for CSS Modules.

## 3. State Management Strategy

*   **Redux Toolkit:** Used as the single source of truth for global application state.
*   **Slices:** State is divided into logical domains managed by individual slices (e.g., `player`, `traits`, `essence`, `meta`, `settings`, `copies`). Each slice contains its reducer, actions, and potentially related selectors and thunks.
*   **Selectors:** Reselect (`createSelector` via RTK) is used to efficiently derive data from the state and memoize results, preventing unnecessary computations and re-renders. Typed selectors (`useAppSelector`) ensure type safety.
*   **Thunks:** `createAsyncThunk` is used for asynchronous logic, such as saving/loading data, fetching initial game data (if applicable), and complex multi-step actions involving state access.
*   **Immutability:** Enforced via Immer within RTK's `createSlice`. Direct state mutation is avoided.

## 4. Navigation and UI Architecture

### Tab-Based Navigation Strategy
**Decision:** Universal adoption of MUI `<Tabs>` and `<Tab>` components across all features.

#### Benefits:
- **Consistency:** Uniform behavior and styling across the application
- **Accessibility:** Built-in keyboard navigation and ARIA support
- **Performance:** Optimized rendering with memoization
- **Maintainability:** Single source of truth for tab behavior

#### Implementation:
- **`StandardTabs`**: Base component wrapping MUI Tabs with enhanced features
- **`TabPanel`**: Content container with accessibility and transition support
- **`TabContainer`**: Complete solution combining tabs with content layout
- **`useTabs`**: Custom hook for consistent state management and persistence

#### Usage Pattern:
```typescript
// Feature-level tab implementation
const MyFeatureTabs = () => {
  const { activeTab, setActiveTab } = useTabs({
    defaultTab: 'overview',
    tabs: featureTabs,
    persistKey: 'my_feature_tabs'
  });

  return (
    <TabContainer
      tabs={featureTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      aria-label="My Feature Navigation"
    >
      <TabPanel tabId="overview" activeTab={activeTab}>
        <OverviewContent />
      </TabPanel>
      {/* Additional tab panels */}
    </TabContainer>
  );
};
```

## 5. Data Flow

1.  **User Interaction:** User interacts with a UI component (e.g., clicks a tab, button).
2.  **Event Handler:** Component's event handler triggers.
3.  **Dispatch Action/Thunk:**
    *   For synchronous state changes: Dispatches a Redux action (e.g., `dispatch(acquireTrait('trait_id'))`).
    *   For asynchronous operations or complex logic: Dispatches a thunk (e.g., `dispatch(saveGameThunk())`).
    *   For tab navigation: Updates local tab state via `useTabs` hook.
4.  **Reducer (Synchronous):** Action reaches the corresponding slice reducer, which calculates the new state immutably via Immer.
5.  **Thunk Logic (Asynchronous):** Thunk executes its async logic (e.g., interacts with `localStorage`, performs calculations). It may dispatch other actions during or after its execution (e.g., `updateLastSaved`, `replaceState`).
6.  **State Update:** Redux store updates with the new state returned by the reducer(s).
7.  **Component Re-render:** Components subscribed to the relevant parts of the state via `useAppSelector` re-render with the updated data. Selectors ensure only necessary re-renders occur.

## 6. Key Architectural Decisions & Rationale

*   **TypeScript:** Chosen for improved maintainability, scalability, and reduced runtime errors in a complex application.
*   **Redux Toolkit:** Provides a standardized, efficient, and less boilerplate-heavy way to manage complex global state compared to plain Redux or context API alone. Essential for a game with interconnected systems.
*   **Feature-Sliced Design:** Enforces modularity, making the codebase easier to navigate, test, and refactor. Reduces coupling between different parts of the game.
*   **Material UI:** Offers a comprehensive set of well-tested UI components, accelerating development and ensuring a consistent look and feel. Theming capabilities allow for customization.
*   **MUI Tabs Universal Strategy:** Ensures consistent navigation behavior, accessibility compliance, and maintainable code by standardizing tab implementation across all features.
*   **React Router:** Standard library for handling client-side navigation between different game screens/pages.

## 7. Performance Considerations

### Tab System Optimizations:
- **Lazy Loading:** Tab content loaded on demand
- **Memoization:** `React.memo` and `useCallback` prevent unnecessary re-renders
- **State Persistence:** Efficient localStorage integration
- **Transition Management:** Smooth animations without blocking interactions

### General Optimizations:
- **Code Splitting:** Feature-based bundle separation
- **Selector Memoization:** Efficient Redux state derivation
- **Component Optimization:** Strategic use of React optimization techniques

## 8. Accessibility Standards

### Tab Navigation:
- **Keyboard Support:** Full arrow key and tab navigation
- **Screen Reader Support:** Proper ARIA labels and announcements
- **Focus Management:** Logical focus order and visible indicators
- **Standards Compliance:** WCAG 2.1 AA guidelines

### General Accessibility:
- **Semantic HTML:** Proper element usage throughout
- **Color Contrast:** High contrast theme support
- **Motion Preferences:** Respectful of user motion settings
- **Alternative Navigation:** Multiple ways to access content

## 9. Future Extensibility

### Scalable Architecture:
- **Feature Addition:** Easy integration of new game systems
- **Tab System Extension:** Support for new navigation patterns
- **Theme Customization:** Flexible theming system
- **Platform Expansion:** Mobile and tablet support ready

### Planned Enhancements:
- **Advanced Tab Features:** Nested tabs, dynamic tab generation
- **Performance Monitoring:** Real-time performance metrics
- **Advanced Accessibility:** Enhanced screen reader support
- **Cross-Platform:** PWA capabilities for mobile deployment
