import { useContext, useCallback, useState } from 'react';
import { useGameState, useGameDispatch } from '../../context';
import { RESOURCE_TYPES, GENERATION_RATES } from '../../constants/gameConstants';

export const useEssenceManager = () => {
  const { essence = 0 } = useGameState();
  const dispatch = useGameDispatch();

  const gainEssence = useCallback((amount) => {
    dispatch({ type: 'GAIN_ESSENCE', payload: amount });
  }, [dispatch]);

  const spendEssence = useCallback((amount) => {
    if (essence >= amount) {
      dispatch({ type: 'SPEND_ESSENCE', payload: amount });
      return true;
    }
    return false;
  }, [essence, dispatch]);

  const hasEnoughEssence = useCallback((amount) => {
    return essence >= amount;
  }, [essence]);

  return {
    essence,
    gainEssence,
    spendEssence,
    hasEnoughEssence
  };
};

export const useAffinityManager = () => {
  const { affinities = {} } = useGameState();
  const dispatch = useGameDispatch();

  const updateAffinity = useCallback((npcId, level) => {
    dispatch({ 
      type: 'UPDATE_AFFINITY', 
      payload: { npcId, level } 
    });
  }, [dispatch]);

  const getAffinityLevel = useCallback((npcId) => {
    return affinities && affinities[npcId] ? affinities[npcId] : 'Stranger';
  }, [affinities]);

  return {
    affinities,
    updateAffinity,
    getAffinityLevel
  };
};

export const useFactionManager = () => {
  const { factions = [] } = useGameState();
  const dispatch = useGameDispatch();

  const createFaction = useCallback((factionData) => {
    dispatch({
      type: 'CREATE_FACTION',
      payload: { faction: factionData }
    });
  }, [dispatch]);

  const joinFaction = useCallback((factionId, role = 'Member') => {
    dispatch({
      type: 'JOIN_FACTION',
      payload: { factionId, role }
    });
  }, [dispatch]);

  return {
    factions,
    createFaction,
    joinFaction
  };
};

/**
 * Hook for managing game notifications
 * 
 * @returns {Object} Notification functions
 */
export const useNotification = () => {
  const dispatch = useGameDispatch();
  
  const [notification, setNotification] = useState({ open: false });
  
  /**
   * Display a notification to the user
   * 
   * @param {Object} notificationOptions - The notification options
   */
  const showNotification = useCallback((notificationOptions) => {
    setNotification({
      open: notificationOptions.open || true,
      message: notificationOptions.message || '',
      severity: notificationOptions.severity || 'info'
    });
  }, []);
  
  return { notification, showNotification };
};