# Battle Component Documentation

## Overview

The Battle component manages turn-based combat encounters between the player and enemies in the Incremental RPG game. It handles combat mechanics, player/enemy stats, combat actions, battle log, and combat outcomes (victory/defeat).

**File Location:** `src/features/Combat/components/container/Battle.tsx`

## Props Interface

```typescript
interface BattleProps {
  dungeonId: string;         // ID of the current dungeon
  onExplorationComplete: () => void;  // Callback when combat ends
}
```

- `dungeonId`: String identifier for the current dungeon where the battle is taking place. This can be used to load appropriate enemies, set encounter difficulty, or apply dungeon-specific modifiers.
- `onExplorationComplete`: Callback function invoked when the battle concludes (through victory, defeat, or other means). Allows the parent component to handle post-combat transitions.

## Internal Interfaces

```typescript
interface TraitEffect {
  traitName: string;        // Name of the trait that triggered the effect
  description: string;      // Description of what the effect does
  value: string | number;   // Effect magnitude or display text
}

interface LogEntry {
  text: string;             // Message text for the combat log
  type: string;             // Type of log entry (e.g., 'player-attack', 'enemy-attack', 'victory')
}
```

## State Management

The Battle component maintains several key pieces of state:

### Combat State

Initialized from `combatInitialState` and extended with battle-specific data:
- `active`: Boolean indicating if combat is ongoing
- `playerTurn`: Boolean tracking whose turn it is
- `round`: Number tracking the current combat round
- `player`: Object containing player combat stats (health, mana, etc.)
- `enemy`: Object containing enemy stats and information
- `log`: Array of combat log entries tracking battle events
- `rewards`: Object containing rewards for victory (set after combat ends)

### UI State

- `traitEffect`: Tracks the currently displayed trait effect popup
- `animationEffect`: Manages the visual effect animation for trait activations
- `mousePos`: Tracks mouse position for positioning effect animations

## Key Methods

### Combat Core Functions

#### `calculateDamage(isPlayerAttacking: boolean): number`

Calculates damage dealt in an attack based on attacker and defender stats.

- **Parameters**: 
  - `isPlayerAttacking`: Boolean indicating if the player is attacking (true) or being attacked (false)
- **Returns**: Number representing the final damage value
- **Details**: 
  - Uses combatState.enemy stats and calculatedStats from traits
  - Applies a random variance (-2 to +2) to damage
  - Ensures minimum damage of 1

#### `handleAttack(): void`

Processes the player's attack action and its consequences.

- **Flow**:
  1. Calculates damage to enemy
  2. Updates combat log
  3. Checks for and applies trait effects
  4. Updates enemy health
  5. Determines if enemy is defeated
  6. Handles victory or transitions to enemy turn

#### `enemyTurn(): void`

Handles the enemy's attack against the player.

- **Flow**:
  1. Calculates damage to player
  2. Updates combat log
  3. Updates player health
  4. Updates main game state via dispatch
  5. Checks if player is defeated
  6. Transitions back to player turn if not defeated

#### `handleVictory(): void` & `handleDefeat(): void`

Handle the conclusion of combat with appropriate rewards, notifications, and state updates.

### Effect Management

#### `showTraitEffect(effect: TraitEffect): void`

Displays a trait effect animation and dialog to the player.

- **Parameters**:
  - `effect`: TraitEffect object containing effect details
- **Details**:
  - Sets both the dialog and animation state
  - Uses a timeout to automatically clear the animation

#### `addLogEntry(entry: LogEntry): void`

Adds an entry to the combat log with appropriate metadata.

- **Parameters**:
  - `entry`: Object containing `text` and `type` properties
- **Details**:
  - Adds timestamp and importance level
  - Automatically scrolls the log to show new entries

## Usage Example

```tsx
import React from 'react';
import Battle from '../../features/Combat/components/container/Battle';

const DungeonScreen = () => {
  const handleCombatComplete = () => {
    console.log('Combat finished, returning to dungeon exploration');
    // Handle post-combat logic, like returning to dungeon map
  };

  return (
    <div className="dungeon-screen">
      <h2>Dark Forest Dungeon</h2>
      
      {/* Combat encounter */}
      <Battle 
        dungeonId="dark_forest_1" 
        onExplorationComplete={handleCombatComplete} 
      />
    </div>
  );
};

export default DungeonScreen;
```

## Component Lifecycle

1. **Initialization**:
   - Sets up combat state from initial state and current player stats
   - Prepares UI elements and refs

2. **During Combat**:
   - Alternates between player and enemy turns
   - Updates health, combat log, and checks for victory/defeat conditions
   - Displays trait effects when triggered
   - Allows player to take actions (attack, skills, items)

3. **Combat Resolution**:
   - Processes victory or defeat
   - Calculates and awards rewards
   - Updates player state via context
   - Invokes the `onExplorationComplete` callback

## UI Structure

The Battle component renders a structured combat interface:

1. **Top Section**: Trait effect dialogs and animations
2. **Main Panel**: Battle information with round number
3. **Stats Area**: Player and enemy statistics with health/mana bars
4. **Action Buttons**: Attack, skills, and items
5. **Battle Log**: Scrollable log of combat events
6. **Result Actions**: Continue button (shown after combat concludes)

## Integration with Game Systems

The Battle component integrates with several core game systems:

- **Game State Context**: Reads player data and dispatches updates
- **Trait System**: Applies trait effects during combat via `useTraitEffects`
- **Theme System**: Uses theme colors and styling via `useThemeUtils`

## Performance Considerations

- Uses `useRef` for the battle log to avoid unnecessary re-renders when scrolling
- Implements timeouts for enemy turns and animations to create a turn-based feel
- Efficiently updates only necessary parts of the combat state
