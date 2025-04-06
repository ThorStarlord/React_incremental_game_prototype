/**
 * Redux slice for Minions state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  MinionsState,
  Minion,
  MinionTask,
  MinionAssignment,
  CreateMinionPayload,
  UpdateMinionPayload,
  AssignTaskPayload,
  CompleteTaskPayload,
  AddExperiencePayload,
  UpgradeStatPayload,
  AddTraitPayload,
  RemoveTraitPayload,
  FeedMinionPayload,
  PurchaseUpgradePayload,
  RemoveMinionPayload,
  UpdateConfigPayload,
  UpdateSimulationSettingsPayload,
  UnlockSlotPayload,
  UnlockTaskPayload,
  ProcessSimulationTickPayload
} from './MinionsTypes';

import {
  createMinion,
  assignTask,
  completeTask,
  purchaseUpgrade,
  unlockSlot,
  processSimulationTick
} from './MinionsThunks';

/**
 * Initial state for the minions slice
 */
const initialState: MinionsState = {
  minions: {},
  availableTasks: [],
  upgrades: {},
  traits: {},
  specializations: {},
  maxMinionSlots: 10,
  unlockedMinionSlots: 1,
  nextSlotCost: 100,
  config: {
    autoAssign: false,
    notifyOnCompletion: true,
    defaultAssignment: 'idle'
  },
  lastUpdate: Date.now(),
  isLoading: false,
  error: null,
  selectedMinionId: null,
  simulation: {
    running: false,
    interval: 5000,
    lastProcessed: Date.now()
  }
};

/**
 * Calculate experience needed for a level
 */
const calculateExpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * Check if level up is needed and return new level
 */
const checkLevelUp = (experience: number, currentLevel: number): number => {
  let level = currentLevel;
  
  // Check if experience is enough for next level
  while (experience >= calculateExpForLevel(level + 1)) {
    level++;
  }
  
  return level;
};

/**
 * Minions slice with reducers
 */
