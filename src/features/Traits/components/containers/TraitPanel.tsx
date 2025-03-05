import React from 'react';

/**
 * Interface representing a character trait
 * @interface Trait
 * @property {string} id - Unique identifier for the trait
 * @property {string} name - Display name of the trait
 * @property {number} level - Current level of the trait
 * @property {string} description - Detailed description of what the trait does
 * @property {string} effect - Description of the trait's effect at current level
 * @property {number} cost - Cost in trait points to level up this trait
 */
interface Trait {
  id: string;
  name: string;
  level: number;
  description: string;
  effect: string;
  cost: number;
}

/**
 * Interface representing the props for the TraitPanel component
 * @interface TraitPanelProps
 * @property {Trait} trait - The trait object to display
 * @property {Function} onLevelUp - Callback function triggered when the trait is leveled up
 * @property {boolean} canLevelUp - Whether the trait can currently be leveled up
 */
interface TraitPanelProps {
  trait: Trait;
  onLevelUp: () => void;
  canLevelUp: boolean;
}

/**
 * TraitPanel Component
 * 
 * Displays detailed information about a character trait and provides
 * a button to level up the trait if sufficient points are available.
 * 
 * @param {TraitPanelProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const TraitPanel: React.FC<TraitPanelProps> = ({ trait, onLevelUp, canLevelUp }) => {
  const { name, level, description, effect, cost } = trait;

  /**
   * Handles the click event on the level up button
   * If the trait can be leveled up, calls the onLevelUp callback
   */
  const handleLevelUp = (): void => {
    if (canLevelUp) {
      onLevelUp();
    }
  };

  return (
    <div className="trait-panel">
      <div className="trait-header">
        <h3>{name}</h3>
        <div className="trait-level">Level: {level}</div>
      </div>
      <div className="trait-description">{description}</div>
      <div className="trait-effect">
        <strong>Current Effect:</strong> {effect}
      </div>
      <div className="trait-footer">
        <div className="trait-cost">Cost: {cost} points</div>
        <button 
          className="level-up-button" 
          onClick={handleLevelUp} 
          disabled={!canLevelUp}
        >
          Level Up
        </button>
      </div>
    </div>
  );
};

export default TraitPanel;
