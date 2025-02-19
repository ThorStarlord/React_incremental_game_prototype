// src/components/GameContainer.js

import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import { GameDispatchContext, GameStateContext } from '../context/GameStateContext';
import { calculateEssenceGeneration } from '../utils/soulResonanceUtils';
import { UPDATE_INTERVALS } from '../config/gameConstants';
import Header from './Header';
import { towns } from '../modules/data/towns';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import LeftColumn from './LeftColumn';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';
import { saveLayout } from '../storage';

const GameContainer = () => {
  const firstTownId = towns[0]?.id;
  const [selectedTownId, setSelectedTownId] = useState(firstTownId || null);
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedComponent = active.id;
    const newColumn = over.data?.current?.sortable?.containerId || over.id;

    setColumnLayout((prev) => {
      const updatedColumns = { ...prev };
      const sourceColumn = Object.keys(prev).find(key => 
        prev[key].includes(draggedComponent)
      );
      
      if (sourceColumn === newColumn) {
        // If in same column, handle reordering
        const oldIndex = prev[sourceColumn].indexOf(draggedComponent);
        const newIndex = prev[sourceColumn].indexOf(over.id);
        updatedColumns[sourceColumn] = arrayMove(
          prev[sourceColumn],
          oldIndex,
          newIndex
        );
      } else {
        // Move between columns
        Object.keys(updatedColumns).forEach((key) => {
          updatedColumns[key] = updatedColumns[key].filter(
            (comp) => comp !== draggedComponent
          );
        });
        updatedColumns[newColumn].push(draggedComponent);
      }

      return updatedColumns;
    });
  };

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          overflowX: 'hidden' // Prevent horizontal scroll
        }}
      >
        <Box sx={{ flex: '0 0 auto' }}>
          <Header />
        </Box>
        <Box 
          sx={{
            display: 'flex',
            flex: 1,
            gap: 2,
            p: 2,
            alignItems: 'stretch'
          }}
        >
          <Box sx={{ width: 200 }}>
            <LeftColumn components={columnLayout.left} />
          </Box>
          <Box sx={{ flex: 1, maxWidth: 900, mx: 'auto' }}>
            <MiddleColumn 
              components={columnLayout.middle}
              selectedTownId={selectedTownId}
              selectedNpcId={selectedNpcId}
              selectedDungeon={selectedDungeon}
              isExploring={isExploring}
              onTownSelect={setSelectedTownId}
              onBackToWorldMap={() => setSelectedTownId(null)}
            />
          </Box>
          <Box sx={{ width: 200 }}>
            <RightColumn components={columnLayout.right} />
          </Box>
        </Box>
      </Box>
    </DndContext>
  );
};

export default GameContainer;