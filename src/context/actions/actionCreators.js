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

// Essence action creators
export const collectEssence = (amount) => ({
  type: COLLECT_ESSENCE,
  payload: { amount }
});

export const spendEssence = (amount) => ({
  type: SPEND_ESSENCE,
  payload: { amount }
});

export const upgradeEssenceRate = (cost, multiplier) => ({
  type: UPGRADE_ESSENCE_RATE,
  payload: { cost, multiplier }
});

// Player action creators
export const gainExperience = (amount) => ({
  type: GAIN_EXPERIENCE,
  payload: { amount }
});

export const levelUp = () => ({
  type: LEVEL_UP
});

export const learnSkill = (skillId) => ({
  type: LEARN_SKILL,
  payload: { skillId }
});

export const equipItem = (itemId, slot) => ({
  type: EQUIP_ITEM,
  payload: { itemId, slot }
});

export const unequipItem = (slot) => ({
  type: UNEQUIP_ITEM,
  payload: { slot }
});

export const addItemToInventory = (item) => ({
  type: ADD_ITEM_TO_INVENTORY,
  payload: { item }
});

export const removeItemFromInventory = (itemId) => ({
  type: REMOVE_ITEM_FROM_INVENTORY,
  payload: { itemId }
});