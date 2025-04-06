/**
 * Redux selectors for Combat state
 */
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { CombatState, StatusEffect } from './CombatTypes';

// Basic selectors
export const selectCombatState = (state: RootState) => state.combat;
export const selectIsCombatActive = (state: RootState) => state.combat.active;
export const selectIsPlayerTurn = (state: RootState) => state.combat.playerTurn;
export const selectCombatRound = (state: RootState) => state.combat.round;
export const selectCombatLog = (state: RootState) => state.combat.log;
export const selectCombatResult = (state: RootState) => state.combat.result;
export const selectCombatLoading = (state: RootState) => state.combat.loading;

// Player selectors
export const selectPlayerStats = (state: RootState) => state.combat.playerStats;
export const selectPlayerHealth = (state: RootState) => state.combat.playerStats.currentHealth;
export const selectPlayerMaxHealth = (state: RootState) => state.combat.playerStats.maxHealth;
export const selectPlayerHealthPercentage = createSelector(
  [selectPlayerHealth, selectPlayerMaxHealth],
  (health, maxHealth) => (health / maxHealth) * 100
);
export const selectPlayerMana = (state: RootState) => state.combat.playerStats.currentMana;
export const selectPlayerMaxMana = (state: RootState) => state.combat.playerStats.maxMana;
export const selectPlayerManaPercentage = createSelector(
  [selectPlayerMana, selectPlayerMaxMana],
  (mana, maxMana) => (mana && maxMana) ? (mana / maxMana) * 100 : 0
);

// Enemy selectors
export const selectEnemyStats = (state: RootState) => state.combat.enemyStats;
export const selectEnemyHealth = (state: RootState) => state.combat.enemyStats?.currentHealth;
export const selectEnemyMaxHealth = (state: RootState) => state.combat.enemyStats?.maxHealth;
export const selectEnemyHealthPercentage = createSelector(
  [selectEnemyHealth, selectEnemyMaxHealth],
  (health, maxHealth) => {
    if (!health || !maxHealth) return 0;
    return (health / maxHealth) * 100;
  }
);

// Effect selectors
export const selectAllEffects = (state: RootState) => state.combat.effects;
export const selectEffectById = (effectId: string) => 
  (state: RootState) => state.combat.effects.find(effect => effect.id === effectId);

// Skill selectors
export const selectAllSkills = (state: RootState) => state.combat.skills;
export const selectAvailableSkills = createSelector(
  [selectAllSkills, selectPlayerMana],
  (skills, mana = 0) => skills.filter(skill => skill.currentCooldown === 0 && skill.manaCost <= mana)
);
export const selectSkillById = (skillId: string) => 
  (state: RootState) => state.combat.skills.find(skill => skill.id === skillId);

// Item selectors
export const selectAllItems = (state: RootState) => state.combat.items;
export const selectItemById = (itemId: string) => 
  (state: RootState) => state.combat.items.find(item => item.id === itemId);

// Combat info selectors
export const selectCombatDungeonId = (state: RootState) => state.combat.dungeonId;
export const selectCombatDifficulty = (state: RootState) => state.combat.difficulty;
export const selectCurrentEncounter = (state: RootState) => state.combat.encounter;
export const selectTotalEncounters = (state: RootState) => state.combat.totalEncounters;
export const selectEncounterProgress = createSelector(
  [selectCurrentEncounter, selectTotalEncounters],
  (current, total) => (current / total) * 100
);

// State derivation selectors
export const selectCanPlayerAct = createSelector(
  [selectIsCombatActive, selectIsPlayerTurn],
  (active, playerTurn) => active && playerTurn
);

export const selectCombatStatus = createSelector(
  [selectIsCombatActive, selectCombatResult, selectPlayerHealth],
  (active, result, playerHealth): 'active' | 'victory' | 'defeat' | 'retreat' | 'not_started' => {
    if (!active && !result) return 'not_started';
    if (active) return 'active';
    if (result?.victory) return 'victory';
    if (result?.retreat) return 'retreat';
    return 'defeat';
  }
);
