# Gemini AI Instructions for React Incremental RPG

This document provides context and guidelines for the Gemini AI agent working on the React Incremental RPG Prototype. Your primary goal is to understand and adhere to the established architecture, patterns, and conventions to ensure consistency and maintainability.

## 1. Project Overview

This is a prototype for an experimental incremental game built with React. The core innovation is its focus on **emotional connection mechanics** as the primary driver of progression, rather than traditional resource grinding. Key systems include:

-   **Essence System:** The primary metaphysical resource generated from NPC connections.
-   **Trait System:** The main method of character progression, based on a Discover -> Equip -> Resonate lifecycle.
-   **NPC System:** A two-tiered relationship model of **Affinity** (opinion) and **Intimacy/Connection Depth** (bond level).
-   **Player Progression:** Based on a "Resonance Level" and attribute allocation, not traditional XP.

Refer to the `specification/GameDesignDocument.md` for a complete overview of the game's vision.

## 2. Technology Stack

Your code generation and suggestions must conform to this stack:

-   **Framework:** React 18+ (Functional Components and Hooks only)
-   **Language:** TypeScript (with `strict: true` enabled)
-   **State Management:** Redux Toolkit
-   **UI Library:** Material-UI (MUI) v5+
-   **Routing:** React Router v6
-   **Styling:** MUI's `sx` prop, `styled()`, and CSS Modules for component-specific styles.

## 3. Key Architectural Principles

**Adherence to the project's architecture is your highest priority.**

### 3.1. Feature-Sliced Design (FSD)

The project uses a strict Feature-Sliced Design. When generating new files or importing modules, follow this structure:

-   `src/app/`: Core app setup (Redux store, typed hooks).
-   `src/pages/`: Top-level components that assemble features for a route (e.g., `CharacterPage.tsx`).
-   `src/features/`: Self-contained business logic modules (e.g., `Player`, `Traits`, `NPCs`).
-   `src/shared/`: Reusable, business-agnostic code (e.g., UI components like `Panel`, utility functions).
-   `src/layout/`: Global layout components like `GameLayout` and `VerticalNavBar`.
-   `src/constants/`: Global, game-wide constants.

**Import Rules:** Modules should only import from modules "below" them in the hierarchy (e.g., a `feature` can import from `shared`, but `shared` cannot import from a `feature`).

### 3.2. State Management (Redux Toolkit)

-   All state logic must use Redux Toolkit.
-   **Slices:** Each feature has its own slice (`createSlice`) containing its state, reducers, and actions.
-   **Thunks:** Use `createAsyncThunk` for all asynchronous logic or complex multi-step synchronous actions that require access to the store.
-   **Selectors:** All data retrieval from the Redux store within components must use memoized selectors (`createSelector`) defined in `FeatureSelectors.ts` files. This is critical for performance.
-   **Immutability:** Reducers use Immer, so write "mutative" logic inside `createSlice` reducers. Everywhere else, treat state as immutable.

### 3.3. Component Design

-   Follow the **Container/UI (Smart/Dumb) component pattern**.
    -   **UI Components** (`src/features/.../ui/`): Receive all data and callbacks via props. They are not aware of Redux.
    -   **Container Components** (`src/features/.../containers/`): Connect to the Redux store, use selectors to get data, and pass it down to UI components.
-   Use `React.memo` on presentational components to prevent unnecessary re-renders.

### 3.4. Naming Conventions

-   **Feature Folders:** Singular, `PascalCase` (e.g., `Player`, `Trait`, `Copy`).
-   **Redux Slice Keys:** Singular, `camelCase` (e.g., `player`, `trait`, `copy`).
-   **Component Files:** `PascalCase.tsx`.
-   **Hooks/Utils:** `camelCase.ts`.

## 4. Task-Specific Instructions

### When Generating Code:

-   **New Feature:** Create a new folder under `src/features/` with the standard FSD internal structure (`state/`, `components/ui`, `components/containers`, etc.).
-   **New Component:** Determine if it's a reusable `shared` component or a feature-specific one. Create both a UI component and, if it requires state, a container.
-   **New State Logic:** Add it to the appropriate feature slice. Create new selectors for any new pieces of state that need to be read. Create thunks for any associated async logic.
-   **Type Safety:** Provide strong TypeScript types for everything. **Avoid using `any`**.

### When Reviewing Pull Requests:

Please check for the following:
-   ✅ **Architectural Compliance:** Does the new code adhere to the Feature-Sliced Design principles?
-   ✅ **State Management:** Is Redux Toolkit used correctly? Are there memoized selectors for all new state access?
-   ✅ **Type Safety:** Is the code strongly typed? Are there any instances of `any` that could be more specific?
-   ✅ **Consistency:** Does the code match the style and patterns of the existing codebase (e.g., component structure, naming conventions)?
-   ✅ **Documentation:** Are complex functions or components commented with JSDoc?
-   ✅ **No Magic Strings:** Values used in multiple places should be extracted into `src/constants/`.

## 5. Important Files for Context

When in doubt, refer to these key files and the extensive documentation within the `/specification` folder.

-   **/specification/**: This is your primary source of truth for all game mechanics, requirements, and technical design. Reference it often.
-   **.github/copilot-instructions.md**: Contains additional best practices that are also relevant.
-   **src/app/store.ts**: Defines the root Redux store structure.
-   **src/routes/AppRouter.tsx**: Defines the application's routing structure and page layouts.
-   **src/layout/components/GameLayout.tsx**: The primary layout component for the main game interface.

By following these instructions, you will act as a valuable and consistent contributor to this project.