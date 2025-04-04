import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  EssenceState, 
  EssenceGenerator, 
  GainEssencePayload, 
  SpendEssencePayload, 
  PurchaseGeneratorPayload, 
  PurchaseUpgradePayload,
  GENERATOR_TYPES,
  UPGRADE_TYPES
} from './EssenceTypes';

// Initial generators
const initialGenerators = {
  [GENERATOR_TYPES.BASIC]: {
    level: 0,
    baseCost: 10,
    costMultiplier: 1.15,
    baseProduction: 0.1,
    owned: 0,
    unlocked: true,
    name: "Minor Essence Crystal",
    description: "A small crystal that slowly generates essence over time."
  },
  [GENERATOR_TYPES.ADVANCED]: {
    level: 0,
    baseCost: 100,
    costMultiplier: 1.2,
    baseProduction: 1,
    owned: 0,
    unlocked: false,
    name: "Greater Essence Crystal",
    description: "A refined crystal with improved essence generation capabilities."
  }
};

// Initial upgrades
const initialUpgrades = {
  [UPGRADE_TYPES.CLICK_POWER]: {
    level: 0,
    baseCost: 25,
    costMultiplier: 2,
    effect: 1,
    maxLevel: 10,
    unlocked: true,
    name: "Enhanced Focus",
    description: "Increases essence gained from manual collection."
  },
  [UPGRADE_TYPES.AUTO_GENERATION]: {
    level: 0,
    baseCost: 50,
    costMultiplier: 2.5,
    effect: 0.2,
    maxLevel: 5,
    unlocked: false,
    name: "Essence Attunement",
    description: "Passively increases essence generation from all sources."
  }
};

// Initial state
const initialState: EssenceState = {
  amount: 0,
  totalCollected: 0,
  perSecond: 0,
  perClick: 1,
  multiplier: 1,
  unlocked: true,
  generators: initialGenerators,
  upgrades: initialUpgrades,
  mechanics: {
    autoCollectUnlocked: false,
    resonanceUnlocked: false
  },
  sources: [],
  notifications: [],
  maxAmount: 1000,
  lastUpdated: Date.now()
};

// Helper functions
const calculateGeneratorCost = (generator: EssenceGenerator, quantity: number = 1): number => {
  let cost = 0;
  for (let i = 0; i < quantity; i++) {
    cost += generator.baseCost * Math.pow(generator.costMultiplier, generator.owned + i);
  }
  return Math.floor(cost);
};

const calculateUpgradeCost = (upgrade: any, levels: number = 1): number => {
  let cost = 0;
  for (let i = 0; i < levels; i++) {
    cost += upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level + i);
  }
  return Math.floor(cost);
};