const minionsSlice = createSlice({
  name: 'minions',
  initialState,
  reducers: {
    /**
     * Create a new minion
     */
    addMinion(state, action: PayloadAction<CreateMinionPayload>) {
      const { name, type, rarity = 'common', traits = [] } = action.payload;
      
      // Make sure we have room for a new minion
      if (Object.keys(state.minions).length >= state.unlockedMinionSlots) {
        state.error = 'All minion slots are filled. Unlock more slots to add minions.';
        return;
      }
      
      // Create a new minion with default values
      const newMinion: Minion = {
        id: uuidv4(),
        name,
        type,
        level: 1,
        experience: 0,
        stats: {
          strength: 5,
          dexterity: 5,
          intelligence: 5,
          stamina: 5
        },
        abilities: [],
        assignment: null,
        unlocked: true,
        rarity,
        loyalty: 50,
        fatigue: 0,
        recoveryRate: 5,
        createdAt: Date.now(),
        traits
      };
      
      // Add minion to state
      state.minions[newMinion.id] = newMinion;
      
      // Clear any error
      state.error = null;
    },
    
    /**
     * Update an existing minion
     */
    updateMinion(state, action: PayloadAction<UpdateMinionPayload>) {
      const { minionId, updates } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      // Update the minion, spreading the updates over the existing data
      state.minions[minionId] = {
        ...state.minions[minionId],
        ...updates,
        // Preserve the ID
        id: minionId
      };
      
      state.error = null;
    },
    
    /**
     * Remove a minion
     */
    removeMinion(state, action: PayloadAction<RemoveMinionPayload>) {
      const { minionId } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      // Remove the minion
      delete state.minions[minionId];
      
      // If this was the selected minion, clear selection
      if (state.selectedMinionId === minionId) {
        state.selectedMinionId = null;
      }
      
      state.error = null;
    },
    
    /**
     * Assign a task to a minion
     */
    assignMinionTask(state, action: PayloadAction<AssignTaskPayload>) {
      const { minionId, taskId, locationId } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      const task = state.availableTasks.find(t => t.id === taskId);
      if (!task) {
        state.error = `Task with ID ${taskId} not found.`;
        return;
      }
      
      // Create a new assignment
      const assignment: MinionAssignment = {
        id: uuidv4(),
        type: task.id.includes('gather') ? 'gathering' : 
              task.id.includes('craft') ? 'crafting' : 
              task.id.includes('combat') ? 'combat' : 'exploration',
        taskId,
        locationId,
        startTime: Date.now(),
        duration: task.duration,
        completed: false,
        progress: 0
      };
      
      // Assign the task
      state.minions[minionId].assignment = assignment;
      
      // Reset fatigue
      state.minions[minionId].fatigue = 0;
      
      state.error = null;
    },
    
    /**
     * Complete a task
     */
    completeTaskManually(state, action: PayloadAction<CompleteTaskPayload>) {
      const { minionId, success, rewards } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      const minion = state.minions[minionId];
      if (!minion.assignment) {
        state.error = `Minion ${minion.name} is not assigned to any task.`;
        return;
      }
      
      // Mark task as completed
      minion.assignment.completed = true;
      
      // Add experience
      if (rewards) {
        const newExp = minion.experience + rewards.experience;
        minion.experience = newExp;
        
        // Check if minion leveled up
        const newLevel = checkLevelUp(newExp, minion.level);
        if (newLevel > minion.level) {
          minion.level = newLevel;
        }
      }
      
      // Add fatigue
      minion.fatigue = Math.min(100, minion.fatigue + 15);
      
      state.error = null;
    },
    
    /**
     * Feed a minion to reduce fatigue and increase loyalty
     */
    feedMinion(state, action: PayloadAction<FeedMinionPayload>) {
      const { minionId, foodId, quality } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      const minion = state.minions[minionId];
      
      // Reduce fatigue based on food quality
      minion.fatigue = Math.max(0, minion.fatigue - quality * 10);
      
      // Increase loyalty based on food quality
      minion.loyalty = Math.min(100, minion.loyalty + quality * 2);
      
      // Record feeding time
      minion.lastFed = Date.now();
      
      state.error = null;
    },
    
    /**
     * Add a trait to a minion
     */
    addTrait(state, action: PayloadAction<AddTraitPayload>) {
      const { minionId, traitId } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      if (!state.traits[traitId]) {
        state.error = `Trait with ID ${traitId} not found.`;
        return;
      }
      
      const minion = state.minions[minionId];
      
      // Initialize traits array if needed
      if (!minion.traits) {
        minion.traits = [];
      }
      
      // Check if trait already exists
      if (minion.traits.includes(traitId)) {
        state.error = `Minion already has the trait ${state.traits[traitId].name}.`;
        return;
      }
      
      // Check for incompatible traits
      const trait = state.traits[traitId];
      if (trait.incompatible) {
        const hasIncompatible = minion.traits.some(existingTraitId => 
          trait.incompatible?.includes(existingTraitId)
        );
        
        if (hasIncompatible) {
          state.error = `Trait ${trait.name} is incompatible with one of the minion's existing traits.`;
          return;
        }
      }
      
      // Add trait
      minion.traits.push(traitId);
      
      // Apply trait bonuses to stats
      if (trait.bonuses) {
        Object.entries(trait.bonuses).forEach(([stat, value]) => {
          if (minion.stats[stat] !== undefined) {
            minion.stats[stat] += value;
          } else {
            minion.stats[stat] = value;
          }
        });
      }
      
      state.error = null;
    },
    
    /**
     * Remove a trait from a minion
     */
    removeTrait(state, action: PayloadAction<RemoveTraitPayload>) {
      const { minionId, traitId } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      const minion = state.minions[minionId];
      
      if (!minion.traits || !minion.traits.includes(traitId)) {
        state.error = `Minion does not have the specified trait.`;
        return;
      }
      
      // Remove trait
      minion.traits = minion.traits.filter(id => id !== traitId);
      
      // Remove trait bonuses from stats
      const trait = state.traits[traitId];
      if (trait && trait.bonuses) {
        Object.entries(trait.bonuses).forEach(([stat, value]) => {
          if (minion.stats[stat] !== undefined) {
            minion.stats[stat] -= value;
          }
        });
      }
      
      state.error = null;
    },
    
    /**
     * Upgrade a minion's stat
     */
    upgradeStat(state, action: PayloadAction<UpgradeStatPayload>) {
      const { minionId, stat, amount, cost } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      const minion = state.minions[minionId];
      
      // Check if the stat exists
      if (minion.stats[stat] === undefined) {
        state.error = `Stat ${stat} does not exist for this minion.`;
        return;
      }
      
      // Increase the stat
      minion.stats[stat] += amount;
      
      state.error = null;
    },
    
    /**
     * Add experience to a minion
     */
    addExperience(state, action: PayloadAction<AddExperiencePayload>) {
      const { minionId, amount } = action.payload;
      
      if (!state.minions[minionId]) {
        state.error = `Minion with ID ${minionId} not found.`;
        return;
      }
      
      const minion = state.minions[minionId];
      
      // Add experience
      const newExp = minion.experience + amount;
      minion.experience = newExp;
      
      // Check if minion leveled up
      const newLevel = checkLevelUp(newExp, minion.level);
      if (newLevel > minion.level) {
        minion.level = newLevel;
      }
      
      state.error = null;
    },
    
    /**
     * Select a minion
     */
    selectMinion(state, action: PayloadAction<string | null>) {
      state.selectedMinionId = action.payload;
    },
    
    /**
     * Update minion configuration
     */
    updateConfig(state, action: PayloadAction<UpdateConfigPayload>) {
      state.config = {
        ...state.config,
        ...action.payload.config
      };
    },
    
    /**
     * Update simulation settings
     */
    updateSimulationSettings(state, action: PayloadAction<UpdateSimulationSettingsPayload>) {
      if (action.payload.running !== undefined) {
        state.simulation.running = action.payload.running;
      }
      
      if (action.payload.interval !== undefined) {
        state.simulation.interval = action.payload.interval;
      }
    },
    
    /**
     * Add a new task
     */
    addTask(state, action: PayloadAction<MinionTask>) {
      // Check if task already exists
      const existingTaskIndex = state.availableTasks.findIndex(t => t.id === action.payload.id);
      
      if (existingTaskIndex >= 0) {
        // Update existing task
        state.availableTasks[existingTaskIndex] = action.payload;
      } else {
        // Add new task
        state.availableTasks.push(action.payload);
      }
    },
    
    /**
     * Clear error message
     */
    clearError(state) {
      state.error = null;
    },
    
    /**
     * Reset minions state
     */
    resetMinions() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // Handle createMinion thunk
    builder.addCase(createMinion.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createMinion.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createMinion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to create minion';
    });
    
    // Handle assignTask thunk
    builder.addCase(assignTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(assignTask.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(assignTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to assign task';
    });
    
    // Handle completeTask thunk
    builder.addCase(completeTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(completeTask.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(completeTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to complete task';
    });
    
    // Handle purchaseUpgrade thunk
    builder.addCase(purchaseUpgrade.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(purchaseUpgrade.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(purchaseUpgrade.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to purchase upgrade';
    });
    
    // Handle unlockSlot thunk
    builder.addCase(unlockSlot.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(unlockSlot.fulfilled, (state) => {
      state.isLoading = false;
      state.unlockedMinionSlots += 1;
      state.nextSlotCost = Math.floor(state.nextSlotCost * 1.5); // Increase cost for next slot
    });
    builder.addCase(unlockSlot.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to unlock slot';
    });
    
    // Handle processSimulationTick thunk
    builder.addCase(processSimulationTick.fulfilled, (state, action) => {
      state.lastUpdate = action.payload.timestamp;
      state.simulation.lastProcessed = action.payload.timestamp;
    });
  }
});

// Export actions
export const {
  addMinion,
  updateMinion,
  removeMinion,
  assignMinionTask,
  completeTaskManually,
  feedMinion,
  addTrait,
  removeTrait,
  upgradeStat,
  addExperience,
  selectMinion,
  updateConfig,
  updateSimulationSettings,
  addTask,
  clearError,
  resetMinions
} = minionsSlice.actions;

// Export reducer
export default minionsSlice.reducer;
