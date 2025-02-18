// src/components/GameContainer.js

import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import { GameDispatchContext, GameStateContext } from '../context/GameStateContext';
import { calculateEssenceGeneration } from '../utils/soulResonanceUtils';
import { UPDATE_INTERVALS } from '../config/gameConstants';
import Header from './Header';
import Footer from './Footer';
import PlayerStats from './PlayerStats';
import PlayerTraits from './PlayerTraits';
import FactionContainer from './FactionUI/FactionContainer';
import WorldMap from './panels/WorldMap';
import TownArea from './areas/TownArea';
import ExplorationArea from './areas/ExplorationArea';
import EssenceDisplay from './EssenceDisplay';
import './GameContainer.css';
import { towns } from '../modules/data/towns'; // ⭐️ Import towns data

const GameContainer = () => {
  // ⭐️ Get the ID of the first town
  const firstTownId = towns[0]?.id;
  const [selectedTownId, setSelectedTownId] = useState(firstTownId || null); // ⭐️ Initialize with first town
  const [selectedNpcId, setSelectedNpcId] = useState(null);
  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [isExploring, setIsExploring] = useState(false);
  const dispatch = useContext(GameDispatchContext);
  const { affinities } = useContext(GameStateContext);

  useEffect(() => {
    if (selectedTownId) {
      const interval = setInterval(() => {
        const essenceGain = calculateEssenceGeneration(affinities);
        dispatch({ type: 'GAIN_ESSENCE', payload: essenceGain });
      }, UPDATE_INTERVALS.ESSENCE_GENERATION);
      return () => clearInterval(interval);
    }
  }, [selectedTownId, affinities, dispatch]);

  const handleTownSelect = (townId) => {
    setSelectedTownId(townId);
    setSelectedNpcId(null);
    setSelectedDungeon(null);
    setIsExploring(false);
  };

  const handleBackToWorldMap = () => { // ⭐️ New function to go back to World Map (TownArea -> WorldMap)
    setSelectedTownId(null);
    setSelectedNpcId(null);
    setSelectedDungeon(null);
    setIsExploring(false);
  };


  const renderMainContent = () => {
    if (isExploring || selectedDungeon) {
      return <ExplorationArea /* ... props ... */ />;
    }
    if (selectedTownId) {
      return <TownArea townId={selectedTownId} onBack={handleBackToWorldMap} /* ... other props for TownArea ... */ />; // ⭐️ Pass onBack for TownArea
    }
    return null; // ⭐️ renderMainContent now returns null if no Town or Dungeon is selected, NO WorldMap here!
  };

  return (
    <Box className="game-container">
      <Box id="header"><Header /></Box>
      <Box id="main-content-area">{renderMainContent()}</Box> {/* Renamed ID */}
      <Box id="world-map-area"> {/* World map area - ALWAYS shows WorldMap */}
        <WorldMap
          onTownSelect={handleTownSelect}
          onDungeonSelect={(dungeonId, regionId) => {
            setSelectedDungeon({ id: dungeonId, regionId });
            setSelectedTownId(null);
            setSelectedNpcId(null);
            setIsExploring(false);
          }}
        />
      </Box>
      <Box id="bottom-windows">
        <PlayerStats />
        <PlayerTraits />
        <FactionContainer />
      </Box>
      <Footer />
    </Box>
  );
};

export default GameContainer;