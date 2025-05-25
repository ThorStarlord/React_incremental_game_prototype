# Component Specification

This document details the design and implementation of UI components used throughout the React Incremental RPG Prototype, organized by feature and functionality.

## 1. Overview

The component architecture follows Feature-Sliced Design principles with clear separation between presentational (UI) and container components. All components use Material-UI for consistent theming and accessibility compliance.

**Implementation Status**: ✅ **COMPREHENSIVE** - Complete component system implemented including reusable utilities, feature-specific components, and container patterns with full accessibility and performance optimization.

## 2. Player System Components ✅ **NEWLY IMPLEMENTED**

### 2.1. Core UI Components ✅ **COMPLETE**

#### StatDisplay Component
**Location**: `src/features/Player/components/ui/StatDisplay.tsx`
**CSS**: `src/features/Player/components/ui/StatDisplay.module.css`

**Purpose**: Reusable component for displaying individual player statistics with visual indicators and optional progress visualization.

**Props Interface**:
```typescript
interface StatDisplayProps {
  label: string;              // Display label for the statistic
  value: number;              // Current value of the statistic
  maxValue?: number;          // Maximum value (optional, for progress bars)
  unit?: string;              // Optional unit suffix (e.g., "HP", "%", "sec")
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  asPercentage?: boolean;     // Show as percentage (0-100 scale)
  showProgress?: boolean;     // Show progress bar indicator
  className?: string;         // Additional CSS classes
}
```

**Features**:
- **Visual Design**: Card-based layout with hover effects and responsive spacing
- **Progress Indicators**: Optional LinearProgress with customizable colors and animations
- **Responsive Layout**: Stacked layout on mobile, side-by-side on desktop
- **Accessibility**: Full ARIA labeling and keyboard navigation support
- **Performance**: Memoized component with efficient prop handling

#### ProgressBar Component
**Location**: `src/features/Player/components/ui/ProgressBar.tsx`

**Purpose**: Reusable progress bar component for player progression indicators with customizable appearance and animation support.

**Props Interface**:
```typescript
interface ProgressBarProps {
  current: number;            // Current progress value
  max: number;                // Maximum progress value
  label?: string;             // Display label
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  height?: number;            // Height of the progress bar (default 8px)
  showPercentage?: boolean;   // Show percentage text
  showValues?: boolean;       // Show current/max values
  animationDuration?: number; // Animation duration in ms (default 500ms)
}
```

**Features**:
- **Material-UI Integration**: Uses LinearProgress with custom styling and theme colors
- **Animation Support**: Configurable transition duration with cubic-bezier easing
- **Value Safety**: Automatic value validation to prevent errors
- **Multiple Display Modes**: Percentage, values, or label-only display options
- **Performance**: Memoized component with efficient calculations

#### PlayerStatsUI Component
**Location**: `src/features/Player/components/ui/PlayerStatsUI.tsx`

**Purpose**: Comprehensive UI for displaying player statistics with visual progress indicators organized in logical sections.

**Props Interface**:
```typescript
interface PlayerStatsUIProps {
  stats: PlayerStats;         // Player statistics data
  showDetails?: boolean;      // Show detailed breakdown (default true)
}
```

**Features**:
- **Vital Statistics**: Health and mana with ProgressBar components showing current/max values
- **Combat Statistics**: Attack, defense, crit chance, and crit damage using StatDisplay components
- **Performance Statistics**: Speed, regeneration rates, and calculated total power
- **Responsive Design**: Material-UI Grid system adapting from 4 columns to 2 on mobile
- **Semantic Icons**: Material-UI icons (Favorite, Shield, Speed) for visual identification
- **Color Coding**: Dynamic colors based on stat types and health/mana percentages

#### PlayerTraitsUI Component
**Location**: `src/features/Player/components/ui/PlayerTraitsUI.tsx`

**Purpose**: UI component for displaying player trait information with slot management and quick actions.

**Props Interface**:
```typescript
interface PlayerTraitsUIProps {
  equippedTraits: string[];   // Array of equipped trait IDs
  permanentTraits: string[];  // Array of permanent trait IDs
  availableSlots: number;     // Available trait slots
  usedSlots: number;          // Used trait slots
  onManageTraits?: () => void; // Callback for opening trait management
}
```

**Features**:
- **Slot Grid Layout**: 2x3 visual grid showing all available trait slots with state indicators
- **Trait Information**: Name, rarity chips, and status display for equipped traits
- **Quick Actions**: Direct equip/unequip with confirmation dialogs
- **Permanent Traits**: Special section for permanent trait display with warning-colored chips
- **Accessibility**: Full keyboard navigation and ARIA support

