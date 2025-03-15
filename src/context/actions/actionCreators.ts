import { 
  ESSENCE_ACTIONS, 
  PLAYER_ACTIONS, 
  INVENTORY_ACTIONS,
  SKILL_ACTIONS,
  Action
} from '../types/ActionTypes';

// Essence action interfaces
interface CollectEssencePayload {
  amount: number;
}

interface SpendEssencePayload {
  amount: number;
}

interface UpgradeEssenceRatePayload {
  cost: number;
  multiplier: number;
}

// Player action interfaces
interface GainExperiencePayload {
  amount: number;
}

interface LearnSkillPayload {
  skillId: string;
}

interface EquipItemPayload {
  itemId: string;
  slot: string;
}

interface UnequipItemPayload {
  slot: string;
}

interface InventoryItemPayload {
  item: any; // Replace with proper item type when available
}

interface RemoveItemPayload {
  itemId: string;
}

// Essence action creators
export const collectEssence = (amount: number): Action<typeof ESSENCE_ACTIONS.GAIN_ESSENCE, CollectEssencePayload> => ({
  type: ESSENCE_ACTIONS.GAIN_ESSENCE,
  payload: { amount }
});

export const spendEssence = (amount: number): Action<typeof ESSENCE_ACTIONS.SPEND_ESSENCE, SpendEssencePayload> => ({
  type: ESSENCE_ACTIONS.SPEND_ESSENCE,
  payload: { amount }
});

export const upgradeEssenceRate = (cost: number, multiplier: number): Action<typeof ESSENCE_ACTIONS.UPGRADE_ESSENCE_RATE, UpgradeEssenceRatePayload> => ({
  type: ESSENCE_ACTIONS.UPGRADE_ESSENCE_RATE,
  payload: { cost, multiplier }
});

// Player action creators
export const gainExperience = (amount: number): Action<typeof PLAYER_ACTIONS.GAIN_EXPERIENCE, GainExperiencePayload> => ({
  type: PLAYER_ACTIONS.GAIN_EXPERIENCE,
  payload: { amount }
});

export const levelUp = (): Action<typeof PLAYER_ACTIONS.LEVEL_UP, undefined> => ({
  type: PLAYER_ACTIONS.LEVEL_UP
});

export const learnSkill = (skillId: string): Action<typeof SKILL_ACTIONS.LEARN_SKILL, LearnSkillPayload> => ({
  type: SKILL_ACTIONS.LEARN_SKILL,
  payload: { skillId }
});

export const equipItem = (itemId: string, slot: string): Action<typeof PLAYER_ACTIONS.EQUIP_ITEM, EquipItemPayload> => ({
  type: PLAYER_ACTIONS.EQUIP_ITEM,
  payload: { itemId, slot }
});

export const unequipItem = (slot: string): Action<typeof PLAYER_ACTIONS.UNEQUIP_ITEM, UnequipItemPayload> => ({
  type: PLAYER_ACTIONS.UNEQUIP_ITEM,
  payload: { slot }
});

export const addItemToInventory = (item: any): Action<typeof INVENTORY_ACTIONS.ADD_ITEM, InventoryItemPayload> => ({
  type: INVENTORY_ACTIONS.ADD_ITEM,
  payload: { item }
});

export const removeItemFromInventory = (itemId: string): Action<typeof INVENTORY_ACTIONS.REMOVE_ITEM, RemoveItemPayload> => ({
  type: INVENTORY_ACTIONS.REMOVE_ITEM,
  payload: { itemId }
});
