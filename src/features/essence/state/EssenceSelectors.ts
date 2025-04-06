/**
 * Redux selectors for Essence-related state
 */
import { RootState } from '../../../app/store';

// Basic selectors
export const selectEssenceAmount = (state: RootState) => state.essence.amount;
export const selectTotalEarned = (state: RootState) => state.essence.totalEarned;
export const selectTotalSpent = (state: RootState) => state.essence.totalSpent;
export const selectEssenceTransactions = (state: RootState) => state.essence.transactions;

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
