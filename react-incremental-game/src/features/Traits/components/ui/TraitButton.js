import React from 'react';
import PropTypes from 'prop-types';
import './TraitButton.css'; // Assuming you have a CSS file for styling

const TraitButton = ({ trait, onClick, isActive }) => {
    return (
        <button 
            className={`trait-button ${isActive ? 'active' : ''}`} 
            onClick={() => onClick(trait)}
        >
            {trait.name}
        </button>
    );
};

TraitButton.propTypes = {
    trait: PropTypes.shape({
        name: PropTypes.string.isRequired,
        // Add other trait properties as needed
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
};

TraitButton.defaultProps = {
    isActive: false,
};

export default TraitButton;