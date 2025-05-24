# Player System Specification

This document defines the core attributes, statistics, progression mechanics, and state related to the player character.

## 1. Overview

*   **Concept:** The player character's role and fundamental characteristics. The player possesses unique abilities related to Emotional Resonance, allowing them to acquire traits and create/influence Copies.
*   **Core State:** Key pieces of information defining the player (name, stats, attributes, etc.). Includes state related to managing Copies.

**Implementation Status**: ✅ **UI IMPLEMENTED** - Complete character management interface with comprehensive stats, traits, and equipment display.

## 2. Player Stats ✅ UI IMPLEMENTED

*   **Primary Stats (Directly Modifiable/Affected):**
    *   `Health (HP)`: ✅ **UI IMPLEMENTED** - Current and Maximum with visual progress bars and percentage display
    *   `Mana (MP)` / `Energy`: ✅ **UI IMPLEMENTED** - Current and Maximum with color-coded progress indicators
    *   `Stamina`: (Optional) Used for actions like sprinting, dodging.
*   **Combat Stats (Derived or Base + Bonuses):**
    *   `Attack Power` / `Damage`: ✅ **UI IMPLEMENTED** - Base damage output with color-coded display
    *   `Defense` / `Armor`: ✅ **UI IMPLEMENTED** - Damage reduction with visual representation
    *   `Speed` / `Attack Speed`: ✅ **UI IMPLEMENTED** - Action frequency with success-colored display
    *   `Critical Hit Chance`: ✅ **UI IMPLEMENTED** - Probability with percentage display (warning color)
    *   `Critical Hit Damage`: ✅ **UI IMPLEMENTED** - Multiplier with chip-based display
*   **Regeneration Stats:**
    *   `Health Regen`: ✅ **UI IMPLEMENTED** - HP recovered per second with per-tick display
    *   `Mana Regen`: ✅ **UI IMPLEMENTED** - MP recovered per second with visual indicators
*   **Other Potential Stats:**
    *   Movement Speed.
    *   Magic Resistance.
    *   Evasion Chance.
    *   Resource Gathering Speed.
    *   Crafting Speed/Quality.
    *   **Copy Limit:** Maximum number of active Copies the player can maintain.

### 2.1. Stats UI Implementation ✅ COMPLETE

**PlayerStats Component**: `src/features/Player/components/ui/PlayerStats.tsx`

#### Visual Design Features ✅ IMPLEMENTED:
- **Vital Stats Card**: Health and mana with linear progress bars
- **Combat Stats Grid**: 2x2 grid layout for attack, defense, speed, crit chance
- **Color System**: Dynamic colors based on stat types and values
- **Progress Indicators**: Health (green/yellow/red), Mana (blue/yellow/red)
- **Responsive Layout**: Grid adapts to screen size with proper spacing

#### Interactive Features ✅ IMPLEMENTED:
- **Real-time Updates**: Stats reflect current Redux state immediately
- **Visual Feedback**: Color-coded values for quick status assessment
- **Detailed Display**: Current/max values with percentage calculations
- **Regeneration Display**: Per-second values for resource regeneration

## 3. Player Attributes ✅ STATE READY

*   **Core Attributes (Points allocated):**
    *   `Strength (STR)`: Influences physical damage, carry capacity.
    *   `Dexterity (DEX)`: Influences attack speed, critical chance, evasion.
    *   `Constitution (CON)`: Influences max health, health regen.
    *   `Intelligence (INT)`: Influences magic damage, max mana, **potentially Copy Limit or effectiveness**.
    *   `Wisdom (WIS)`: Influences mana regen, magic resistance, skill effectiveness.
    *   `Charisma (CHA)`: Influences NPC interactions, prices, **potentially Copy Limit or Loyalty**.
*   **Attribute Points:**
    *   How are they gained? (e.g., through leveling, specific traits, quest rewards, milestones).
    *   Cost to increase an attribute (constant or increasing?).
*   **Attribute Effects:**
    *   Define the specific formula linking each attribute to the stats it influences (e.g., `Max Health = Base Health + (CON * 10)`, `Copy Limit = Base Limit + floor(CHA / 5)`).

## 4. Player Equipment ✅ UI IMPLEMENTED

**PlayerEquipment Component**: `src/features/Player/components/ui/PlayerEquipment.tsx`

### 4.1. Equipment Slot System ✅ IMPLEMENTED

