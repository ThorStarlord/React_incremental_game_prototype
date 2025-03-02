import React, { useContext, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GameStateContext } from '../../../../context/GameStateContext';
import './FactionContainer.css';

const FactionContainer = () => {
  const { gameState } = useContext(GameStateContext);
  const [selectedFaction, setSelectedFaction] = useState(null);
  
  // Get factions from the updated structure
  const factionsData = gameState?.factions?.factions || {};
  const factionsList = Object.values(factionsData).filter(faction => faction.unlocked);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'faction-window',
    data: { type: 'window', windowType: 'faction' }
  });

  const draggableStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // Get the current reputation tier for a faction
  const getCurrentTier = (faction) => {
    if (!faction.reputationTiers) return null;
    
    for (let i = faction.reputationTiers.length - 1; i >= 0; i--) {
      if (faction.reputation >= faction.reputationTiers[i].threshold) {
        return faction.reputationTiers[i];
      }
    }
    return faction.reputationTiers[0];
  };

  const renderFactionDetails = (faction) => {
    const currentTier = getCurrentTier(faction);
    
    return (
      <div className="faction-details">
        <h3>{faction.name}</h3>
        <p className="faction-description">{faction.description}</p>
        <div className="reputation-info">
          <p>Reputation: {faction.reputation}</p>
          <p>Status: {currentTier?.name || 'Unknown'}</p>
        </div>
        {currentTier?.benefits?.length > 0 && (
          <div className="faction-benefits">
            <h4>Current Benefits:</h4>
            <ul>
              {currentTier.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        {faction.specialCurrency && (
          <p>{faction.specialCurrency}: {faction.specialCurrencyAmount}</p>
        )}
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={draggableStyle}
      {...listeners}
      {...attributes}
      className="faction-container"
    >
      <div className="faction-header">
        <h2>Factions</h2>
        <span className="close-button">✕</span>
      </div>
      
      <div className="factions-content">
        <div className="factions-list">
          {factionsList.length > 0 ? (
            factionsList.map(faction => (
              <div 
                key={faction.id} 
                className={`faction-item ${selectedFaction === faction.id ? 'selected' : ''}`}
                onClick={() => setSelectedFaction(faction.id)}
              >
                <h4>{faction.name}</h4>
                <div className="reputation-bar">
                  <div 
                    className="reputation-fill" 
                    style={{width: `${Math.max(0, faction.reputation)}%`}}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="no-factions">No factions discovered yet.</p>
          )}
        </div>
        
        <div className="faction-detail-panel">
          {selectedFaction && renderFactionDetails(factionsData[selectedFaction])}
          {!selectedFaction && <p className="faction-hint">Select a faction to view details</p>}
        </div>
      </div>
    </div>
  );
};

export default FactionContainer;