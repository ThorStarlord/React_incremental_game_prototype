# User Flows Specification

This document outlines key user interaction patterns and workflows within the React Incremental RPG Prototype, focusing on how users navigate and interact with the standardized MUI tabs system.

## 1. Primary Navigation Flow

### Initial Game Load
```
1. User opens application
2. System loads last saved tab state (or defaults to 'Game')
3. Left column shows vertical primary tabs
4. Middle column displays selected tab content
5. Right column shows relevant logs/info
```

### Tab Navigation Pattern
```
User Action → Tab State Update → Content Transition → UI Feedback
```

#### Primary Tab Switch (Left Column)
1. **User clicks primary tab** (Game, Traits, NPCs, etc.)
2. **System updates active tab state** (persisted to localStorage)
3. **Content area transitions** with fade animation
4. **Right column updates** with relevant contextual information
5. **URL updates** to reflect current view (optional)

#### Secondary Tab Navigation (Content Area)
1. **User navigates within feature area** using horizontal tabs
2. **Local tab state updates** (persisted per feature)
3. **Content panel switches** with smooth transition
4. **Breadcrumb updates** showing current location

## 2. Feature-Specific Workflows

### Trait Management Flow
```
Primary Tab: Traits → Secondary Tabs: [Codex, Equipped, Permanent, Shared]

Codex Tab:
1. Browse available traits
2. View trait details in right panel
3. Check acquisition requirements
4. Initiate acquisition (if eligible)

Equipped Tab:
1. View current trait loadout
2. Drag/drop to reorder
3. Unequip traits
4. Save as preset

Permanent Tab:
1. View permanent traits
2. See permanence costs
3. Make traits permanent (essence cost)

Shared Tab:
1. View NPCs/Copies with shared traits
2. Manage shared trait slots
3. Add/remove shared traits
```

### NPC Interaction Flow
```
Primary Tab: NPCs → Secondary Tabs: [Known NPCs, Relationships, Interactions] (Note: Current implementation focuses on Known NPCs and basic details within the NPCPanel)

Known NPCs Tab:
1. Browse discovered NPCs using the NPCListView.
2. Select an NPC from the list.
3. View NPC details (name, basic info) in the NPCPanel.
4. (Future) Filter by location/relationship.

Relationships Tab: (Future Implementation)
1. See connection depths
2. Track loyalty levels
3. View shared traits
4. Manage trait slots

Interactions Tab: (Future Implementation)
1. Available dialogues
2. Quest opportunities
3. Relationship actions
4. Seduction attempts (for Copy creation)
```

### Copy Management Flow
```
Primary Tab: Copies → Secondary Tabs: [Active Copies, Creation, Tasks, Loyalty]

Active Copies Tab:
1. View all created copies
2. Check status and location
3. Review inheritance and shared traits
4. Quick task assignment

Creation Tab:
1. Review seduction opportunities
2. Choose growth method (Normal/Accelerated)
3. Set initial parameters
4. Confirm creation (essence cost)

Tasks Tab:
1. Assign specific tasks to copies
2. Monitor task progress
3. Review task results
4. Plan long-term assignments

Loyalty Tab:
1. Monitor loyalty levels
2. See loyalty influences
3. Take loyalty maintenance actions
4. Address loyalty issues
```

## 3. Keyboard Navigation Patterns

### Tab Navigation Shortcuts
```
Ctrl + Tab        → Next primary tab
Ctrl + Shift + Tab → Previous primary tab
Tab               → Navigate within current tab area
Arrow Keys        → Navigate tab headers
Enter/Space       → Activate focused tab
Escape            → Return focus to primary navigation
```

### Accessibility Flow
1. **Screen reader announces** current tab and content
2. **Keyboard users can navigate** without mouse
3. **Focus management** maintains logical order
4. **Skip links** allow bypassing repetitive content

## 4. State Persistence Patterns

### Session Continuity
```
1. User navigates to Traits > Equipped tab
2. System saves: primaryTab='traits', traitsTab='equipped'
3. User refreshes page or returns later
4. System restores exact navigation state
5. User continues from where they left off
```

### Cross-Feature Integration
```
Scenario: User wants to share trait with NPC
1. Start in Traits > Equipped (view available traits)
2. Navigate to NPCs > Relationships (select target NPC)
3. Right-click trait in Traits tab → "Share with [NPC Name]"
4. System shows sharing interface
5. Complete action, return to previous state
```

## 5. Error and Edge Case Handling

### Missing or Invalid Tabs
```
If persisted tab no longer exists:
1. Fall back to default tab for that level
2. Show user notification about navigation change
3. Log issue for debugging
4. Update persistence with valid state
```

### Loading States
```
During async content loading:
1. Show skeleton loading animation in tab content
2. Maintain tab navigation functionality
3. Display loading indicator in relevant areas
4. Handle loading errors gracefully
```

### Disabled Tabs
```
For locked/unavailable features:
1. Show tab in disabled state
2. Display tooltip explaining unlock conditions
3. Update state dynamically when conditions met
4. Provide clear path to unlock
```

## 6. Mobile and Responsive Flows

### Mobile Navigation Pattern
```
1. Primary tabs move to bottom navigation bar
2. Secondary tabs become dropdown/accordion
3. Content takes full screen width
4. Swipe gestures for tab switching
```

### Tablet Experience
```
1. Collapsible left sidebar with primary tabs
2. Secondary tabs remain horizontal
3. Touch-friendly tap targets
4. Gesture support for navigation
```

## 7. Performance Optimization Flows

### Lazy Loading Pattern
```
1. User switches to new primary tab
2. System checks if content is loaded
3. If not loaded: Show loading state, fetch content
4. If loaded: Immediate content display
5. Cache content for subsequent visits
```

### Memory Management
```
1. System tracks active and recently used tabs
2. Unloads content from unused tabs after threshold
3. Maintains navigation state and metadata
4. Reloads content on demand when revisited
```

## 8. Notification and Feedback Flows

### Visual Feedback Pattern
```
User Action → Immediate Visual Response → State Update → Async Confirmation

Example - Equipping Trait:
1. User clicks "Equip" button
2. Button shows loading state
3. Trait moves to equipped section
4. Success notification appears
5. Related stats update visually
```

### Error Handling Flow
```
1. User attempts invalid action
2. System validates action
3. If invalid: Show inline error message
4. Provide corrective guidance
5. Maintain user's current context
6. Allow retry or alternative actions
```

## 9. Integration Points

### Redux State Coordination
```
1. Tab navigation updates URL state
2. Feature components subscribe to relevant state
3. Cross-feature actions update multiple slices
4. State changes trigger UI updates
5. Persistence layer saves changes
```

### Component Communication
```
1. Parent tab container manages overall state
2. Child tab panels receive props/state
3. Events bubble up through component hierarchy
4. Shared state updates propagate down
5. Side effects handled in appropriate components
