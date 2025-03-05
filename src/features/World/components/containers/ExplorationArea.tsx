import React from 'react';
import { Box } from '@mui/material';
import Battle from '../combat/Battle';
import NPCEncounter from '../NPCEncounter';
import DungeonPanel from '../panels/DungeonPanel';

/**
 * Interface for the ExplorationArea component props
 */
interface ExplorationAreaProps {
  dungeonId?: string;
  onExplorationComplete: () => void;
  onBack: () => void;
  onStartBattle: (dungeonId: string) => void;
}

/**
 * ExplorationArea Component
 * 
 * Manages the display of either a dungeon overview panel or
 * an active battle when exploring a dungeon.
 * 
 * @param {ExplorationAreaProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ExplorationArea: React.FC<ExplorationAreaProps> = ({ 
  dungeonId, 
  onExplorationComplete, 
  onBack, 
  onStartBattle 
}) => {
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
