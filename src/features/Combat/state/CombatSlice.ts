/**
 * Redux slice for Combat state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  CombatState,
  StartCombatPayload,
  CombatActionPayload,
  EndCombatPayload,
  CombatSkill,
  CombatItem,
  CombatEnemy,
  CombatResult,
  StatusEffect
} from './CombatTypes';
import { createLogEntry } from '../hooks/battle/usePlayerActions/utils/logEntryFormatters';
import { endCombat, executeCombatAction, startCombat } from './CombatThunks';

/**
 * Initial state for the combat slice
 */
const initialState: CombatState = {
  active: false,
  playerTurn: true,
  round: 1,
  playerStats: {
    currentHealth: 100,
    maxHealth: 100,
    currentMana: 50,
    maxMana: 50
  },
  skills: [],
  items: [],
  effects: [],
  difficulty: 'normal',
  encounter: 0,
  totalEncounters: 1,
  log: [],
  result: null,
  loading: false
};

/**
 * Combat slice definition
 */
const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    /**
     * Set the player's stats for combat
     */
    setPlayerStats(state, action: PayloadAction<Partial<CombatState['playerStats']>>) {
      state.playerStats = {
        ...state.playerStats,
        ...action.payload
      };
    },
    
    /**
     * Set the enemy for combat
     */
    setEnemyStats(state, action: PayloadAction<CombatEnemy>) {
      state.enemyStats = action.payload;
    },
    
    /**
     * Update player's health
     */
    updatePlayerHealth(state, action: PayloadAction<number>) {
      state.playerStats.currentHealth = Math.max(
        0,
        Math.min(state.playerStats.maxHealth, action.payload)
      );
      
      // Add log entry
      state.log.push(
        createLogEntry(
          `Player health is now ${state.playerStats.currentHealth}/${state.playerStats.maxHealth}`,
          'info',
          'normal'
        )
      );
    },
    
    /**
     * Update enemy's health
     */
    updateEnemyHealth(state, action: PayloadAction<number>) {
      if (state.enemyStats) {
        state.enemyStats.currentHealth = Math.max(
          0,
          Math.min(state.enemyStats.maxHealth, action.payload)
        );
        
        // Add log entry
        state.log.push(
          createLogEntry(
            `${state.enemyStats.name}'s health is now ${state.enemyStats.currentHealth}/${state.enemyStats.maxHealth}`,
            'info',
            'normal'
          )
        );
      }
    },
    
    /**
     * Add a status effect
     */
    addStatusEffect(state, action: PayloadAction<StatusEffect>) {
      // Check if effect already exists
      const existingIndex = state.effects.findIndex(e => e.id === action.payload.id);
      
      if (existingIndex >= 0) {
        // Replace with longer duration if applicable
        state.effects[existingIndex] = {
          ...state.effects[existingIndex],
          duration: Math.max(state.effects[existingIndex].duration, action.payload.duration)
        };
      } else {
        // Add new effect
        state.effects.push(action.payload);
      }
      
      // Add log entry
      state.log.push(
        createLogEntry(
          `Effect applied: ${action.payload.name}`,
          'effect',
          'normal'
        )
      );
    },
    
    /**
     * Remove a status effect
     */
    removeStatusEffect(state, action: PayloadAction<string>) {
      state.effects = state.effects.filter(effect => effect.id !== action.payload);
    },
    
    /**
     * Set available skills for combat
     */
    setSkills(state, action: PayloadAction<CombatSkill[]>) {
      state.skills = action.payload;
    },
    
    /**
     * Update a skill's cooldown
     */
    updateSkillCooldown(state, action: PayloadAction<{ skillId: string, cooldown: number }>) {
      const skillIndex = state.skills.findIndex(s => s.id === action.payload.skillId);
      if (skillIndex >= 0) {
        state.skills[skillIndex].currentCooldown = action.payload.cooldown;
      }
    },
    
    /**
     * Set available items for combat
     */
    setItems(state, action: PayloadAction<CombatItem[]>) {
      state.items = action.payload;
    },
    
    /**
     * Use an item (reduce quantity)
     */
    useItem(state, action: PayloadAction<string>) {
      const itemIndex = state.items.findIndex(i => i.id === action.payload);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity -= 1;
        
        // Remove item if quantity is 0
        if (state.items[itemIndex].quantity <= 0) {
          state.items.splice(itemIndex, 1);
        }
        
        // Add log entry
        state.log.push(
          createLogEntry(
            `Used item: ${state.items[itemIndex]?.name || 'Unknown'}`,
            'item',
            'normal'
          )
        );
      }
    },
    
    /**
     * Add a log entry
     */
    addLogEntry(state, action: PayloadAction<{ message: string, type?: string, importance?: 'normal' | 'high' }>) {
      state.log.push(
        createLogEntry(
          action.payload.message,
          action.payload.type || 'info',
          action.payload.importance || 'normal'
        )
      );
    },
    
    /**
     * Change the turn (player/enemy)
     */
    changeTurn(state) {
      state.playerTurn = !state.playerTurn;
      
      // Increment round counter if it's now the player's turn
      if (state.playerTurn) {
        state.round += 1;
        
        // Add log entry
        state.log.push(
          createLogEntry(
            `Round ${state.round} begins`,
            'round',
            'normal'
          )
        );
      }
    },
    
    /**
     * Reset combat state
     */
    resetCombat() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // Handle start combat
    builder.addCase(startCombat.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(startCombat.fulfilled, (state, action) => {
      return {
        ...state,
        ...action.payload,
        active: true,
        loading: false
      };
    });
    builder.addCase(startCombat.rejected, (state) => {
      state.loading = false;
    });
    
    // Handle combat action execution
    builder.addCase(executeCombatAction.pending, (state) => {
      // Could set some loading state for the action if needed
    });
    builder.addCase(executeCombatAction.fulfilled, (state, action) => {
      if (action.payload.combatEnded) {
        state.active = false;
        state.result = action.payload.result;
      }
    });
    
    // Handle end combat
    builder.addCase(endCombat.fulfilled, (state, action) => {
      state.active = false;
      state.result = action.payload;
    });
  }
});

// Export actions
export const {
  setPlayerStats,
  setEnemyStats,
  updatePlayerHealth,
  updateEnemyHealth,
  addStatusEffect,
  removeStatusEffect,
  setSkills,
  updateSkillCooldown,
  setItems,
  useItem,
  addLogEntry,
  changeTurn,
  resetCombat
} = combatSlice.actions;

// Export reducer
export default combatSlice.reducer;