// Create the essence slice
const essenceSlice = createSlice({
  name: 'essence',
  initialState,
  reducers: {
    // Gain essence (e.g., from clicking, generators, etc.)
    gainEssence: (state, action: PayloadAction<GainEssencePayload>) => {
      const { amount, source = 'unknown' } = action.payload;
      
      // Ensure amount is positive
      if (amount <= 0) return;
      
      // Apply global multiplier
      const gainedAmount = Math.floor(amount * state.multiplier);
      
      // Add to current and total essence
      state.amount += gainedAmount;
      state.totalCollected += gainedAmount;
      
      // Cap at max amount if defined
      if (state.maxAmount && state.amount > state.maxAmount) {
        state.amount = state.maxAmount;
      }
      
      // Add notification (keeping only most recent 10)
      if (state.notifications) {
        state.notifications.unshift({
          id: `essence-gain-${Date.now()}`,
          message: `Gained essence from ${source}`,
          amount: gainedAmount,
          source,
          timestamp: Date.now()
        });
        
        // Only keep last 10 notifications
        state.notifications = state.notifications.slice(0, 10);
      }
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Spend essence (e.g., on upgrades, buildings, etc.)
    spendEssence: (state, action: PayloadAction<SpendEssencePayload>) => {
      const { amount, purpose = 'unknown' } = action.payload;
      
      // Ensure amount is positive and player has enough
      if (amount <= 0 || state.amount < amount) return;
      
      // Subtract from current essence
      state.amount -= amount;
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Purchase a generator
    purchaseGenerator: (state, action: PayloadAction<PurchaseGeneratorPayload>) => {
      const { generatorType, quantity = 1 } = action.payload;
      const generator = state.generators[generatorType];
      
      // Make sure generator exists and is unlocked
      if (!generator || !generator.unlocked) return;
      
      // Calculate cost for requested quantity
      const cost = calculateGeneratorCost(generator, quantity);
      
      // Check if player has enough essence
      if (state.amount < cost) return;
      
      // Spend essence
      state.amount -= cost;
      
      // Update generator
      generator.owned += quantity;
      generator.level += quantity;
      
      // Update per-second rate
      state.perSecond = calculateTotalPerSecond(state);
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Purchase an upgrade
    purchaseUpgrade: (state, action: PayloadAction<PurchaseUpgradePayload>) => {
      const { upgradeType, levels = 1 } = action.payload;
      const upgrade = state.upgrades[upgradeType];
      
      // Make sure upgrade exists, is unlocked, and hasn't reached max level
      if (!upgrade || !upgrade.unlocked || upgrade.level >= upgrade.maxLevel) return;
      
      // Calculate how many levels can actually be purchased
      const actualLevels = Math.min(levels, upgrade.maxLevel - upgrade.level);
      if (actualLevels <= 0) return;
      
      // Calculate cost
      const cost = calculateUpgradeCost(upgrade, actualLevels);
      
      // Check if player has enough essence
      if (state.amount < cost) return;
      
      // Spend essence
      state.amount -= cost;
      
      // Update upgrade level
      upgrade.level += actualLevels;
      
      // Apply upgrade effects
      applyUpgradeEffects(state, upgradeType, actualLevels);
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Unlock a new generator
    unlockGenerator: (state, action: PayloadAction<string>) => {
      const generatorType = action.payload;
      
      if (state.generators[generatorType]) {
        state.generators[generatorType].unlocked = true;
      }
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Unlock a new upgrade
    unlockUpgrade: (state, action: PayloadAction<string>) => {
      const upgradeType = action.payload;
      
      if (state.upgrades[upgradeType]) {
        state.upgrades[upgradeType].unlocked = true;
      }
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Update essence generation rate
    updateGenerationRate: (state) => {
      // Update per-second rate
      state.perSecond = calculateTotalPerSecond(state);
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Process essence generation (called periodically)
    processGeneration: (state, action: PayloadAction<number>) => {
      const deltaTime = action.payload; // Time in seconds since last update
      
      if (deltaTime <= 0 || state.perSecond <= 0) return;
      
      // Calculate essence gained during this period
      const generatedAmount = state.perSecond * deltaTime;
      
      // Add to current and total essence
      state.amount += generatedAmount;
      state.totalCollected += generatedAmount;
      
      // Cap at max amount if defined
      if (state.maxAmount && state.amount > state.maxAmount) {
        state.amount = state.maxAmount;
      }
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Set essence multiplier
    setMultiplier: (state, action: PayloadAction<number>) => {
      const newMultiplier = action.payload;
      
      if (newMultiplier > 0) {
        state.multiplier = newMultiplier;
      }
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Unlock a mechanic
    unlockMechanic: (state, action: PayloadAction<keyof EssenceState['mechanics']>) => {
      const mechanicName = action.payload;
      
      state.mechanics[mechanicName] = true;
      
      // Update timestamp
      state.lastUpdated = Date.now();
    },
    
    // Reset all essence (for testing/prestige)
    resetEssence: (state) => {
      state.amount = 0;
      state.perSecond = 0;
      state.perClick = initialState.perClick;
      
      Object.keys(state.generators).forEach(key => {
        state.generators[key].owned = 0;
        state.generators[key].level = 0;
      });
      
      Object.keys(state.upgrades).forEach(key => {
        state.upgrades[key].level = 0;
      });
      
      // Update timestamp
      state.lastUpdated = Date.now();
    }
  }
});

// Helper function to calculate total essence per second
function calculateTotalPerSecond(state: EssenceState): number {
  let total = 0;
  
  // Add generator production
  Object.values(state.generators).forEach(generator => {
    total += generator.baseProduction * generator.owned;
  });
  
  // Apply multipliers from upgrades
  if (state.upgrades[UPGRADE_TYPES.AUTO_GENERATION]) {
    const upgradeLevel = state.upgrades[UPGRADE_TYPES.AUTO_GENERATION].level;
    const upgradeEffect = state.upgrades[UPGRADE_TYPES.AUTO_GENERATION].effect;
    total *= (1 + (upgradeLevel * upgradeEffect));
  }
  
  // Apply global multiplier
  total *= state.multiplier;
  
  return total;
}

// Helper function to apply specific upgrade effects
function applyUpgradeEffects(state: EssenceState, upgradeType: string, levels: number): void {
  switch (upgradeType) {
    case UPGRADE_TYPES.CLICK_POWER:
      // Increase essence gained per click
      const clickPowerUpgrade = state.upgrades[UPGRADE_TYPES.CLICK_POWER];
      state.perClick += clickPowerUpgrade.effect * levels;
      break;
      
    case UPGRADE_TYPES.AUTO_GENERATION:
      // Update per-second rate based on upgrade
      state.perSecond = calculateTotalPerSecond(state);
      break;
      
    case UPGRADE_TYPES.MULTIPLIER:
      // Increase global multiplier if this upgrade exists
      if (state.upgrades[UPGRADE_TYPES.MULTIPLIER]) {
        const multiplierUpgrade = state.upgrades[UPGRADE_TYPES.MULTIPLIER];
        state.multiplier += multiplierUpgrade.effect * levels;
        state.perSecond = calculateTotalPerSecond(state);
      }
      break;
  }
}

// Export actions
export const {
  gainEssence,
  spendEssence,
  purchaseGenerator,
  purchaseUpgrade,
  unlockGenerator,
  unlockUpgrade,
  updateGenerationRate,
  processGeneration,
  setMultiplier,
  unlockMechanic,
  resetEssence
} = essenceSlice.actions;

// Selectors
export const selectEssence = (state: RootState) => state.essence;
export const selectEssenceAmount = (state: RootState) => state.essence.amount;
export const selectEssencePerSecond = (state: RootState) => state.essence.perSecond;
export const selectEssencePerClick = (state: RootState) => state.essence.perClick;
export const selectEssenceMultiplier = (state: RootState) => state.essence.multiplier;
export const selectGenerators = (state: RootState) => state.essence.generators;
export const selectUpgrades = (state: RootState) => state.essence.upgrades;
export const selectMechanics = (state: RootState) => state.essence.mechanics;

// Memoized selector for calculating the cost of a generator purchase
export const selectGeneratorCost = createSelector(
  [selectGenerators, (_state, generatorType: string) => generatorType, (_state, _generatorType, quantity = 1) => quantity],
  (generators, generatorType, quantity) => {
    const generator = generators[generatorType];
    if (!generator) return 0;
    return calculateGeneratorCost(generator, quantity);
  }
);

// Memoized selector for calculating the cost of an upgrade purchase
export const selectUpgradeCost = createSelector(
  [selectUpgrades, (_state, upgradeType: string) => upgradeType, (_state, _upgradeType, levels = 1) => levels],
  (upgrades, upgradeType, levels) => {
    const upgrade = upgrades[upgradeType];
    if (!upgrade) return 0;
    return calculateUpgradeCost(upgrade, levels);
  }
);

// Export reducer
export default essenceSlice.reducer;
