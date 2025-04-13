import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PlayerState,
  PlayerInitialState,
  StatusEffect,
  SetNamePayload,
  ResetPlayerPayload,
  RestPayload,
  HealthModificationPayload,
  EnergyModificationPayload,
  ActiveCharacterPayload,
  AttributeUpdatePayload,
  AttributeAllocationPayload,
  SkillUpdatePayload,
  SkillIdPayload,
  SkillUpgradePayload,
  TraitPayload,
  StatusEffectIdPayload,
  StatUpdatePayload,
  UpdateAttributesPayload,
  UpdateStatsPayload,
  UpdateTotalPlayTimePayload
} from './PlayerTypes';

// Use the initial state from the types file
const initialState: PlayerState = PlayerInitialState;

// Helper functions
function calculateSkillLevel(experience: number): number {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

// Create slice
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Core player actions
    updatePlayer: (state, action: PayloadAction<Partial<PlayerState>>) => {
      return { ...state, ...action.payload };
    },
    
    setName: (state, action: PayloadAction<SetNamePayload>) => {
      if (action.payload.name.trim() !== '') {
        state.name = action.payload.name;
      }
    },
    
    resetPlayer: (state, action: PayloadAction<ResetPlayerPayload>) => {
      const keepName = action.payload?.keepName === true;
      const currentName = keepName ? state.name : '';
      const creationDate = state.creationDate;
      
      // Reset state to initial values
      Object.assign(state, initialState);
      
      // Preserve name and creation date if needed
      if (keepName) {
        state.name = currentName;
      }
      state.creationDate = creationDate || new Date().toISOString();
    },
    
    rest: (state, action: PayloadAction<RestPayload>) => {
      const { duration, location } = action.payload;
      
      // Calculate recovery amounts
      const healthRecovery = Math.min(
        state.stats.maxHealth - state.stats.health,
        Math.floor((state.stats.healthRegen || 1) * duration)
      );
      
      const manaRecovery = Math.min(
        state.stats.maxMana - state.stats.mana,
        Math.floor((state.stats.manaRegen || 1) * duration)
      );
      
      // Apply recovery
      state.stats.health += healthRecovery;
      state.stats.mana += manaRecovery;
      state.lastRestLocation = location || state.lastRestLocation;
      state.lastRestTime = Date.now();
    },
    
    modifyHealth: (state, action: PayloadAction<HealthModificationPayload>) => {
      const { amount } = action.payload;
      state.stats.health = Math.max(0, Math.min(state.stats.maxHealth, state.stats.health + amount));
    },
    
    modifyEnergy: (state, action: PayloadAction<EnergyModificationPayload>) => {
      const { amount } = action.payload;
      state.stats.mana = Math.max(0, Math.min(state.stats.maxMana, state.stats.mana + amount));
    },
    
    setActiveCharacter: (state, action: PayloadAction<ActiveCharacterPayload>) => {
      state.activeCharacterId = action.payload.characterId;
    },
    
    updateTotalPlayTime: (state, action: PayloadAction<UpdateTotalPlayTimePayload>) => {
      if (action.payload.amount > 0) {
        state.totalPlayTime += action.payload.amount;
      }
    },
    
    // Attribute actions
    updateAttribute: (state, action: PayloadAction<AttributeUpdatePayload>) => {
      const { attributeId, value } = action.payload;
      
      if (state.attributes[attributeId]) {
        state.attributes[attributeId].value = value;
      }
    },
    
    updateAttributes: (state, action: PayloadAction<UpdateAttributesPayload>) => {
      Object.entries(action.payload).forEach(([attributeId, value]) => {
        if (state.attributes[attributeId]) {
          state.attributes[attributeId].value = value;
        }
      });
    },
    
    allocateAttribute: (state, action: PayloadAction<AttributeAllocationPayload>) => {
      const { attributeId, amount } = action.payload;
      
      // Only proceed if there are enough attribute points
      if (state.attributePoints >= amount && amount > 0 && state.attributes[attributeId]) {
        // Decrease available points
        state.attributePoints -= amount;
        
        // Increase the attribute
        state.attributes[attributeId].baseValue += amount;
        state.attributes[attributeId].value += amount;
      }
    },
    
    // Skill actions
    updateSkill: (state, action: PayloadAction<SkillUpdatePayload>) => {
      const { skillId, experience } = action.payload;
      
      if (experience <= 0) return;
      
      const skillIndex = state.skills.findIndex(skill => skill.id === skillId);
      
      if (skillIndex >= 0) {
        // Update existing skill
        const newExperience = state.skills[skillIndex].experience + experience;
        state.skills[skillIndex].experience = newExperience;
        state.skills[skillIndex].level = calculateSkillLevel(newExperience);
      } else {
        // Add new skill
        state.skills.push({
          id: skillId,
          level: calculateSkillLevel(experience),
          experience
        });
      }
    },
    
    learnSkill: (state, action: PayloadAction<SkillIdPayload>) => {
      const { skillId } = action.payload;
      
      // Check if skill already exists
      if (state.skills.some(skill => skill.id === skillId)) return;
      
      // Create a new skill
      state.skills.push({
        id: skillId,
        level: 1,
        experience: 0
      });
    },
    
    upgradeSkill: (state, action: PayloadAction<SkillUpgradePayload>) => {
      const { skillId, level } = action.payload;
      
      const skillIndex = state.skills.findIndex(skill => skill.id === skillId);
      
      if (skillIndex >= 0 && level > state.skills[skillIndex].level) {
        state.skills[skillIndex].level = level;
      }
    },
    
    // Status effects
    addStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      const effect = action.payload;
      
      // Remove any existing effect with same id
      state.statusEffects = state.statusEffects.filter(e => e.id !== effect.id);
      
      // Add the new effect
      state.statusEffects.push({
        ...effect,
        timestamp: effect.timestamp || Date.now()
      });
    },
    
    removeStatusEffect: (state, action: PayloadAction<StatusEffectIdPayload>) => {
      const { effectId } = action.payload;
      
      // Remove effect
      state.statusEffects = state.statusEffects.filter(e => e.id !== effectId);
    },
    
    // Stat updates
    updateStat: (state, action: PayloadAction<StatUpdatePayload>) => {
      const { statId, value } = action.payload;
      
      if (statId in state.stats) {
        state.stats[statId] = value;
      }
    },
    
    updateStats: (state, action: PayloadAction<UpdateStatsPayload>) => {
      Object.entries(action.payload).forEach(([statId, value]) => {
        if (statId in state.stats) {
          state.stats[statId] = value;
        }
      });
    }
  }
});

// Export actions
export const { 
  updatePlayer, 
  setName, 
  resetPlayer, 
  rest, 
  modifyHealth, 
  modifyEnergy,
  setActiveCharacter,
  updateTotalPlayTime,
  updateAttribute,
  updateAttributes,
  allocateAttribute,
  updateSkill,
  learnSkill,
  upgradeSkill,
  addStatusEffect,
  removeStatusEffect,
  updateStat,
  updateStats
} = playerSlice.actions;

// Export the reducer as default (no selectors here anymore)
export default playerSlice.reducer;
