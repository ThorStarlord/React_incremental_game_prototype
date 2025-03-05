import React from 'react';
import TraitPanel from './TraitPanel';

/**
 * Interface representing the props for the TraitList component
 * @interface TraitListProps
 * @property {Array<Object>} traits - The array of trait objects to display
 * @property {Function} onTraitLevelUp - Callback function triggered when a trait is leveled up
 * @property {number} pointsAvailable - Number of trait points available to spend
 */
interface TraitListProps {
  traits: Array<{
    id: string;
    name: string;
    level: number;
    description: string;
    effect: string;
    cost: number;
  }>;
  onTraitLevelUp: (traitId: string) => void;
  pointsAvailable: number;
}

/**
 * TraitList Component
 * 
 * Displays a list of character traits that can be leveled up.
 * Each trait is rendered as a TraitPanel component.
 * 
 * @param {TraitListProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const TraitList: React.FC<TraitListProps> = ({ traits, onTraitLevelUp, pointsAvailable }) => {
  return (
    <div className="traits-container">
      <h2>Character Traits</h2>
      <div className="trait-points">
        <span>Available Points: {pointsAvailable}</span>
      </div>
      <div className="traits-list">
        {traits.map((trait) => (
          <TraitPanel
            key={trait.id}
            trait={trait}
            onLevelUp={() => onTraitLevelUp(trait.id)}
            canLevelUp={pointsAvailable >= trait.cost}
          />
        ))}
      </div>
    </div>
  );
};

export default TraitList;
