// src/components/GameContainer.js

import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import { GameDispatchContext, GameStateContext } from '../context/GameStateContext';
import { calculateEssenceGeneration } from '../utils/soulResonanceUtils';
import { UPDATE_INTERVALS } from '../config/gameConstants';
import Header from './Header';
import PlayerStats from './PlayerStats';
import PlayerTraits from './PlayerTraits';
import FactionContainer from './FactionUI/FactionContainer';
import WorldMap from './panels/WorldMap';
import TownArea from './areas/TownArea';
import ExplorationArea from './areas/ExplorationArea';
import SoulResonanceDisplay from './SoulResonanceDisplay'; // ⭐️ Import SoulResonanceDisplay
import './GameContainer.css';
import { towns } from '../modules/data/towns'; // ⭐️ Import towns data
import { DndContext } from '@dnd-kit/core'; // ⭐️ Import DndContext!
import LeftColumn from './LeftColumn';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';
import DroppableColumn from './DroppableColumn'; // ⭐️ Import DroppableColumn
import { saveLayout } from '../storage'; // ⭐️ Import saveLayout

const GameContainer = () => {
  // ⭐️ Get the ID of the first town
  const firstTownId = towns[0]?.id;
  const [selectedTownId, setSelectedTownId] = useState(firstTownId || null); // ⭐️ Initialize with first town
  const [selectedNpcId, setSelectedNpcId] = useState(null);
  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [isExploring, setIsExploring] = useState(false);
  const dispatch = useContext(GameDispatchContext);
  const { affinities } = useContext(GameStateContext);
  const [columnLayout, setColumnLayout] = useState(() => {
    const savedLayout = localStorage.getItem('incremental_rpg_layout');
    return savedLayout ? JSON.parse(savedLayout) : {
      left: ['PlayerStats'],
      middle: ['Battle'],
      right: ['PlayerTraits']
    };
  });

  // Save layout when it changes
  useEffect(() => {
    saveLayout(columnLayout);
  }, [columnLayout]);

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedComponent = active.id;
    const newColumn = over.id;

    setColumnLayout((prev) => {
      const updatedColumns = { ...prev };

      // Remove from previous column
      Object.keys(updatedColumns).forEach((key) => {
        updatedColumns[key] = updatedColumns[key].filter((comp) => comp !== draggedComponent);
      });

      // Add to new column
      updatedColumns[newColumn].push(draggedComponent);

      return updatedColumns;
    });
  };

  const renderMainContent = () => {
    return <MiddleColumn />;
  };

  return (
    <DndContext onDragEnd={handleDragEnd}> {/* ⭐️ Opening DndContext - OUTSIDE */}
      <Box className="game-container"> {/* ⭐️ Opening Box - INSIDE DndContext */}
        <Box id="header"><Header /></Box>
        <DroppableColumn id="left" components={columnLayout.left} />
        <DroppableColumn id="middle" components={columnLayout.middle} />
        <DroppableColumn id="right" components={columnLayout.right} />
        <Box id="world-map-area">
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
          <LeftColumn />
          <MiddleColumn />
          <RightColumn />
        </Box>
      </Box>
    </DndContext>
  );
};

export default GameContainer;