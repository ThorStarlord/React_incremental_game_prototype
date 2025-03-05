import React from 'react';
import './StatDisplay.css';

/**
 * Props for the StatDisplay component
 */
interface StatDisplayProps {
    /** The name of the statistic to display */
    statName: string;
    /** The value of the statistic */
    statValue: number;
    /** Maximum possible value (for percentage or progress display) */
    maxValue?: number;
    /** Format option: 'number' (default), 'percent', 'decimal-1', 'decimal-2' */
    format?: 'number' | 'percent' | 'decimal-1' | 'decimal-2';
    /** Optional icon class name (supports Font Awesome if included in project) */
    icon?: string | null;
    /** Whether to display a progress bar visualization */
    showBar?: boolean;
    /** Color theme: 'default', 'primary', 'success', 'warning', 'danger' */
    theme?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    /** Size variant: 'small', 'medium' (default), 'large' */
    size?: 'small' | 'medium' | 'large';
}

/**
 * @component StatDisplay
 * @description A reusable component for displaying character or game statistics with various formatting options
 * 
 * @example
 * // Basic usage
 * <StatDisplay statName="Strength" statValue={10} />
 * 
 * @example
 * // With progress bar and percentage
 * <StatDisplay statName="Health" statValue={75} maxValue={100} format="percent" showBar={true} theme="danger" />
 * 
 * @example
 * // With icon and decimal formatting
 * <StatDisplay statName="Critical" statValue={0.257} format="decimal-2" icon="fa-bolt" theme="warning" />
 * 
 * @returns {React.ReactElement} The rendered stat display component
 */
const StatDisplay: React.FC<StatDisplayProps> = ({ 
    statName, 
    statValue,
    maxValue = 100,
    format = 'number',
    icon = null,
    showBar = false,
    theme = 'default',
    size = 'medium'
}) => {
    // Format the stat value based on the format option
    const formatValue = (): string | number => {
        switch(format) {
            case 'percent':
                return `${Math.round((statValue / maxValue) * 100)}%`;
            case 'decimal-1':
                return statValue.toFixed(1);
            case 'decimal-2':
                return statValue.toFixed(2);
            default:
                return statValue;
        }
    };

    // Calculate progress bar width as a percentage
    const barWidth: number = showBar ? Math.min(Math.max((statValue / maxValue) * 100, 0), 100) : 0;
    
    return (
        <div className={`stat-display size-${size} theme-${theme}`}>
            <div className="stat-header">
                {icon && <i className={`stat-icon ${icon}`} aria-hidden="true"></i>}
                <span className="stat-name">{statName}:</span>
                <span className="stat-value">{formatValue()}</span>
            </div>
            
            {showBar && (
                <div className="stat-progress">
                    <div 
                        className="stat-progress-bar" 
                        style={{ width: `${barWidth}%` }}
                        role="progressbar"
                        aria-valuenow={statValue}
                        aria-valuemin={0}
                        aria-valuemax={maxValue}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default StatDisplay;
