import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/traits.module.css';

const TraitCard = ({ trait, onSelect }) => {
    return (
        <div className={styles.traitCard} onClick={() => onSelect(trait)}>
            <h3 className={styles.traitName}>{trait.name}</h3>
            <p className={styles.traitDescription}>{trait.description}</p>
        </div>
    );
};

TraitCard.propTypes = {
    trait: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default TraitCard;