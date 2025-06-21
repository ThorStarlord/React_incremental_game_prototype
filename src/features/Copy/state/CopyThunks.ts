/**
 * @file CopyThunks.ts
 * @description Thunks for handling asynchronous Copy logic, like creation.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { addCopy } from './CopySlice';
import type { Copy } from './CopyTypes';
import { PlayerStats } from '../../Player/state/PlayerTypes';

// Define default starting stats for a new Copy
const defaultCopyStats: PlayerStats = {
    health: 50,
    maxHealth: 50,
    mana: 25,
    maxMana: 25,
    attack: 5,
    defense: 5,
    speed: 10,
    healthRegen: 0.5,
    manaRegen: 0.5,
    criticalChance: 0.05,
    criticalDamage: 1.5,
};

interface CreateCopyPayload {
    npcId: string;
}

/**
 * Thunk to attempt creating a Copy from an NPC.
 */
export const createCopyThunk = createAsyncThunk(
    'copy/create',
    async ({ npcId }: CreateCopyPayload, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const player = state.player;
        const npc = state.npcs.npcs[npcId];

        if (!npc) {
            return rejectWithValue('Target NPC not found.');
        }

        // --- Success Check ---
        // Example: Success chance is based on player's Charisma.
        // A Charisma of 20 gives a 55% chance ((20-10)/2 * 10) + 5
        const charismaModifier = Math.floor((player.attributes.charisma - 10) / 2);
        const successChance = (5 + (charismaModifier * 10)) / 100; // Base 5% + 10% per modifier point

        if (Math.random() > successChance) {
            // TODO: Dispatch a failure notification
            console.log(`Seduction failed. Chance was ${successChance * 100}%.`);
            return rejectWithValue('Seduction attempt failed.');
        }

        // --- Create the Copy Object ---
        const newCopy: Copy = {
            id: `copy_${Date.now()}`,
            name: `Copy of ${npc.name}`,
            createdAt: Date.now(),
            parentNPCId: npc.id,
            growthType: 'normal', // Can be changed later via another action
            maturity: 0,
            loyalty: 50, // Start at a neutral loyalty
            stats: { ...defaultCopyStats },
            // Inherit a snapshot of traits the player has equipped
            inheritedTraits: player.traitSlots
                .map(slot => slot.traitId)
                .filter(Boolean) as string[],
            location: npc.location, // Starts at the parent's location
        };

        // --- Dispatch the action to add the new copy ---
        dispatch(addCopy(newCopy));
        
        // TODO: Dispatch a success notification
        console.log(`Seduction successful! Created: ${newCopy.name}`);

        return newCopy;
    }
);