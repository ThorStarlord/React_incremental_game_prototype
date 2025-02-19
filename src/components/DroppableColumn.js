import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import DraggableComponent from './DraggableComponent';
import './DroppableColumn.css';

const DroppableColumn = ({ id, components }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`column ${isOver ? 'highlight' : ''}`} id={id}>
      {components.map((comp) => (
        <DraggableComponent key={comp} id={comp} />
      ))}
    </div>
  );
};

export default DroppableColumn;
