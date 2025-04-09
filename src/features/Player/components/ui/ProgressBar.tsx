import React from 'react';
import './ProgressBar.css';

/**
 * Props for the ProgressBar component
 */
interface ProgressBarProps {
    /** Progress percentage (0-100) */
    progress: number;
    /** Optional text label to display */
    label?: string;
    /** Optional color for the progress bar */
    color?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * @component ProgressBar
 * @description Displays a visual progress bar with customizable appearance
 * 
 * @returns {JSX.Element} Rendered progress bar
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ 
    progress, 
    label, 
    color = '#4CAF50', 
    className = '' 
}) => {
    // Ensure progress is within valid range
    const validProgress: number = Math.min(100, Math.max(0, progress));
    
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
