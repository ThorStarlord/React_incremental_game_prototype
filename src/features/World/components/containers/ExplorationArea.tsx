import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
// Import types
import { BattleResult } from '../../../../context/types/gameStates/BattleGameStateTypes';
import { Enemy as DungeonEnemy } from '../../data/dungeonEnemies';
import { CombatEnemy } from '../../../../context/types/combat';
// Import the combat components
import Battle from '../../../Combat/components/containers/Battle';
import { adaptToCombatEnemy } from '../../../Combat/adapters/enemyAdapter';

/**
 * Interface for the ExplorationArea component props
 */
interface ExplorationAreaProps {
  dungeonId?: string;
  onExplorationComplete: (result: BattleResult) => void;
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
  // State to track combat status
  const [isInCombat, setIsInCombat] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<DungeonEnemy | null>(null);
  const [currentEncounter, setCurrentEncounter] = useState(1);
  const [maxEncounters, setMaxEncounters] = useState(1);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard' | 'nightmare'>('normal');

  // Function to handle starting a battle
  const handleStartBattle = (dungeonId: string) => {
    // In a real implementation, you'd load the enemy data from the dungeon
    // For now, using a sample enemy
    const sampleEnemy: DungeonEnemy = {
      id: 'sample-1',
      name: 'Test Enemy',
      hp: 50,
      attack: 5,
      defense: 3,
      essenceDrop: 10,
      goldDrop: 15,
      portrait: 'default_enemy',
      traits: []
    };
    
    setCurrentEnemy(sampleEnemy);
    setIsInCombat(true);
    onStartBattle(dungeonId);
  };

  // Function to handle retreat
  const handleRetreat = () => {
    setIsInCombat(false);
    setCurrentEnemy(null);
  };

  // Function to handle exploration completion
  const handleExplorationComplete = (result: BattleResult) => {
    setIsInCombat(false);
    setCurrentEnemy(null);
    onExplorationComplete(result);
  };

  return (
    <Box id="main-content" className="game-area">
      {!isInCombat && dungeonId ? (
        // Show dungeon info when not in combat
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Dungeon {dungeonId}</Typography>
          <Typography variant="body1">
            Select an action below.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={onBack}>
              Go Back
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleStartBattle(dungeonId)}
            >
              Start Battle
            </Button>
          </Box>
        </Paper>
      ) : isInCombat && currentEnemy ? (
        // Show battle component when in combat
        <Battle
          enemy={adaptToCombatEnemy(currentEnemy)}
          dungeonId={dungeonId || "unknown"}
          encounter={currentEncounter}
          totalEncounters={maxEncounters}
          onExplorationComplete={handleExplorationComplete}
          onRetreat={handleRetreat}
          difficulty={difficulty}
        />
      ) : (
        // Default view when no dungeon is selected or in transition
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Exploration Area</Typography>
          <Typography variant="body1">
            Select a dungeon from the world map to begin exploring.
          </Typography>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={onBack}>
            Return to Map
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ExplorationArea;
