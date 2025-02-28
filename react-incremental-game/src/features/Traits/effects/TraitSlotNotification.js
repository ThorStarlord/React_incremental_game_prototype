import React from 'react';
import PropTypes from 'prop-types';
import './TraitSlotNotification.css';

const TraitSlotNotification = ({ message, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="trait-slot-notification">
            {message}
        </div>
    );
};

TraitSlotNotification.propTypes = {
    message: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
};

export default TraitSlotNotification;