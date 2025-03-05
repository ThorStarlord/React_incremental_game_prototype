import {
  COLLECT_ESSENCE,
  SPEND_ESSENCE,
  UPGRADE_ESSENCE_RATE,
  GAIN_EXPERIENCE,
  LEVEL_UP,
  LEARN_SKILL,
  EQUIP_ITEM,
  UNEQUIP_ITEM,
  ADD_ITEM_TO_INVENTORY,
  REMOVE_ITEM_FROM_INVENTORY
} from './actionTypes';

// Define action interfaces
interface Action<T, P> {
  type: T;
  payload?: P;
}

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
export const collectEssence = (amount: number): Action<typeof COLLECT_ESSENCE, CollectEssencePayload> => ({
  type: COLLECT_ESSENCE,
  payload: { amount }
});

export const spendEssence = (amount: number): Action<typeof SPEND_ESSENCE, SpendEssencePayload> => ({
  type: SPEND_ESSENCE,
  payload: { amount }
});

export const upgradeEssenceRate = (cost: number, multiplier: number): Action<typeof UPGRADE_ESSENCE_RATE, UpgradeEssenceRatePayload> => ({
  type: UPGRADE_ESSENCE_RATE,
  payload: { cost, multiplier }
});

// Player action creators
export const gainExperience = (amount: number): Action<typeof GAIN_EXPERIENCE, GainExperiencePayload> => ({
  type: GAIN_EXPERIENCE,
  payload: { amount }
});

export const levelUp = (): Action<typeof LEVEL_UP, undefined> => ({
  type: LEVEL_UP
});

export const learnSkill = (skillId: string): Action<typeof LEARN_SKILL, LearnSkillPayload> => ({
  type: LEARN_SKILL,
  payload: { skillId }
});

export const equipItem = (itemId: string, slot: string): Action<typeof EQUIP_ITEM, EquipItemPayload> => ({
  type: EQUIP_ITEM,
  payload: { itemId, slot }
});

export const unequipItem = (slot: string): Action<typeof UNEQUIP_ITEM, UnequipItemPayload> => ({
  type: UNEQUIP_ITEM,
  payload: { slot }
});

export const addItemToInventory = (item: any): Action<typeof ADD_ITEM_TO_INVENTORY, InventoryItemPayload> => ({
  type: ADD_ITEM_TO_INVENTORY,
  payload: { item }
});

export const removeItemFromInventory = (itemId: string): Action<typeof REMOVE_ITEM_FROM_INVENTORY, RemoveItemPayload> => ({
  type: REMOVE_ITEM_FROM_INVENTORY,
  payload: { itemId }
});
