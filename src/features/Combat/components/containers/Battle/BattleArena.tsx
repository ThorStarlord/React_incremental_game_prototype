import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import CombatantCard from '../Battle/CombatantCard';

interface BattleArenaProps {
  playerStats: {
    currentHealth: number;
    maxHealth: number;
    currentMana?: number;
    maxMana?: number;
  };
  enemyStats: {
    id?: string;
    name?: string;
    currentHealth: number;
    maxHealth: number;
    level?: number;
  };
  isPlayerTurn: boolean;
  enemyImageUrl?: string;
}

/**
 * BattleArena Component
 * 
 * Visual representation of the battle, showing player and enemy.
 */
const BattleArena: React.FC<BattleArenaProps> = ({
  playerStats,
  enemyStats,
  isPlayerTurn,
  enemyImageUrl
}) => {
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Player side */}
      <Box sx={{ width: '45%', textAlign: 'center' }}>
        <CombatantCard
          name="Player"
          health={playerStats.currentHealth}
          maxHealth={playerStats.maxHealth}
          mana={playerStats.currentMana}
          maxMana={playerStats.maxMana}
          isActive={isPlayerTurn}
          isPlayer={true}
        />
      </Box>
      
      {/* Battle indicator */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: 'text.secondary',
            opacity: 0.3
          }}
        >
          VS
        </Typography>
      </Box>
      
      {/* Enemy side */}
      <Box sx={{ width: '45%', textAlign: 'center' }}>
        <CombatantCard
          name={enemyStats.name || 'Enemy'}
          health={enemyStats.currentHealth}
          maxHealth={enemyStats.maxHealth}
          level={enemyStats.level}
          isActive={!isPlayerTurn}
          isPlayer={false}
          imageUrl={enemyImageUrl}
        />
      </Box>
    </Paper>
  );
};

export default BattleArena;