#### Slot Categories ✅ COMPLETE:
- **Armor Slots (4)**: Head, Chest, Legs, Feet
- **Weapon Slots (2)**: Main Hand, Off Hand  
- **Accessory Slots (2)**: Accessory 1, Accessory 2

#### Visual Design ✅ IMPLEMENTED:
- **Categorized Layout**: Three separate cards for armor, weapons, accessories
- **Equipment Icons**: Contextual icons for each slot type (Shield, Sword, Inventory)
- **Empty State Display**: Clear indicators for unequipped slots with add buttons
- **Equipment Details**: Item name, rarity chip, and slot label display
- **Responsive Grid**: 2x2 grids within each category for optimal layout

#### Interactive Features ✅ IMPLEMENTED:
- **Quick Actions**: Equip/unequip buttons with tooltip guidance
- **Rarity Display**: Color-coded chips for item rarity (legendary, epic, rare)
- **Visual Feedback**: Hover states and clear action indicators
- **Accessibility**: Full keyboard navigation and ARIA support

### 4.2. Equipment Integration ✅ READY

**State Management**: Complete Redux integration ready for equipment actions
- **Equipment Selectors**: selectPlayerEquipment and selectEquipmentBySlot
- **Action Patterns**: Ready for equipItem and unequipItem actions
- **Type Safety**: EquipmentItem and EquipmentState types fully defined
- **Performance**: Memoized selectors for efficient equipment access

## 5. Player Traits Management ✅ UI IMPLEMENTED

**PlayerTraits Component**: `src/features/Player/components/ui/PlayerTraits.tsx`

### 5.1. Trait Display System ✅ IMPLEMENTED

#### Equipped Traits Section ✅ COMPLETE:
- **Slot Grid Layout**: 2x3 grid showing all available trait slots
- **Slot State Management**: Locked, empty, and equipped slot visualization
- **Trait Information**: Name, rarity, description display for equipped traits
- **Quick Actions**: Direct unequip with confirmation, equip dialogs for empty slots

#### Available Traits Section ✅ IMPLEMENTED:
- **Quick Access Panel**: List of ready-to-equip traits with metadata
- **Trait Metadata**: Name, rarity chips, equipped status indicators
- **Quick Equip**: One-click equip to available slots with validation
- **Status Tracking**: Clear indication of equipped vs. available traits

### 5.2. Trait Slot Management ✅ COMPLETE

#### Slot Visualization ✅ IMPLEMENTED:
```typescript
// ✅ Comprehensive slot state handling
const TraitSlot: React.FC<{ slot: any; index: number }> = ({ slot, index }) => {
  // Handles locked, empty, and equipped states
  // Provides visual feedback and unlock requirements
  // Integrates with trait selection and unequip actions
};
```

#### Integration Features ✅ READY:
- **Trait System Connection**: Full integration with Traits feature state
- **Action Dispatch**: equipTrait and unequipTrait action integration  
- **Validation**: Slot availability and trait compatibility checking
- **Performance**: Memoized callbacks and efficient rendering

## 6. Character Page Integration ✅ COMPLETE

**CharacterPage Component**: `src/pages/CharacterPage.tsx`

### 6.1. Tabbed Interface ✅ IMPLEMENTED

#### Tab Structure ✅ COMPLETE:
- **Stats Tab**: PlayerStats component with comprehensive stat display
- **Traits Tab**: PlayerTraits component with slot management
- **Equipment Tab**: PlayerEquipment component with gear visualization
- **Skills Tab**: PlaceholderPage for future skill system implementation

#### Navigation Features ✅ IMPLEMENTED:
- **Responsive Tabs**: Scrollable tabs on mobile, standard on desktop
- **Tab Icons**: Material Icons for visual identification (Person, Star, Inventory, TrendingUp)
- **State Management**: Local tab state with smooth transitions
- **Accessibility**: Full ARIA support and keyboard navigation

### 6.2. Integration Architecture ✅ COMPLETE

#### Component Organization:
```typescript
// ✅ Clean integration pattern established
export const CharacterPage: React.FC = React.memo(() => {
  const [tabValue, setTabValue] = useState(0);
  
  return (
    <Container maxWidth="xl">
      {/* Tab navigation */}
      <Tabs value={tabValue} onChange={handleTabChange}>
        {/* Tab panels with feature components */}
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        <PlayerStats />
      </TabPanel>
      {/* Additional tab panels */}
    </Container>
  );
});
```

## 7. Skills (Optional - High Level) 📋 PLANNED

