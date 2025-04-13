import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { Attribute, PlayerStats, Skill, StatusEffect } from './PlayerTypes';

// Basic selectors (already defined in PlayerSlice, re-exported here for organization)
export const selectPlayer = (state: RootState) => state.player;
export const selectPlayerName = (state: RootState) => state.player.name;
export const selectPlayerLevel = (state: RootState) => state.player.level;
export const selectPlayerExperience = (state: RootState) => state.player.experience;
export const selectPlayerHealth = (state: RootState) => state.player.stats.health;
export const selectPlayerMaxHealth = (state: RootState) => state.player.stats.maxHealth;
export const selectPlayerMana = (state: RootState) => state.player.stats.mana;
export const selectPlayerMaxMana = (state: RootState) => state.player.stats.maxMana;
export const selectPlayerGold = (state: RootState) => state.player.gold;
export const selectPlayerAttributes = (state: RootState) => state.player.attributes;
export const selectPlayerAttributePoints = (state: RootState) => state.player.attributePoints;
export const selectPlayerSkills = (state: RootState) => state.player.skills;
export const selectPlayerSkillPoints = (state: RootState) => state.player.skillPoints;
export const selectPlayerStats = (state: RootState) => state.player.stats;
export const selectPlayerAcquiredTraits = (state: RootState) => state.player.acquiredTraits;
export const selectPlayerPermanentTraits = (state: RootState) => state.player.permanentTraits;
export const selectPlayerTraitSlots = (state: RootState) => state.player.traitSlots;
export const selectPlayerStatusEffects = (state: RootState) => state.player.statusEffects;
export const selectPlayerTotalPlayTime = (state: RootState) => state.player.totalPlayTime;
export const selectPlayerTotalEssenceEarned = (state: RootState) => state.player.totalEssenceEarned;

// Memoized complex selectors

/**
 * Selector for a specific player attribute by ID
 */
export const selectPlayerAttribute = createSelector(
  [selectPlayerAttributes, (_, attributeId: string) => attributeId],
  (attributes, attributeId): Attribute | undefined => attributes[attributeId]
);

/**
 * Selector for a specific player attribute's value by ID
 */
export const selectPlayerAttributeValue = createSelector(
  [selectPlayerAttributes, (_, attributeId: string) => attributeId],
  (attributes, attributeId): number => attributes[attributeId]?.value || 0
);

/**
 * Selector for a specific player skill by ID
 */
export const selectPlayerSkillById = createSelector(
  [selectPlayerSkills, (_, skillId: string) => skillId],
  (skills, skillId): Skill | undefined => skills.find(skill => skill.id === skillId)
);

/**
 * Selector for a specific player skill's level by ID
 */
export const selectPlayerSkillLevel = createSelector(
  [selectPlayerSkills, (_, skillId: string) => skillId],
  (skills, skillId): number => {
    const skill = skills.find(skill => skill.id === skillId);
    return skill?.level || 0;
  }
);

/**
 * Selector for player's health percentage
 */
export const selectPlayerHealthPercentage = createSelector(
  [selectPlayerHealth, selectPlayerMaxHealth],
  (health, maxHealth): number => maxHealth > 0 ? (health / maxHealth) * 100 : 0
);

/**
 * Selector for player's mana percentage
 */
export const selectPlayerManaPercentage = createSelector(
  [selectPlayerMana, selectPlayerMaxMana],
  (mana, maxMana): number => maxMana > 0 ? (mana / maxMana) * 100 : 0
);

/**
 * Selector for whether player has any active status effects
 */
export const selectPlayerHasStatusEffects = createSelector(
  [selectPlayerStatusEffects],
  (statusEffects): boolean => statusEffects.length > 0
);

/**
 * Selector for player's active status effects by type
 */
export const selectPlayerStatusEffectsByType = createSelector(
  [selectPlayerStatusEffects, (_, effectType: string) => effectType],
  (statusEffects, effectType): StatusEffect[] => 
    statusEffects.filter(effect => effect.name.toLowerCase().includes(effectType.toLowerCase()))
);

/**
 * Selector for whether player has a specific status effect
 */
export const selectPlayerHasStatusEffect = createSelector(
  [selectPlayerStatusEffects, (_, effectId: string) => effectId],
  (statusEffects, effectId): boolean => 
    statusEffects.some(effect => effect.id === effectId)
);

/**
 * Selector for whether player has a specific trait
 */
export const selectPlayerHasTrait = createSelector(
  [selectPlayerAcquiredTraits, (_, traitId: string) => traitId],
  (acquiredTraits, traitId): boolean => acquiredTraits.includes(traitId)
);

/**
 * Selector for whether player has a specific trait permanent
 */
export const selectPlayerHasTraitPermanent = createSelector(
  [selectPlayerPermanentTraits, (_, traitId: string) => traitId],
  (permanentTraits, traitId): boolean => permanentTraits.includes(traitId)
);

/**
 * Selector for player combined attack value (base + bonuses)
 */
export const selectPlayerAttackValue = createSelector(
  [selectPlayerStats],
  (stats): number => stats.attack
);

/**
 * Selector for player combined defense value (base + bonuses)
 */
export const selectPlayerDefenseValue = createSelector(
  [selectPlayerStats],
  (stats): number => stats.defense
);

/**
 * Selector for whether player can level up a specific skill (has enough skill points)
 */
export const selectPlayerCanLevelSkill = createSelector(
  [selectPlayerSkillPoints, selectPlayerSkillById, (_, skillId: string) => skillId],
  (skillPoints, skill): boolean => skillPoints > 0 && skill !== undefined
);

/**
 * Selector for whether player can allocate attribute points
 */
export const selectPlayerCanAllocateAttributes = createSelector(
  [selectPlayerAttributePoints],
  (attributePoints): boolean => attributePoints > 0
);

/**
 * Selector for player's progress to next level as a percentage
 */
export const selectPlayerLevelProgress = createSelector(
  [selectPlayerExperience, selectPlayerLevel],
  (experience, level): number => {
    const expForCurrentLevel = calculateExpForLevel(level);
    const expForNextLevel = calculateExpForLevel(level + 1);
    const expNeeded = expForNextLevel - expForCurrentLevel;
    const expProgress = experience - expForCurrentLevel;
    return expNeeded > 0 ? Math.min(100, Math.floor((expProgress / expNeeded) * 100)) : 100;
  }
);

/**
 * Helper function to calculate experience required for a specific level
 */
const calculateExpForLevel = (level: number): number => {
  // This should match the calculation used in your leveling system
  return Math.floor(100 * Math.pow(level, 1.5));
};