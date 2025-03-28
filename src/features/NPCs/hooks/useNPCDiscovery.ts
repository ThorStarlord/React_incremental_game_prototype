import React, { useState, useEffect } from 'react';
import { ACTION_TYPES } from '../../../context/types/ActionTypes';
import { useGameState, useGameDispatch } from '../../../context/GameStateExports';

/**
 * Interface for dialogue option
 */
interface DialogueOption {
  text: string;
  nextDialogue?: string;
  relationshipChange?: number;
  action?: string;
  traitId?: string;
  essenceCost?: number;
  relationshipRequirement?: number;
}

/**
 * Interface for dialogue structure
 */
interface Dialogue {
  id?: string;
  text: string;
  options: DialogueOption[];
}

/**
 * Interface for NPC dialogue collection
 */
interface NPCDialogue {
  firstMeeting?: Dialogue;
  initial: Dialogue;
  [key: string]: Dialogue | undefined;
}

/**
 * Interface for NPC structure
 */
interface NPC {
  id: string;
  name: string;
  dialogue?: NPCDialogue;
  greeting?: string;
  // ...other NPC properties...
}

/**
 * Hook for managing NPC discovery and dialogue interaction
 * 
 * @param npc - The NPC data object
 * @returns Object containing current dialogue and setter function
 */
export const useNPCDiscovery = (npc: NPC | null) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Track if this NPC has been discovered
  const [discovered, setDiscovered] = useState<boolean>(false);
  // Track if player has met this NPC before
  const [hasMetNPC, setHasMetNPC] = useState<boolean>(false);
  // Track current dialogue
  const [currentDialogue, setCurrentDialogue] = useState<Dialogue | null>(null);
  
  // Check if player has discovered this NPC
  useEffect(() => {
    if (npc && gameState.player) {
      // Check if this NPC is in the player's discovered NPCs list
      // Access discoveredNpcs from the correct path in gameState
      const npcsState = (gameState as any).npcs;
      const discoveredNPCs = npcsState?.playerInteractions?.discoveredNpcs || [];
      
      const hasMetBefore = Array.isArray(discoveredNPCs) && discoveredNPCs.includes(npc.id) || false;
      setHasMetNPC(hasMetBefore);
      setDiscovered(true);
    }
  }, [npc, gameState]);

  useEffect(() => {
    if (discovered && npc) {
      // First meeting logic
      if (!hasMetNPC) {
        dispatch({
          type: ACTION_TYPES.ADD_NOTIFICATION, // Correct action type
          payload: {
            message: `You've met ${npc.name} for the first time!`,
            type: 'info',
            category: 'interaction',
            npcId: npc.id,
            npcName: npc.name,
            timestamp: Date.now()
          }
        });

        // Show first meeting dialogue if available
        const npcDialogue = npc?.dialogue as NPCDialogue || {} as NPCDialogue;
        if (npcDialogue.firstMeeting) {
          setCurrentDialogue(npcDialogue.firstMeeting);
        } else if (!currentDialogue) {
          // Initial greeting with safe fallbacks
          setCurrentDialogue(npcDialogue.initial || { 
            text: npc?.greeting || "Hello there.", 
            options: [] 
          });
        }
      } else {
        // Regular dialogue for returning visits with safe fallbacks
        const npcDialogue = npc?.dialogue as NPCDialogue || {} as NPCDialogue;
        setCurrentDialogue(npcDialogue.initial || { 
          text: npc?.greeting || "Hello there.", 
          options: [] 
        });
      }
    }
  }, [discovered, npc, hasMetNPC, currentDialogue, dispatch]);

  return { currentDialogue, setCurrentDialogue };
};

export default useNPCDiscovery;
