import React from 'react';
import PropTypes from 'prop-types';
import './TraitSlotProgressIndicator.css';

const TraitSlotProgressIndicator = ({ progress, total }) => {
    const percentage = (progress / total) * 100;

    return (
        <div className="trait-slot-progress-indicator">
            <div className="progress-bar" style={{ width: `${percentage}%` }} />
            <span className="progress-text">{`${progress} / ${total}`}</span>
        </div>
    );
};

TraitSlotProgressIndicator.propTypes = {
    progress: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

export default TraitSlotProgressIndicator;