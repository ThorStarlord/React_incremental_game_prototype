# Technical Architecture Overview

This document provides a high-level overview of the technical architecture, technology stack, and project structure for the React Incremental RPG Prototype.

**Architecture Status**: ✅ **MATURE** - Core architecture implemented with Feature-Sliced Design, Redux Toolkit state management, comprehensive UI framework, complete NPC interaction system, **Phase 1 Navigation Primitives**, **complete layout system with MainContentArea**, **comprehensive page shell architecture with placeholder system**, **Phase 2 Layout State Management**, **✅ COMPLETE GameLayout Component**, and **✅ NEWLY IMPLEMENTED AppRouter Integration**.

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
        *   **`Settings/`**: ✅ **UI IMPLEMENTED** - ✅ **NEWLY COMPLETE** - Comprehensive user configuration management with audio, graphics, gameplay, and UI settings
        *   **`Meta/`**: ✅ **IMPLEMENTED** - Application metadata and save/load functionality
        *   **`Npcs/`**: ✅ **UI IMPLEMENTED** - Complete NPC interaction system with tabbed interface and relationship progression
        *   **Future Features**: `Copy/`, `Quest/` (planned)
    *   **`gameLogic/`**: Core game logic, systems, and calculations not tied to a specific UI feature.
    *   **`hooks/`**: Global/shared custom React hooks.
    *   **`layout/`**: ✅ **COMPLETE** - Global layout components and column structures with **MainContentArea implementation**.
        *   **`components/`**: ✅ **COMPLETE** - All layout components including MainContentArea
        *   **`types/`**: ✅ **PHASE 1 IMPLEMENTED** - Navigation type definitions and interfaces
        *   **`constants/`**: ✅ **PHASE 1 IMPLEMENTED** - Navigation configuration and item definitions
        *   **`columns/`**: Column-specific layout components
    *   **`pages/`**: ✅ **NEWLY IMPLEMENTED** - Top-level page components assembling features and layouts for specific routes with comprehensive shell architecture.
    *   **`routes/`**: ✅ **IMPLEMENTED** - Routing configuration with layout routes.
    *   **`shared/`**: ✅ **IMPLEMENTED** - Reusable components, utilities, hooks, or types used across multiple features.
        *   `components/`
            *   **`Tabs/`**: ✅ **IMPLEMENTED** - Standardized MUI-based tab component system used by Traits and NPCs
            *   **`PlaceholderPage/`**: ✅ **NEWLY IMPLEMENTED** - Reusable placeholder component system
    *   **`theme/`**: MUI theme configuration and custom theme context/provider.

## 3. Navigation Architecture ✅ PHASE 1 COMPLETE + UNIFIED

### 3.1. Navigation Primitives ✅ COMPLETE + RESPONSIVE

**Phase 1 Implementation**: Core navigation foundation completed with comprehensive responsive architecture and **unified component interface**.

#### VerticalNavBar Wrapper ✅ NEWLY COMPLETE
**Component**: `src/layout/components/VerticalNavBar/VerticalNavBar.tsx`

**Main responsive navigation component providing unified interface across all devices**

##### Architecture Features ✅ IMPLEMENTED:
- **Responsive Component Switching**: Automatic selection of DesktopNavBar or MobileNavDrawer based on `useMediaQuery`
- **Route Integration**: Active tab detection from React Router with proper navigation handling
- **Unified State Management**: Single component interface managing both desktop and mobile navigation states
- **Performance Optimized**: Memoized callbacks and efficient rendering patterns
- **Developer Integration**: Custom hooks and clean prop interfaces for parent component control

##### Integration Benefits ✅ ACHIEVED:
```typescript
// ✅ Unified navigation interface
<VerticalNavBar 
  collapsed={navCollapsed}
  onCollapseChange={setNavCollapsed}
  navItems={customNavItems} // Optional override
  className={customStyles}  // Optional styling
/

// ✅ Mobile navigation control hook
const { isMobile, isDrawerOpen, openDrawer, closeDrawer } = useMobileNavigation();
```

#### Desktop Navigation Component ✅ IMPLEMENTED
**DesktopNavBar** (`src/layout/components/VerticalNavBar/DesktopNavBar.tsx`)
- **Material-UI Integration**: Complete MUI List and styling implementation
- **Responsive Design**: Smooth transitions between expanded (240px) and collapsed (64px) states
- **Section Organization**: Visual grouping with section titles and dividers
- **Implementation Awareness**: Clear indication of implemented vs. planned features
- **Accessibility**: Full ARIA support, keyboard navigation, and screen reader compatibility

