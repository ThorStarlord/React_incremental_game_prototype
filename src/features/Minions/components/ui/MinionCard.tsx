import React from 'react';
import './MinionCard.css'; // Assuming you have a CSS file for styling

/**
 * Interface representing a minion's basic properties
 */
interface Minion {
  /** Unique identifier for the minion */
  id: string | number;
  /** Display name of the minion */
  name: string;
  /** Description of the minion */
  description: string;
  /** Current health points of the minion */
  health: number;
  /** Attack power of the minion */
  attack: number;
  /** Defense rating of the minion */
  defense: number;
  /** Additional properties of the minion */
  [key: string]: any;
}

/**
 * Interface for MinionCard component props
 */
interface MinionCardProps {
  /** Minion object to display */
  minion: Minion;
  /** Callback function when minion is selected */
  onSelect: (minion: Minion) => void;
}

/**
 * Component that displays a card representing a minion with its stats
 * 
 * @param minion - The minion object containing stats and information
 * @param onSelect - Function to call when the minion card is clicked
 * @returns A card component displaying minion information
 */
const MinionCard: React.FC<MinionCardProps> = ({ minion, onSelect }) => {
    return (
        <div className="minion-card" onClick={() => onSelect(minion)}>
            <h3 className="minion-name">{minion.name}</h3>
            <p className="minion-description">{minion.description}</p>
            <div className="minion-stats">
                <span>Health: {minion.health}</span>
                <span>Attack: {minion.attack}</span>
                <span>Defense: {minion.defense}</span>
            </div>
        </div>
    );
};

export default MinionCard;
