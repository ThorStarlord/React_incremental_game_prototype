import React from 'react';
import './DialogueHistory.css';

const DialogueHistory = ({ dialogues }) => {
    return (
        <div className="dialogue-history">
            <h2>Dialogue History</h2>
            <ul>
                {dialogues.map((dialogue, index) => (
                    <li key={index}>
                        <strong>{dialogue.npcName}:</strong> {dialogue.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DialogueHistory;