// src/components/GameContainer.js

import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import { GameDispatchContext, GameStateContext } from '../context/GameStateContext';
import { calculateEssenceGeneration } from '../utils/soulResonanceUtils';
import { UPDATE_INTERVALS } from '../config/gameConstants';
import Header from './Header';
import { towns } from '../modules/data/towns';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import LeftColumn from './LeftColumn';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';
import { saveLayout } from '../storage';
import './GameContainer.css';

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
      <Box className="game-container">
        <Box id="header"><Header /></Box>
        <Box id="bottom-windows">
          <LeftColumn components={columnLayout.left} />
          <MiddleColumn 
            components={columnLayout.middle}
            selectedTownId={selectedTownId}
            selectedNpcId={selectedNpcId}
            selectedDungeon={selectedDungeon}
            isExploring={isExploring}
            onTownSelect={setSelectedTownId}
            onBackToWorldMap={() => setSelectedTownId(null)}
          />
          <RightColumn components={columnLayout.right} />
        </Box>
      </Box>
    </DndContext>
  );
};

export default GameContainer;