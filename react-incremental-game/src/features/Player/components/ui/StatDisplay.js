import React from 'react';
import PropTypes from 'prop-types';
import './StatDisplay.css';

const StatDisplay = ({ statName, statValue }) => {
    return (
        <div className="stat-display">
            <span className="stat-name">{statName}:</span>
            <span className="stat-value">{statValue}</span>
        </div>
    );
};

StatDisplay.propTypes = {
    statName: PropTypes.string.isRequired,
    statValue: PropTypes.number.isRequired,
};

export default StatDisplay;