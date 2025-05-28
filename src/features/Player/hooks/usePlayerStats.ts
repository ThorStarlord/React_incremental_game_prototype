import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { 
  selectPlayer,
  selectPlayerStats,
  selectPlayerAttributes,
  selectPlayerStatusEffects,
  selectHealthData,
  selectManaData,
  selectCombatStats,
  selectPerformanceStats,
  selectAvailableAttributePoints,
  selectAvailableSkillPoints,
  selectIsPlayerAlive,
  selectTotalPlaytime
} from '../state/PlayerSelectors';
import { 
  modifyHealth,
  modifyMana,
  allocateAttributePoint,
  addStatusEffect,
  removeStatusEffect,
  recalculateStats
} from '../state/PlayerSlice';
import type { StatusEffect, PlayerAttributes } from '../state/PlayerTypes';

/**
 * Main hook for comprehensive player statistics and character management
 * Provides access to all player data, computed values, and action dispatchers
 * 
 * @returns Complete player management interface with state and actions
 */
export const usePlayerStats = () => {
  const dispatch = useAppDispatch();
  
  // Core player state selection
  const player = useAppSelector(selectPlayer);
  const stats = useAppSelector(selectPlayerStats);
  const attributes = useAppSelector(selectPlayerAttributes);
  const statusEffects = useAppSelector(selectPlayerStatusEffects);
  
  // Enhanced computed data with memoized selectors
  const healthData = useAppSelector(selectHealthData);
  const manaData = useAppSelector(selectManaData);
  const combatStats = useAppSelector(selectCombatStats);
  const performanceStats = useAppSelector(selectPerformanceStats);
  
  // Individual data points
  const availableAttributePoints = useAppSelector(selectAvailableAttributePoints);
  const availableSkillPoints = useAppSelector(selectAvailableSkillPoints);
  const isAlive = useAppSelector(selectIsPlayerAlive);
  const totalPlaytime = useAppSelector(selectTotalPlaytime);
  
  // Memoized action dispatchers for health/mana management
  const handleHealthChange = useCallback((amount: number) => {
    dispatch(modifyHealth(amount));
  }, [dispatch]);
  
  const handleManaChange = useCallback((amount: number) => {
    dispatch(modifyMana(amount));
  }, [dispatch]);
  
  // Attribute allocation with validation
  const handleAttributeAllocation = useCallback((attributeName: keyof PlayerAttributes, points: number = 1) => {
    if (availableAttributePoints >= points) {
      dispatch(allocateAttributePoint({ attributeName, points }));
    }
  }, [dispatch, availableAttributePoints]);
  
  // Status effect management
  const handleAddStatusEffect = useCallback((effect: StatusEffect) => {
    dispatch(addStatusEffect(effect));
  }, [dispatch]);
  
  const handleRemoveStatusEffect = useCallback((effectId: string) => {
    dispatch(removeStatusEffect(effectId));
  }, [dispatch]);
  
  // Manual stat recalculation trigger
  const handleRecalculateStats = useCallback(() => {
    dispatch(recalculateStats());
  }, [dispatch]);
  
  // Helper functions for UI display
  const formatPlaytime = useCallback((milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }, []);
  
  const canAllocateAttributes = useCallback((points: number = 1): boolean => {
    return availableAttributePoints >= points;
  }, [availableAttributePoints]);
  
  const hasActiveStatusEffects = statusEffects.length > 0;
  
  return {
    // Core state
    player,
    stats,
    attributes,
    statusEffects,
    
    // Computed data
    healthData,
    manaData,
    combatStats,
    performanceStats,
    
    // Individual values
    availableAttributePoints,
    availableSkillPoints,
    totalPlaytime,
    
    // Status indicators
    isAlive,
    hasActiveStatusEffects,
    canAllocateAttributes,
    
    // Actions
    modifyHealth: handleHealthChange,
    modifyMana: handleManaChange,
    allocateAttribute: handleAttributeAllocation,
    addStatusEffect: handleAddStatusEffect,
    removeStatusEffect: handleRemoveStatusEffect,
    recalculateStats: handleRecalculateStats,
    
    // Utilities
    formatPlaytime,
  };
};

