import React from 'react';
import TraitList from '../features/Traits/containers/TraitList';
import TraitSlots from '../features/Traits/containers/TraitSlots';
import './TraitsPage.css';

const TraitsPage = () => {
    return (
        <div className="traits-page">
            <h1>Traits</h1>
            <TraitList />
            <TraitSlots />
        </div>
    );
};

export default TraitsPage;