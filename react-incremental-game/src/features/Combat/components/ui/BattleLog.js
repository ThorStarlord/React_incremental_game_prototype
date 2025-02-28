import React from 'react';
import './BattleLog.css';

const BattleLog = ({ logs }) => {
    return (
        <div className="battle-log">
            <h2>Battle Log</h2>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
    );
};

export default BattleLog;