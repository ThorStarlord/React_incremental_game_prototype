import { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import {
  selectPlayerHealthData,
  selectPlayerManaData,
  selectPlayerCombatStats,
  selectPlayerPerformanceStats,
  selectPlayerAttributes,
  selectAvailableAttributePoints,
  selectAvailableSkillPoints,
  selectIsPlayerAlive,
  selectFormattedPlaytime
} from '../state/PlayerSelectors';

/**
 * Custom hook for accessing player statistics and computed data
 * Provides memoized access to player stats with derived calculations
 */
export const usePlayerStats = () => {
  const healthData = useAppSelector(selectPlayerHealthData);
  const manaData = useAppSelector(selectPlayerManaData);
  const combatStats = useAppSelector(selectPlayerCombatStats);
  const performanceStats = useAppSelector(selectPlayerPerformanceStats);
  const attributes = useAppSelector(selectPlayerAttributes);
  const availableAttributePoints = useAppSelector(selectAvailableAttributePoints);
  const availableSkillPoints = useAppSelector(selectAvailableSkillPoints);
  const isAlive = useAppSelector(selectIsPlayerAlive);
  const formattedPlaytime = useAppSelector(selectFormattedPlaytime);

  // Memoized computed values
  const computedStats = useMemo(() => ({
    // Health status indicators
    isHealthCritical: healthData.status === 'critical',
    isHealthLow: healthData.status === 'low',
    isHealthFull: healthData.status === 'full',
    
    // Mana status indicators
    isManaCritical: manaData.status === 'critical',
    isManaLow: manaData.status === 'low',
    isManaFull: manaData.status === 'full',
    
    // Combat readiness
    combatReadiness: isAlive && healthData.percentage > 25 && manaData.percentage > 15,
    
    // Progression indicators
    hasAttributePoints: availableAttributePoints > 0,
    hasSkillPoints: availableSkillPoints > 0,
    canProgress: availableAttributePoints > 0 || availableSkillPoints > 0,
    
    // Attribute totals
    totalAttributePoints: Object.values(attributes).reduce((sum, val) => sum + val, 0),
    averageAttribute: Object.values(attributes).reduce((sum, val) => sum + val, 0) / 6,
    
    // Power indicators
    isPowerful: performanceStats.powerLevel > 100,
    isNewPlayer: performanceStats.totalPlaytime < 300000 // 5 minutes
  }), [
    healthData,
    manaData,
    isAlive,
    availableAttributePoints,
    availableSkillPoints,
    attributes,
    performanceStats
  ]);

  return {
    // Core data
    healthData,
    manaData,
    combatStats,
    performanceStats,
    attributes,
    
    // Availability
    availableAttributePoints,
    availableSkillPoints,
    
    // Status
    isAlive,
    formattedPlaytime,
    
    // Computed values
    ...computedStats
  };
};

/**
 * Hook for accessing specific attribute values
 */
export const usePlayerAttribute = (attributeName: keyof typeof attributes) => {
  const attributes = useAppSelector(selectPlayerAttributes);
  return attributes[attributeName];
};

/**
 * Hook for player health monitoring
 */
export const usePlayerHealth = () => {
  const healthData = useAppSelector(selectPlayerHealthData);
  const isAlive = useAppSelector(selectIsPlayerAlive);
  
  return {
    ...healthData,
    isAlive,
    needsHealing: healthData.percentage < 50,
    isEmergency: healthData.percentage < 25
  };
};

/**
 * Hook for player mana monitoring
 */
export const usePlayerMana = () => {
  const manaData = useAppSelector(selectPlayerManaData);
  
  return {
    ...manaData,
    needsRestoration: manaData.percentage < 35,
    isEmpty: manaData.current === 0
  };
};
