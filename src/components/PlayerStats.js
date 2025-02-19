import React, { useContext, useState } from 'react';
import { Box, Typography, CardHeader, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import DraggableStatPoint from './DraggableStatPoint';
import DroppableStat from './DroppableStat';
import './PlayerStats.css';

const PlayerStats = () => {
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [expanded, setExpanded] = useState(true);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const statId = over.id;
    let upgradeSuccessful = false;

    switch(statId) {
      case 'attack':
        if (player.statPoints > 0) {
          dispatch({
            type: 'UPDATE_PLAYER',
            payload: {
              ...player,
              attack: player.attack + 1,
              statPoints: player.statPoints - 1
            }
          });
          upgradeSuccessful = true;
        }
        break;
      case 'defense':
        if (player.statPoints > 0) {
          dispatch({
            type: 'UPDATE_PLAYER',
            payload: {
              ...player,
              defense: player.defense + 1,
              statPoints: player.statPoints - 1
            }
          });
          upgradeSuccessful = true;
        }
        break;
      case 'hp':
        if (player.statPoints > 0) {
          dispatch({
            type: 'UPDATE_PLAYER',
            payload: {
              ...player,
              hp: player.hp + 5,
              statPoints: player.statPoints - 1
            }
          });
          upgradeSuccessful = true;
        }
        break;
      default:
        break;
    }
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'player-stats-window',
    data: { type: 'window', windowType: 'player-stats' }
  });

  const draggableStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <ResizableBox
      width={width}
      height={height}
      minConstraints={[200, 150]}
      maxConstraints={[600, 400]}
      onResize={(e, data) => {
        setWidth(data.size.width);
        setHeight(data.size.height);
      }}
    >
      <Card sx={{ width: '100%', height: '100%' }}>
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              backgroundColor: 'lightblue',
              color: 'white'
            }}
          >
            <Typography variant="h6">Player Stats</Typography>
          </AccordionSummary>
          <AccordionDetails
            ref={setNodeRef}
            style={draggableStyle}
            {...listeners}
            {...attributes}
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.paper',
              boxShadow: 1,
              width: '100%'
            }}
          >
            <Typography variant="body2" sx={{ mb: 2 }}>
              Name: {player.name}
            </Typography>
            
            <DndContext onDragEnd={handleDragEnd}>
              <Box sx={{ mb: 2 }}>
                <DraggableStatPoint statPoints={player.statPoints} />
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                <DroppableStat
                  id="hp"
                  name="HP"
                  value={player.hp}
                  isActive={player.statPoints > 0}
                />
                <DroppableStat
                  id="attack"
                  name="Attack"
                  value={player.attack}
                  isActive={player.statPoints > 0}
                />
                <DroppableStat
                  id="defense"
                  name="Defense"
                  value={player.defense}
                  isActive={player.statPoints > 0}
                />
              </Box>

              <DragOverlay>
                {active => {
                  if (active?.id === 'stat-points') {
                    return (
                      <div className="stat-points dragging">
                        <span>+1</span>
                      </div>
                    );
                  }
                  return null;
                }}
              </DragOverlay>
            </DndContext>

            <div className="other-stats">
              <p>Essence: {player.essence}</p>
              <p>Gold: {player.gold}</p>
            </div>
          </AccordionDetails>
        </Accordion>
      </Card>
    </ResizableBox>
  );
};

export default PlayerStats;