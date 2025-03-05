import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
// import NPCEncounter from '../NPCEncounter'; // Commented out - module not found
// import DungeonPanel from '../panels/DungeonPanel'; // Commented out - module not found

/**
 * Interface for the ExplorationArea component props
 */
interface ExplorationAreaProps {
  dungeonId?: string;
  onExplorationComplete: () => void;
  onBack: () => void;
  onStartBattle: (dungeonId: string) => void;
}

// Temporary Battle placeholder component until the real one is available
const BattlePlaceholder: React.FC<{dungeonId?: string, onExplorationComplete: () => void}> = ({
  dungeonId,
  onExplorationComplete
}) => (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h5">Combat System</Typography>
    <Typography variant="body1">
      Battle component is being developed. This is a placeholder.
    </Typography>
    <Typography variant="body2" sx={{ mt: 2 }}>
      Dungeon ID: {dungeonId || 'None'}
    </Typography>
    <Box sx={{ mt: 3 }}>
      <button onClick={onExplorationComplete}>
        Complete Exploration
      </button>
    </Box>
  </Paper>
);

// Temporary DungeonPanel placeholder component until the real one is available
const DungeonPanelPlaceholder: React.FC<{
  dungeonId: string;
  onBack: () => void;
  onStartBattle: (dungeonId: string) => void;
}> = ({ dungeonId, onBack, onStartBattle }) => (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h5">Dungeon {dungeonId}</Typography>
    <Typography variant="body1">
      DungeonPanel component is being developed. This is a placeholder.
    </Typography>
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
      <Button variant="outlined" onClick={onBack}>
        Go Back
      </Button>
      <Button variant="contained" color="primary" onClick={() => onStartBattle(dungeonId)}>
        Start Battle
      </Button>
    </Box>
  </Paper>
);

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
        <DungeonPanelPlaceholder
          dungeonId={dungeonId}
          onBack={onBack}
          onStartBattle={onStartBattle}
        />
      ) : (
        <BattlePlaceholder
          dungeonId={dungeonId}
          onExplorationComplete={onExplorationComplete}
        />
      )}
    </Box>
  );
};

export default ExplorationArea;
