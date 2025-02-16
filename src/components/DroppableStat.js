import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import './DroppableStat.css';

export const DroppableStat = ({ id, name, value, isActive }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      type: 'stat',
      name: name
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`droppable-stat ${isOver ? 'over' : ''} ${isActive ? 'active' : ''}`}
    >
      <div className="stat-info">
        <span className="stat-name">{name}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="drop-zone-indicator">
        Drop to upgrade {name}
      </div>
    </div>
  );
};

export default DroppableStat;