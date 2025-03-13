/**
 * @file CombatInitialState.ts
 * @description Defines the initial state for combat encounters.
 * Combat is turn-based with alternating player and enemy actions.
 */

import { 
  CombatState, 
  EnvironmentType,
  CombatStatus,
  CombatLogEntry 
} from '../types/CombatGameStateTypes';

const combatInitialState: CombatState = {
  // Core combat state properties
  active: false,          // Whether combat is active (required by interface)
  inCombat: false,         // Whether combat is active
  playerTurn: true,        // Whether it's the player's turn
  round: 0,                // Current combat round
  combatants: [],          // All actors in combat
  combatLog: [],           // History of combat actions
  activeEffects: {         // Active effects
    player: [],
    enemy: []
  },
  lastUpdated: Date.now(), // Timestamp of last update
  difficulty: 'normal',    // Default difficulty
  environment: EnvironmentType.Forest, // Default environment
  isAutoMode: false,       // Whether auto-combat is enabled
  
  // Additional properties needed by the interface
  status: CombatStatus.NOT_STARTED,  // Combat status
  activeEnemy: null,       // Currently active enemy
  playerEffects: [],       // Player-specific effects
  enemyEffects: [],        // Enemy-specific effects
  turnQueue: [],           // Turn order queue
  
  // Rewards structure
  rewards: {
    experience: 0,
    gold: 0,
    items: [],
    bonusLoot: []
  },
  
  // Legacy support - using 'log' for compatibility with some parts of the codebase
  log: []
};

export default combatInitialState;