*   **Skill System Overview:** ✅ **SHELL READY** - PlaceholderPage component provides comprehensive planning for skill system integration.
*   **Skill Points:** How are they gained and spent? (e.g., through leveling, specific traits, quest rewards, milestones).
*   *(Detailed skill specifications belong in a separate `SkillsSystem.md`)*

### 7.1. Skills Shell Implementation ✅ COMPLETE

**PlaceholderPage Integration**: Skills tab includes comprehensive feature planning
- **Skill Trees**: Multiple progression paths for different playstyles
- **Active Abilities**: Combat and utility skills with cooldowns  
- **Passive Abilities**: Permanent stat bonuses and special effects
- **Skill Points**: Earned through leveling and quest completion
- **Specialization**: Focus on combat, social, or utility skill branches
- **Skill Synergies**: Combinations providing additional bonuses

## 8. Player State Management ✅ ENHANCED

*   **Initial State:** Default values for a new character (`PlayerInitialState`), including initial Copy Limit.
*   **Saving/Loading:** What parts of the player state need to be persisted? (Includes all stats, attributes, inventory, relationships, **and references to owned Copies**).
*   **State Updates:** How is the player state modified by game events (combat, resting, using items, **creating/managing Copies**, etc.)?

### 8.1. Enhanced Selectors ✅ IMPLEMENTED

**PlayerSelectors.ts**: Comprehensive selector implementation
```typescript
// ✅ Enhanced selectors for UI integration
export const selectPlayerHealth = createSelector(
  [selectPlayerStats],
  (stats) => ({
    current: stats.health,
    max: stats.maxHealth,
    percentage: stats.maxHealth > 0 ? (stats.health / stats.maxHealth) * 100 : 0
  })
);

export const selectPlayerMana = createSelector(
  [selectPlayerStats], 
  (stats) => ({
    current: stats.mana,
    max: stats.maxMana,
    percentage: stats.maxMana > 0 ? (stats.mana / stats.maxMana) * 100 : 0
  })
);
```

### 8.2. Component Architecture ✅ ESTABLISHED

**Feature-Sliced Organization**: Complete component structure
```
src/features/Player/
├── components/
│   ├── containers/
│   │   └── PlayerTraits.tsx     // ✅ Container patterns
│   └── ui/
│       ├── PlayerStats.tsx      // ✅ Pure UI components
│       ├── PlayerTraits.tsx     // ✅ Trait management UI
│       └── PlayerEquipment.tsx  // ✅ Equipment visualization
├── state/
│   └── PlayerSelectors.ts       // ✅ Enhanced selectors
└── index.ts                     // ✅ Public API exports
```

## 9. UI/UX Considerations ✅ IMPLEMENTED

*   **Character Sheet Display**: ✅ **COMPLETE** - Comprehensive character sheet with tabbed organization
*   **Stats Display**: ✅ **COMPLETE** - Visual stat display with progress bars and color coding
*   **Trait Management**: ✅ **COMPLETE** - Equipment visual interface with quick actions  
*   **Interface for spending attribute/skill points**: 📋 **SHELL READY** - Architecture prepared for point allocation
*   **Integration with Copy Management UI**: 📋 **PLANNED** - Architecture ready for Copy system integration

### 9.1. Visual Design Standards ✅ IMPLEMENTED

**Material-UI Integration**: Consistent design system throughout
- **Card Layout**: Organized information display with proper spacing
- **Grid System**: Responsive layout adapting to screen sizes
- **Color System**: Semantic colors for different stat types and states
- **Typography**: Consistent text hierarchy and readable font sizes
- **Icon System**: Material Icons for visual consistency and recognition

### 9.2. Accessibility Standards ✅ COMPLETE

**WCAG 2.1 AA Compliance**: Full accessibility implementation
- **Keyboard Navigation**: Complete keyboard support for all interactions
- **Screen Reader Support**: Comprehensive ARIA labeling and announcements
- **Color Independence**: Information conveyed through multiple visual cues
- **Focus Management**: Logical focus order and visible focus indicators
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility

### 9.3. Performance Standards ✅ OPTIMIZED

**React Performance Best Practices**: Efficient rendering and state management
- **Component Memoization**: React.memo applied to prevent unnecessary re-renders
- **Callback Memoization**: useCallback for stable event handler references
- **Selector Optimization**: createSelector for derived state calculations
- **Conditional Rendering**: Tab content loaded only when active for efficiency

The Player System now provides a complete character management interface that integrates seamlessly with the existing game architecture while maintaining excellent performance and accessibility standards.
