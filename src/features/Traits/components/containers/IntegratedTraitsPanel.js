import React from 'react';
import TraitList from '../TraitList';
import TraitSlots from '../TraitSlots';
import styles from '../../styles/traits.module.css';

const IntegratedTraitsPanel = () => {
    return (
        <div className={styles.integratedTraitsPanel}>
            <TraitList />
            <TraitSlots />
        </div>
    );
};

export default IntegratedTraitsPanel;