/**
 * Simplified hook for read-only components that only need to display player stats
 * More efficient for components that don't need action dispatchers
 * 
 * @returns Player statistics without action functions
 */
export const usePlayerStatsDisplay = () => {
  const stats = useAppSelector(selectPlayerStats);
  const healthData = useAppSelector(selectHealthData);
  const manaData = useAppSelector(selectManaData);
  const combatStats = useAppSelector(selectCombatStats);
  const performanceStats = useAppSelector(selectPerformanceStats);
  const isAlive = useAppSelector(selectIsPlayerAlive);
  
  return {
    stats,
    healthData,
    manaData,
    combatStats,
    performanceStats,
    isAlive,
  };
};

/**
 * Hook specialized for attribute management and allocation
 * Provides attribute data and allocation capabilities
 * 
 * @returns Attribute management interface
 */
export const usePlayerAttributes = () => {
  const dispatch = useAppDispatch();
  const attributes = useAppSelector(selectPlayerAttributes);
  const availablePoints = useAppSelector(selectAvailableAttributePoints);
  
  const allocateAttribute = useCallback((attributeName: keyof PlayerAttributes, points: number = 1) => {
    if (availablePoints >= points) {
      dispatch(allocateAttributePoint({ attributeName, points }));
    }
  }, [dispatch, availablePoints]);
  
  const canAllocate = useCallback((points: number = 1): boolean => {
    return availablePoints >= points;
  }, [availablePoints]);
  
  const getAttributeBonus = useCallback((attributeName: keyof PlayerAttributes): number => {
    const attributeValue = attributes[attributeName];
    return Math.floor((attributeValue - 10) / 2); // D&D style modifier calculation
  }, [attributes]);
  
  const getTotalAttributePoints = useCallback((): number => {
    return Object.values(attributes).reduce((sum, value) => sum + value, 0);
  }, [attributes]);
  
  const getAttributeInvestment = useCallback((): number => {
    const baseAttributes = 60; // 6 attributes × 10 base value
    return getTotalAttributePoints() - baseAttributes;
  }, [getTotalAttributePoints]);
  
  return {
    attributes,
    availablePoints,
    allocateAttribute,
    canAllocate,
    getAttributeBonus,
    getTotalAttributePoints,
    getAttributeInvestment,
  };
};

/**
 * Hook for managing player status effects
 * Provides status effect state and management functions
 * 
 * @returns Status effect management interface
 */
export const usePlayerStatusEffects = () => {
  const dispatch = useAppDispatch();
  const statusEffects = useAppSelector(selectPlayerStatusEffects);
  
  const addEffect = useCallback((effect: StatusEffect) => {
    dispatch(addStatusEffect(effect));
  }, [dispatch]);
  
  const removeEffect = useCallback((effectId: string) => {
    dispatch(removeStatusEffect(effectId));
  }, [dispatch]);
  
  const hasEffect = useCallback((effectId: string): boolean => {
    return statusEffects.some(effect => effect.id === effectId);
  }, [statusEffects]);
  
  const getEffect = useCallback((effectId: string): StatusEffect | undefined => {
    return statusEffects.find(effect => effect.id === effectId);
  }, [statusEffects]);
  
  const getActiveEffects = useCallback((type?: string): StatusEffect[] => {
    if (type) {
      return statusEffects.filter(effect => effect.type === type);
    }
    return statusEffects;
  }, [statusEffects]);
  
  const getEffectsByCategory = useCallback((category: string): StatusEffect[] => {
    return statusEffects.filter(effect => 
      effect.category === category || effect.type === category
    );
  }, [statusEffects]);
  
  const hasActiveEffects = statusEffects.length > 0;
  
  return {
    statusEffects,
    hasActiveEffects,
    addEffect,
    removeEffect,
    hasEffect,
    getEffect,
    getActiveEffects,
    getEffectsByCategory,
  };
};

/**
 * Hook for character progression and advancement tracking
 * Provides progression metrics and advancement utilities
 * 
 * @returns Character progression interface
 */
