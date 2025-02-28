import React from 'react';
import { useEssenceGeneration } from '../../hooks/useEssenceGeneration';
import EssenceGenerationTimer from '../ui/EssenceGenerationTimer';
import './EssenceDisplay.css';

const EssenceDisplay = () => {
    const { essence, essenceRate } = useEssenceGeneration();

    return (
        <div className="essence-display">
            <h2>Essence</h2>
            <p>Current Essence: {essence}</p>
            <p>Essence Generation Rate: {essenceRate} per second</p>
            <EssenceGenerationTimer />
        </div>
    );
};

export default EssenceDisplay;