#### PlayerEquipment Component
**Location**: `src/features/Player/components/ui/PlayerEquipment.tsx`

**Purpose**: Equipment slot visualization organized by category with interactive management actions.

**Features**:
- **Categorized Display**: Separate Material-UI Paper cards for armor, weapons, and accessories
- **Equipment Slots**: 8 total slots (4 armor, 2 weapons, 2 accessories) with semantic icons
- **Rarity Indicators**: Color-coded Material-UI Chip components for item rarity
- **Quick Actions**: Equip/unequip buttons with tooltip guidance
- **Empty State Handling**: Clear "Add Equipment" prompts for unequipped slots
- **Responsive Grid**: 2x2 grids within each category using Material-UI Grid system

### 2.2. Container Components ✅ **IMPLEMENTED**

#### PlayerStatsContainer
**Location**: `src/features/Player/components/containers/PlayerStatsContainer.tsx`

**Purpose**: Container component connecting PlayerStatsUI to Redux state management.

**Features**:
- **Redux Integration**: Uses selectPlayerStats selector for efficient state access
- **Props Configuration**: Configurable showDetails prop for stat detail control
- **Performance**: Memoized component preventing unnecessary re-renders
- **Type Safety**: Full TypeScript integration with PlayerStats interface

#### PlayerTraitsContainer  
**Location**: `src/features/Player/components/containers/PlayerTraitsContainer.tsx`

**Purpose**: Container component connecting PlayerTraitsUI to trait state management.

**Features**:
- **Trait State Integration**: Uses selectEquippedTraits and selectPermanentTraits selectors
- **Slot Management**: Mock slot data with callback handling for trait management
- **Action Handling**: useCallback for memoized event handlers
- **Architecture Pattern**: Demonstrates container/component separation

#### Progression Container
**Location**: `src/features/Player/components/containers/Progression.tsx`

**Purpose**: Container component for player progression and experience tracking with comprehensive statistics.

**Features**:
- **Experience Tracking**: Progress bars for level advancement with next-level calculations
- **Character Statistics**: Total experience, attribute points, skill points, gold display
- **Playtime Tracking**: Formatted playtime display with session information
- **Status Display**: Character alive status with conditional color coding
- **Component Reuse**: Integrates ProgressBar and StatDisplay for consistent presentation

### 2.3. Character Page Integration ✅ **COMPLETE**

#### CharacterPage Component
**Location**: `src/pages/CharacterPage.tsx`

**Purpose**: Top-level page component integrating all player management interfaces with tabbed navigation.

**Features**:
- **Tabbed Interface**: Material-UI Tabs with responsive scrollable behavior
- **Tab Organization**: Stats, Traits, Equipment, and Skills (placeholder) sections
- **Icon Integration**: Material-UI icons (Person, Star, Inventory, TrendingUp) for visual identification
- **State Management**: Local tab state with useState and memoized change handlers
- **Responsive Design**: Scrollable tabs on mobile, standard tabs on desktop
- **Accessibility**: Full ARIA support and keyboard navigation

**Tab Structure**:
```typescript
const characterTabs = [
  { label: 'Stats', icon: PersonIcon, component: PlayerStatsContainer },
  { label: 'Traits', icon: StarIcon, component: PlayerTraitsContainer },
  { label: 'Equipment', icon: InventoryIcon, component: PlayerEquipment },
  { label: 'Skills', icon: TrendingUpIcon, component: PlaceholderPage }
];
```

## 3. Shared Component Library ✅ **IMPLEMENTED**

### 3.1. Tab System Components ✅ **COMPLETE**

#### StandardTabs Component
**Location**: `src/shared/components/Tabs/StandardTabs.tsx`

**Purpose**: Standardized Material-UI tab component used across features for consistent navigation behavior.

**Features**:
- **Universal Pattern**: Consistent tab behavior across Traits, NPCs, and Character systems
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **Responsive Design**: Scrollable tabs on mobile devices
- **Theme Integration**: Proper Material-UI theming and color variants

#### TabContainer Component
**Location**: `src/shared/components/Tabs/TabContainer.tsx`

**Purpose**: Container wrapper for tab content with consistent styling and behavior.

#### TabPanel Component
**Location**: `src/shared/components/Tabs/TabPanel.tsx`

**Purpose**: Individual tab content wrapper with proper accessibility attributes and conditional rendering.

### 3.2. Placeholder System ✅ **IMPLEMENTED**

