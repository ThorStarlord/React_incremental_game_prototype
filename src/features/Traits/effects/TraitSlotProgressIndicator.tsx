import React from 'react';
import './TraitSlotProgressIndicator.css';

/**
 * Props for the TraitSlotProgressIndicator component
 */
interface TraitSlotProgressIndicatorProps {
    /** Current progress value */
    progress: number;
    /** Total/maximum value for progress calculation */
    total: number;
}

/**
 * Displays a progress bar indicating progress toward unlocking a new trait slot
 * 
 * @param props Component props
 * @returns React component
 */
const TraitSlotProgressIndicator: React.FC<TraitSlotProgressIndicatorProps> = ({ progress, total }) => {
    const percentage = (progress / total) * 100;

    return (
        <div className="trait-slot-progress-indicator">
            <div className="progress-bar" style={{ width: `${percentage}%` }} />
            <span className="progress-text">{`${progress} / ${total}`}</span>
        </div>
    );
};

export default TraitSlotProgressIndicator;
