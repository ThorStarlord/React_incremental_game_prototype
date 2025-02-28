import React from 'react';
import TownArea from '../TownArea';
import DungeonPanel from '../DungeonPanel';
import RegionsPanel from '../RegionsPanel';
import './TownPanel.css';

const TownPanel = () => {
    return (
        <div className="town-panel">
            <h2>Town Overview</h2>
            <TownArea />
            <DungeonPanel />
            <RegionsPanel />
        </div>
    );
};

export default TownPanel;