import React from 'react';
import './ProgressBar.css';

/**
 * @component ProgressBar
 * @description Displays a visual progress bar with customizable appearance
 * 
 * @param {Object} props - Component props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {string} [props.label] - Optional text label to display
 * @param {string} [props.color] - Optional color for the progress bar
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @returns {JSX.Element} Rendered progress bar
 */
const ProgressBar = ({ progress, label, color = '#4CAF50', className = '' }) => {
    // Ensure progress is within valid range
    const validProgress = Math.min(100, Math.max(0, progress));
    
    return (
        <div className={`progress-bar-container ${className}`}>
            <div 
                className="progress-bar-fill" 
                style={{ 
                    width: `${validProgress}%`,
                    backgroundColor: color
                }}
            />
            {label && <span className="progress-bar-label">{label}</span>}
        </div>
    );
};

export default ProgressBar;
