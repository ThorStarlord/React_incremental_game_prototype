import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import Panel from './Panel';
import './PlayerStats.css';

const PlayerStats = () => {
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  const handleStatUpgrade = (statId) => {
    if (player.statPoints <= 0) return;
    
    const updates = {
      attack: { value: player.attack + 1 },
      defense: { value: player.defense + 1 },
      hp: { value: player.hp + 5 }
    };

    const update = updates[statId];
    if (update) {
      dispatch({
        type: 'UPDATE_PLAYER',
        payload: {
          ...player,
          [statId]: update.value,
          statPoints: player.statPoints - 1
        }
      });
    }
  };

  return (
    <Panel title="Player Stats">
      <Typography variant="body2" sx={{ mb: 2 }}>
        Name: {player.name}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography>HP: {player.hp}</Typography>
        <Typography>Attack: {player.attack}</Typography>
        <Typography>Defense: {player.defense}</Typography>
      </Box>

      <div className="other-stats">
        <p>Essence: {player.essence}</p>
        <p>Gold: {player.gold}</p>
      </div>
    </Panel>
  );
};

export default PlayerStats;