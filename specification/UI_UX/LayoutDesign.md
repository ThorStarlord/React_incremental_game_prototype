# Layout Design Specification

This document outlines the user interface layout structure and design principles for the React Incremental RPG Prototype.

## 1. Layout Architecture Overview ✅ COMPLETE + MIGRATED (Legacy Deprecated)

The application has migrated from a legacy 3-column layout system to a modern, flexible layout architecture. Legacy components remain in the repository as clearly marked, deprecated stubs to aid migration, but all active routing and pages use the new system.

### 1.1. Modern Layout System ✅ IMPLEMENTED

**GameLayout Component** - Primary layout system
- **Location**: `src/layout/components/GameLayout.tsx`
- **Architecture**: Unified responsive layout with integrated navigation and content management
- **State Management**: Centralized layout state via useLayoutState hook
- **Router Integration**: Seamless AppRouter coordination for `/game/*` routes
- **Responsive Design**: Automatic desktop/mobile adaptation with proper breakpoints

### 1.2. Legacy Layout Components ⚠️ DEPRECATED (kept as stubs)

**Deprecated Components** - Present only as warning stubs with migration guidance
- **GameContainer** (`src/layout/components/GameContainer.tsx`): Deprecated in favor of `GameLayout`
- **LeftColumn / MiddleColumn / RightColumn** (`src/layout/components/columns/`): Deprecated in favor of `VerticalNavBar` + `MainContentArea`

**Deprecation Strategy**:
- ✅ **Migration Complete**: All functionality has been migrated to `GameLayout` and `MainContentArea`.
- ⚠️ **Graceful Degradation**: Legacy files render warnings and are scheduled for removal after downstream consumers migrate.

## 2. Component Architecture ✅ COMPLETE + DEPRECATION-AWARE

### 2.1. Active Layout Components ✅ IMPLEMENTED

**GameLayout** (`src/layout/components/GameLayout.tsx`)
- **Purpose**: Primary layout container with responsive design
- **Features**: Integrated navigation, content management, state persistence
- **Integration**: VerticalNavBar + MainContentArea + useLayoutState

**VerticalNavBar** (`src/layout/components/VerticalNavBar/`)
- **Purpose**: Unified responsive navigation system
- **Components**: DesktopNavBar + MobileNavDrawer with automatic switching
- **Features**: Collapsible sidebar, touch-friendly mobile drawer, **now includes 'Dashboard' as a primary navigation item.**

**MainContentArea** (`src/layout/components/MainContentArea.tsx`)
- **Purpose**: Dynamic content rendering with switch-based page management
- **Features**: Efficient conditional rendering, error boundaries, placeholder system

### 2.2. Removed Layout Components ✅ REMOVED

**GameContainer** (`src/layout/components/GameContainer.tsx`)
- **Status**: ✅ **REMOVED** - Replaced by `GameLayout`
- **Note**: This component and its associated files have been removed from the codebase.

**Column Components** (`src/layout/components/columns/`)
- **LeftColumn**: ✅ **REMOVED** - Functionality moved to `VerticalNavBar` or integrated into page components.
- **MiddleColumn**: ✅ **REMOVED** - Functionality moved to `MainContentArea` or integrated into page components.
- **RightColumn**: ✅ **REMOVED** - Functionality integrated into page components.
- **Note**: These components and their associated files have been removed from the codebase.

## 3. Layout State Management ✅ COMPLETE + DEPRECATION-SUPPORT

### 3.1. useLayoutState Hook ✅ ENHANCED

**Features**:
- **Tab Management**: Active tab state with persistence
- **Sidebar Control**: Collapsible sidebar with responsive behavior
- **Router Integration**: Coordination with React Router navigation
- **Legacy Detection**: Development warnings for deprecated component usage

**Usage Pattern**:
```typescript
// ✅ Modern layout state management
const {
  activeTab,
  sidebarCollapsed,
  setActiveTab,
  setSidebarCollapsed,
  toggleSidebar
} = useLayoutState({
  defaultTab: 'dashboard',
  persistSidebar: true,
  syncWithRouter: false
});
```

### 3.2. Migration Benefits ✅ ACHIEVED

