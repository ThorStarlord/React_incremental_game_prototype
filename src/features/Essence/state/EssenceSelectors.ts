/**
 * Redux selectors for Essence-related state
 */
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';

// Basic selectors
export const selectEssenceAmount = (state: RootState) => state.essence.amount;
// Use totalCollected instead of totalEarned
export const selectTotalCollected = (state: RootState) => state.essence.totalCollected;
// Add export for maxAmount
export const selectEssenceMaxAmount = (state: RootState) => state.essence.maxAmount;

// Generator selectors
export const selectAllGenerators = (state: RootState) => state.essence.generators;
export const selectGenerator = (generatorType: string) => 
  (state: RootState) => state.essence.generators[generatorType];
export const selectUnlockedGenerators = (state: RootState) => 
  Object.values(state.essence.generators).filter(generator => generator.unlocked);

// Upgrade selectors
export const selectAllUpgrades = (state: RootState) => state.essence.upgrades;
export const selectUpgrade = (upgradeType: string) => 
  (state: RootState) => state.essence.upgrades[upgradeType];
export const selectUnlockedUpgrades = (state: RootState) => 
  Object.values(state.essence.upgrades).filter(upgrade => upgrade.unlocked);

// Calculation selectors
export const selectEssencePerSecond = createSelector(
  (state: RootState) => state.essence.perSecond,
  perSecond => Math.floor(perSecond)
);
export const selectEssenceMultiplier = (state: RootState) => state.essence.multiplier;
export const selectEssenceGenerationRate = (state: RootState) => state.essence.generationRate;

// Export the number of active NPC connections
export const selectNpcConnections = (state: RootState) => state.essence.npcConnections;
