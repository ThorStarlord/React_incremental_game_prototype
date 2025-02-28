import React from 'react';
import PropTypes from 'prop-types';
import './TraitEffectNotification.css';

const TraitEffectNotification = ({ message, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="trait-effect-notification">
            {message}
        </div>
    );
};

TraitEffectNotification.propTypes = {
    message: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
};

export default TraitEffectNotification;