**Performance Improvements**:
- **Reduced Complexity**: Single GameLayout vs. multiple column components
- **Efficient Rendering**: Centralized state management reduces re-renders
- **Memory Usage**: Unified component lifecycle management
- **Route Performance**: AppRouter integration eliminates nested routing overhead

**Developer Experience**:
- **Simplified Integration**: Single component interface vs. multiple layout pieces
- **Type Safety**: Comprehensive TypeScript integration throughout
- **Clear Patterns**: Consistent state management and component structure
- **Migration Guidance**: Step-by-step deprecation warnings and documentation

## 4. Responsive Design Strategy ✅ IMPLEMENTED

### 4.1. Breakpoint System

**Material-UI Breakpoints**:
- **Mobile**: `<768px` - MobileNavDrawer with touch-optimized interactions
- **Desktop**: `≥768px` - DesktopNavBar with hover states and keyboard navigation
- **Transitions**: Smooth switching between layouts based on screen size

### 4.2. Navigation Adaptation ✅ COMPLETE

**Desktop Navigation**:
- **Collapsible Sidebar**: 240px expanded, 64px collapsed
- **Hover States**: Interactive feedback for navigation items
- **Keyboard Navigation**: Full accessibility support

**Mobile Navigation**:
- **Drawer System**: 280px drawer with backdrop and swipe gestures
- **Touch Targets**: Minimum 48px touch targets for accessibility
- **Auto-Close**: Drawer closes on navigation selection

## 5. Layout Evolution Timeline ✅ DOCUMENTED

### Phase 1: Legacy System (Removed) ✅
- **Architecture**: GameContainer + 3-column layout (LeftColumn, MiddleColumn, RightColumn)
- **Status**: Fully removed from the codebase.
- **Issues**: Complex state management, limited responsive design, performance overhead

### Phase 2: Modern System (Current) ✅ IMPLEMENTED
- **Architecture**: GameLayout + VerticalNavBar + MainContentArea
- **Benefits**: Unified state management, responsive design, AppRouter integration
- **Performance**: Reduced component overhead, efficient rendering patterns

### Phase 3: Legacy Removal (Complete) ✅
- **Timeline**: Completed
- **Process**: Deprecated components and their exports have been removed.
- **Benefits**: Reduced bundle size, simplified architecture, improved maintainability

## 6. Migration Guidelines ✅ COMPLETED

### 6.1. Component Migration Paths

**From Legacy 3-Column Layout to Modern Tab-Based Layout**:
```typescript
// ❌ Legacy pattern (components now removed)
<GameContainer>
  <LeftColumn />
  <MiddleColumn />
  <RightColumn />
</GameContainer>

// ✅ Modern pattern (already implemented)
<GameLayout />
```

**Benefits of Migration**:
- **Unified State**: Single `useLayoutState` hook vs. multiple component states
- **Responsive Design**: Built-in mobile/desktop adaptation
- **Performance**: Reduced component mounting/unmounting overhead
- **Router Integration**: Seamless AppRouter coordination

### 6.2. State Management Migration

**Legacy State Pattern**:
```typescript
// ❌ Scattered state management (no longer applicable)
const [leftCollapsed, setLeftCollapsed] = useState(false);
const [activeContent, setActiveContent] = useState('default');
const [rightVisible, setRightVisible] = useState(true);
```

**Modern State Pattern**:
```typescript
// ✅ Centralized layout state (already implemented)
const {
  activeTab,
  sidebarCollapsed,
  setActiveTab,
  setSidebarCollapsed
} = useLayoutState();
```

## 7. Future Enhancements 📋 PLANNED

### 7.1. Advanced Layout Features
- **Split Panes**: Resizable content areas for advanced users
- **Layout Presets**: Saved layout configurations
- **Custom Themes**: User-configurable layout themes
- **Animation System**: Smooth transitions and micro-interactions

### 7.2. Performance Optimizations
- **Virtual Scrolling**: For large content areas
- **Code Splitting**: Layout component lazy loading
- **Caching**: Layout state caching for faster load times
- **Bundle Optimization**: Tree shaking for unused layout components

The layout system has successfully evolved from legacy architecture to a modern, maintainable, and performant system with comprehensive deprecation strategy ensuring smooth transition for all stakeholders.
