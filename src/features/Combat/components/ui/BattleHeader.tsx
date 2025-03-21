import React from 'react';
import { Typography, Grid } from '@mui/material';
import { PlayerStatsPanel } from './PlayerStatsPanel';
import { EnemyStatsPanel } from './EnemyStatsPanel';

interface BattleHeaderProps {
  round: number;
  playerStats: {
    currentHealth: number;
    maxHealth: number;
    currentMana: number;
    maxMana: number;
  };
  enemyStats: {
    name: string;
    level: number;
    currentHealth: number;
    maxHealth: number;
    attack: number;
    defense: number;
  };
  calculatedStats: {
    attack: number;
    defense: number;
  };
  playerName: string;
}

const BattleHeader: React.FC<BattleHeaderProps> = ({
  round,
  playerStats,
  enemyStats,
  calculatedStats,
  playerName
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Battle - Round {Math.ceil(round)}
      </Typography>
      
      {/* Player vs Enemy header */}
      <Grid container spacing={2}>
        <PlayerStatsPanel 
          playerStats={playerStats}
          calculatedStats={calculatedStats}
          playerName={playerName}
        />
        
        <EnemyStatsPanel 
          enemyStats={enemyStats}
        />
      </Grid>
    </>
  );
};

export default BattleHeader;
