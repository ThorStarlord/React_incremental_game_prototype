import React from 'react';
import { Box } from '@mui/material';
import Battle from '../Battle';
import NPCEncounter from '../NPCEncounter';
import DungeonPanel from '../panels/DungeonPanel';

const ExplorationArea = ({ dungeonId, onExplorationComplete, onBack, onStartBattle }) => {
  return (
    <Box id="main-content" className="game-area">
      {dungeonId ? (
        <DungeonPanel
          dungeonId={dungeonId}
          onBack={onBack}
          onStartBattle={onStartBattle}
        />
      ) : (
        <Battle
          dungeonId={dungeonId}
          onExplorationComplete={onExplorationComplete}
        />
      )}
    </Box>
  );
};

export default ExplorationArea;