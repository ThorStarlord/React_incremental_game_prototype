import React from 'react';

// Define interface for the component props
interface EssenceDisplayProps {
  currentEssence?: number;
  maxEssence?: number;
  essenceTypes?: Array<{
    id: string;
    name: string;
    amount: number;
    color?: string;
  }>;
  onEssenceClick?: (essenceId: string) => void;
  essenceRate?: number; // Add essenceRate property
}

/**
 * EssenceDisplay Component
 * 
 * Displays the player's essence amounts and types.
 * 
 * @param {number} currentEssence - The current amount of essence the player has
 * @param {number} maxEssence - The maximum amount of essence the player can have
 * @param {Array} essenceTypes - Array of different essence types with their amounts
 * @param {Function} onEssenceClick - Handler for when an essence type is clicked
 * @param {number} essenceRate - Rate at which essence is generated
 * @returns {JSX.Element} - Rendered component
 */
const EssenceDisplay: React.FC<EssenceDisplayProps> = ({
  currentEssence = 0,
  maxEssence = 100,
  essenceTypes = [],
  onEssenceClick,
  essenceRate
}) => {
  return (
    <div className="essence-display">
      <h3>Essence</h3>
      
      {/* Overall essence bar */}
      <div className="essence-bar">
        <div 
          className="essence-fill" 
          style={{ 
            width: `${Math.min(100, (currentEssence / maxEssence) * 100)}%`,
            backgroundColor: '#3a7ca5'
          }}
        />
        <span className="essence-text">{currentEssence}/{maxEssence}</span>
      </div>
      
      {/* Show essence generation rate if provided */}
      {essenceRate !== undefined && (
        <div className="essence-rate">
          <span>+{essenceRate}/min</span>
        </div>
      )}
      
      {/* Essence types listing */}
      <div className="essence-types">
        {essenceTypes.map(essence => (
          <div 
            key={essence.id}
            className="essence-type"
            onClick={() => onEssenceClick && onEssenceClick(essence.id)}
            style={{ borderColor: essence.color || 'white' }}
          >
            <span className="essence-name">{essence.name}</span>
            <span className="essence-amount">{essence.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EssenceDisplay;
