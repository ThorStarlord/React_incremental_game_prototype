import React from 'react';
import TraitList from '../containers/TraitList';
import TraitSlots from '../containers/TraitSlots';
import IntegratedTraitsPanel from '../containers/IntegratedTraitsPanel';

const TraitSystemWrapper = () => {
    return (
        <div className="trait-system-wrapper">
            <TraitList />
            <TraitSlots />
            <IntegratedTraitsPanel />
        </div>
    );
};

export default TraitSystemWrapper;