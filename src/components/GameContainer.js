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

const GameContainer = () => {
  const [selectedTownId, setSelectedTownId] = useState(null);
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

  const handleBackToRegions = () => {
    setSelectedTownId(null);
    setSelectedNpcId(null);
    setSelectedDungeon(null);
    setIsExploring(false);
  };

  const renderMainContent = () => {
    if (isExploring || selectedDungeon) {
      return (
        <ExplorationArea 
          dungeonId={selectedDungeon?.id}
          regionId={selectedDungeon?.regionId}
          onExplorationComplete={() => {
            setIsExploring(false);
            setSelectedDungeon(null);
          }}
          onBack={handleBackToRegions}
          onStartBattle={() => setIsExploring(true)}
        />
      );
    }

    if (selectedTownId) {
      return (
        <TownArea 
          townId={selectedTownId}
          selectedNpcId={selectedNpcId}
          onBack={handleBackToRegions}
          onNpcSelect={setSelectedNpcId}
          onBackToTown={() => setSelectedNpcId(null)}
        />
      );
    }

    return (
      <WorldMap
        onTownSelect={handleTownSelect}
        onDungeonSelect={(dungeonId, regionId) => {
          setSelectedDungeon({ id: dungeonId, regionId });
          setSelectedTownId(null);
          setSelectedNpcId(null);
          setIsExploring(false);
        }}
      />
    );
  };

  return (
    <Box className="game-container"> {/* Removed 'exploring' class from here */}
      <Box id="header"><Header /></Box>
      <Box id="main-content">{renderMainContent()}</Box> {/* Main content area */}
      <Box id="world-map-area"> {/* World map area */}
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
      <Box id="bottom-windows"> {/* Bottom windows area */}
        <PlayerStats />
        <PlayerTraits />
        <FactionContainer />
      </Box>
      {/* Removed EssenceDisplay from direct placement, we can put it in PlayerStats or Header later */}
      <Footer /> {/* Footer is now at the very bottom because of grid layout */}
    </Box>
  );
};

export default GameContainer;