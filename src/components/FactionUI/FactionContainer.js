import React, { useContext } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GameStateContext } from '../../context/GameStateContext';
import './FactionContainer.css';

const FactionContainer = () => {
  const { factions } = useContext(GameStateContext);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'faction-window',
    data: { type: 'window', windowType: 'faction' }
  });

  const draggableStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={draggableStyle}
      {...listeners}
      {...attributes}
      className="faction-container"
    >
      <h2>Faction Information</h2>
      {factions.map(faction => (
        <div key={faction.id} className="faction">
          <h3>{faction.name}</h3>
          <p>{faction.description}</p>
          <p>Members: {faction.memberCount}</p>
        </div>
      ))}
    </div>
  );
};

export default FactionContainer;