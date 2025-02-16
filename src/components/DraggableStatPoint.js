import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './DraggableStatPoint.css';

export const DraggableStatPoint = ({ statPoints }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'stat-points',
    data: {
      type: 'stat-point',
      value: 1
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  if (statPoints <= 0) {
    return <div className="stat-points empty">No Stat Points</div>;
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`stat-points ${isDragging ? 'dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <span className="stat-points-label">Stat Points:</span>
      <span className="stat-points-value">{statPoints}</span>
      <div className="drag-handle">⋮</div>
    </div>
  );
};

export default DraggableStatPoint;