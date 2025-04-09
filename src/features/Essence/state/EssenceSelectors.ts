/**
 * Redux selectors for Essence-related state
 */
import { RootState } from '../../../app/store';

// Basic selectors
export const selectEssenceAmount = (state: RootState) => state.essence.amount;
// Use totalCollected instead of totalEarned
export const selectTotalCollected = (state: RootState) => state.essence.totalCollected;

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
export const selectEssencePerSecond = (state: RootState) => state.essence.perSecond;
export const selectEssenceMultiplier = (state: RootState) => state.essence.multiplier;
export const selectEssenceGenerationRate = (state: RootState) => state.essence.generationRate;
