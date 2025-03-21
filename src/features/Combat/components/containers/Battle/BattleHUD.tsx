import React from 'react';
import { Box, Paper, Typography, Chip, Tooltip } from '@mui/material';
import { StatusEffect } from '../../../../../context/types/combat';
import StatusEffectsDisplay from '../Battle/StatusEffectsDisplay';

interface BattleHUDProps {
  playerStats: {
    currentHealth: number;
    maxHealth: number;
    currentMana: number;
    maxMana: number;
  };
  enemyStats: {
    id?: string;
    name?: string;
    currentHealth: number;
    maxHealth: number;
    attack?: number;
    defense?: number;
    level?: number;
  };
  playerEffects: StatusEffect[];
}

/**
 * BattleHUD Component
 * 
 * Displays combat-related information including health, mana,
 * and status effects.
 */
const BattleHUD: React.FC<BattleHUDProps> = ({
  playerStats,
  enemyStats,
  playerEffects
}) => {
  // Player health and mana percentage for UI
  const playerHealthPercent = Math.floor((playerStats.currentHealth / playerStats.maxHealth) * 100);
  const playerManaPercent = Math.floor((playerStats.currentMana / playerStats.maxMana) * 100);
  
  // Enemy health percentage for UI
  const enemyHealthPercent = Math.floor((enemyStats.currentHealth / enemyStats.maxHealth) * 100);
  
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        mb: 2, 
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      {/* Player Stats */}
      <Box sx={{ flex: 1, mr: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Your Stats
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" minWidth={70}>
            Health:
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {playerStats.currentHealth}/{playerStats.maxHealth} ({playerHealthPercent}%)
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" minWidth={70}>
            Mana:
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {playerStats.currentMana}/{playerStats.maxMana} ({playerManaPercent}%)
          </Typography>
        </Box>
        
        {/* Player status effects */}
        <StatusEffectsDisplay effects={playerEffects} />
      </Box>
      
      {/* Enemy Stats */}
      <Box sx={{ flex: 1, ml: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          {enemyStats.name || 'Enemy'} Stats
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" minWidth={70}>
            Health:
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {enemyStats.currentHealth}/{enemyStats.maxHealth} ({enemyHealthPercent}%)
          </Typography>
        </Box>
        
        {enemyStats.attack && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" minWidth={70}>
              Attack:
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {enemyStats.attack}
            </Typography>
          </Box>
        )}
        
        {enemyStats.defense && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" minWidth={70}>
              Defense:
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {enemyStats.defense}
            </Typography>
          </Box>
        )}
        
        {enemyStats.level && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" minWidth={70}>
              Level:
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {enemyStats.level}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default BattleHUD;
