import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createFaction } from '../../../context/actions/factionActions';
import './FactionCreation.css';

const FactionCreation = () => {
    const [factionName, setFactionName] = useState('');
    const [factionDescription, setFactionDescription] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (factionName && factionDescription) {
            dispatch(createFaction({ name: factionName, description: factionDescription }));
            setFactionName('');
            setFactionDescription('');
        }
    };

    return (
        <div className="faction-creation">
            <h2>Create a New Faction</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="factionName">Faction Name:</label>
                    <input
                        type="text"
                        id="factionName"
                        value={factionName}
                        onChange={(e) => setFactionName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="factionDescription">Description:</label>
                    <textarea
                        id="factionDescription"
                        value={factionDescription}
                        onChange={(e) => setFactionDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Faction</button>
            </form>
        </div>
    );
};

export default FactionCreation;