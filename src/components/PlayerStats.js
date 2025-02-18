import React, { useContext } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core'; // ⭐️ Import useDraggable
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import DraggableStatPoint from './DraggableStatPoint';
import DroppableStat from './DroppableStat';
import './PlayerStats.css';

const PlayerStats = () => {
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

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

  // ⭐️ Draggable setup for PlayerStats itself
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'player-stats-window', // Unique ID for this draggable
    data: { type: 'window', windowType: 'player-stats' } // Data to identify this window
  });

  const draggableStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef} // ⭐️ Attach ref to the main div
      style={draggableStyle} // ⭐️ Apply draggable style
      {...listeners} // ⭐️ Attach listeners for drag events
      {...attributes} // ⭐️ Attach accessibility attributes
      className="player-stats"
    >
      <h2>Player Stats</h2>
      <p>Name: {player.name}</p>
      
      <DndContext onDragEnd={handleDragEnd}>
        <DraggableStatPoint statPoints={player.statPoints} />
        
        <div className="stats-container">
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
        </div>

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
    </div>
  );
};

export default PlayerStats;