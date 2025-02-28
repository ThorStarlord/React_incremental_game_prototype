import React from 'react';
import styles from '../styles/traits.module.css';

const EmptySlotCard = () => {
    return (
        <div className={styles.emptySlotCard}>
            <p>No Trait Available</p>
        </div>
    );
};

export default EmptySlotCard;