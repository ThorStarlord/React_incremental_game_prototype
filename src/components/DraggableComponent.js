import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import PlayerStats from './PlayerStats';
import Battle from './Battle';
import PlayerTraits from './PlayerTraits';
import './DraggableComponent.css';

const componentMap = {
  PlayerStats: <PlayerStats />,
  Battle: <Battle />,
  PlayerTraits: <PlayerTraits />,
};

const DraggableComponent = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div 
      ref={setNodeRef} 
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}
      {...listeners}
      {...attributes}
      className="draggable-item"
    >
      {componentMap[id]}
    </div>
  );
};

export default DraggableComponent;
