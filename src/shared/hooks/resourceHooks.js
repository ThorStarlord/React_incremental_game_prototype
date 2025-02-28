import { useContext, useCallback } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import { ESSENCE_COSTS } from '../config/gameConstants';

export const useEssenceManager = () => {
  const { essence } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

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
  const { affinities } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  const updateAffinity = useCallback((npcId, level) => {
    dispatch({ 
      type: 'UPDATE_AFFINITY', 
      payload: { npcId, level } 
    });
  }, [dispatch]);

  const getAffinityLevel = useCallback((npcId) => {
    return affinities[npcId] || 'Stranger';
  }, [affinities]);

  return {
    affinities,
    updateAffinity,
    getAffinityLevel
  };
};

export const useFactionManager = () => {
  const { factions } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

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