# Layout Design Specification

This document defines the overall layout structure, navigation patterns, and UI organization for the React Incremental RPG Prototype.

## 1. Overall Layout Strategy

### Primary Layout: Three-Column Design
```
┌─────────────────────────────────────────────────────────────┐
│ Header (GameControlPanel)                                   │
├───────────────┬─────────────────────┬───────────────────────┤
│ Left Column   │ Middle Column       │ Right Column          │
│ (Status &     │ (Main Content)      │ (Logs & Info)         │
│ Navigation)   │                     │                       │
│               │                     │                       │
│               │                     │                       │
│               │                     │                       │
│               │                     │                       │
└───────────────┴─────────────────────┴───────────────────────┘
```

### Column Specifications

#### Left Column (Status & Navigation)
- **Purpose**: Player status, quick stats, primary navigation
- **Width**: Fixed (~300px)
- **Components**:
  - Player health/mana bars
  - Essence counter
  - Experience/level display
  - Primary navigation tabs (vertical)

#### Middle Column (Main Content)
- **Purpose**: Primary interaction area, detailed interfaces
- **Width**: Flexible (remaining space)
- **Components**:
  - Feature-specific content areas
  - Tabbed interfaces using standardized components
  - Interactive game elements

#### Right Column (Logs & Info)
- **Purpose**: Secondary information, logs, notifications
- **Width**: Fixed (~300px)
- **Components**:
  - Activity logs
  - Notifications
  - Secondary information panels

## 2. Navigation Strategy

### Tab-Based Navigation
**Decision**: Universal adoption of MUI `<Tabs>` and `<Tab>` components

#### Primary Tabs (Left Column - Vertical)
```typescript
const primaryTabs = [
  { id: 'game', label: 'Game', icon: <GamepadIcon /> },
  { id: 'traits', label: 'Traits', icon: <StarIcon /> },
  { id: 'npcs', label: 'NPCs', icon: <PeopleIcon /> }, // Added NPCs tab
  { id: 'copies', label: 'Copies', icon: <ContentCopyIcon /> },
  { id: 'quests', label: 'Quests', icon: <AssignmentIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }
];
```

#### Secondary Tabs (Middle Column - Horizontal)
Feature-specific sub-navigation within each primary tab area.

### Standardized Tab Components

#### Core Components
- **`StandardTabs`**: Base MUI-wrapped tab navigation
- **`TabPanel`**: Content container with accessibility
- **`TabContainer`**: Combined tabs + content layout
- **`useTabs`**: Hook for consistent state management

#### Features
- **Accessibility**: Full keyboard navigation, ARIA attributes
- **Consistency**: Unified styling and behavior
- **Flexibility**: Support for icons, orientation, variants
- **Performance**: Memoized callbacks, efficient re-renders

## 3. Responsive Considerations

### Desktop (Primary Target)
- Full three-column layout
- Vertical tabs in left column
- Horizontal secondary tabs in content areas

### Tablet (Secondary)
- Collapsible left column
- Tab navigation moves to header area
- Content areas remain tabbed

### Mobile (Future)
- Single column layout
- Bottom navigation for primary tabs
- Simplified secondary navigation

## 4. Theme Integration

### MUI Theme Usage
- **Primary Colors**: Define game-appropriate color scheme
- **Typography**: Consistent font hierarchy
- **Spacing**: Standardized spacing units
- **Components**: Customized MUI component variants

### Dark Mode Support
- Toggle available in settings
- Consistent theme application
- High contrast accessibility compliance

## 5. Component Organization

### Layout Components (`src/layout/`)
- **`AppLayout.tsx`**: Root layout wrapper
- **`GameLayout.tsx`**: Main three-column game layout
- **`Header.tsx`**: Top navigation and game controls

### Shared Components (`src/shared/components/`)
- **`Tabs/`**: Standardized tab system
  - `StandardTabs.tsx`
  - `TabPanel.tsx`
  - `TabContainer.tsx`
- **`Navigation/`**: Navigation helpers
- **`Layout/`**: Reusable layout utilities

### Feature Components (`src/features/*/components/`)
- **`containers/`**: Smart components with Redux connections
- **`ui/`**: Presentational components
- **`layout/`**: Feature-specific layout components

## 6. Navigation State Management

### Tab State Strategy
```typescript
// Global navigation state (primary tabs)
const useAppNavigation = () => {
  const [activeTab, setActiveTab] = useTabs({
    defaultTab: 'game',
    tabs: primaryTabs,
    persistKey: 'primary_navigation'
  });
  // ...
};

// Feature-specific tab state
const useFeatureTabs = (featureName: string) => {
  const [activeTab, setActiveTab] = useTabs({
    defaultTab: 'overview',
    tabs: featureTabs,
    persistKey: `${featureName}_tabs`
  });
  // ...
};
```

### State Persistence
- **Primary Navigation**: Persisted to localStorage
- **Feature Tabs**: Persisted per feature
- **Session State**: Maintained during page refresh

## 7. Accessibility Standards

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Arrow Keys**: Navigate within tab groups
- **Enter/Space**: Activate tabs
- **Escape**: Exit tab navigation

### Screen Reader Support
- **ARIA Labels**: Descriptive tab labels
- **Role Attributes**: Proper ARIA roles
- **State Announcements**: Active tab indication
- **Content Association**: Tab/panel relationships

### Visual Design
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Clear focus states
- **Text Sizing**: Scalable font sizes
- **Motion**: Respectful of motion preferences

## 8. Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Load tab content on demand
- **Memoization**: Prevent unnecessary re-renders
- **Virtual Scrolling**: For large lists in tabs
- **Bundle Splitting**: Feature-based code splitting

### Memory Management
- **Component Cleanup**: Proper useEffect cleanup
- **Event Listeners**: Remove on unmount
- **Large Data Sets**: Efficient data handling
- **Resource Loading**: Progressive enhancement
