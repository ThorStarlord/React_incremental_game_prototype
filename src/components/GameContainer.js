import React, { useState } from 'react';
import { Box } from '@mui/material';
import FactionContainer from './FactionUI/FactionContainer';
import Battle from './Battle';
import NPCEncounter from './NPCEncounter';
import PlayerStats from './PlayerStats';
import PlayerTraits from './PlayerTraits';
import Header from './Header';
import Footer from './Footer';
import RegionsPanel from './panels/RegionsPanel';
import TownPanel from './panels/TownPanel';
import DungeonPanel from './panels/DungeonPanel';
import './GameContainer.css';

const GameContainer = () => {
  const [selectedTownId, setSelectedTownId] = useState(null);
  const [selectedNpcId, setSelectedNpcId] = useState(null);
  const [selectedDungeon, setSelectedDungeon] = useState(null); // { id, regionId }
  const [isExploring, setIsExploring] = useState(false);

  const handleTownSelect = (townId) => {
    setSelectedTownId(townId);
    setSelectedNpcId(null);
    setSelectedDungeon(null);
    setIsExploring(false);
  };

  const handleBackToRegions = () => {
    setSelectedTownId(null);
    setSelectedNpcId(null);
    setSelectedDungeon(null);
    setIsExploring(false);
  };

  const handleNpcSelect = (npcId) => {
    setSelectedNpcId(npcId);
  };

  const handleBackToTown = () => {
    setSelectedNpcId(null);
  };

  const handleDungeonSelect = (dungeonId, regionId) => {
    setSelectedDungeon({ id: dungeonId, regionId });
    setSelectedTownId(null);
    setSelectedNpcId(null);
    setIsExploring(false);
  };

  const handleStartExploration = (dungeonId) => {
    setIsExploring(true);
  };

  const handleExplorationComplete = () => {
    setIsExploring(false);
    setSelectedDungeon(null);
  };

  const renderMainContent = () => {
    if (isExploring) {
      return (
        <Box id="main-content" className="game-area">
          <Battle 
            dungeonId={selectedDungeon.id}
            onExplorationComplete={handleExplorationComplete}
          />
        </Box>
      );
    }

    if (selectedNpcId) {
      return (
        <Box id="main-content" className="game-area">
          <NPCEncounter 
            npcId={selectedNpcId} 
            onBack={handleBackToTown}
          />
        </Box>
      );
    }

    if (selectedDungeon) {
      return (
        <Box id="main-content" className="game-area">
          <DungeonPanel 
            dungeonId={selectedDungeon.id}
            regionId={selectedDungeon.regionId}
            onBack={handleBackToRegions}
            onStartBattle={handleStartExploration}
          />
        </Box>
      );
    }

    if (selectedTownId) {
      return (
        <Box id="main-content" className="game-area">
          <TownPanel 
            townId={selectedTownId} 
            onBack={handleBackToRegions}
            onNpcSelect={handleNpcSelect}
          />
        </Box>
      );
    }

    return (
      <Box id="main-content" className="game-area">
        <RegionsPanel 
          onTownSelect={handleTownSelect}
          onDungeonSelect={handleDungeonSelect} 
        />
      </Box>
    );
  };

  return (
    <Box className={`game-container ${isExploring ? 'exploring' : ''}`}>
      <Box id="header" className="game-area">
        <Header />
      </Box>
      <Box id="player-stats" className="game-area">
        <PlayerStats />
      </Box>
      {renderMainContent()}
      {!isExploring && (
        <>
          <Box id="battle" className="game-area">
            <Battle />
          </Box>
          <Box id="traits" className="game-area">
            <PlayerTraits />
          </Box>
          <Box id="faction" className="game-area">
            <FactionContainer />
          </Box>
        </>
      )}
      <Box id="footer" className="game-area">
        <Footer />
      </Box>
    </Box>
  );
};

export default GameContainer;