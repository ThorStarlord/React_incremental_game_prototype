/**
 * Redux Thunks for Minions-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../../app/store';
import { 
  addNotification 
} from '../../Notifications/state/NotificationsSlice';
import {
  Minion,
  MinionTask,
  CreateMinionPayload,
  AssignTaskPayload,
  CompleteTaskPayload,
  PurchaseUpgradePayload,
  UnlockSlotPayload,
  ProcessSimulationTickPayload
} from './MinionsTypes';
import {
  addMinion,
  assignMinionTask,
  completeTaskManually,
  updateMinion,
  addExperience
} from './MinionsSlice';

/**
 * Calculate success chance for a minion's task
 * 
 * @param minion - The minion performing the task
 * @param task - The task being performed
 * @returns Success chance (0-1)
 */
const calculateSuccessChance = (minion: Minion, task: MinionTask): number => {
  // Base success chance (75%)
  let chance = 0.75;
  
  // Adjust based on minion's level relative to task required level
  const levelDifference = minion.level - task.requiredLevel;
  chance += levelDifference * 0.05; // 5% per level above requirement
  
  // Adjust based on minion's stats vs task requirements
  if (task.requirements.stats) {
    let statBonus = 0;
    let statCount = 0;
    
    Object.entries(task.requirements.stats).forEach(([stat, reqValue]) => {
      if (reqValue !== undefined && minion.stats[stat] !== undefined) {
        const statDiff = minion.stats[stat] - reqValue;
        statBonus += statDiff * 0.01; // 1% per stat point above requirement
        statCount++;
      }
    });
    
    // Average stat bonus
    if (statCount > 0) {
      chance += statBonus / statCount;
    }
  }
  
  // Adjust based on fatigue (0-100)
  chance -= (minion.fatigue / 100) * 0.2; // Up to 20% penalty for max fatigue
  
  // Adjust based on loyalty (0-100)
  chance += ((minion.loyalty - 50) / 100) * 0.1; // Up to 5% bonus for max loyalty
  
  // Adjustment for minion specialization
  if (minion.specialization) {
    const specializationMatch = task.requirements.specialization?.includes(minion.specialization);
    if (specializationMatch) {
      chance += 0.1; // 10% bonus for matching specialization
    }
  }
  
  // Add efficiency bonus if present
  if (task.efficiency) {
    chance *= task.efficiency;
  }
  
  // Ensure chance is between 0.1 and 0.95
  return Math.max(0.1, Math.min(0.95, chance));
};

/**
 * Calculate rewards for a task
 * 
 * @param minion - The minion completing the task
 * @param task - The completed task
 * @param success - Whether the task was successfully completed
 * @returns Rewards object
 */
const calculateTaskRewards = (
  minion: Minion, 
  task: MinionTask, 
  success: boolean
): CompleteTaskPayload['rewards'] => {
  const baseRewards = task.rewards;
  
  // If task failed, return reduced experience only
  if (!success) {
    return {
      experience: Math.floor(baseRewards.experience * 0.2) // 20% of normal XP for failure
    };
  }
  
  // Calculate level bonus (higher level = more rewards)
  const levelMultiplier = 1 + ((minion.level - task.requiredLevel) * 0.05);
  
  // Calculate loyalty bonus (higher loyalty = more rewards)
  const loyaltyMultiplier = 1 + ((minion.loyalty - 50) / 100 * 0.1);
  
  // Total multiplier
  const totalMultiplier = levelMultiplier * loyaltyMultiplier;
  
  // Calculate resources with multiplier
  const resources: Record<string, number> = {};
  if (baseRewards.resources) {
    Object.entries(baseRewards.resources).forEach(([resourceId, amount]) => {
      resources[resourceId] = Math.floor(amount * totalMultiplier);
    });
  }
  
  // Items have a chance to get bonus quantity based on level and luck
  const items: Record<string, number> = {};
  if (baseRewards.items) {
    Object.entries(baseRewards.items).forEach(([itemId, amount]) => {
      // 10% chance per level above requirement to get an extra item
      const bonusChance = (minion.level - task.requiredLevel) * 0.1;
      const bonusItems = Math.random() < bonusChance ? 1 : 0;
      
      items[itemId] = amount + bonusItems;
    });
  }
  
  return {
    resources,
    items,
    experience: Math.floor(baseRewards.experience * totalMultiplier)
  };
};

