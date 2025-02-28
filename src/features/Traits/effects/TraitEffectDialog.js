import React from 'react';
import PropTypes from 'prop-types';
import './TraitEffectDialog.css';

const TraitEffectDialog = ({ isOpen, onClose, effect }) => {
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

TraitEffectDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    effect: PropTypes.shape({
        description: PropTypes.string.isRequired,
    }).isRequired,
};

export default TraitEffectDialog;