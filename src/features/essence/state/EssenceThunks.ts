/**
 * Redux Thunks for Essence-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../../app/store';
import { 
  addNotification 
} from '../../Notifications/state/NotificationsSlice';
import { 
  GENERATOR_TYPES,
  EssenceSource,
  GainEssencePayload,
  PurchaseGeneratorPayload,
  PurchaseUpgradePayload
} from './EssenceTypes';

/**
 * Generate essence over time based on current generators and modifiers
 */
export const generateEssence = createAsyncThunk<
  number,
  void,
  { state: RootState }
>(
  'essence/generate',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const { 
      essence: { 
        perSecond, 
        multiplier, 
        generators, 
        upgrades, 
        mechanics 
      } 
    } = state;
    
    // Calculate base amount from generators
    let totalAmount = 0;
    
    // Add amount from each generator
    Object.entries(generators).forEach(([type, generator]) => {
      if (generator.unlocked && generator.owned > 0) {
        const generatorAmount = generator.owned * generator.baseProduction * generator.level;
        totalAmount += generatorAmount;
      }
    });
    
    // Apply global multiplier
    totalAmount *= multiplier;
    
    // Apply upgrade effects
    if (upgrades.autoGeneration && upgrades.autoGeneration.level > 0) {
      totalAmount *= (1 + (upgrades.autoGeneration.level * upgrades.autoGeneration.effect));
    }
    
    // Round to avoid floating point issues
    const finalAmount = Math.floor(totalAmount);
    
    // Dispatch action to add essence
    if (finalAmount > 0) {
      dispatch({
        type: 'essence/gainEssence',
        payload: {
          amount: finalAmount,
          source: 'auto_generation'
        }
      });
      
      // Occasionally notify the player (10% chance)
      if (Math.random() < 0.1) {
        dispatch(addNotification(
          `Generated ${finalAmount} essence from your generators`,
          'info',
          {
            duration: 3000,
            category: 'resource_gain'
          }
        ));
      }
    }
    
    return finalAmount;
  }
);

/**
 * Purchase a new essence generator
 */
export const purchaseGenerator = createAsyncThunk<
  boolean,
  PurchaseGeneratorPayload,
  { state: RootState }
>(
  'essence/purchaseGenerator',
  async ({ generatorType, quantity = 1 }, { dispatch, getState }) => {
    const state = getState();
    const { essence } = state;
    
    // Find the generator in state
    const generator = essence.generators[generatorType];
    
    if (!generator || !generator.unlocked) {
      return false;
    }
    
    // Calculate cost based on current ownership and formula
    // Cost formula: baseCost * (costMultiplier ^ owned)
    let totalCost = 0;
    let currentOwned = generator.owned;
    
    for (let i = 0; i < quantity; i++) {
      const cost = generator.baseCost * Math.pow(generator.costMultiplier, currentOwned);
      totalCost += Math.floor(cost);
      currentOwned++;
    }
    
    // Check if player has enough essence
    if (essence.amount < totalCost) {
      // Notify player if they can't afford it
      dispatch(addNotification(
        `Not enough essence to purchase ${quantity} ${generator.name}`,
        'warning',
        { duration: 3000 }
      ));
      return false;
    }
    
    // Spend essence
    dispatch({
      type: 'essence/spendEssence',
      payload: {
        amount: totalCost,
        purpose: `purchase_generator_${generatorType}`
      }
    });
    
    // Add generator(s)
    dispatch({
      type: 'essence/addGenerator',
      payload: {
        generatorType,
        quantity
      }
    });
    
    // Notify the player
    dispatch(addNotification(
      `Purchased ${quantity} ${generator.name} for ${totalCost} essence`,
      'success',
      { duration: 3000 }
    ));
    
    return true;
  }
);

/**
 * Purchase an essence upgrade
 */
export const purchaseUpgrade = createAsyncThunk<
  boolean,
  PurchaseUpgradePayload,
  { state: RootState }
