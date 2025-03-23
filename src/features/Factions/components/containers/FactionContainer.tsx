import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useGameState } from '../../../../context/GameStateExports';
import { Faction as SystemFaction } from '../../../../context/types/gameStates/FactionGameStateTypes';
import './FactionContainer.css';

/**
 * Props for the FactionContainer component
 */
interface FactionContainerProps {
  factionId: string;
  position?: { x: number; y: number };
  onSelect?: (factionId: string) => void;
  isSelected?: boolean;
}

/**
 * Interface for Faction data with the properties we need
 */
interface Faction {
  id: string;
  name: string;
  description: string;
  relationship: number;
  reputationTiers?: {
    threshold: number;
    name: string;
    benefits?: string[];
  }[];
  // Other faction properties
  [key: string]: any;
}

/**
 * FactionContainer component displays faction information in a draggable container
 */
const FactionContainer: React.FC<FactionContainerProps> = ({
  factionId,
  position = { x: 0, y: 0 },
  onSelect,
  isSelected = false,
}) => {
  // Use useGameState hook instead of useContext
  const gameState = useGameState();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get faction data from state - fix accessing factions from the system
  const systemFaction = gameState.factions?.factions?.[factionId] as SystemFaction | undefined;
  
  // Convert the system faction to our component's faction type - fix property duplication
  const faction: Faction | undefined = systemFaction ? {
    ...systemFaction, // Spread first to get all properties
    relationship: 0, // Default value since relationship doesn't exist in SystemFaction 
    // Add any missing required fields
  } : undefined;

  // Set up draggable functionality
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `faction-${factionId}`,
    data: {
      type: 'faction',
      id: factionId,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x + position.x}px, ${transform.y + position.y}px, 0)`,
  } : {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  };

  // If faction not found, return null
  if (!faction) return null;

  // Calculate current reputation tier
  const currentTier = faction.reputationTiers
    ? [...faction.reputationTiers]
        .sort((a, b) => b.threshold - a.threshold)
        .find(tier => faction.relationship >= tier.threshold) || null
    : null;

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (onSelect) {
      onSelect(factionId);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`faction-container ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className="faction-header">
        <h3>{faction.name}</h3>
        <div className="faction-relationship">
          <div className="relationship-bar">
            <div
              className="relationship-value"
              style={{ width: `${Math.max(0, Math.min(100, (faction.relationship + 100) / 2))}%` }}
            />
          </div>
          <p>Status: {currentTier?.name || 'Unknown'}</p>
        </div>
        {/* Add proper null checking */}
        {currentTier?.benefits && currentTier.benefits.length > 0 && (
          <div className="faction-benefits">
            <h4>Current Benefits:</h4>
            <ul>
              {currentTier?.benefits?.map((benefit: string, index: number) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="faction-details">
          <p>{faction.description}</p>
          {/* Additional faction details... */}
        </div>
      )}
    </div>
  );
};

export default FactionContainer;
