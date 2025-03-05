// This file contains utility functions related to quests in the game.

import { QuestData } from '../data/quests';

/**
 * Interface for a quest with active/completed status
 * Extends QuestData from quests.ts
 */
export interface GameQuest extends QuestData {
  isActive?: boolean;
  isCompleted?: boolean;
}

/**
 * Retrieves a quest by its ID from a list of quests
 * 
 * @param quests - Array of quests to search through
 * @param id - ID of the quest to find
 * @returns The found quest or undefined if not found
 */
export const getQuestById = (quests: GameQuest[], id: string): GameQuest | undefined => {
    return quests.find(quest => quest.id === id);
};

/**
 * Filters an array of quests to return only active ones
 * 
 * @param quests - Array of quests to filter
 * @returns Array of active quests
 */
export const getActiveQuests = (quests: GameQuest[]): GameQuest[] => {
    return quests.filter(quest => quest.isActive);
};

/**
 * Marks a quest as completed in the quests array
 * 
 * @param quests - Array of quests
 * @param id - ID of the quest to complete
 * @returns New array with the updated quest
 */
export const completeQuest = (quests: GameQuest[], id: string): GameQuest[] => {
    return quests.map(quest => 
        quest.id === id ? { ...quest, isActive: false, isCompleted: true } : quest
    );
};

/**
 * Adds a new quest to the quests array
 * 
 * @param quests - Current array of quests
 * @param newQuest - New quest to add
 * @returns New array including the added quest
 */
export const addQuest = (quests: GameQuest[], newQuest: GameQuest): GameQuest[] => {
    return [...quests, newQuest];
};

/**
 * Removes a quest from the quests array
 * 
 * @param quests - Current array of quests
 * @param id - ID of the quest to remove
 * @returns New array without the removed quest
 */
export const removeQuest = (quests: GameQuest[], id: string): GameQuest[] => {
    return quests.filter(quest => quest.id !== id);
};
