import React from 'react';
import './TraitButton.css'; // Assuming you have a CSS file for styling

/**
 * Interface for Trait object
 * 
 * @interface Trait
 * @property {string} name - Display name of the trait
 * @property {string} [id] - Optional unique identifier
 * @property {string} [description] - Optional description of the trait
 * @property {any} [key: string] - Any additional trait properties
 */
interface Trait {
  name: string;
  id?: string;
  description?: string;
  [key: string]: any;
}

/**
 * Props for the TraitButton component
 * 
 * @interface TraitButtonProps
 * @property {Trait} trait - The trait object to display as a button
 * @property {(trait: Trait) => void} onClick - Callback function when button is clicked
 * @property {boolean} [isActive=false] - Whether the trait button is in active state
 */
interface TraitButtonProps {
  trait: Trait;
  onClick: (trait: Trait) => void;
  isActive?: boolean;
}

/**
 * TraitButton Component
 * 
 * A button component for displaying and interacting with trait objects.
 * Supports active state styling and click handling.
 * 
 * @param {TraitButtonProps} props - The component props
 * @returns {JSX.Element} Rendered button component
 */
const TraitButton: React.FC<TraitButtonProps> = ({ 
  trait, 
  onClick, 
  isActive = false 
}) => {
  return (
    <button 
      className={`trait-button ${isActive ? 'active' : ''}`} 
      onClick={() => onClick(trait)}
    >
      {trait.name}
    </button>
  );
};

export default TraitButton;