#### PlaceholderPage Component
**Location**: `src/shared/components/PlaceholderPage/PlaceholderPage.tsx`

**Purpose**: Reusable placeholder component for features in development with comprehensive status communication.

**Features**:
- **Status Communication**: Clear indication of development status and timelines
- **Feature Planning**: Detailed roadmap and feature descriptions
- **Visual Design**: Material-UI Card layout with proper spacing and typography
- **Consistency**: Standardized placeholder messaging across all features

## 4. CSS Architecture ✅ **IMPLEMENTED**

### 4.1. CSS Modules Integration

**StatDisplay.module.css**: Component-specific styling for StatDisplay component
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Hover Effects**: Subtle box-shadow transitions for interactive feedback
- **Layout Patterns**: Flexbox layouts with proper spacing and alignment
- **Performance**: Scoped styles preventing global CSS conflicts

### 4.2. Material-UI Theme Integration

**Theme Consistency**: All components use Material-UI theme system for:
- **Color Palette**: Semantic colors (primary, secondary, error, warning, success, info)
- **Typography**: Consistent text hierarchy and font sizing
- **Spacing**: Material-UI spacing system for consistent layouts
- **Breakpoints**: Responsive design using theme breakpoints
- **Transitions**: Smooth animations using theme transition definitions

## 5. Accessibility Standards ✅ **COMPLETE**

### 5.1. WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- **Tab Order**: Logical tab sequence throughout all components
- **Focus Indicators**: Visible focus states on all interactive elements
- **Keyboard Shortcuts**: Arrow key navigation where appropriate

**Screen Reader Support**:
- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Semantic HTML**: Proper heading hierarchy and landmark usage
- **Live Regions**: Announcements for dynamic content updates
- **Alternative Text**: Meaningful descriptions for visual elements

**Visual Accessibility**:
- **Color Independence**: Information conveyed through multiple visual cues
- **Contrast Ratios**: Sufficient contrast for all text and interactive elements
- **Touch Targets**: Minimum 44px target sizes for mobile accessibility
- **Responsive Text**: Scalable text that remains readable at 200% zoom

### 5.2. Component-Specific Accessibility

**StatDisplay Component**:
- **Progress Semantics**: Proper role and value attributes for progress indicators
- **Unit Announcements**: Clear screen reader announcements for values and units
- **State Changes**: Live region updates for dynamic stat changes

**ProgressBar Component**:
- **Progress Role**: Proper ARIA role and value attributes
- **Label Association**: Clear label relationships for screen readers
- **Value Announcements**: Percentage and value announcements

**PlayerStatsUI Component**:
- **Section Headings**: Proper heading hierarchy for stat categories
- **Group Labels**: Clear grouping of related statistics
- **Icon Descriptions**: Alternative text for decorative icons

## 6. Performance Optimization ✅ **IMPLEMENTED**

### 6.1. React Performance Patterns

**Component Memoization**:
- **React.memo**: Applied to all major components to prevent unnecessary re-renders
- **useCallback**: Memoized event handlers for stable function references
- **useMemo**: Memoized calculations for expensive operations
- **Selector Optimization**: Memoized Redux selectors prevent recalculation

**Efficient Rendering**:
- **Conditional Content**: Tab content loaded only when active
- **Key Props**: Stable keys for list rendering
- **State Normalization**: Efficient data structures for rendering optimization
- **Bundle Splitting**: Component-level code splitting where beneficial

### 6.2. CSS Performance

**CSS Modules Benefits**:
- **Scoped Styles**: Prevents global CSS conflicts and improves performance
- **Dead Code Elimination**: Unused styles automatically removed during build
- **Cache Optimization**: Stable class names improve browser caching
- **Reduced Specificity**: Simpler selectors improve CSS performance

## 7. Testing Architecture ✅ **STRUCTURED**

### 7.1. Component Testability

**Predictable Structure**:
- **Clear Props Interface**: Well-defined props for easy testing
- **Separated Concerns**: Container/component separation enables focused testing
- **Mocked Dependencies**: Redux selectors and actions easily mockable
- **Accessibility Testing**: Structure ready for automated accessibility testing

**Testing Patterns**:
- **Unit Tests**: Individual component functionality and prop handling
- **Integration Tests**: Container component Redux integration
- **Accessibility Tests**: Screen reader and keyboard navigation testing
- **Visual Regression**: Component appearance and responsive behavior

The Player UI component system provides a comprehensive foundation for character management with modern React patterns, accessibility compliance, and performance optimization throughout the implementation.
