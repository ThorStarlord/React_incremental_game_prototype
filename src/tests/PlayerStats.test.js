import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayerStats from '../features/Player/containers/PlayerStats';

describe('PlayerStats Component', () => {
    test('renders player stats correctly', () => {
        const mockPlayerData = {
            health: 100,
            mana: 50,
            strength: 20,
            agility: 15,
        };

        render(<PlayerStats playerData={mockPlayerData} />);

        expect(screen.getByText(/Health:/i)).toBeInTheDocument();
        expect(screen.getByText(/Mana:/i)).toBeInTheDocument();
        expect(screen.getByText(/Strength:/i)).toBeInTheDocument();
        expect(screen.getByText(/Agility:/i)).toBeInTheDocument();
    });

    test('displays correct values for player stats', () => {
        const mockPlayerData = {
            health: 100,
            mana: 50,
            strength: 20,
            agility: 15,
        };

        render(<PlayerStats playerData={mockPlayerData} />);

        expect(screen.getByText(/Health: 100/i)).toBeInTheDocument();
        expect(screen.getByText(/Mana: 50/i)).toBeInTheDocument();
        expect(screen.getByText(/Strength: 20/i)).toBeInTheDocument();
        expect(screen.getByText(/Agility: 15/i)).toBeInTheDocument();
    });
});