/**
 * Create a new minion
 */
export const createMinion = createAsyncThunk<
  Minion,
  CreateMinionPayload,
  { state: RootState }
>(
  'minions/createMinion',
  async (payload, { dispatch, getState }) => {
    const { name, type, rarity = 'common', traits = [] } = payload;
    
    // Create minion object
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
    dispatch(addMinion({
      name,
      type,
      rarity,
      traits
    }));
    
    // Show notification
    dispatch(addNotification(
      `New minion ${name} has joined your team!`,
      'success',
      {
        duration: 5000,
        category: 'minions'
      }
    ));
    
    return newMinion;
  }
);

/**
 * Assign a task to a minion
 */
export const assignTask = createAsyncThunk<
  { minionId: string; taskId: string },
  AssignTaskPayload,
  { state: RootState }
>(
  'minions/assignTask',
  async (payload, { dispatch, getState }) => {
    const { minionId, taskId, locationId } = payload;
    const state = getState();
    
    // Get minion and task
    const minion = state.minions.minions[minionId];
    const task = state.minions.availableTasks.find(t => t.id === taskId);
    
    if (!minion) {
      throw new Error(`Minion with ID ${minionId} not found.`);
    }
    
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found.`);
    }
    
    // Assign task
    dispatch(assignMinionTask({
      minionId,
      taskId,
      locationId
    }));
    
    // Show notification
    dispatch(addNotification(
      `Assigned ${minion.name} to ${task.name}`,
      'info',
      {
        duration: 3000,
        category: 'minions'
      }
    ));
    
    return { minionId, taskId };
  }
);

/**
 * Complete a task
 */
export const completeTask = createAsyncThunk<
  { minionId: string; success: boolean; rewards: CompleteTaskPayload['rewards'] },
  { minionId: string },
  { state: RootState }
>(
  'minions/completeTask',
  async (payload, { dispatch, getState }) => {
    const { minionId } = payload;
    const state = getState();
    
    // Get minion
    const minion = state.minions.minions[minionId];
    
    if (!minion) {
      throw new Error(`Minion with ID ${minionId} not found.`);
    }
    
    if (!minion.assignment || minion.assignment.completed) {
      throw new Error(`Minion ${minion.name} is not on an active task.`);
    }
    
    // Get task
    const task = state.minions.availableTasks.find(t => t.id === minion.assignment?.taskId);
    
    if (!task) {
      throw new Error(`Task not found for minion ${minion.name}.`);
    }
    
    // Determine if task was successful
    const successChance = calculateSuccessChance(minion, task);
    const success = Math.random() < successChance;
    
    // Calculate rewards
    const rewards = calculateTaskRewards(minion, task, success);
    
    // Complete the task
    dispatch(completeTaskManually({
      minionId,
      success,
      rewards
    }));
    
    // Add resources to player
    if (success && rewards.resources) {
      dispatch({
        type: 'resources/add',
        payload: rewards.resources
      });
    }
    
    // Add items to player inventory
    if (success && rewards.items) {
      Object.entries(rewards.items).forEach(([itemId, quantity]) => {
        dispatch({
          type: 'inventory/addItem',
          payload: {
            itemId,
            quantity
          }
        });
      });
    }
    
    // Show notification
    const message = success
      ? `${minion.name} successfully completed ${task.name}!`
      : `${minion.name} failed to complete ${task.name}.`;
    
    dispatch(addNotification(
      message,
      success ? 'success' : 'warning',
      {
        duration: 5000,
        category: 'minions'
      }
    ));
    
    return { minionId, success, rewards };
  }
);

/**
 * Purchase an upgrade
 */
export const purchaseUpgrade = createAsyncThunk<
  { upgradeId: string },
  PurchaseUpgradePayload,
  { state: RootState }
>(
  'minions/purchaseUpgrade',
  async (payload, { dispatch, getState }) => {
    const { upgradeId, cost } = payload;
    const state = getState();
    
    // Get upgrade
    const upgrade = state.minions.upgrades[upgradeId];
    
    if (!upgrade) {
      throw new Error(`Upgrade with ID ${upgradeId} not found.`);
    }
    
    if (upgrade.purchased) {
      throw new Error(`Upgrade ${upgrade.name} is already purchased.`);
    }
    
    // Check if player has enough resources
    if (state.player.gold < cost) {
      throw new Error(`Not enough gold to purchase ${upgrade.name}.`);
    }
    
    // Deduct resources
    dispatch({
      type: 'player/removeGold',
      payload: cost
    });
    
    // Mark upgrade as purchased
    dispatch({
      type: 'minions/purchaseUpgrade',
      payload: upgradeId
    });
    
    // Apply upgrade effects based on type
    if (upgrade.effect.type === 'unlock_slot') {
      dispatch(unlockSlot({ cost: 0 })); // Cost already deducted
    }
    
    // Show notification
    dispatch(addNotification(
      `Purchased upgrade: ${upgrade.name}`,
      'success',
      {
        duration: 5000,
        category: 'minions'
      }
    ));
    
    return { upgradeId };
  }
);

/**
 * Unlock a minion slot
 */
export const unlockSlot = createAsyncThunk<
  { newSlotCount: number },
  UnlockSlotPayload,
  { state: RootState }
>(
  'minions/unlockSlot',
  async (payload, { dispatch, getState }) => {
    const { cost } = payload;
    const state = getState();
    
    // Check if there are available slots to unlock
    if (state.minions.unlockedMinionSlots >= state.minions.maxMinionSlots) {
      throw new Error('Maximum number of minion slots already unlocked.');
    }
    
    // Check if player has enough resources (if cost provided)
    if (cost > 0 && state.player.gold < cost) {
      throw new Error('Not enough gold to unlock a new minion slot.');
    }
    
    // Deduct resources if cost provided
    if (cost > 0) {
      dispatch({
        type: 'player/removeGold',
        payload: cost
      });
    }
    
    // Unlock slot is handled in the slice's extraReducers
    
    // Show notification
    dispatch(addNotification(
      'Unlocked a new minion slot!',
      'success',
      {
        duration: 5000,
        category: 'minions'
      }
    ));
    
    return { newSlotCount: state.minions.unlockedMinionSlots + 1 };
  }
);

/**
 * Process a simulation tick for all minions
 */
export const processSimulationTick = createAsyncThunk<
  ProcessSimulationTickPayload,
  void,
  { state: RootState }
>(
  'minions/processSimulationTick',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const timestamp = Date.now();
    
    // Check last processed time to avoid processing too frequently
    const minTime = 1000; // Minimum 1 second between processing
    if (timestamp - state.minions.simulation.lastProcessed < minTime) {
      return { timestamp };
    }
    
    const { minions } = state.minions;
    
    // Process each minion
    Object.values(minions).forEach(minion => {
      // Process assignment completion
      if (minion.assignment && !minion.assignment.completed) {
        const startTime = minion.assignment.startTime;
        const duration = minion.assignment.duration;
        
        // Check if task is complete
        if (timestamp >= startTime + duration) {
          dispatch(completeTask({ minionId: minion.id }));
        } else {
          // Update progress
          const progress = Math.min(100, ((timestamp - startTime) / duration) * 100);
          
          dispatch(updateMinion({
            minionId: minion.id,
            updates: {
              assignment: {
                ...minion.assignment,
                progress
              }
            }
          }));
        }
      }
      
      // Process fatigue recovery (only for idle minions)
      if (!minion.assignment && minion.fatigue > 0) {
        const recoveryRate = minion.recoveryRate || 5; // Default recovery rate
        const newFatigue = Math.max(0, minion.fatigue - (recoveryRate / 60)); // Recover per minute
        
        if (newFatigue !== minion.fatigue) {
          dispatch(updateMinion({
            minionId: minion.id,
            updates: { fatigue: newFatigue }
          }));
        }
      }
      
      // Process idle experience gain (very small amount)
      if (!minion.assignment) {
        const idleExpGain = 0.1; // Very small amount of XP per tick
        dispatch(addExperience({
          minionId: minion.id,
          amount: idleExpGain
        }));
      }
    });
    
    return { timestamp };
  }
);