#### Mobile Navigation Component ✅ IMPLEMENTED
**MobileNavDrawer** (`src/layout/components/VerticalNavBar/MobileNavDrawer.tsx`)
- **Touch Optimization**: 280px drawer width with 48px+ touch targets for accessibility
- **Automatic Behavior**: Closes on navigation selection and backdrop interaction
- **Performance**: Optimized for mobile with keepMounted and efficient event handling
- **Accessibility**: Complete keyboard navigation and ARIA support for mobile devices

#### Integration Architecture ✅ COMPLETE + UNIFIED
- **Single Component Interface**: ✅ **NEWLY ACHIEVED** - One `VerticalNavBar` component handles all responsive navigation
- **Type Safety**: Comprehensive TypeScript integration prevents navigation errors across all devices
- **Unified Configuration**: Single navigation configuration works seamlessly for desktop and mobile
- **Implementation Tracking**: Navigation system aware of feature development status on all devices
- **Route Coordination**: Navigation primitives coordinate with React Router across all form factors

### 3.2. Current Navigation Integration ✅ COMPLETE + RESPONSIVE

**Universal Navigation Strategy**: Complete integration with unified responsive component
- **Trait System**: Navigation integration with responsive design compatibility
- **NPC System**: Complete integration with mobile-optimized interactions
- **Route Coordination**: VerticalNavBar coordinates seamlessly with React Router on all devices
- **State Management**: Unified navigation state management across desktop and mobile

**Responsive Navigation Features** ✅ COMPLETE:
- **Automatic Device Detection**: `useMediaQuery` breakpoints with seamless device switching
- **Desktop/Mobile Coordination**: VerticalNavBar wrapper manages device-specific components
- **Touch-Friendly Design**: Mobile navigation optimized for touch interactions with proper target sizing
- **Performance Optimization**: Device-specific rendering with efficient memory management

### 3.3. Navigation Architecture Benefits ✅ COMPLETE + UNIFIED

**Complete Responsive Design** ✅ NEWLY ACHIEVED:
```typescript
// ✅ Unified responsive navigation pattern
export const VerticalNavBar: React.FC<VerticalNavBarProps> = (props) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return isMobile ? (
    <MobileNavDrawer {...mobileProps} />
  ) : (
    <DesktopNavBar {...desktopProps} />
  );
};
```

**Unified Interface Benefits** ✅ NEWLY ACHIEVED:
- **Developer Experience**: Single component handles all responsive navigation complexity
- **State Coordination**: Unified state management across desktop and mobile with automatic synchronization
- **Performance**: Efficient conditional rendering with proper component lifecycle management
- **Maintainability**: Single interface reduces complexity and improves code maintainability

**Cross-Device Consistency** ✅ ENHANCED:
- **Unified Configuration**: Same navigation items and sections work seamlessly across all devices
- **State Synchronization**: Navigation state remains consistent during device transitions
- **Type Safety**: Navigation types provide safety across all form factors with unified interface
- **Implementation Status**: Feature availability tracking consistent across devices with single source of truth

## 4. Layout Architecture ✅ COMPLETE + MAINCONTENT + STATE-MANAGEMENT + GAMELAYOUT + ROUTER-INTEGRATION + **LEGACY-DEPRECATION**

### 4.1. Modern Layout System ✅ COMPLETE + GAMELAYOUT + ROUTER-INTEGRATION + DEPRECATION-STRATEGY

The application has completed the transition from legacy 3-column layout to a modern, flexible layout system with **✅ NEWLY IMPLEMENTED deprecation strategy for legacy components**:

#### Primary Layout Components ✅ COMPLETE + GAMELAYOUT + ROUTER-INTEGRATION + DEPRECATION

**GameLayout Component** ✅ **COMPLETE WITH ROUTER INTEGRATION**
- **Location**: `src/layout/components/GameLayout.tsx`
- **Status**: Active, primary layout component
- **Purpose**: Unified layout component that integrates all layout systems
- **Router Integration**: ✅ **IMPLEMENTED** - Direct integration with AppRouter for `/game/*` routes
- **Migration**: Replaces legacy GameContainer and 3-column layout system

