import React from 'react';
import { useQuests } from '../hooks/useQuests';
import './QuestsPage.css';

const QuestsPage = () => {
    const { quests, completeQuest } = useQuests();

    return (
        <div className="quests-page">
            <h1>Quests</h1>
            <ul>
                {quests.map(quest => (
                    <li key={quest.id}>
                        <h2>{quest.title}</h2>
                        <p>{quest.description}</p>
                        <button onClick={() => completeQuest(quest.id)}>Complete Quest</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestsPage;