import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlayerStats from './PlayerStats';
import Battle from './Battle';
import PlayerTraits from './PlayerTraits';
import './DraggableComponent.css';

const componentMap = {
  PlayerStats: <PlayerStats />,
  Battle: <Battle />,
  PlayerTraits: <PlayerTraits />,
};

const DraggableComponent = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default DraggableComponent;
