import React, { useContext } from 'react';
import { useDraggable } from '@dnd-kit/core'; // ⭐️ Import useDraggable
import { GameStateContext } from '../context/GameStateContext';
import './PlayerTraits.css';

const PlayerTraits = () => {
  const { player, traits } = useContext(GameStateContext);

  // ⭐️ Draggable setup for PlayerTraits itself
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'player-traits-window', // Unique ID for this draggable
    data: { type: 'window', windowType: 'player-traits' } // Data to identify this window
  });

  const draggableStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const renderAcquiredTraits = () => {
    if (!player.acquiredTraits.length) {
      return <p className="no-traits">No traits acquired yet</p>;
    }

    return player.acquiredTraits.map(traitId => {
      const trait = traits.copyableTraits[traitId];
      return (
        <div key={traitId} className="trait-item">
          <h4>{trait.name}</h4>
          <p className="trait-description">{trait.description}</p>
          <span className="trait-type">{trait.type}</span>
        </div>
      );
    });
  };

  return (
    <div
      ref={setNodeRef} // ⭐️ Attach ref to the main div
      style={draggableStyle} // ⭐️ Apply draggable style
      {...listeners} // ⭐️ Attach listeners for drag events
      {...attributes} // ⭐️ Attach accessibility attributes
      className="player-traits"
    >
      <h3>Acquired Traits</h3>
      <div className="traits-list">
        {renderAcquiredTraits()}
      </div>
    </div>
  );
};

export default PlayerTraits;