>(
  'essence/purchaseUpgrade',
  async ({ upgradeType, levels = 1 }, { dispatch, getState }) => {
    const state = getState();
    const { essence } = state;
    
    // Find the upgrade in state
    const upgrade = essence.upgrades[upgradeType];
    
    if (!upgrade || !upgrade.unlocked) {
      return false;
    }
    
    // Check if already at max level
    if (upgrade.level >= upgrade.maxLevel) {
      dispatch(addNotification(
        `${upgrade.name} is already at maximum level`,
        'info',
        { duration: 3000 }
      ));
      return false;
    }
    
    // Calculate cost based on current level and formula
    // Cost formula: baseCost * (costMultiplier ^ level)
    let totalCost = 0;
    let currentLevel = upgrade.level;
    const maxPossibleLevels = Math.min(levels, upgrade.maxLevel - currentLevel);
    
    for (let i = 0; i < maxPossibleLevels; i++) {
      const cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel);
      totalCost += Math.floor(cost);
      currentLevel++;
    }
    
    // Check if player has enough essence
    if (essence.amount < totalCost) {
      // Notify player if they can't afford it
      dispatch(addNotification(
        `Not enough essence to upgrade ${upgrade.name}`,
        'warning',
        { duration: 3000 }
      ));
      return false;
    }
    
    // Spend essence
    dispatch({
      type: 'essence/spendEssence',
      payload: {
        amount: totalCost,
        purpose: `purchase_upgrade_${upgradeType}`
      }
    });
    
    // Add upgrade levels
    dispatch({
      type: 'essence/upgradeEssence',
      payload: {
        upgradeType,
        levels: maxPossibleLevels
      }
    });
    
    // Notify the player
    dispatch(addNotification(
      `Upgraded ${upgrade.name} to level ${upgrade.level + maxPossibleLevels}`,
      'success',
      { duration: 3000 }
    ));
    
    return true;
  }
);

/**
 * Auto-process essence generation for offline progress
 */
export const processOfflineProgress = createAsyncThunk<
  void,
  { lastTimestamp: number },
  { state: RootState }
>(
  'essence/processOfflineProgress',
  async ({ lastTimestamp }, { dispatch, getState }) => {
    const currentTime = Date.now();
    const elapsedTimeMs = currentTime - lastTimestamp;
    const elapsedSeconds = elapsedTimeMs / 1000;
    
    // Don't process if less than 10 seconds have passed
    if (elapsedSeconds < 10) return;
    
    const state = getState();
    const { essence } = state;
    
    // Calculate essence gained while offline
    let totalGained = 0;
    
    // Base calculation from perSecond rate
    totalGained = essence.perSecond * elapsedSeconds;
    
    // Apply offline penalties if configured (e.g., 50% efficiency when offline)
    const offlineEfficiency = 0.5; // Could be from settings
    totalGained *= offlineEfficiency;
    
    // Round to an integer
    totalGained = Math.floor(totalGained);
    
    if (totalGained > 0) {
      // Add the essence
      dispatch({
        type: 'essence/gainEssence',
        payload: {
          amount: totalGained,
          source: 'offline_progress'
        }
      });
      
      // Notify the player
      dispatch(addNotification(
        `You gained ${totalGained} essence while offline`,
        'info',
        { 
          duration: 5000,
          icon: 'offline_bolt'
        }
      ));
    }
  }
);

/**
 * Reset essence generators and get back some essence
 */
export const resetEssenceGenerators = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'essence/resetGenerators',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const { essence } = state;
    
    // Calculate essence to refund (e.g., 40% of spent essence)
    const refundRate = 0.4;
    let totalRefund = 0;
    
    // Calculate approximate essence spent on generators
    Object.values(essence.generators).forEach(generator => {
      if (generator.owned > 0) {
        // Simplified calculation
        const spentEssence = generator.baseCost * (Math.pow(generator.costMultiplier, generator.owned) - 1) / 
                            (generator.costMultiplier - 1);
        totalRefund += Math.floor(spentEssence * refundRate);
      }
    });
    
    // Reset generators
    dispatch({ type: 'essence/resetGenerators' });
    
    // Add refunded essence
    if (totalRefund > 0) {
      dispatch({
        type: 'essence/gainEssence',
        payload: {
          amount: totalRefund,
          source: 'generator_reset'
        }
      });
      
      // Notify the player
      dispatch(addNotification(
        `Generators reset! Received ${totalRefund} essence as refund`,
        'info',
        { duration: 5000 }
      ));
    }
  }
);
