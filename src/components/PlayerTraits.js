import React, { useContext } from 'react';
import { GameStateContext } from '../context/GameStateContext';
import './PlayerTraits.css';

const PlayerTraits = () => {
  const { player, traits } = useContext(GameStateContext);

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
    <div className="player-traits">
      <h3>Acquired Traits</h3>
      <div className="traits-list">
        {renderAcquiredTraits()}
      </div>
    </div>
  );
};

export default PlayerTraits;