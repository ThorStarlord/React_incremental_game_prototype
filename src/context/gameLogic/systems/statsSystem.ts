import { useEffect } from 'react';
import { SKILL_ACTIONS } from '../../types/actions';
import { createNotification } from '../utils/notificationHelpers';
import { ExtendedGameState } from '../../types/gameStates/gameLoopStateTypes';
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
        type: SKILL_ACTIONS.GAIN_SKILL_EXPERIENCE,
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
          type: 'ADD_NOTIFICATION',
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
      type: 'UPDATE_PLAYER',
      payload: {
        health: Math.min(
          (gameState.player.health || 0) + healthRegen, 
          (gameState.player.maxHealth || 100)
        )
      }
    });
  }
}
