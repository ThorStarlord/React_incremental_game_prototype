import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useGameState, useGameDispatch } from '../../../../../context/GameStateExports';

// Import battle subcomponents
import BattleArena from '../Battle/BattleArena';
import BattleHUD from '../Battle/BattleHUD';
import BattleActions from '../Battle/BattleActions';
import BattleLog from '../Battle/BattleLog';
import TurnIndicator from '../Battle/TurnIndicator';

// Import battle hook - fix import to use the re-export in the same directory
import useBattleLogic from './useBattleLogic';

// Import the proper Enemy type directly from combat types
import { Enemy } from '../../../../../context/types/combat/actors';
import { BattleResult } from '../../../../../context/types/BattleGameStateTypes';

interface BattleProps {
  enemy: Enemy;  // This will now match the correct Enemy type
  dungeonId: string;
  encounter?: number;
  totalEncounters?: number;
  onExplorationComplete: (result: BattleResult) => void;
  onRetreat?: () => void;
  difficulty?: 'easy' | 'normal' | 'hard' | 'nightmare';
}

/**
 * Battle Component
 * 
 * Manages a single battle encounter against an enemy.
 * Composes multiple subcomponents to create the battle UI.
 */
const Battle: React.FC<BattleProps> = ({
  enemy,
  dungeonId,
  encounter = 1,
  totalEncounters = 1,
  onExplorationComplete,
  onRetreat,
  difficulty = 'normal'
}) => {
  // Access state directly from useGameState instead of destructuring 'state'
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Use the battle logic hook to manage combat state and actions
  const {
    combatState,
    setCombatState,
    handlePlayerAttack,
    handleUseSkill,
    handleUseItem,
    handleDefend,
    handleFlee,
    handlePlayerTurnEnd,
    showTraitEffect
  } = useBattleLogic({
    player: gameState.player,
    dungeonId,
    dispatch,
    difficulty,
    calculatedStats: gameState.calculatedStats || {}, // Add fallback empty object
    onComplete: onExplorationComplete,
    onVictory: () => {
      // Handle victory logic if needed
    },
    onDefeat: () => {
      // Handle defeat logic if needed
    }
  });

  // Handle initial enemy setup
  useEffect(() => {
    if (enemy && !combatState.enemyStats?.id) {
      setCombatState(prev => ({
        ...prev,
        enemyStats: {
          id: enemy.id,
          name: enemy.name,
          currentHealth: enemy.maxHealth,
          maxHealth: enemy.maxHealth,
          attack: enemy.attack,
          defense: enemy.defense,
          level: enemy.level
        }
      }));
    }
  }, [enemy, combatState.enemyStats?.id]);

  if (!combatState.active) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Battle has ended.</Typography>
      </Box>
    );
  }

  if (!combatState.enemyStats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading battle...</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Encounter info */}
      {totalEncounters > 1 && (
        <Typography 
          variant="subtitle2" 
          sx={{ textAlign: 'center', mb: 1 }}
        >
          Encounter {encounter} / {totalEncounters}
        </Typography>
      )}
      
      {/* Turn indicator */}
      <TurnIndicator isPlayerTurn={combatState.playerTurn} />
      
      {/* Battle HUD - shows player & enemy stats */}
      <BattleHUD 
        playerStats={combatState.playerStats}
        enemyStats={combatState.enemyStats}
        playerEffects={combatState.effects || []}
      />
      
      {/* Main battle arena - visual representation of combat */}
      <BattleArena 
        playerStats={combatState.playerStats}
        enemyStats={combatState.enemyStats}
        isPlayerTurn={combatState.playerTurn}
        enemyImageUrl={enemy.imageUrl}
      />
      
      {/* Combat log */}
      <BattleLog log={combatState.log} />
      
      {/* Battle actions - attack, skills, items, flee */}
      <BattleActions 
        onAttack={handlePlayerAttack}
        onUseSkill={handleUseSkill}
        onUseItem={handleUseItem} 
        onDefend={handleDefend}
        onFlee={onRetreat || handleFlee}
        skills={combatState.skills || []}
        items={combatState.items || []}
        isPlayerTurn={combatState.playerTurn}
        disabled={!combatState.playerTurn}
      />
    </Box>
  );
};

export default Battle;
