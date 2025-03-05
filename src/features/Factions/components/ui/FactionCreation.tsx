import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { createFaction } from '../../../context/actions/factionActions';
import './FactionCreation.css';

/**
 * Interface for faction creation data
 */
interface FactionData {
    name: string;
    description: string;
    [key: string]: any; // For any additional faction properties
}

/**
 * FactionCreation component
 * Provides a form to create a new faction in the game
 * 
 * @returns {JSX.Element} The faction creation form component
 */
const FactionCreation: React.FC = (): JSX.Element => {
    const [factionName, setFactionName] = useState<string>('');
    const [factionDescription, setFactionDescription] = useState<string>('');
    const dispatch = useDispatch();

    /**
     * Handle form submission to create a new faction
     * @param {FormEvent<HTMLFormElement>} e - Form submission event
     */
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFactionName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="factionDescription">Description:</label>
                    <textarea
                        id="factionDescription"
                        value={factionDescription}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFactionDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Faction</button>
            </form>
        </div>
    );
};

export default FactionCreation;
