import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useGameState } from '../../../../context/GameStateExports';
import Battle from './Battle';

// Import components
import CombatLoading from '../presentation/CombatLoading';
import CombatResults from '../presentation/CombatResults';
import CombatControls from '../presentation/CombatControls';
import CombatProgress from '../presentation/CombatProgress';

// Import hooks
import { useCombatFlow } from '../../hooks/useCombatFlow';

// Import types
import { CombatResult } from '../../../../context/types/combat/combatTypes';
import { Enemy as CombatEnemy } from '../../../../context/types/combat/combatTypes';
import { Enemy as SimpleEnemy } from '../../../../context/types/combat/baseEnemyTypes';

// Import adapter
import { adaptEnemy } from '../../utils/enemyAdapter';

/**
 * Interface for Combat component props
 */
interface CombatProps {
  /** Area ID where combat takes place */
  areaId?: string;
  /** Difficulty level (multiplier for enemy stats) */
  difficulty?: number;
  /** Whether this is a random encounter vs. planned battle */
  isRandomEncounter?: boolean;
  /** Callback when combat is complete */
  onComplete?: (result: CombatResult) => void;
  /** Callback when player retreats */
  onRetreat?: () => void;
}

/**
 * Combat Manager Component
 * 
 * Manages the state and flow of combat encounters, including enemy generation,
 * combat transitions, multiple encounters, and rewards
 */
const Combat: React.FC<CombatProps> = ({ 
  areaId = 'forest', 
  difficulty = 1, 
  isRandomEncounter = false, 
  onComplete, 
  onRetreat 
}) => {
  const gameState = useGameState();
  // Access player directly from gameState
  const player = gameState.player;
  
  // Use the combat flow hook to manage the combat state and logic
  const {
    loading,
    currentEnemy,
    currentEncounter,
    totalEncounters,
    combatResult,
    totalRewards,
    initializeCombat,
    handleBattleComplete,
    handleRetreat
  } = useCombatFlow(player, areaId, difficulty, isRandomEncounter);

  // Initialize combat when component mounts
  useEffect(() => {
    initializeCombat();
  }, [initializeCombat]);

  /**
   * Complete all combat and return to previous screen
   */
  const handleFinish = () => {
    if (onComplete) {
      onComplete({
        victory: combatResult?.victory || false,
        rewards: totalRewards
      });
    }
  };

  /**
   * Retreat from combat and return to previous screen
   */
  const handleExitCombat = () => {
    if (onRetreat) {
      onRetreat();
    } else if (onComplete) {
      onComplete({
        victory: false,
        retreat: true
      });
    }
  };

  // Render appropriate UI based on current state
  if (loading) {
    return <CombatLoading />;
  }

  if (combatResult !== null) {
    return (
      <CombatResults 
        combatResult={combatResult}
        totalRewards={totalRewards}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      {/* Progress indicator */}
      <CombatProgress 
        currentEncounter={currentEncounter}
        totalEncounters={totalEncounters}
      />
      
      {/* Main battle component */}
      {currentEnemy && (
        <Battle 
          enemy={adaptEnemy({
            ...currentEnemy,
            // Ensure required properties exist for SimpleEnemy
            health: currentEnemy.maxHealth || currentEnemy.currentHealth || 100,
            maxHealth: currentEnemy.maxHealth || 100,
            currentHealth: currentEnemy.currentHealth || currentEnemy.maxHealth || 100
          } as SimpleEnemy)}
          dungeonId={areaId}
          encounter={currentEncounter + 1}
          totalEncounters={totalEncounters}
          onExplorationComplete={handleBattleComplete}
          onRetreat={handleRetreat}
        />
      )}
      
      {/* Combat controls */}
      <CombatControls onRetreat={handleExitCombat} />
    </Box>
  );
};

export default Combat;