**Legacy Component Deprecation** ✅ **NEWLY IMPLEMENTED**
- **GameContainer**: ✅ **DEPRECATED** - Legacy component with clear migration guidance and warning alerts
- **Column Components**: ✅ **DEPRECATED** - LeftColumn, MiddleColumn, RightColumn marked for removal
- **Migration Strategy**: Comprehensive deprecation warnings with JSDoc annotations and runtime alerts
- **Developer Guidance**: Clear migration paths to GameLayout with benefits documentation
- **Removal Timeline**: Components prepared for future removal with graceful degradation

#### Legacy Layout Deprecation Strategy ✅ NEWLY IMPLEMENTED

**Deprecation Implementation**:
```typescript
// ✅ Implemented deprecation pattern
/**
 * @deprecated GameContainer is deprecated in favor of GameLayout component
 * 
 * Migration Guide:
 * - Replace GameContainer usage with GameLayout
 * - GameLayout provides unified layout state management via useLayoutState hook
 * - GameLayout includes responsive design and AppRouter integration
 */
export const GameContainer: React.FC = React.memo(() => {
  console.warn('GameContainer is deprecated. Please migrate to GameLayout component.');
  
  return (
    <Alert severity="warning">
      <AlertTitle>Legacy Component - GameContainer Deprecated</AlertTitle>
      {/* Clear migration guidance */}
    </Alert>
  );
});
```

**Deprecation Benefits** ✅ ACHIEVED:
- **Clear Migration Path**: Comprehensive guidance for developers
- **Graceful Degradation**: Deprecated components render with informative alerts
- **Runtime Warnings**: Console warnings alert developers to deprecated usage
- **Documentation**: JSDoc comments explain deprecation rationale and alternatives
- **Preparation for Removal**: Components structured for easy future removal

#### Component Status Overview ✅ UPDATED

**Active Components**:
- ✅ **GameLayout**: Primary layout component with full feature support
- ✅ **VerticalNavBar**: Unified responsive navigation system
- ✅ **MainContentArea**: Dynamic content rendering system
- ✅ **useLayoutState**: Centralized layout state management hook

**Deprecated Components**:
- ⚠️ **GameContainer**: Deprecated - migrate to GameLayout
- ⚠️ **LeftColumn**: Deprecated - functionality moved to VerticalNavBar
- ⚠️ **MiddleColumn**: Deprecated - functionality moved to MainContentArea
- ⚠️ **RightColumn**: Deprecated - functionality integrated into page components

**Migration Status**:
- **Current Implementation**: No active usage of deprecated components in main application
- **Legacy Exports**: Deprecated components remain available with warning messages
- **Future Removal**: Deprecated components scheduled for removal in future version
- **Clean Architecture**: Modern layout system provides superior performance and maintainability

<!-- ...existing content... -->

## 8. Key Architectural Decisions & Rationale ✅ IMPLEMENTED + **LEGACY-DEPRECATION-STRATEGY**

<!-- ...existing decisions... -->

*   **Legacy Layout Deprecation Strategy:** ✅ **NEWLY IMPLEMENTED** - Comprehensive deprecation approach for legacy 3-column layout components (GameContainer, LeftColumn, MiddleColumn, RightColumn) providing clear migration guidance, runtime warnings, graceful degradation with informative UI, and preparation for future removal. Ensures smooth transition to modern GameLayout architecture while maintaining backward compatibility and developer communication throughout the migration process.

*   **Deprecation Implementation Benefits:** ✅ **ACHIEVED** - The deprecation strategy demonstrates mature software architecture practices including comprehensive JSDoc documentation, runtime developer warnings, user-facing deprecation alerts, clear migration paths with specific code examples, and graceful component degradation. This approach ensures that legacy code remains functional while actively guiding developers toward modern alternatives, maintaining code quality during architectural transitions.

*   **Component Lifecycle Management:** ✅ **ESTABLISHED** - The deprecation strategy establishes clear patterns for component lifecycle management including deprecation marking, warning implementation, migration guidance provision, and removal preparation. This pattern can be applied to future architectural changes, ensuring consistent developer experience and maintainable codebase evolution throughout the application lifecycle.

The architecture now provides a **complete, modern layout system** with comprehensive deprecation strategy for legacy components, ensuring clean architectural transition while maintaining developer productivity and code quality standards.
