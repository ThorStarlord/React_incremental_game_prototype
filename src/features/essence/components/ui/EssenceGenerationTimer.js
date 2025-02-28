import React from 'react';

const EssenceGenerationTimer = ({ timeRemaining }) => {
    return (
        <div className="essence-generation-timer">
            <h2>Essence Generation Timer</h2>
            <p>Time Remaining: {timeRemaining} seconds</p>
        </div>
    );
};

export default EssenceGenerationTimer;