export const usePlayerProgression = () => {
  const player = useAppSelector(selectPlayer);
  const performanceStats = useAppSelector(selectPerformanceStats);
  const totalPlaytime = useAppSelector(selectTotalPlaytime);
  const availableAttributePoints = useAppSelector(selectAvailableAttributePoints);
  const availableSkillPoints = useAppSelector(selectAvailableSkillPoints);
  
  const formatPlaytime = useCallback((milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }, []);
  
  const getTotalAttributePoints = useCallback((): number => {
    return Object.values(player.attributes).reduce((sum, value) => sum + value, 0);
  }, [player.attributes]);
  
  const getAttributeInvestment = useCallback((): number => {
    const baseAttributes = 60; // 6 attributes × 10 base value
    return getTotalAttributePoints() - baseAttributes;
  }, [getTotalAttributePoints]);
  
  const getProgressionLevel = useCallback((): number => {
    // Simple progression level based on playtime and attribute investment
    const hoursPlayed = totalPlaytime / (1000 * 60 * 60);
    const attributeInvestment = getAttributeInvestment();
    return Math.floor(hoursPlayed + (attributeInvestment / 10));
  }, [totalPlaytime, getAttributeInvestment]);
  
  return {
    playtimeMs: totalPlaytime,
    playtimeFormatted: formatPlaytime(totalPlaytime),
    availableAttributePoints,
    availableSkillPoints,
    totalAttributePoints: getTotalAttributePoints(),
    attributeInvestment: getAttributeInvestment(),
    progressionLevel: getProgressionLevel(),
    performanceStats,
  };
};

/**
 * Hook for player health and vitals management
 * Provides health/mana utilities and status checking
 * 
 * @returns Vitals management interface
 */
export const usePlayerVitals = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectPlayerStats);
  const healthData = useAppSelector(selectHealthData);
  const manaData = useAppSelector(selectManaData);
  const isAlive = useAppSelector(selectIsPlayerAlive);
  
  const heal = useCallback((amount: number) => {
    dispatch(modifyHealth(Math.abs(amount)));
  }, [dispatch]);
  
  const damage = useCallback((amount: number) => {
    dispatch(modifyHealth(-Math.abs(amount)));
  }, [dispatch]);
  
  const restoreMana = useCallback((amount: number) => {
    dispatch(modifyMana(Math.abs(amount)));
  }, [dispatch]);
  
  const consumeMana = useCallback((amount: number) => {
    dispatch(modifyMana(-Math.abs(amount)));
  }, [dispatch]);
  
  const canCastSpell = useCallback((manaCost: number): boolean => {
    return stats.mana >= manaCost;
  }, [stats.mana]);
  
  const getHealthStatus = useCallback((): 'critical' | 'low' | 'moderate' | 'good' | 'full' => {
    const percentage = healthData.percentage;
    if (percentage <= 0.1) return 'critical';
    if (percentage <= 0.25) return 'low';
    if (percentage <= 0.5) return 'moderate';
    if (percentage < 1.0) return 'good';
    return 'full';
  }, [healthData.percentage]);
  
  const getManaStatus = useCallback((): 'empty' | 'low' | 'moderate' | 'good' | 'full' => {
    const percentage = manaData.percentage;
    if (percentage <= 0.1) return 'empty';
    if (percentage <= 0.25) return 'low';
    if (percentage <= 0.5) return 'moderate';
    if (percentage < 1.0) return 'good';
    return 'full';
  }, [manaData.percentage]);
  
  const getHealthPercentage = useCallback((): number => {
    return Math.round(healthData.percentage * 100);
  }, [healthData.percentage]);
  
  const getManaPercentage = useCallback((): number => {
    return Math.round(manaData.percentage * 100);
  }, [manaData.percentage]);
  
  return {
    // Current values
    health: stats.health,
    maxHealth: stats.maxHealth,
    mana: stats.mana,
    maxMana: stats.maxMana,
    
    // Enhanced data
    healthData,
    manaData,
    
    // Status
    isAlive,
    
    // Actions
    heal,
    damage,
    restoreMana,
    consumeMana,
    
    // Utilities
    canCastSpell,
    getHealthStatus,
    getManaStatus,
    getHealthPercentage,
    getManaPercentage,
  };
};
