import React, { ReactElement } from 'react';
import { Box, Typography } from '@mui/material';
import { TownArea } from '../areas';
import ExplorationArea from '../containers/ExplorationArea';

/**
 * Interface for MainContent props
 * 
 * @interface MainContentProps
 * @property {string | null} selectedTownId - ID of the currently selected town
 * @property {string | null} selectedNpcId - ID of the currently selected NPC
 * @property {string | null} selectedDungeon - ID of the currently selected dungeon
 * @property {boolean} isExploring - Whether the player is currently exploring
 * @property {() => void} onBackToWorldMap - Callback function to return to world map
 */
interface MainContentProps {
  selectedTownId: string | null;
  selectedNpcId: string | null;
  selectedDungeon: string | null;
  isExploring: boolean;
  onBackToWorldMap: () => void;
}

/**
 * MainContent Component
 * 
 * The main dynamic content area that renders different game areas
 * based on the player's current selection/activity
 * 
 * @param {MainContentProps} props - Component props
 * @returns {ReactElement} The rendered component
 */
const MainContent: React.FC<MainContentProps> = ({ 
  selectedTownId, 
  selectedNpcId, 
  selectedDungeon, 
  isExploring, 
  onBackToWorldMap 
}) => {
  /**
   * Renders the appropriate content based on current selection state
   * 
   * @returns {ReactElement} The content to display
   */
  const renderGameContent = (): ReactElement => {
    if (isExploring || selectedDungeon) {
      return <ExplorationArea 
        dungeonId={selectedDungeon || undefined} 
        onExplorationComplete={onBackToWorldMap} 
        onBack={onBackToWorldMap}
        onStartBattle={(dungeonId) => console.log(`Start battle in ${dungeonId}`)}
      />;
    }
    if (selectedTownId) {
      return (
        <TownArea
          townId={selectedTownId}
          selectedNpcId={selectedNpcId}
          onBack={onBackToWorldMap}
        />
      );
    }
    return (
      <Typography>
        Welcome to the Main Content Area! Select a Town or Dungeon from the World Map below.
      </Typography>
    );
  };

  return (
    <Box 
      id="main-content-area-dynamic" 
      sx={{
        height: '100%',
        overflowY: 'hidden',
        position: 'relative'
      }}
    >
      <Box 
        sx={{
          p: 2.5,
          border: 1,
          borderStyle: 'dashed',
          borderColor: 'grey.400',
          borderRadius: 1,
          bgcolor: 'background.paper',
          mb: 2.5,
          flex: 1,
          minHeight: 200,
          maxHeight: 300,
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          overflow: 'hidden',
        }}
      >
        {renderGameContent()}
      </Box>
    </Box>
  );
};

export default MainContent;
