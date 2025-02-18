import React from 'react';
import { Box } from '@mui/material';
import TownPanel from '../panels/TownPanel';
import NPCEncounter from '../NPCEncounter';

const TownArea = ({ townId, selectedNpcId, onBack, onNpcSelect, onBackToTown }) => {
  return (
    <Box id="main-content" className="game-area">
      {selectedNpcId ? (
        <NPCEncounter 
          npcId={selectedNpcId} 
          onBack={onBackToTown}
        />
      ) : (
        <TownPanel 
          townId={townId} 
          onBack={onBack}
          onNpcSelect={onNpcSelect}
        />
      )}
    </Box>
  );
};

export default TownArea;