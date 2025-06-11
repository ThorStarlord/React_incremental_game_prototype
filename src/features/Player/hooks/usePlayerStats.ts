import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  modifyHealth, 
  modifyEnergy, 
  allocateAttribute,
  updatePlayer 
} from '../state/PlayerSlice';
import { 
  selectPlayerStats, 
  selectPlayerHealth, 
  selectPlayerMana,
  selectPlayerAttributes,
  selectCanAllocateAttributes 
} from '../state/PlayerSelectors';
import type { PlayerAttributes } from '../state/PlayerTypes';

/**
 * Custom hook for player statistics management
 * Provides convenient interface for player stat operations and data access
 */
export const usePlayerStats = () => {
  const dispatch = useAppDispatch();
  
  // State selectors
  const stats = useAppSelector(selectPlayerStats);
  const healthData = useAppSelector(selectPlayerHealth);
  const manaData = useAppSelector(selectPlayerMana);
  const attributes = useAppSelector(selectPlayerAttributes);
  const canAllocateAttributes = useAppSelector(selectCanAllocateAttributes);

  // Health management actions
  const restoreHealth = useCallback((amount: number) => {
    dispatch(modifyHealth({ amount }));
  }, [dispatch]);

  const takeDamage = useCallback((amount: number) => {
    dispatch(modifyHealth({ amount: -amount }));
  }, [dispatch]);

  // Mana/Energy management actions
  const restoreMana = useCallback((amount: number) => {
    dispatch(modifyEnergy({ amount }));
  }, [dispatch]);

  const consumeMana = useCallback((amount: number) => {
    dispatch(modifyEnergy({ amount: -amount }));
  }, [dispatch]);

  // Attribute management
  const allocateAttributePoint = useCallback((attribute: keyof PlayerAttributes, amount: number = 1) => {
    dispatch(allocateAttribute({ attribute, amount }));
  }, [dispatch]);

  // General player updates
  const updatePlayerData = useCallback((updates: Partial<any>) => {
    dispatch(updatePlayer(updates));
  }, [dispatch]);

  // Computed values
  const isHealthy = healthData.percentage > 75;
  const isInjured = healthData.percentage < 25;
  const hasLowMana = manaData.percentage < 20;
  const powerLevel = Math.floor(
    stats.attack + stats.defense + stats.maxHealth / 10 + stats.maxMana / 5
  );

  return {
    // Raw data
    stats,
    attributes,
    healthData,
    manaData,
    
    // Status flags
    isHealthy,
    isInjured,
    hasLowMana,
    canAllocateAttributes,
    
    // Computed values
    powerLevel,
    
    // Action methods
    restoreHealth,
    takeDamage,
    restoreMana,
    consumeMana,
    allocateAttributePoint,
    updatePlayerData,
  };
};

export default usePlayerStats;
