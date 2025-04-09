import React from 'react';
import './TraitEffectDialog.css';

/**
 * Interface for effect object properties
 */
interface EffectDetails {
    /** Description of what the effect does */
    description: string;
}

/**
 * Props for the TraitEffectDialog component
 */
interface TraitEffectDialogProps {
    /** Whether the dialog is currently visible */
    isOpen: boolean;
    /** Function to call when the dialog is closed */
    onClose: () => void;
    /** The effect details to display */
    effect: EffectDetails;
}

/**
 * A dialog component that displays information about a trait effect
 * 
 * @param props Component props
 * @returns React component or null when not visible
 */
const TraitEffectDialog: React.FC<TraitEffectDialogProps> = ({ isOpen, onClose, effect }) => {
    if (!isOpen) return null;

    return (
        <div className="trait-effect-dialog">
            <div className="dialog-content">
                <h2>Trait Effect</h2>
                <p>{effect.description}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default TraitEffectDialog;
