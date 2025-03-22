import { useEffect } from 'react';
import { ACTION_TYPES } from '../../types/ActionTypes';
import { createNotification } from '../utils/notificationHelpers';
import { ExtendedGameState } from '../../types/gameLoopStateTypes';
import { GameAction } from '../../GameDispatchContext';

/**
 * Hook for managing player stats progression and passive skill gains
 */
export const useStatsSystem = (
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) => {
  useEffect(() => {
    const statsInterval = setInterval(() => {
      // Apply passive skill experience gain
      handlePassiveSkillGain(gameState, dispatch);
      
      // Apply health regeneration if applicable
      handleHealthRegeneration(gameState, dispatch);
    }, 30000); // Run every 30 seconds
    
    return () => clearInterval(statsInterval);
  }, [dispatch, gameState.player]);
};

/**
 * Handle passive skill experience gain
 */
function handlePassiveSkillGain(
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) {
  if (gameState.player.skills) {
    const passiveSkillGain = gameState.player.passiveSkillGainRate || 0;
    
    if (passiveSkillGain > 0 && gameState.player.activeSkill) {
      dispatch({
        type: ACTION_TYPES.GAIN_SKILL_EXPERIENCE,
        payload: {
          skillId: gameState.player.activeSkill,
          amount: passiveSkillGain
        }
      });
      
      // Notify on significant milestones
      const currentSkill = gameState.player.skills.find(
        s => s.id === gameState.player.activeSkill
      );
      
      if (currentSkill && Math.floor(currentSkill.experience) % 100 === 0) {
        dispatch({
          type: ACTION_TYPES.ADD_NOTIFICATION,
          payload: createNotification(
            `You've gained experience in ${currentSkill.name}!`,
            'positive',
            3000
          )
        });
      }
    }
  }
}

/**
 * Handle health regeneration
 */
function handleHealthRegeneration(
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) {
  const healthRegen = gameState.player.healthRegenRate || 0;
  if (healthRegen > 0 && 
      (gameState.player.health || 0) < (gameState.player.maxHealth || 100)) {
    dispatch({
      type: ACTION_TYPES.UPDATE_PLAYER,
      payload: {
        health: Math.min(
          (gameState.player.health || 0) + healthRegen, 
          (gameState.player.maxHealth || 100)
        )
      }
    });
  }
}
