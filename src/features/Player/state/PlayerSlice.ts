import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  PlayerState,
  PlayerStats,
  Attribute,
  StatusEffect,
  EquipmentItem,
  UpdatePlayerPayload,
  ModifyHealthPayload,
  AllocateAttributePayload,
  EquipItemPayload
} from './PlayerTypes';

// Initial player stats following specification defaults
const initialStats: PlayerStats = {
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  attack: 10,
  defense: 5,
  speed: 10,
  healthRegen: 1,
  manaRegen: 2,
  critChance: 0.05, // 5%
  critDamage: 1.5   // 150%
};

// Initial attributes with base RPG stats
const initialAttributes: Record<string, Attribute> = {
  strength: { name: 'Strength', value: 10, baseValue: 10 },
  dexterity: { name: 'Dexterity', value: 10, baseValue: 10 },
  intelligence: { name: 'Intelligence', value: 10, baseValue: 10 },
  constitution: { name: 'Constitution', value: 10, baseValue: 10 },
  wisdom: { name: 'Wisdom', value: 10, baseValue: 10 },
  charisma: { name: 'Charisma', value: 10, baseValue: 10 }
};

// Initial player state
const initialState: PlayerState = {
  name: 'Player',
  stats: initialStats,
  attributes: initialAttributes,
  attributePoints: 0,
  skillPoints: 0,
  statusEffects: [],
  equipment: {
    head: null,
    chest: null,
    legs: null,
    feet: null,
    mainHand: null,
    offHand: null,
    accessory1: null,
    accessory2: null
  },
  gold: 0,
  totalPlayTime: 0,
  isAlive: true
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Update player with partial state
    updatePlayer: (state, action: PayloadAction<UpdatePlayerPayload>) => {
      Object.assign(state, action.payload.updates);
    },

    // Set player name
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },

    // Reset player to initial state
    resetPlayer: () => initialState,

    // Modify health (damage or healing)
    modifyHealth: (state, action: PayloadAction<ModifyHealthPayload>) => {
      const { amount, type } = action.payload;
      if (type === 'damage') {
        state.stats.health = Math.max(0, state.stats.health - amount);
        if (state.stats.health === 0) {
          state.isAlive = false;
        }
      } else if (type === 'heal') {
        state.stats.health = Math.min(state.stats.maxHealth, state.stats.health + amount);
      }
    },

    // Modify mana
    modifyMana: (state, action: PayloadAction<{ amount: number; type: 'spend' | 'restore' }>) => {
      const { amount, type } = action.payload;
      if (type === 'spend') {
        state.stats.mana = Math.max(0, state.stats.mana - amount);
      } else if (type === 'restore') {
        state.stats.mana = Math.min(state.stats.maxMana, state.stats.mana + amount);
      }
    },

    // Allocate attribute points
    allocateAttribute: (state, action: PayloadAction<AllocateAttributePayload>) => {
      const { attributeName, points } = action.payload;
      if (state.attributePoints >= points && state.attributes[attributeName]) {
        state.attributePoints -= points;
        state.attributes[attributeName].baseValue += points;
        state.attributes[attributeName].value += points;
        
        // Update derived stats based on attributes
        playerSlice.caseReducers.recalculateStats(state);
      }
    },

    // Update skill points
    updateSkillPoints: (state, action: PayloadAction<number>) => {
      state.skillPoints = Math.max(0, action.payload);
    },

    // Equip item
    equipItem: (state, action: PayloadAction<EquipItemPayload>) => {
      const { slot, item } = action.payload;
      state.equipment[slot] = item;
      
      // Recalculate stats with new equipment
      playerSlice.caseReducers.recalculateStats(state);
    },

    // Unequip item
    unequipItem: (state, action: PayloadAction<string>) => {
      const slot = action.payload;
      state.equipment[slot] = null;
      
      // Recalculate stats without the item
      playerSlice.caseReducers.recalculateStats(state);
    },

    // Add status effect
    addStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      // Remove existing effect with same ID if present
      state.statusEffects = state.statusEffects.filter(
        effect => effect.id !== action.payload.id
      );
      state.statusEffects.push(action.payload);
      
      // Recalculate stats with new effect
      playerSlice.caseReducers.recalculateStats(state);
    },

    // Remove status effect
    removeStatusEffect: (state, action: PayloadAction<string>) => {
      state.statusEffects = state.statusEffects.filter(
        effect => effect.id !== action.payload
      );
      
      // Recalculate stats without the effect
      playerSlice.caseReducers.recalculateStats(state);
    },

    // Update total play time
    updatePlayTime: (state, action: PayloadAction<number>) => {
      state.totalPlayTime = action.payload;
    },

    // Add gold
    addGold: (state, action: PayloadAction<number>) => {
      state.gold = Math.max(0, state.gold + action.payload);
    },

    // Spend gold
    spendGold: (state, action: PayloadAction<number>) => {
      if (state.gold >= action.payload) {
        state.gold -= action.payload;
      }
    },

    // Recalculate all derived stats
    recalculateStats: (state) => {
      // Start with base stats influenced by attributes
      const str = state.attributes.strength?.value || 10;
      const dex = state.attributes.dexterity?.value || 10;
      const int = state.attributes.intelligence?.value || 10;
      const con = state.attributes.constitution?.value || 10;
      const wis = state.attributes.wisdom?.value || 10;

      // Calculate base stats from attributes
      state.stats.maxHealth = 100 + (con - 10) * 10;
      state.stats.maxMana = 50 + (int - 10) * 5 + (wis - 10) * 3;
      state.stats.attack = 10 + Math.floor((str - 10) * 1.5);
      state.stats.defense = 5 + Math.floor((con - 10) * 1.2);
      state.stats.speed = 10 + Math.floor((dex - 10) * 1.3);
      state.stats.healthRegen = 1 + Math.floor((con - 10) * 0.2);
      state.stats.manaRegen = 2 + Math.floor((wis - 10) * 0.3);
      state.stats.critChance = Math.min(0.5, 0.05 + (dex - 10) * 0.005);

      // Apply equipment bonuses
      Object.values(state.equipment).forEach(item => {
        if (item?.stats) {
          Object.entries(item.stats).forEach(([stat, value]) => {
            if (typeof value === 'number' && stat in state.stats) {
              (state.stats as any)[stat] += value;
            }
          });
        }
      });

      // Apply status effect bonuses
      state.statusEffects.forEach(effect => {
        Object.entries(effect.effects).forEach(([stat, value]) => {
          if (typeof value === 'number' && stat in state.stats) {
            (state.stats as any)[stat] += value;
          }
        });
      });

      // Ensure health and mana don't exceed new maximums
      state.stats.health = Math.min(state.stats.health, state.stats.maxHealth);
      state.stats.mana = Math.min(state.stats.mana, state.stats.maxMana);

      // Ensure stats don't go below minimums
      state.stats.health = Math.max(0, state.stats.health);
      state.stats.mana = Math.max(0, state.stats.mana);
      state.stats.attack = Math.max(1, state.stats.attack);
      state.stats.defense = Math.max(0, state.stats.defense);
      state.stats.speed = Math.max(1, state.stats.speed);
    }
  }
});

export const {
  updatePlayer,
  setName,
  resetPlayer,
  modifyHealth,
  modifyMana,
  allocateAttribute,
  updateSkillPoints,
  equipItem,
  unequipItem,
  addStatusEffect,
  removeStatusEffect,
  updatePlayTime,
  addGold,
  spendGold,
  recalculateStats
} = playerSlice.actions;

export default playerSlice.reducer;
