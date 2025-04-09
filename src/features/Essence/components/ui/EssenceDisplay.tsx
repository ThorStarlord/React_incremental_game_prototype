import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectEssenceAmount
} from '../../state/EssenceSlice';
import { RootState } from '../../../../app/store';

// Define interface for the component props - now making all props optional
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
  essenceRate?: number;
}

/**
 * EssenceDisplay Component
 * 
 * Displays the player's essence amounts and types.
 * Component gets data from Redux store but allows prop overrides.
 * 
 * @returns {JSX.Element} - Rendered component
 */
const EssenceDisplay: React.FC<EssenceDisplayProps> = ({
  currentEssence: providedEssence,
  maxEssence: providedMaxEssence = 1000,
  essenceTypes = [],
  onEssenceClick,
  essenceRate: providedEssenceRate
}) => {
  // Get essence data from Redux store
  const storeEssence = useSelector(selectEssenceAmount);
  const generationRate = useSelector((state: RootState) => 
    state.essence.generationRate || 1
  );
  
  // Use provided values or fall back to store values
  const currentEssence = providedEssence !== undefined ? providedEssence : storeEssence;
  const maxEssence = providedMaxEssence;
  const essenceRate = providedEssenceRate !== undefined ? providedEssenceRate : generationRate;
  
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
