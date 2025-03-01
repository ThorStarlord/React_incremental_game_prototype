import React from 'react';
import PropTypes from 'prop-types';
import './StatDisplay.css';

/**
 * @component StatDisplay
 * @description A reusable component for displaying character or game statistics with various formatting options
 * 
 * @param {Object} props - Component props
 * @param {string} props.statName - The name of the statistic to display
 * @param {number} props.statValue - The value of the statistic
 * @param {number} [props.maxValue] - Maximum possible value (for percentage or progress display)
 * @param {string} [props.format] - Format option: 'number' (default), 'percent', 'decimal-1', 'decimal-2'
 * @param {string} [props.icon] - Optional icon class name (supports Font Awesome if included in project)
 * @param {boolean} [props.showBar] - Whether to display a progress bar visualization
 * @param {string} [props.theme] - Color theme: 'default', 'primary', 'success', 'warning', 'danger'
 * @param {string} [props.size] - Size variant: 'small', 'medium' (default), 'large'
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
const StatDisplay = ({ 
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
    const formatValue = () => {
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
    const barWidth = showBar ? Math.min(Math.max((statValue / maxValue) * 100, 0), 100) : 0;
    
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
                        aria-valuemin="0"
                        aria-valuemax={maxValue}
                    ></div>
                </div>
            )}
        </div>
    );
};

StatDisplay.propTypes = {
    statName: PropTypes.string.isRequired,
    statValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number,
    format: PropTypes.oneOf(['number', 'percent', 'decimal-1', 'decimal-2']),
    icon: PropTypes.string,
    showBar: PropTypes.bool,
    theme: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger']),
    size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default StatDisplay;