import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/traits.module.css';

const CompactTraitCard = ({ trait, onClick }) => {
    return (
        <div className={styles.compactTraitCard} onClick={onClick}>
            <h3>{trait.name}</h3>
            <p>{trait.description}</p>
        </div>
    );
};

CompactTraitCard.propTypes = {
    trait: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default CompactTraitCard;